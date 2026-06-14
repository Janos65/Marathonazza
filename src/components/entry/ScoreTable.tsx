import { useState } from 'react'
import StrokeStepper from './StrokeStepper'
import { getHoleOrder, sumStrokes, calcNetScore, isRoundComplete } from '../../lib/scoring'
import type { Pair, ScoreMap } from '../../lib/types'

interface Props {
  pair: Pair
  roundNumber: number
  parByHole: Record<number, number | null>
  scores: ScoreMap
  submitted: boolean
  birdieCount: number
  submittedRoundsCount: number
  onSetStroke: (hole: number, strokes: number | null) => void
  onSubmit: () => void
}

const BirdIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#C9A84C">
    <path d="M22 3c-2 4-4.5 6-7.5 7C12 11 9.5 12 7 14c-1.6 1.3-2.6 3-3 5 2-.8 3.6-1 5-1-.6 1-1 2-1 3 2.4-1.3 4-3 5-5 4-1 7-4 8-9 .3-1.4.5-2.7 1-4z" />
  </svg>
)

function diffMeta(strokes: number | null, par: number | null): { label: string; color: string; bg: string } {
  if (strokes == null || par == null) return { label: '', color: '#9aa896', bg: 'transparent' }
  const d = strokes - par
  if (d <= -2) return { label: `−${Math.abs(d)}`, color: '#1A6B3A', bg: 'rgba(45,158,90,.14)' }
  if (d === -1) return { label: 'B', color: '#1A6B3A', bg: 'rgba(45,158,90,.16)' }
  if (d === 0) return { label: 'PAR', color: '#5d7a5f', bg: 'rgba(120,140,120,.1)' }
  if (d === 1) return { label: '+1', color: '#B5742A', bg: 'rgba(201,137,63,.14)' }
  return { label: `+${d}`, color: '#B23A28', bg: 'rgba(192,80,58,.14)' }
}

export default function ScoreTable({
  pair,
  roundNumber,
  parByHole,
  scores,
  submitted,
  birdieCount,
  submittedRoundsCount,
  onSetStroke,
  onSubmit,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const order = getHoleOrder(pair.starting_hole)
  const raw = sumStrokes(scores)
  const filled = order.filter((h) => scores[h] != null).length
  const net = calcNetScore(raw, pair.handicap)
  const complete = isRoundComplete(scores)

  return (
    <div className="overflow-hidden rounded-[20px] bg-white" style={{ border: '1px solid #E9E2D2', boxShadow: '0 16px 40px -22px rgba(20,40,25,.22)' }}>
      {/* pair head */}
      <div className="flex items-center gap-3 px-5 py-[18px]" style={{ borderBottom: '1px solid #F0EBDD' }}>
        <div className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full font-serif text-[17px] font-bold text-[#EAF2E8]" style={{ background: 'linear-gradient(145deg,#2D6A4F,#16331f)', boxShadow: '0 4px 12px rgba(27,67,50,.3)' }}>
          {pair.name.split('/').map((s) => s.trim()[0] || '').join('')}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-serif text-[19px] font-bold leading-tight text-[#14271B]">{pair.name}</div>
          <div className="mt-0.5 flex items-center gap-2.5">
            <span className="font-mono text-[11px] text-[#8a8470]">HCP {pair.handicap}</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#9A7B2E]">
              <BirdIcon />
              {birdieCount} birdie{submittedRoundsCount > 0 ? ` · ${submittedRoundsCount} giri` : ''}
            </span>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="px-6 py-[30px] text-center">
          <div className="inline-flex items-center gap-[9px] rounded-full px-5 py-[11px] text-[15px] font-bold text-[#1A6B3A]" style={{ background: 'rgba(45,158,90,.12)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D9E5A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></svg>
            Giro {roundNumber} confermato
          </div>
          <div className="mt-[22px] flex items-center justify-center gap-[30px]">
            <div>
              <div className="font-mono text-[30px] font-bold text-[#14271B]">{raw}</div>
              <div className="mt-0.5 font-mono text-[10px] tracking-[1.5px] text-[#9a947f]">LORDO</div>
            </div>
            <div className="h-9 w-px bg-[#E7E0D0]" />
            <div>
              <div className="font-mono text-[30px] font-bold text-[#1B4332]">{net}</div>
              <div className="mt-0.5 font-mono text-[10px] tracking-[1.5px] text-[#9a947f]">NETTO</div>
            </div>
          </div>
          <div className="mt-3.5 text-[12px] text-[#a8a293]">Modificabile solo dall'admin</div>
        </div>
      ) : (
        <>
          <div className="px-3 pb-2 pt-1">
            {order.map((hole) => {
              const par = parByHole[hole] ?? null
              const strokes = scores[hole] ?? null
              const dm = diffMeta(strokes, par)
              const isB = hole === 8
              return (
                <div
                  key={hole}
                  className="grid items-center gap-2 rounded-xl px-2 py-2"
                  style={{
                    gridTemplateColumns: '64px 1fr 150px 52px',
                    background: isB ? 'linear-gradient(90deg, rgba(201,168,76,.1), rgba(255,255,255,0) 72%)' : '#FFFFFF',
                    borderBottom: '1px solid #F4F0E5',
                  }}
                >
                  <div className="flex items-center gap-[7px]">
                    <span className="font-mono text-[17px] font-bold text-[#14271B]">{hole}</span>
                    {isB && <BirdIcon size={13} />}
                  </div>
                  <div className="font-mono text-[11px] text-[#9a947f]">Par {par ?? '—'}</div>
                  <StrokeStepper value={strokes} onChange={(v) => onSetStroke(hole, v)} />
                  <div className="rounded-lg py-[5px] text-center font-mono text-[13px] font-bold" style={{ color: dm.color, background: dm.bg }}>
                    {dm.label}
                  </div>
                </div>
              )
            })}
          </div>

          {/* footer */}
          <div className="px-5 pb-5 pt-3.5" style={{ borderTop: '1px solid #F0EBDD' }}>
            <div className="mb-3.5 flex items-center justify-center gap-[26px]">
              <div className="text-center">
                <div className="font-mono text-[24px] font-bold text-[#14271B]">{raw}</div>
                <div className="font-mono text-[9.5px] tracking-[1.5px] text-[#9a947f]">LORDO</div>
              </div>
              <span className="text-[18px] text-[#cbc4b0]">−</span>
              <div className="text-center">
                <div className="font-mono text-[24px] font-bold text-[#8a8470]">{pair.handicap}</div>
                <div className="font-mono text-[9.5px] tracking-[1.5px] text-[#9a947f]">HCP</div>
              </div>
              <span className="text-[18px] text-[#cbc4b0]">=</span>
              <div className="text-center">
                <div className="font-mono text-[24px] font-bold text-[#1B4332]">{net}</div>
                <div className="font-mono text-[9.5px] tracking-[1.5px] text-[#9a947f]">NETTO</div>
              </div>
            </div>
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={!complete}
              className="flex w-full items-center justify-center gap-[9px] rounded-[14px] p-4 font-sans text-[16px] font-bold transition-colors"
              style={{
                background: complete ? '#1B4332' : '#E7E1D2',
                color: complete ? '#F7F3E8' : '#AFA993',
                cursor: complete ? 'pointer' : 'not-allowed',
                animation: complete ? 'mzPulseBtn 1.8s ease-in-out infinite' : 'none',
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></svg>
              <span>Conferma giro {roundNumber}</span>
              <span className="font-mono text-[13px] opacity-70">{filled}/9</span>
            </button>
          </div>
        </>
      )}

      {/* confirm dialog */}
      {confirmOpen && (
        <div
          onClick={() => setConfirmOpen(false)}
          className="fixed inset-0 z-[90] flex items-center justify-center p-[22px]"
          style={{ background: 'rgba(20,40,25,.45)', backdropFilter: 'blur(4px)', animation: 'mzFadeIn .18s ease' }}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-[min(420px,100%)] rounded-[20px] bg-white p-7 text-center" style={{ boxShadow: '0 40px 90px -30px rgba(20,40,25,.5)', animation: 'mzModalIn .26s cubic-bezier(.16,.84,.3,1)' }}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(201,168,76,.14)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></svg>
            </div>
            <h3 className="m-0 mb-2 font-serif text-[22px] font-bold text-[#14271B]">Confermi il Giro {roundNumber}?</h3>
            <p className="m-0 mb-[22px] text-[14px] leading-relaxed text-[#6B7A66]">
              Stai confermando i colpi di <strong className="text-[#14271B]">{pair.name}</strong>. Potrà essere modificato solo dall'admin.
            </p>
            <div className="flex gap-2.5">
              <button onClick={() => setConfirmOpen(false)} className="flex-1 rounded-xl bg-white p-3.5 text-[15px] font-bold text-[#6B7A66]" style={{ border: '1.5px solid #E1DAC8' }}>
                Annulla
              </button>
              <button
                onClick={() => {
                  setConfirmOpen(false)
                  onSubmit()
                }}
                className="rounded-xl p-3.5 text-[15px] font-bold text-[#F7F3E8]"
                style={{ flex: 1.4, background: '#1B4332' }}
              >
                Conferma giro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
