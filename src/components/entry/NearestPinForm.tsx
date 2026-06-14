import { useState } from 'react'
import { ROUNDS } from '../../lib/constants'
import type { NearestToPin, PlayerOption } from '../../lib/types'

interface Props {
  players: PlayerOption[]
  entries: NearestToPin[]
  defaultRound: number
  onAdd: (playerName: string, pairId: string | null, round: number, distanceCm: number) => Promise<void>
}

const inputStyle = {
  background: 'rgba(7,21,13,.5)',
  border: '1px solid rgba(116,198,157,.3)',
  color: '#F4EFE3',
} as const

export default function NearestPinForm({ players, entries, defaultRound, onAdd }: Props) {
  const [playerIdx, setPlayerIdx] = useState<number | ''>('')
  const [distance, setDistance] = useState('')
  const [round, setRound] = useState(defaultRound)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const dist = Number(distance)
    if (playerIdx === '' || !dist || dist <= 0) return
    const player = players[playerIdx]
    if (!player) return
    setBusy(true)
    await onAdd(player.name, player.pairId, round, dist)
    setBusy(false)
    setDistance('')
  }

  return (
    <div className="rounded-[20px] p-6" style={{ background: 'linear-gradient(165deg,#103024,#16402c)', boxShadow: '0 16px 40px -22px rgba(20,40,25,.4)' }}>
      <div className="mb-[5px] flex items-center gap-[9px]">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9FE3BE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V4M4 4l11 3-11 3" /></svg>
        <h3 className="m-0 font-serif text-[20px] font-bold text-[#FBF7EC]">Nearest to the Pin — Buca 2</h3>
      </div>
      <p className="m-0 mb-[18px] text-[13px] text-[#f4efe399]">Inserisci la distanza dal primo colpo alla bandiera</p>

      <form onSubmit={submit}>
        <div className="grid gap-2.5" style={{ gridTemplateColumns: '1fr 110px' }}>
          <select value={playerIdx} onChange={(e) => setPlayerIdx(e.target.value === '' ? '' : Number(e.target.value))} className="rounded-[11px] px-3.5 py-[13px] font-sans text-[14px] font-semibold outline-none" style={inputStyle}>
            <option value="" style={{ background: '#0d2b1d' }}>Giocatore…</option>
            {players.map((p, i) => (
              <option key={i} value={i} style={{ background: '#0d2b1d' }}>{p.name}</option>
            ))}
          </select>
          <select value={round} onChange={(e) => setRound(Number(e.target.value))} className="rounded-[11px] px-2.5 py-[13px] font-mono text-[14px] font-semibold outline-none" style={inputStyle}>
            {ROUNDS.map((r) => (
              <option key={r} value={r} style={{ background: '#0d2b1d' }}>Giro {r}</option>
            ))}
          </select>
        </div>
        <div className="mt-2.5 grid gap-2.5" style={{ gridTemplateColumns: '1fr 130px' }}>
          <input value={distance} onChange={(e) => setDistance(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" placeholder="Distanza in cm" className="rounded-[11px] px-3.5 py-[13px] font-mono text-[15px] font-semibold outline-none" style={inputStyle} />
          <button type="submit" disabled={busy} className="rounded-[11px] font-sans text-[14px] font-bold text-[#F4EFE6] transition-[filter] hover:brightness-110 disabled:opacity-60" style={{ background: 'linear-gradient(145deg,#40916C,#2D6A4F)' }}>
            {busy ? '…' : 'Invia'}
          </button>
        </div>
      </form>

      {entries.length > 0 && (
        <div className="mt-4 pt-3.5" style={{ borderTop: '1px solid rgba(116,198,157,.18)' }}>
          <div className="mb-[9px] font-mono text-[9.5px] tracking-[2px] text-[#9fe3beb3]">MISURE INSERITE</div>
          {entries.map((en) => (
            <div key={en.id} className="mb-1.5 flex items-center justify-between rounded-[9px] px-3 py-[9px]" style={{ background: 'rgba(7,21,13,.4)' }}>
              <span className="text-[13.5px] font-semibold text-[#F4EFE3]">{en.player_name}</span>
              <span className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] text-[#f4efe373]">Giro {en.round_number}</span>
                <span className="font-mono text-[15px] font-bold text-[#9FE3BE]">{en.distance_cm} cm</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
