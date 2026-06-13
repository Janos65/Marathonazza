import { usePairs } from '../hooks/usePairs'
import { useHoles } from '../hooks/useHoles'
import { useSpecials } from '../hooks/useSpecials'
import { HOLES, COMPETITION_LABELS } from '../lib/constants'
import SectionHeading, { GoldDivider } from '../components/ui/SectionHeading'
import { FullPageSpinner } from '../components/ui/Spinner'
import PhotoUpload from '../components/admin/PhotoUpload'
import MapUpload from '../components/admin/MapUpload'
import ParEditor from '../components/admin/ParEditor'
import WinnerSelect from '../components/admin/WinnerSelect'
import ScoreManager from '../components/admin/ScoreManager'

export default function Admin() {
  const { pairs, loading: pairsLoading, refetch: refetchPairs } = usePairs()
  const { parByHole, mapByHole, loading: holesLoading, updatePar, updateMap } = useHoles()
  const { winners, setWinner, allPlayers } = useSpecials()

  if (pairsLoading || holesLoading) return <FullPageSpinner />

  async function saveAllPars(pars: Record<number, number | null>) {
    await Promise.all(Object.entries(pars).map(([h, p]) => updatePar(Number(h), p)))
  }

  return (
    <div className="py-8">
      <h1 className="mb-1 text-3xl font-serif font-bold text-green-800">Pannello Admin</h1>
      <p className="mb-8 text-sm text-gray-500">
        Nessuna autenticazione — strumento per l’organizzatore.
      </p>

      <section>
        <SectionHeading hint="Carica le foto profilo delle coppie (max 2MB).">
          Foto Profilo Coppie
        </SectionHeading>
        <div className="grid gap-3 sm:grid-cols-2">
          {pairs.map((p) => (
            <PhotoUpload key={p.id} pair={p} onUpdated={refetchPairs} />
          ))}
        </div>
      </section>

      <GoldDivider />

      <section>
        <SectionHeading hint="Carica le mappe delle 9 buche (max 5MB).">Mappe Buche</SectionHeading>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HOLES.map((h) => (
            <MapUpload key={h} holeNumber={h} mapUrl={mapByHole[h] ?? null} onUpload={updateMap} />
          ))}
        </div>
      </section>

      <GoldDivider />

      <section>
        <SectionHeading hint="Imposta il par di ogni buca (3–6). Buca 8 è par 3 fisso.">
          Par delle Buche
        </SectionHeading>
        <ParEditor parByHole={parByHole} onSaveAll={saveAllPars} />
      </section>

      <GoldDivider />

      <section>
        <SectionHeading hint="Imposta manualmente i vincitori dei premi a giudizio (giocatore singolo).">
          Vincitori Premi Speciali
        </SectionHeading>
        <div className="grid gap-3 sm:grid-cols-2">
          <WinnerSelect
            title={COMPETITION_LABELS.closest_to_line}
            subtitle="Buca 7 — prima pallina più vicina alla linea di metà fairway"
            players={allPlayers}
            currentWinnerName={winners.closest_to_line}
            onSet={(name) => setWinner('closest_to_line', name)}
          />
          <WinnerSelect
            title={COMPETITION_LABELS.drive_in_contest}
            subtitle="Buca 9 — drive più lungo nell’ultimo giro (Giro 5)"
            players={allPlayers}
            currentWinnerName={winners.drive_in_contest}
            onSet={(name) => setWinner('drive_in_contest', name)}
          />
        </div>
      </section>

      <GoldDivider />

      <section>
        <SectionHeading hint="Sblocca un giro confermato per permettere la modifica.">
          Gestione Punteggi
        </SectionHeading>
        <ScoreManager pairs={pairs} />
      </section>
    </div>
  )
}
