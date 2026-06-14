import { useMemo, useState } from 'react'
import { usePairs } from '../hooks/usePairs'
import { useHoles } from '../hooks/useHoles'
import { useRoundScores } from '../hooks/useRoundScores'
import SegmentedRounds from '../components/ui/SegmentedRounds'
import RoundTable from '../components/live/RoundTable'
import HoleModal from '../components/live/HoleModal'
import { FullPageSpinner } from '../components/ui/Spinner'

const legend = [
  { label: 'Birdie (buca 8)', bg: 'linear-gradient(145deg,#E8CE7E,#C9A84C)' },
  { label: 'Sotto par', bg: 'rgba(64,145,108,.4)' },
  { label: 'Bogey', bg: 'rgba(224,184,104,.25)' },
  { label: 'Doppio +', bg: 'rgba(212,96,74,.28)' },
]

export default function LiveRound() {
  const [round, setRound] = useState(1)
  const [openHole, setOpenHole] = useState<number | null>(null)

  const { pairs, loading: pairsLoading } = usePairs()
  const { parByHole, mapByHole, loading: holesLoading, updatePar } = useHoles()
  const pairIds = useMemo(() => pairs.map((p) => p.id), [pairs])
  const { scores } = useRoundScores(pairIds, round)

  return (
    <div
      className="px-[clamp(14px,4vw,48px)] pb-[90px] pt-[clamp(34px,6vw,64px)]"
      style={{ minHeight: 'calc(100vh - 64px)', background: 'radial-gradient(120% 50% at 50% 0%, #0D2B1D, #07150D 70%)' }}
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-[30px] flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-2.5 flex items-center gap-2.5">
              <span className="relative inline-flex h-[9px] w-[9px]">
                <span className="absolute inset-0 rounded-full" style={{ background: '#74C69D', animation: 'mzBadge 1.6s ease-in-out infinite' }} />
              </span>
              <span className="font-mono text-[11px] tracking-[5px] text-gold">TEMPO REALE</span>
            </div>
            <h2 className="m-0 font-serif text-[clamp(34px,6vw,56px)] font-bold tracking-[-.5px] text-[#FBF7EC]">Live Round</h2>
            <p className="mt-2.5 text-[14.5px] text-[#f4efe38c]">Colpi grezzi buca per buca · tocca una buca per la mappa</p>
          </div>
          <SegmentedRounds value={round} onChange={setRound} theme="dark" />
        </div>

        {/* legend */}
        <div className="mb-[18px] flex flex-wrap gap-3.5">
          {legend.map((l) => (
            <div key={l.label} className="flex items-center gap-[7px] text-[11.5px] text-[#f4efe38c]">
              <span className="h-3.5 w-3.5 rounded" style={{ background: l.bg }} />
              {l.label}
            </div>
          ))}
        </div>

        {pairsLoading || holesLoading ? (
          <FullPageSpinner />
        ) : (
          <RoundTable pairs={pairs} parByHole={parByHole} scores={scores} onHoleClick={setOpenHole} />
        )}
      </div>

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
