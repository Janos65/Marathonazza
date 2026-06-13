import { Crown } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import { ROUNDS } from '../../lib/constants'
import type { LeaderboardRow } from '../../lib/types'

interface Props {
  rows: LeaderboardRow[]
}

type Ring = 'gold' | 'silver' | 'bronze' | 'none'

function podiumStyle(rank: number): { ring: Ring; rowClass: string; border: string } {
  if (rank === 1)
    return {
      ring: 'gold',
      rowClass: 'rank-1',
      border: '#C9A84C',
    }
  if (rank === 2) return { ring: 'silver', rowClass: '', border: '#A8B5A0' }
  if (rank === 3) return { ring: 'bronze', rowClass: '', border: '#C17F3A' }
  return { ring: 'none', rowClass: '', border: 'transparent' }
}

function rowBg(rank: number): string {
  if (rank === 1) return 'linear-gradient(90deg, #FFF9E6 0%, #ffffff 45%)'
  if (rank === 2) return 'linear-gradient(90deg, #F1F4F0 0%, #ffffff 45%)'
  if (rank === 3) return 'linear-gradient(90deg, #F8EFE6 0%, #ffffff 45%)'
  return '#ffffff'
}

export default function MainTable({ rows }: Props) {
  let rank = 0

  return (
    <div className="overflow-x-auto rounded-2xl border border-green-100 bg-white shadow-sm">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-green-800 text-xs font-semibold text-white">
            <th className="px-3 py-3 text-left">#</th>
            <th className="px-3 py-3 text-left">Coppia</th>
            {ROUNDS.map((r) => (
              <th key={r} className="px-2 py-3 text-center">
                R{r}
              </th>
            ))}
            <th className="px-2 py-3 text-center">HCP</th>
            <th className="px-3 py-3 text-center">Netto</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const ranked = row.submittedCount > 0
            if (ranked) rank++
            const displayRank = ranked ? rank : null
            const ps = podiumStyle(ranked ? rank : 99)
            return (
              <tr
                key={row.pair.id}
                className={`leaderboard-row ${ps.rowClass}`}
                style={{
                  background: rowBg(ranked ? rank : 99),
                  animationDelay: `${i * 0.04}s`,
                }}
              >
                <td
                  className="px-3 py-3 text-center text-sm font-bold text-green-800"
                  style={{ borderLeft: `4px solid ${ps.border}` }}
                >
                  <div className="flex items-center justify-center gap-1">
                    {displayRank === 1 && <Crown size={16} className="text-gold" />}
                    {displayRank ?? '—'}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={row.pair.name} photoUrl={row.pair.photo_url} size={40} ring={ps.ring} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-green-800">
                        {row.pair.name}
                      </p>
                      {row.hasInProgress && (
                        <Badge tone="green" pulse className="mt-0.5">
                          ⛳ in corso
                        </Badge>
                      )}
                    </div>
                  </div>
                </td>
                {ROUNDS.map((r) => (
                  <td key={r} className="tnum px-2 py-3 text-center text-sm text-gray-600">
                    {row.rounds[r] ?? '—'}
                  </td>
                ))}
                <td className="tnum px-2 py-3 text-center text-sm text-gray-500">
                  {row.pair.handicap}
                </td>
                <td className="tnum px-3 py-3 text-center text-base font-bold text-green-800">
                  {row.submittedCount > 0 ? row.totalNet : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
