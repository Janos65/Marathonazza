import type { ReactNode } from 'react'
import { usePairs } from '../hooks/usePairs'
import { useHoles } from '../hooks/useHoles'
import { useSpecials } from '../hooks/useSpecials'
import { HOLES, COMPETITION_LABELS } from '../lib/constants'
import { FullPageSpinner } from '../components/ui/Spinner'
import PhotoUpload from '../components/admin/PhotoUpload'
import MapUpload from '../components/admin/MapUpload'
import ParEditor from '../components/admin/ParEditor'
import WinnerSelect from '../components/admin/WinnerSelect'
import ScoreManager from '../components/admin/ScoreManager'

function SectionCard({
  num,
  title,
  hint,
  badgeColor = '#1B4332',
  badgeText = '#C9A84C',
  children,
}: {
  num: number
  title: string
  hint?: string
  badgeColor?: string
  badgeText?: string
  children: ReactNode
}) {
  return (
    <div className="rounded-[20px] bg-white p-6" style={{ border: '1px solid #E9E2D2', boxShadow: '0 16px 40px -24px rgba(20,40,25,.18)' }}>
      <div className="mb-[18px] flex items-center gap-[11px]">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] font-mono text-[13px] font-bold" style={{ background: badgeColor, color: badgeText }}>
          {num}
        </div>
        <h3 className="m-0 font-serif text-[19px] font-bold text-[#14271B]">{title}</h3>
        {hint && <span className="ml-auto font-mono text-[11px] text-[#a8a293]">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export default function Admin() {
  const { pairs, loading: pairsLoading, refetch: refetchPairs } = usePairs()
  const { parByHole, mapByHole, loading: holesLoading, updatePar, updateMap } = useHoles()
  const { winners, setWinner, allPlayers } = useSpecials()

  if (pairsLoading || holesLoading)
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', background: '#FBF8F0' }}>
        <FullPageSpinner />
      </div>
    )

  async function saveAllPars(pars: Record<number, number | null>) {
    await Promise.all(Object.entries(pars).map(([h, p]) => updatePar(Number(h), p)))
  }

  return (
    <div className="px-[clamp(14px,4vw,40px)] pb-[120px] pt-[clamp(30px,5vw,56px)]" style={{ minHeight: 'calc(100vh - 64px)', background: 'radial-gradient(130% 50% at 50% 0%, #FBF8F0, #EFE8D8 90%)' }}>
      <div className="mx-auto max-w-[1060px]">
        <div className="mb-[34px]">
          <div className="mb-2.5 font-mono text-[10px] tracking-[4px] text-[#9A7B2E]">PANNELLO ORGANIZZATORE</div>
          <h2 className="m-0 font-serif text-[clamp(32px,5vw,48px)] font-bold text-[#14271B]">Admin</h2>
          <p className="mt-2.5 text-[14.5px] text-[#6B7A66]">Gestione foto, mappe, par, vincitori e punteggi</p>
        </div>

        <div className="flex flex-col gap-[22px]">
          <SectionCard num={1} title="Foto profilo coppie" hint="JPG · PNG · max 2MB">
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))' }}>
              {pairs.map((p) => (
                <PhotoUpload key={p.id} pair={p} onUpdated={refetchPairs} />
              ))}
            </div>
          </SectionCard>

          <SectionCard num={2} title="Mappe buche" hint="JPG · PNG · max 5MB">
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))' }}>
              {HOLES.map((h) => (
                <MapUpload key={h} holeNumber={h} mapUrl={mapByHole[h] ?? null} onUpload={updateMap} />
              ))}
            </div>
          </SectionCard>

          <SectionCard num={3} title="Par delle buche">
            <ParEditor parByHole={parByHole} onSaveAll={saveAllPars} />
          </SectionCard>

          <div className="grid gap-[22px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
            <WinnerSelect
              title={COMPETITION_LABELS.closest_to_line}
              caption="VINCITORE · BUCA 7"
              badgeNumber={4}
              badgeColor="#1B4332"
              players={allPlayers}
              currentWinnerName={winners.closest_to_line}
              onSet={(name) => setWinner('closest_to_line', name)}
            />
            <WinnerSelect
              title={COMPETITION_LABELS.drive_in_contest}
              caption="VINCITORE · BUCA 9 · GIRO 5"
              badgeNumber={5}
              badgeColor="#9A7B2E"
              players={allPlayers}
              currentWinnerName={winners.drive_in_contest}
              onSet={(name) => setWinner('drive_in_contest', name)}
            />
          </div>

          <SectionCard num={6} title="Gestione punteggi" hint="sblocco d'emergenza" badgeColor="#C0503A" badgeText="#FBF7EC">
            <ScoreManager pairs={pairs} />
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
