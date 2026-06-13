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
import { supabase } from '../lib/supabase'
import { CODE_STORAGE_KEY, groupLabel } from '../lib/constants'

export default function ScoreEntry() {
  const [code, setCode] = useState<string | null>(() => sessionStorage.getItem(CODE_STORAGE_KEY))
  const [round, setRound] = useState(1)

  const { pairs, loading: pairsLoading } = usePairs()
  const { parByHole, loading: holesLoading } = useHoles()
  const { birdieCountForPair, ntpEntries, addNtp } = useSpecials()

  const groupPairs = useMemo(() => (code ? pairsForCode(pairs, code) : []), [pairs, code])
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

  if (pairsLoading || holesLoading) return <FullPageSpinner />

  function logout() {
    sessionStorage.removeItem(CODE_STORAGE_KEY)
    setCode(null)
  }

  const groupEntries = ntpEntries(pairIds)

  return (
    <div className="py-6">
      <div className="mb-5 flex items-center justify-between">
        <Logo height={28} />
        <SegmentedRounds value={round} onChange={setRound} prefix="G" />
        <button
          onClick={logout}
          className="grid h-9 w-9 place-items-center rounded-lg text-gray-400 hover:bg-green-50 hover:text-green-800"
          aria-label="Esci"
        >
          <LogOut size={18} />
        </button>
      </div>

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
          pairs={groupPairs}
          entries={groupEntries}
          defaultRound={round}
          onAdd={addNtp}
        />
      </div>
    </div>
  )
}
