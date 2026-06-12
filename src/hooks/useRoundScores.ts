import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { calcNetScore, sumStrokes } from '../lib/scoring'
import type { HoleScore, Round, ScoreMap } from '../lib/types'

/**
 * Manage per-hole scores for a set of pairs in a single round.
 * `scores[pairId][holeNumber]` -> strokes | null.
 */
export function useRoundScores(pairIds: string[], roundNumber: number) {
  const [scores, setScores] = useState<Record<string, ScoreMap>>({})
  const [submittedMap, setSubmittedMap] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  const key = useMemo(() => [...pairIds].sort().join(','), [pairIds])

  const refetch = useCallback(async () => {
    if (pairIds.length === 0) {
      setScores({})
      setSubmittedMap({})
      setLoading(false)
      return
    }
    const [scoreRes, roundRes] = await Promise.all([
      supabase
        .from('hole_scores')
        .select('*')
        .in('pair_id', pairIds)
        .eq('round_number', roundNumber),
      supabase.from('rounds').select('*').in('pair_id', pairIds).eq('round_number', roundNumber),
    ])

    const nextScores: Record<string, ScoreMap> = {}
    for (const pid of pairIds) nextScores[pid] = {}
    for (const s of (scoreRes.data as HoleScore[]) ?? []) {
      if (!nextScores[s.pair_id]) nextScores[s.pair_id] = {}
      nextScores[s.pair_id][s.hole_number] = s.strokes
    }

    const nextSubmitted: Record<string, boolean> = {}
    for (const pid of pairIds) nextSubmitted[pid] = false
    for (const r of (roundRes.data as Round[]) ?? []) {
      nextSubmitted[r.pair_id] = r.is_submitted
    }

    setScores(nextScores)
    setSubmittedMap(nextSubmitted)
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, roundNumber])

  useEffect(() => {
    setLoading(true)
    refetch()
    if (pairIds.length === 0) return
    const channel = supabase
      .channel(`round-${roundNumber}-${key}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hole_scores' },
        () => refetch(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rounds' }, () => refetch())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, roundNumber, refetch])

  /** Upsert a single hole stroke; optimistic local update. */
  const setStroke = useCallback(
    async (pairId: string, hole: number, strokes: number | null) => {
      setScores((prev) => ({
        ...prev,
        [pairId]: { ...(prev[pairId] ?? {}), [hole]: strokes },
      }))
      await supabase.from('hole_scores').upsert(
        {
          pair_id: pairId,
          round_number: roundNumber,
          hole_number: hole,
          strokes,
          entered_at: new Date().toISOString(),
        },
        { onConflict: 'pair_id,round_number,hole_number' },
      )
    },
    [roundNumber],
  )

  /** Finalize a round: compute raw/net and lock it. */
  const submitRound = useCallback(
    async (pairId: string, handicap: number) => {
      const map = scores[pairId] ?? {}
      const raw = sumStrokes(map)
      const net = calcNetScore(raw, handicap)
      await supabase.from('rounds').upsert(
        {
          pair_id: pairId,
          round_number: roundNumber,
          is_submitted: true,
          raw_strokes: raw,
          net_strokes: net,
          submitted_at: new Date().toISOString(),
        },
        { onConflict: 'pair_id,round_number' },
      )
      setSubmittedMap((prev) => ({ ...prev, [pairId]: true }))
    },
    [scores, roundNumber],
  )

  const isSubmitted = useCallback((pairId: string) => !!submittedMap[pairId], [submittedMap])

  return { scores, isSubmitted, setStroke, submitRound, loading, refetch }
}
