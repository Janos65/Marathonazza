import { useRef } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import Hero from '../components/leaderboard/Hero'
import MainTable from '../components/leaderboard/MainTable'
import SpecialCards from '../components/leaderboard/SpecialCards'
import { GoldDivider } from '../components/ui/SectionHeading'
import { FullPageSpinner } from '../components/ui/Spinner'

export default function Leaderboard() {
  const { rows, loading, currentRound } = useLeaderboard()
  const tableRef = useRef<HTMLDivElement>(null)

  return (
    <div>
      <Hero
        currentRound={currentRound}
        onScrollDown={() => tableRef.current?.scrollIntoView({ behavior: 'smooth' })}
      />

      <div ref={tableRef} className="scroll-mt-20 pt-10">
        <h2 className="mb-4 font-serif text-3xl font-bold text-green-800">Classifica</h2>
        {loading ? <FullPageSpinner /> : <MainTable rows={rows} />}
      </div>

      <GoldDivider />

      <section className="pb-6">
        <h2 className="mb-4 font-serif text-3xl font-bold text-green-800">Gare Speciali</h2>
        <SpecialCards />
      </section>
    </div>
  )
}
