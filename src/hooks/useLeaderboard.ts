import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { LeaderboardRow, Pair, Round, HoleScore } from '../lib/types'

export function useLeaderboard() {
  const [rows, setRows] = useState<LeaderboardRow[]>([])
  const [loading, setLoading] = useState(true)
  const [currentRound, setCurrentRound] = useState(1)

  const refetch = useCallback(async () => {
    const [pairsRes, roundsRes, scoresRes] = await Promise.all([
      supabase.from('pairs').select('*').order('display_order', { ascending: true }),
      supabase.from('rounds').select('*'),
      supabase.from('hole_scores').select('pair_id, round_number, strokes'),
    ])

    const pairs = (pairsRes.data as Pair[]) ?? []
    const rounds = (roundsRes.data as Round[]) ?? []
    const scores = (scoresRes.data as Pick<HoleScore, 'pair_id' | 'round_number' | 'strokes'>[]) ?? []

    // submitted rounds keyed by pair|round
    const submitted = new Map<string, Round>()
    for (const r of rounds) {
      if (r.is_submitted) submitted.set(`${r.pair_id}|${r.round_number}`, r)
    }

    // which (pair,round) have any entered strokes
    const hasScores = new Set<string>()
    let maxActiveRound = 1
    for (const s of scores) {
      if (s.strokes != null) {
        hasScores.add(`${s.pair_id}|${s.round_number}`)
        if (s.round_number > maxActiveRound) maxActiveRound = s.round_number
      }
    }

    const computed: LeaderboardRow[] = pairs.map((pair) => {
      const roundsMap: Record<number, number | null> = {}
      let totalNet = 0
      let submittedCount = 0
      let hasInProgress = false
      for (let rn = 1; rn <= 5; rn++) {
        const key = `${pair.id}|${rn}`
        const sub = submitted.get(key)
        if (sub) {
          roundsMap[rn] = sub.net_strokes
          totalNet += sub.net_strokes ?? 0
          submittedCount++
        } else {
          roundsMap[rn] = null
          if (hasScores.has(key)) hasInProgress = true
        }
      }
      return { pair, rounds: roundsMap, totalNet, submittedCount, hasInProgress }
    })

    // Sort: pairs with at least one submitted round first by totalNet asc;
    // pairs with no submitted rounds sink to the bottom (by display_order).
    computed.sort((a, b) => {
      if (a.submittedCount === 0 && b.submittedCount === 0) {
        return (a.pair.display_order ?? 0) - (b.pair.display_order ?? 0)
      }
      if (a.submittedCount === 0) return 1
      if (b.submittedCount === 0) return -1
      if (a.totalNet !== b.totalNet) return a.totalNet - b.totalNet
      return (a.pair.display_order ?? 0) - (b.pair.display_order ?? 0)
    })

    setRows(computed)
    setCurrentRound(maxActiveRound)
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
    const channel = supabase
      .channel('leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rounds' }, () => refetch())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hole_scores' }, () => refetch())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refetch])

  return { rows, loading, currentRound }
}
