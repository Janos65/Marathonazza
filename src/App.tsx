import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/ui/NavBar'
import Leaderboard from './pages/Leaderboard'
import LiveRound from './pages/LiveRound'
import ScoreEntry from './pages/ScoreEntry'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="mx-auto min-h-[calc(100vh-57px)] max-w-page px-6 pb-24 md:px-12 sm:pb-10">
        <Routes>
          <Route path="/" element={<Leaderboard />} />
          <Route path="/live" element={<LiveRound />} />
          <Route path="/enter" element={<ScoreEntry />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
