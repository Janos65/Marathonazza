import type { PlayerOption } from '../../lib/types'

interface Props {
  title: string
  caption: string
  badgeNumber: number
  badgeColor: string
  players: PlayerOption[]
  currentWinnerName: string | null
  onSet: (name: string | null) => Promise<void>
}

export default function WinnerSelect({
  title,
  caption,
  badgeNumber,
  badgeColor,
  players,
  currentWinnerName,
  onSet,
}: Props) {
  return (
    <div className="rounded-[20px] bg-white p-6" style={{ border: '1px solid #E9E2D2', boxShadow: '0 16px 40px -24px rgba(20,40,25,.18)' }}>
      <div className="mb-4 flex items-center gap-[11px]">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] font-mono text-[13px] font-bold text-[#FBF7EC]" style={{ background: badgeColor }}>
          {badgeNumber}
        </div>
        <h3 className="m-0 font-serif text-[17px] font-bold text-[#14271B]">{title}</h3>
      </div>
      <div className="mb-[7px] font-mono text-[10px] tracking-[1.5px] text-[#9a947f]">{caption}</div>
      <select
        value={currentWinnerName ?? ''}
        onChange={(e) => onSet(e.target.value || null)}
        className="w-full cursor-pointer rounded-[11px] px-3.5 py-[13px] font-sans text-[14px] font-semibold text-[#14271B] outline-none"
        style={{ border: '1.5px solid #E1DAC8', background: '#FAF7EF' }}
      >
        <option value="">Da assegnare…</option>
        {players.map((p, i) => (
          <option key={i} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  )
}
