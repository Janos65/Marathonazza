import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { BIRDIE_HOLE, BIRDIE_STROKES } from '../lib/constants'
import type {
  CompetitionType,
  HoleScore,
  NearestToPin,
  Pair,
  PlayerOption,
  SpecialWinner,
  Substitute,
} from '../lib/types'

export interface NtpLeader {
  player_name: string
  distance_cm: number
  round_number: number
  pair: Pair | undefined
}

export interface BirdieStanding {
  pair: Pair
  count: number
}

export function useSpecials() {
  const [pairs, setPairs] = useState<Pair[]>([])
  const [substitutes, setSubstitutes] = useState<Substitute[]>([])
  const [ntp, setNtp] = useState<NearestToPin[]>([])
  const [birdieScores, setBirdieScores] = useState<HoleScore[]>([])
  const [winnersRaw, setWinnersRaw] = useState<SpecialWinner[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    const [pairsRes, subsRes, ntpRes, birdieRes, winnersRes] = await Promise.all([
      supabase.from('pairs').select('*').order('display_order', { ascending: true }),
      supabase.from('substitutes').select('*').order('display_order', { ascending: true }),
      supabase.from('nearest_to_pin').select('*').order('distance_cm', { ascending: true }),
      supabase
        .from('hole_scores')
        .select('*')
        .eq('hole_number', BIRDIE_HOLE)
        .eq('strokes', BIRDIE_STROKES),
      supabase.from('special_winners').select('*'),
    ])
    setPairs((pairsRes.data as Pair[]) ?? [])
    setSubstitutes((subsRes.data as Substitute[]) ?? [])
    setNtp((ntpRes.data as NearestToPin[]) ?? [])
    setBirdieScores((birdieRes.data as HoleScore[]) ?? [])
    setWinnersRaw((winnersRes.data as SpecialWinner[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
    const channel = supabase
      .channel('specials')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'nearest_to_pin' }, () =>
        refetch(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'special_winners' }, () =>
        refetch(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hole_scores' }, () =>
        refetch(),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refetch])

  const pairById = useMemo(() => {
    const m = new Map<string, Pair>()
    for (const p of pairs) m.set(p.id, p)
    return m
  }, [pairs])

  /** All individual people who can win a person-based prize. */
  const allPlayers = useMemo<PlayerOption[]>(() => {
    const fromPairs: PlayerOption[] = pairs.flatMap((p) => [
      { name: p.player1_name, pairId: p.id, photoUrl: p.photo_url },
      { name: p.player2_name, pairId: p.id, photoUrl: p.photo_url },
    ])
    const fromSubs: PlayerOption[] = substitutes.map((s) => ({
      name: s.name,
      pairId: null,
      photoUrl: null,
    }))
    return [...fromPairs, ...fromSubs]
  }, [pairs, substitutes])

  const ntpLeader: NtpLeader | null = useMemo(() => {
    if (ntp.length === 0) return null
    const best = ntp[0] // already sorted asc by distance
    return {
      player_name: best.player_name,
      distance_cm: best.distance_cm,
      round_number: best.round_number,
      pair: best.pair_id ? pairById.get(best.pair_id) : undefined,
    }
  }, [ntp, pairById])

  const ntpEntries = useCallback(
    (filterPlayerNames?: string[]) =>
      filterPlayerNames ? ntp.filter((n) => filterPlayerNames.includes(n.player_name)) : ntp,
    [ntp],
  )

  const addNtp = useCallback(
    async (
      player_name: string,
      pair_id: string | null,
      round_number: number,
      distance_cm: number,
    ) => {
      await supabase
        .from('nearest_to_pin')
        .insert({ player_name, pair_id, round_number, distance_cm })
    },
    [],
  )

  const birdieCountByPair = useMemo(() => {
    const m = new Map<string, number>()
    for (const s of birdieScores) m.set(s.pair_id, (m.get(s.pair_id) ?? 0) + 1)
    return m
  }, [birdieScores])

  const birdieStandings: BirdieStanding[] = useMemo(() => {
    return [...birdieCountByPair.entries()]
      .map(([pid, count]) => ({ pair: pairById.get(pid), count }))
      .filter((x): x is BirdieStanding => !!x.pair && x.count > 0)
      .sort((a, b) => b.count - a.count || (a.pair.display_order ?? 0) - (b.pair.display_order ?? 0))
      .slice(0, 3)
  }, [birdieCountByPair, pairById])

  const birdieCountForPair = useCallback(
    (pairId: string) => birdieCountByPair.get(pairId) ?? 0,
    [birdieCountByPair],
  )

  /** competition_type -> winner person name (or null). */
  const winners = useMemo(() => {
    const m: Record<CompetitionType, string | null> = {
      closest_to_line: null,
      drive_in_contest: null,
    }
    for (const w of winnersRaw) m[w.competition_type] = w.winner_name
    return m
  }, [winnersRaw])

  const setWinner = useCallback(
    async (type: CompetitionType, name: string | null) => {
      await supabase
        .from('special_winners')
        .upsert(
          { competition_type: type, winner_name: name, winning_pair_id: null, set_at: new Date().toISOString() },
          { onConflict: 'competition_type' },
        )
    },
    [],
  )

  return {
    pairs,
    substitutes,
    pairById,
    allPlayers,
    loading,
    ntpLeader,
    ntpEntries,
    addNtp,
    birdieStandings,
    birdieCountForPair,
    winners,
    setWinner,
    refetch,
  }
}
