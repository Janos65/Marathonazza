import Avatar from '../ui/Avatar'
import { ROUNDS } from '../../lib/constants'
import type { LeaderboardRow } from '../../lib/types'

interface Props {
  rows: LeaderboardRow[]
}

const GRID = '54px 1fr repeat(5,46px) 52px 74px'
const podColors = ['#E8CE7E', '#C9CFC4', '#D69A5C']

function rowBgFor(rank: number | null): string {
  if (rank === 1) return 'linear-gradient(90deg, rgba(232,206,126,.12), rgba(11,32,21,0) 55%)'
  if (rank === 2) return 'linear-gradient(90deg, rgba(168,181,160,.1), rgba(11,32,21,0) 55%)'
  if (rank === 3) return 'linear-gradient(90deg, rgba(193,127,58,.1), rgba(11,32,21,0) 55%)'
  return 'transparent'
}

export default function MainTable({ rows }: Props) {
  let rank = 0

  return (
    <div
      className="overflow-hidden rounded-[20px] border backdrop-blur"
      style={{
        borderColor: 'rgba(201,168,76,.16)',
        background: 'rgba(11,32,21,.5)',
        boxShadow: '0 30px 70px -40px rgba(0,0,0,.9)',
      }}
    >
      <div className="overflow-x-auto">
        <div style={{ minWidth: 720 }}>
          {/* head */}
          <div
            className="grid items-center gap-1.5 border-b px-5 py-3.5"
            style={{ gridTemplateColumns: GRID, borderColor: 'rgba(201,168,76,.16)', background: 'rgba(7,21,13,.5)' }}
          >
            <div className="font-mono text-[10px] tracking-[1.5px] text-[#f4efe380]">POS</div>
            <div className="font-mono text-[10px] tracking-[1.5px] text-[#f4efe380]">COPPIA</div>
            {ROUNDS.map((r) => (
              <div key={r} className="text-center font-mono text-[10px] text-[#f4efe380]">
                G{r}
              </div>
            ))}
            <div className="text-center font-mono text-[10px] text-[#f4efe380]">HCP</div>
            <div className="text-right font-mono text-[10px] tracking-[1px] text-gold">TOTALE</div>
          </div>

          {/* rows */}
          {rows.map((row, i) => {
            const ranked = row.submittedCount > 0
            if (ranked) rank++
            const displayRank = ranked ? rank : null
            const podium = displayRank && displayRank <= 3 ? displayRank : 0
            const accent = podium ? podColors[podium - 1] : 'transparent'
            const rankColor = podium ? accent : 'rgba(244,239,227,.5)'
            const totalColor = displayRank === 1 ? '#F0D98A' : podium ? accent : '#F4EFE3'
            return (
              <div
                key={row.pair.id}
                className="grid items-center gap-1.5 px-5 py-[11px]"
                style={{
                  gridTemplateColumns: GRID,
                  background: rowBgFor(podium || null),
                  borderBottom: '1px solid rgba(255,255,255,.04)',
                  borderLeft: `3px solid ${accent}`,
                  animation: `mzFadeUp .5s ease ${Math.min(i * 0.035, 0.5)}s both`,
                }}
              >
                <div className="font-mono text-[15px] font-bold" style={{ color: rankColor }}>
                  {displayRank ?? '—'}
                </div>
                <div className="flex min-w-0 items-center gap-[11px]">
                  <Avatar
                    name={row.pair.name}
                    photoUrl={row.pair.photo_url}
                    size={38}
                    ringColor={accent !== 'transparent' ? accent : 'rgba(201,168,76,.28)'}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[15px] font-bold text-[#F4EFE3]">{row.pair.name}</span>
                      {row.hasInProgress && (
                        <span
                          className="flex flex-none items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[8.5px] tracking-[1px] text-[#9FE3BE]"
                          style={{ background: 'rgba(116,198,157,.16)', border: '1px solid rgba(116,198,157,.4)', animation: 'mzBadge 1.8s ease-in-out infinite' }}
                        >
                          <span className="h-[5px] w-[5px] rounded-full" style={{ background: '#74C69D' }} />
                          IN CORSO
                        </span>
                      )}
                    </div>
                    <div className="truncate text-[11px] text-[#f4efe366]">Partenza buca {row.pair.starting_hole}</div>
                  </div>
                </div>
                {ROUNDS.map((r) => {
                  const v = row.rounds[r]
                  return (
                    <div
                      key={r}
                      className="text-center font-mono text-[13px] font-semibold"
                      style={{ color: v == null ? 'rgba(244,239,227,.28)' : 'rgba(244,239,227,.85)' }}
                    >
                      {v == null ? '—' : v}
                    </div>
                  )
                })}
                <div className="text-center font-mono text-[12px] text-[#f4efe380]">{row.pair.handicap}</div>
                <div className="text-right font-mono text-[19px] font-bold" style={{ color: totalColor }}>
                  {ranked ? row.totalNet : '—'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
