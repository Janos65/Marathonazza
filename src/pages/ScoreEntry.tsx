import { useCallback, useEffect, useMemo, useState } from 'react'
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

const GearIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.4"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>
)
const ExitIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
)

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
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', background: 'radial-gradient(130% 60% at 50% 0%, #FBF8F0, #F1EADB 90%)' }}>
        <CodeGate onUnlock={setCode} />
      </div>
    )
  }

  function logout() {
    sessionStorage.removeItem(CODE_STORAGE_KEY)
    setCode(null)
  }

  const SubHeader = (
    <div
      className="sticky z-30 flex flex-wrap items-center justify-between gap-3.5 px-[clamp(14px,4vw,40px)] py-3.5 backdrop-blur"
      style={{ top: 64, background: 'rgba(251,248,240,.9)', borderBottom: '1px solid #E7E0D0' }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-[7px] rounded-[30px] px-3.5 py-[7px] text-[#F4EFE6]" style={{ background: '#1B4332' }}>
          {GearIcon}
          <span className="whitespace-nowrap text-[14px] font-bold">{groupLabel(code!)}</span>
        </div>
        <button onClick={logout} className="flex items-center gap-[5px] text-[12.5px] font-semibold text-[#8a8470] hover:text-[#14271B]">
          {ExitIcon}
          Esci
        </button>
      </div>
      {!isSubstitute && <SegmentedRounds value={round} onChange={setRound} theme="light" />}
    </div>
  )

  // ---- Staffettisti mode ----
  if (isSubstitute) {
    if (subsLoading) return <div style={{ background: '#FBF8F0' }}><FullPageSpinner /></div>
    const subPlayers: PlayerOption[] = substitutes.map((s) => ({ name: s.name, pairId: null, photoUrl: null }))
    const subNames = substitutes.map((s) => s.name)
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', background: 'radial-gradient(130% 60% at 50% 0%, #FBF8F0, #F1EADB 90%)' }}>
        {SubHeader}
        <div className="mx-auto max-w-[920px] px-[clamp(14px,4vw,32px)] pb-[120px] pt-[clamp(20px,4vw,34px)]">
          <p className="mb-4 text-[13px] text-[#6B7A66]">Sostituti — solo inserimento Nearest to the Pin (Buca 2).</p>
          <NearestPinForm players={subPlayers} entries={ntpEntries(subNames)} defaultRound={1} onAdd={addNtp} />
        </div>
      </div>
    )
  }

  // ---- Normal group mode ----
  if (pairsLoading || holesLoading) return <div style={{ background: '#FBF8F0' }}><FullPageSpinner /></div>

  const groupPlayers: PlayerOption[] = groupPairs.flatMap((p) => [
    { name: p.player1_name, pairId: p.id, photoUrl: p.photo_url },
    { name: p.player2_name, pairId: p.id, photoUrl: p.photo_url },
  ])
  const groupNames = groupPlayers.map((p) => p.name)

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'radial-gradient(130% 60% at 50% 0%, #FBF8F0, #F1EADB 90%)' }}>
      {SubHeader}
      <div className="mx-auto flex max-w-[920px] flex-col gap-[22px] px-[clamp(14px,4vw,32px)] pb-[120px] pt-[clamp(20px,4vw,34px)]">
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

        <NearestPinForm players={groupPlayers} entries={ntpEntries(groupNames)} defaultRound={round} onAdd={addNtp} />
      </div>
    </div>
  )
}
