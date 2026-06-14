import Avatar from '../ui/Avatar'
import { useSpecials } from '../../hooks/useSpecials'
import type { CompetitionType } from '../../lib/types'

const ringByRank = ['#F0D98A', '#C9CFC4', '#D69A5C']

const FlagIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#74C69D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22V4M4 4l11 3-11 3" />
  </svg>
)
const BirdIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#E8CE7E">
    <path d="M22 3c-2 4-4.5 6-7.5 7C12 11 9.5 12 7 14c-1.6 1.3-2.6 3-3 5 2-.8 3.6-1 5-1-.6 1-1 2-1 3 2.4-1.3 4-3 5-5 4-1 7-4 8-9 .3-1.4.5-2.7 1-4z" />
  </svg>
)
const TargetIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#74C69D" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v18M3 12h18" />
  </svg>
)
const RulerIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E0B868" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21L21 3M7 4l3 3M4 7l3 3M14 17l3 3M17 14l3 3" />
  </svg>
)
const TrophyIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#E8CE7E">
    <path d="M3 7l4 4 5-7 5 7 4-4-2 12H5L3 7z" />
  </svg>
)

function Badge({ children, tone }: { children: React.ReactNode; tone: 'green' | 'gold' | 'amber' }) {
  const map = {
    green: { bg: 'rgba(116,198,157,.14)', color: '#9FE3BE', border: 'rgba(116,198,157,.3)' },
    gold: { bg: 'rgba(201,168,76,.18)', color: '#F0D98A', border: 'rgba(201,168,76,.4)' },
    amber: { bg: 'rgba(201,168,76,.14)', color: '#E0B868', border: 'rgba(201,168,76,.3)' },
  }[tone]
  return (
    <span
      className="flex-none rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[1px]"
      style={{ background: map.bg, color: map.color, border: `1px solid ${map.border}` }}
    >
      {children}
    </span>
  )
}

function CardHead({
  icon,
  title,
  subtitle,
  badge,
  gold,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  badge: React.ReactNode
  gold?: boolean
}) {
  return (
    <div className="mb-[18px] flex items-start justify-between gap-3">
      <div>
        <div className="mb-[5px] flex items-center gap-[9px]">
          {icon}
          <h3 className="m-0 font-serif text-[21px] font-semibold" style={{ color: gold ? '#FBF7EC' : '#F4EFE3' }}>
            {title}
          </h3>
        </div>
        <p className="m-0 text-[12.5px] text-[#f4efe380]">{subtitle}</p>
      </div>
      {badge}
    </div>
  )
}

export default function SpecialCards() {
  const { allPlayers, ntpLeader, birdieStandings, winners, setWinner } = useSpecials()

  function WinnerCard({
    type,
    title,
    subtitle,
    icon,
    badge,
  }: {
    type: CompetitionType
    title: string
    subtitle: string
    icon: React.ReactNode
    badge: React.ReactNode
  }) {
    const winnerName = winners[type]
    const photo = winnerName ? allPlayers.find((p) => p.name === winnerName)?.photoUrl : null
    return (
      <div
        className="relative overflow-hidden rounded-[18px] p-[26px]"
        style={{
          background: 'linear-gradient(165deg, rgba(13,43,29,.7), rgba(11,32,21,.5))',
          border: '1px solid rgba(116,198,157,.2)',
          boxShadow: '0 22px 50px -34px rgba(0,0,0,.9)',
        }}
      >
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg,#40916C,#74C69D)' }} />
        <CardHead icon={icon} title={title} subtitle={subtitle} badge={badge} />
        {winnerName ? (
          <div
            className="mb-3 flex items-center gap-3.5 rounded-[14px] p-4"
            style={{ background: 'rgba(7,21,13,.45)', border: '1px solid rgba(116,198,157,.16)' }}
          >
            <Avatar name={winnerName} photoUrl={photo} size={46} ringColor="#C9A84C" />
            <div className="flex-1">
              <div className="mb-[3px] font-mono text-[9px] tracking-[2px] text-gold">VINCITORE</div>
              <div className="text-[16px] font-bold text-[#F4EFE3]">{winnerName}</div>
            </div>
            {TrophyIcon}
          </div>
        ) : (
          <div
            className="mb-3 flex flex-col items-center justify-center gap-2.5 rounded-[14px] p-6"
            style={{ background: 'rgba(7,21,13,.4)', border: '1px dashed rgba(201,168,76,.3)' }}
          >
            <div className="font-serif text-[18px] italic text-[#f4efe3b3]">Da assegnare</div>
          </div>
        )}
        <select
          value={winnerName ?? ''}
          onChange={(e) => setWinner(type, e.target.value || null)}
          className="w-full cursor-pointer rounded-[10px] px-3.5 py-[11px] font-sans text-[13.5px] font-semibold outline-none"
          style={{ background: 'rgba(7,21,13,.6)', border: '1px solid rgba(116,198,157,.25)', color: '#F4EFE3' }}
        >
          <option value="" style={{ background: '#0d2b1d' }}>
            — Seleziona vincitore —
          </option>
          {allPlayers.map((p, i) => (
            <option key={i} value={p.name} style={{ background: '#0d2b1d' }}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-[clamp(14px,2vw,22px)] sm:grid-cols-2">
      {/* NTP */}
      <div
        className="relative overflow-hidden rounded-[18px] p-[26px]"
        style={{
          background: 'linear-gradient(165deg, rgba(13,43,29,.7), rgba(11,32,21,.5))',
          border: '1px solid rgba(116,198,157,.2)',
          boxShadow: '0 22px 50px -34px rgba(0,0,0,.9)',
        }}
      >
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg,#40916C,#74C69D)' }} />
        <CardHead icon={FlagIcon} title="Nearest to the Pin" subtitle="Prima pallina più vicina alla bandiera · Buca 2" badge={<Badge tone="green">BUCA 2</Badge>} />
        {ntpLeader ? (
          <div className="flex items-center gap-3.5 rounded-[14px] p-4" style={{ background: 'rgba(7,21,13,.45)', border: '1px solid rgba(116,198,157,.16)' }}>
            <Avatar name={ntpLeader.pair?.name ?? ntpLeader.player_name} photoUrl={ntpLeader.pair?.photo_url} size={52} ringColor="#74C69D" />
            <div className="min-w-0 flex-1">
              <div className="mb-[3px] font-mono text-[9px] tracking-[2px] text-[#74C69D]">IN TESTA</div>
              <div className="truncate text-[16px] font-bold text-[#F4EFE3]">{ntpLeader.player_name}</div>
            </div>
            <div className="flex-none text-right">
              <div className="font-mono text-[28px] font-bold leading-none text-[#74C69D]">{ntpLeader.distance_cm}</div>
              <div className="font-mono text-[10px] text-[#f4efe380]">cm</div>
            </div>
          </div>
        ) : (
          <div className="rounded-[14px] p-5 text-center text-[14px] italic text-[#f4efe366]" style={{ background: 'rgba(7,21,13,.4)' }}>
            Nessuna misura
          </div>
        )}
      </div>

      {/* BIRDIECUP */}
      <div
        className="relative overflow-hidden rounded-[18px] p-[26px]"
        style={{
          background: 'linear-gradient(165deg, rgba(201,168,76,.16), rgba(11,32,21,.55))',
          border: '1px solid rgba(201,168,76,.4)',
          boxShadow: '0 22px 50px -34px rgba(0,0,0,.9), 0 0 40px -20px rgba(201,168,76,.4)',
        }}
      >
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg,#9A7B2E,#F0D98A,#C9A84C)' }} />
        <CardHead icon={BirdIcon} title="BirdieCup" subtitle="Più birdie alla buca 8 (par 3)" badge={<Badge tone="gold">BUCA 8</Badge>} gold />
        {birdieStandings.length > 0 ? (
          <div className="flex flex-col gap-2">
            {birdieStandings.map((b, i) => (
              <div
                key={b.pair.id}
                className="flex items-center gap-3 rounded-[12px] px-3.5 py-2.5"
                style={{
                  background: i === 0 ? 'rgba(201,168,76,.12)' : 'rgba(7,21,13,.4)',
                  border: `1px solid ${i === 0 ? 'rgba(201,168,76,.34)' : 'rgba(255,255,255,.06)'}`,
                }}
              >
                <span className="w-[18px] font-mono text-[15px] font-bold" style={{ color: ringByRank[i] }}>
                  {i + 1}
                </span>
                <Avatar name={b.pair.name} photoUrl={b.pair.photo_url} size={34} ringColor={ringByRank[i]} />
                <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#F4EFE3]">{b.pair.name}</span>
                <span className="font-mono text-[16px] font-bold text-[#F0D98A]">{b.count}</span>
                <span className="text-[11px] text-[#f4efe380]">birdie</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[12px] p-5 text-center text-[14px] italic text-[#f4efe366]" style={{ background: 'rgba(7,21,13,.4)' }}>
            Nessun birdie
          </div>
        )}
      </div>

      {/* CLOSEST TO LINE */}
      <WinnerCard
        type="closest_to_line"
        title="Closest to the Line"
        subtitle="Pallina più vicina alla linea · Buca 7"
        icon={TargetIcon}
        badge={<Badge tone="green">BUCA 7</Badge>}
      />

      {/* DRIVING CONTEST */}
      <WinnerCard
        type="drive_in_contest"
        title="Driving contest"
        subtitle="Drive più lungo · Buca 9 · solo Giro 5"
        icon={RulerIcon}
        badge={<Badge tone="amber">GIRO 5</Badge>}
      />
    </div>
  )
}
