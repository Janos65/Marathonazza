import { useRef } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import Hero from '../components/leaderboard/Hero'
import Podium from '../components/leaderboard/PodiumRow'
import MainTable from '../components/leaderboard/MainTable'
import SpecialCards from '../components/leaderboard/SpecialCards'
import { FullPageSpinner } from '../components/ui/Spinner'

export default function Leaderboard() {
  const { rows, loading, currentRound } = useLeaderboard()
  const tableRef = useRef<HTMLDivElement>(null)

  return (
    <div style={{ background: '#07150D' }}>
      <Hero
        currentRound={currentRound}
        pairsCount={rows.length}
        onScrollDown={() => tableRef.current?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* CLASSIFICA */}
      <section
        ref={tableRef}
        className="scroll-mt-16 px-[clamp(16px,5vw,48px)] py-[clamp(56px,9vw,104px)]"
        style={{ background: 'radial-gradient(120% 60% at 50% 0%, #0D2B1D 0%, #07150D 70%)' }}
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-[clamp(40px,6vw,64px)] text-center">
            <div className="mb-3.5 font-mono text-[11px] tracking-[5px] text-gold">PREMIO FINALE</div>
            <h2 className="m-0 font-serif text-[clamp(34px,6vw,58px)] font-bold tracking-[-.5px] text-[#F4EFE3]">
              Classifica
            </h2>
            <p className="mt-3.5 text-[15px] text-[#f4efe38c]">Punteggio netto cumulativo</p>
          </div>

          {loading ? (
            <FullPageSpinner />
          ) : (
            <>
              <Podium rows={rows.slice(0, 3)} />
              <MainTable rows={rows} />
            </>
          )}
        </div>
      </section>

      {/* PREMI SPECIALI */}
      <section className="px-[clamp(16px,5vw,48px)] pb-[clamp(70px,9vw,120px)] pt-[clamp(40px,7vw,80px)]" style={{ background: '#07150D' }}>
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-[clamp(32px,5vw,52px)] text-center">
            <div className="mb-3.5 font-mono text-[11px] tracking-[5px] text-gold">PREMI SPECIALI</div>
            <h2 className="m-0 font-serif text-[clamp(30px,5vw,50px)] font-bold text-[#FBF7EC]">Premi Speciali</h2>
          </div>
          <SpecialCards />
        </div>

        <div
          className="mx-auto mt-[clamp(50px,7vw,90px)] flex max-w-[1180px] items-center justify-center gap-2.5 pt-[30px]"
          style={{ borderTop: '1px solid rgba(201,168,76,.12)' }}
        >
          <img src="/logo-gold.png" alt="" className="h-6 w-6 object-contain opacity-70" />
          <span className="font-mono text-[10px] tracking-[3px] text-[#c9a84c99]">MARATHONAZZA · 2026</span>
        </div>
      </section>
    </div>
  )
}
