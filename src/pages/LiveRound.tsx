import { useMemo, useState } from 'react'
import { usePairs } from '../hooks/usePairs'
import { useHoles } from '../hooks/useHoles'
import { useRoundScores } from '../hooks/useRoundScores'
import SegmentedRounds from '../components/ui/SegmentedRounds'
import RoundTable from '../components/live/RoundTable'
import HoleModal from '../components/live/HoleModal'
import { FullPageSpinner } from '../components/ui/Spinner'

export default function LiveRound() {
  const [round, setRound] = useState(1)
  const [openHole, setOpenHole] = useState<number | null>(null)

  const { pairs, loading: pairsLoading } = usePairs()
  const { parByHole, mapByHole, loading: holesLoading, updatePar } = useHoles()
  const pairIds = useMemo(() => pairs.map((p) => p.id), [pairs])
  const { scores } = useRoundScores(pairIds, round)

  if (pairsLoading || holesLoading) return <FullPageSpinner />

  return (
    <div className="py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-bold text-green-800">Live · Giro {round}</h1>
        <SegmentedRounds value={round} onChange={setRound} prefix="Giro" />
      </div>

      <RoundTable
        pairs={pairs}
        parByHole={parByHole}
        scores={scores}
        onHoleClick={setOpenHole}
      />

      <p className="mt-3 text-xs text-gray-500">
        Tocca l’intestazione di una buca per vedere la mappa e modificare il par.
      </p>

      <HoleModal
        hole={openHole}
        par={openHole != null ? parByHole[openHole] ?? null : null}
        mapUrl={openHole != null ? mapByHole[openHole] ?? null : null}
        onClose={() => setOpenHole(null)}
        onSavePar={updatePar}
      />
    </div>
  )
}
