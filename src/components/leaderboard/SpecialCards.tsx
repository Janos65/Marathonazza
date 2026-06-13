import { Flag, Bird, Target, Ruler } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { useSpecials } from '../../hooks/useSpecials'
import type { CompetitionType } from '../../lib/types'

function CardShell({
  title,
  subtitle,
  icon,
  gold = false,
  children,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  gold?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className="flex flex-col rounded-2xl border border-green-100 bg-white"
      style={{ boxShadow: '0 4px 16px rgba(27,67,50,0.08)' }}
    >
      <div
        className={`flex items-center gap-2 rounded-t-2xl px-4 py-3 ${
          gold ? 'text-green-900' : 'text-white'
        }`}
        style={
          gold
            ? { background: 'linear-gradient(135deg, #C9A84C 0%, #F0D98A 100%)' }
            : { background: '#1B4332' }
        }
      >
        {icon}
        <h3 className="font-serif text-lg font-semibold">{title}</h3>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-xs text-gray-500">{subtitle}</p>
        {children}
      </div>
    </div>
  )
}

export default function SpecialCards() {
  const { pairs, pairById, ntpLeader, birdieStandings, winners, setWinner } = useSpecials()

  function WinnerPicker({ type }: { type: CompetitionType }) {
    const winnerId = winners[type]
    const winner = winnerId ? pairById.get(winnerId) : undefined
    return (
      <>
        {winner ? (
          <div className="flex items-center gap-2.5">
            <Avatar name={winner.name} photoUrl={winner.photo_url} size={40} ring="gold" />
            <span className="text-sm font-semibold text-green-800">{winner.name}</span>
          </div>
        ) : (
          <p className="text-sm italic text-gray-400">Da assegnare</p>
        )}
        <select
          value={winnerId ?? ''}
          onChange={(e) => setWinner(type, e.target.value || null)}
          className="mt-auto h-10 rounded-lg border border-green-100 bg-white px-2 text-sm focus:border-green-600 focus:outline-none"
        >
          <option value="">— Seleziona vincitore —</option>
          {pairs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Nearest to the Pin */}
      <CardShell
        title="Nearest to the Pin"
        subtitle="Prima pallina alla buca 2 più vicina alla bandiera"
        icon={<Flag size={22} />}
      >
        {ntpLeader ? (
          <div className="flex items-center gap-2.5">
            <Avatar
              name={ntpLeader.pair?.name ?? ntpLeader.player_name}
              photoUrl={ntpLeader.pair?.photo_url}
              size={40}
            />
            <div>
              <p className="text-sm font-semibold text-green-800">{ntpLeader.player_name}</p>
              <p className="tnum text-sm text-gray-500">{ntpLeader.distance_cm} cm</p>
            </div>
          </div>
        ) : (
          <p className="text-sm italic text-gray-400">Nessuna misura</p>
        )}
      </CardShell>

      {/* BirdieCup */}
      <CardShell
        title="BirdieCup"
        subtitle="Birdie totali alla buca 8 (par 3)"
        icon={<Bird size={22} />}
        gold
      >
        {birdieStandings.length > 0 ? (
          <ol className="space-y-2">
            {birdieStandings.map((s, i) => (
              <li key={s.pair.id} className="flex items-center gap-2.5">
                <span className="w-4 text-sm font-bold text-gold">{i + 1}</span>
                <Avatar name={s.pair.name} photoUrl={s.pair.photo_url} size={32} />
                <span className="flex-1 truncate text-sm font-medium text-green-800">
                  {s.pair.name}
                </span>
                <span className="tnum text-sm font-semibold text-green-700">
                  {s.count} birdie
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm italic text-gray-400">Nessun birdie</p>
        )}
      </CardShell>

      {/* Closest to the Line */}
      <CardShell
        title="Closest to the Line"
        subtitle="Prima pallina più vicina alla linea di metà fairway, buca 7"
        icon={<Target size={22} />}
      >
        <WinnerPicker type="closest_to_line" />
      </CardShell>

      {/* Drive in Contest */}
      <CardShell
        title="Drive in Contest"
        subtitle="Drive più lungo alla buca 9 nell’ultimo giro (Solo giro 5)"
        icon={<Ruler size={22} />}
      >
        <WinnerPicker type="drive_in_contest" />
      </CardShell>
    </div>
  )
}
