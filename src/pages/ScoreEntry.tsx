import { useCallback, useEffect, useMemo, useState } from 'react'
import { LogOut } from 'lucide-react'
import Logo from '../components/ui/Logo'
import { FullPageSpinner } from '../components/ui/Spinner'
import SegmentedRounds from '../components/ui/SegmentedRounds'
import CodeGate from '../components/entry/CodeGate'
import ScoreTable from '../components/entry/ScoreTable'
import NearestPinForm from '../components/entry/NearestPinForm'
import { usePairs, pairsForCode } from '../hooks/usePairs'
import { useHoles } from '../hooks/useHoles'
import { useRoundScores } from '../hooks/useRoundScores'
import { useSpecials } from '../hooks/useSpecials'
import { useSubstitutes } from '../hooks/useSubstitutes'
import { supabase } from '../lib/supabase'
import { CODE_STORAGE_KEY, groupLabel, isSubstituteCode } from '../lib/constants'
import type { PlayerOption } from '../lib/types'

export default function ScoreEntry() {
  const [code, setCode] = useState<string | null>(() => sessionStorage.getItem(CODE_STORAGE_KEY))
  const [round, setRound] = useState(1)

  const isSubstitute = !!code && isSubstituteCode(code)

  const { pairs, loading: pairsLoading } = usePairs()
  const { parByHole, loading: holesLoading } = useHoles()
  const { substitutes, loading: subsLoading } = useSubstitutes()
  const { birdieCountForPair, ntpEntries, addNtp } = useSpecials()

  const groupPairs = useMemo(
    () => (code && !isSubstitute ? pairsForCode(pairs, code) : []),
    [pairs, code, isSubstitute],
  )
  const pairIds = useMemo(() => groupPairs.map((p) => p.id), [groupPairs])

  const { scores, isSubmitted, setStroke, submitRound } = useRoundScores(pairIds, round)

  // submitted rounds count per pair (for the BirdieCup denominator)
  const [submittedCounts, setSubmittedCounts] = useState<Record<string, number>>({})
  const refreshCounts = useCallback(async () => {
    if (pairIds.length === 0) return
    const { data } = await supabase
      .from('rounds')
      .select('pair_id')
      .eq('is_submitted', true)
      .in('pair_id', pairIds)
    const counts: Record<string, number> = {}
    for (const row of (data as { pair_id: string }[]) ?? []) {
      counts[row.pair_id] = (counts[row.pair_id] ?? 0) + 1
    }
    setSubmittedCounts(counts)
  }, [pairIds])

  useEffect(() => {
    refreshCounts()
  }, [refreshCounts, round])

  if (!code) {
    return <CodeGate onUnlock={setCode} />
  }

  function logout() {
    sessionStorage.removeItem(CODE_STORAGE_KEY)
    setCode(null)
  }

  const Header = (
    <div className="mb-5 flex items-center justify-between">
      <Logo height={28} />
      {!isSubstitute && <SegmentedRounds value={round} onChange={setRound} prefix="G" />}
      <button
        onClick={logout}
        className="grid h-9 w-9 place-items-center rounded-lg text-gray-400 hover:bg-green-50 hover:text-green-800"
        aria-label="Esci"
      >
        <LogOut size={18} />
      </button>
    </div>
  )

  // ---- Staffettisti mode: NTP entry only ----
  if (isSubstitute) {
    if (subsLoading) return <FullPageSpinner />
    const subPlayers: PlayerOption[] = substitutes.map((s) => ({
      name: s.name,
      pairId: null,
      photoUrl: null,
    }))
    const subNames = substitutes.map((s) => s.name)
    return (
      <div className="py-6">
        {Header}
        <h1 className="mb-1 font-serif text-2xl font-bold text-green-800">{groupLabel(code)}</h1>
        <p className="mb-4 text-sm text-gray-500">
          Sostituti — solo inserimento Nearest to the Pin (Buca 2).
        </p>
        <NearestPinForm
          players={subPlayers}
          entries={ntpEntries(subNames)}
          defaultRound={1}
          onAdd={addNtp}
        />
      </div>
    )
  }

  // ---- Normal group mode ----
  if (pairsLoading || holesLoading) return <FullPageSpinner />

  const groupPlayers: PlayerOption[] = groupPairs.flatMap((p) => [
    { name: p.player1_name, pairId: p.id, photoUrl: p.photo_url },
    { name: p.player2_name, pairId: p.id, photoUrl: p.photo_url },
  ])
  const groupNames = groupPlayers.map((p) => p.name)

  return (
    <div className="py-6">
      {Header}
      <h1 className="mb-4 font-serif text-2xl font-bold text-green-800">{groupLabel(code)}</h1>

      <div className="grid gap-4 lg:grid-cols-2">
        {groupPairs.map((pair) => (
          <ScoreTable
            key={pair.id}
            pair={pair}
            roundNumber={round}
            parByHole={parByHole}
            scores={scores[pair.id] ?? {}}
            submitted={isSubmitted(pair.id)}
            birdieCount={birdieCountForPair(pair.id)}
            submittedRoundsCount={submittedCounts[pair.id] ?? 0}
            onSetStroke={(hole, strokes) => setStroke(pair.id, hole, strokes)}
            onSubmit={async () => {
              await submitRound(pair.id, pair.handicap)
              refreshCounts()
            }}
          />
        ))}
      </div>

      <div className="mt-6">
        <NearestPinForm
          players={groupPlayers}
          entries={ntpEntries(groupNames)}
          defaultRound={round}
          onAdd={addNtp}
        />
      </div>
    </div>
  )
}
