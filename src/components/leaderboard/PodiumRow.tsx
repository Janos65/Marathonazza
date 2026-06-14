import Avatar from '../ui/Avatar'
import type { LeaderboardRow } from '../../lib/types'

interface Props {
  rows: LeaderboardRow[]
}

const CROWN = (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#E8CE7E" stroke="#9A7B2E" strokeWidth=".6" style={{ filter: 'drop-shadow(0 6px 14px rgba(201,168,76,.5))' }}>
    <path d="M3 7l4 4 5-7 5 7 4-4-2 12H5L3 7z" />
  </svg>
)

function totalText(r: LeaderboardRow | undefined): string {
  if (!r) return '—'
  return r.submittedCount > 0 ? String(r.totalNet) : '—'
}

function Side({ row, place }: { row: LeaderboardRow | undefined; place: 2 | 3 }) {
  const ring = place === 2 ? '#C9CFC4' : '#D69A5C'
  const tint = place === 2 ? 'rgba(168,181,160,.14)' : 'rgba(193,127,58,.16)'
  const border = place === 2 ? 'rgba(168,181,160,.34)' : 'rgba(193,127,58,.4)'
  const badge = place === 2 ? 'linear-gradient(145deg,#C9CFC4,#8c978a)' : 'linear-gradient(145deg,#D69A5C,#a05f28)'
  if (!row) return <div />
  return (
    <div
      className="relative rounded-[20px] px-4 pb-6 pt-[26px] text-center"
      style={{
        background: `linear-gradient(180deg, ${tint}, rgba(11,32,21,.6))`,
        border: `1px solid ${border}`,
        boxShadow: '0 24px 60px -30px rgba(0,0,0,.8)',
        animation: `mzScaleIn .7s cubic-bezier(.16,.84,.3,1) ${place === 2 ? '.1s' : '.2s'} both`,
      }}
    >
      <div
        className="absolute left-1/2 top-[-15px] grid h-[30px] w-[30px] -translate-x-1/2 place-items-center rounded-full font-mono text-[13px] font-bold text-[#0e1f15]"
        style={{ background: badge, boxShadow: '0 6px 16px rgba(0,0,0,.4)' }}
      >
        {place}
      </div>
      <div className="mx-auto mb-3.5 mt-2 w-fit">
        <Avatar name={row.pair.name} photoUrl={row.pair.photo_url} size={72} ringColor={ring} />
      </div>
      <div className="font-serif text-[clamp(15px,1.7vw,18px)] font-semibold leading-tight text-[#F4EFE3]">
        {row.pair.name}
      </div>
      <div className="mt-3 font-mono text-[30px] font-bold" style={{ color: ring }}>
        {totalText(row)}
      </div>
      <div className="mt-0.5 font-mono text-[9.5px] tracking-[2px] text-[#f4efe373]">
        TOTALE · HCP {row.pair.handicap}
      </div>
    </div>
  )
}

export default function Podium({ rows }: Props) {
  if (rows.length === 0) return null
  const [first, second, third] = rows

  return (
    <div className="mb-[clamp(44px,6vw,68px)] grid grid-cols-3 items-end gap-[clamp(10px,1.8vw,20px)]">
      <Side row={second} place={2} />

      {/* 1st */}
      {first && (
        <div
          className="relative rounded-[22px] px-[18px] pb-[30px] pt-[34px] text-center"
          style={{
            background: 'linear-gradient(180deg, rgba(232,206,126,.2), rgba(13,43,29,.78))',
            border: '1.5px solid rgba(232,206,126,.6)',
            animation: 'mzGoldPulse 3.2s ease-in-out infinite, mzScaleIn .7s cubic-bezier(.16,.84,.3,1) both',
          }}
        >
          <div className="absolute left-1/2 top-[-20px] -translate-x-1/2">{CROWN}</div>
          <div className="mx-auto mb-4 mt-4 w-fit">
            <Avatar name={first.pair.name} photoUrl={first.pair.photo_url} size={96} ringColor="#E8CE7E" />
          </div>
          <div className="font-serif text-[clamp(18px,2.2vw,24px)] font-bold leading-tight text-[#FBF7EC]">
            {first.pair.name}
          </div>
          <div
            className="mt-3 font-mono text-[46px] font-bold leading-none"
            style={{
              background: 'linear-gradient(90deg,#9A7B2E,#F0D98A,#C9A84C)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {totalText(first)}
          </div>
          <div className="mt-1 font-mono text-[10px] tracking-[2px] text-[#E8CE7E]">
            TOTALE · HCP {first.pair.handicap}
          </div>
        </div>
      )}

      <Side row={third} place={3} />
    </div>
  )
}
