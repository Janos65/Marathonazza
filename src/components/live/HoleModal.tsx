import { useEffect, useState } from 'react'
import { SPECIAL_HOLES } from '../../lib/constants'

interface Props {
  hole: number | null
  par: number | null
  mapUrl: string | null
  onClose: () => void
  onSavePar: (hole: number, par: number | null) => Promise<void>
}

export default function HoleModal({ hole, par, mapUrl, onClose, onSavePar }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const special = hole != null ? SPECIAL_HOLES[hole] : undefined

  useEffect(() => {
    setDraft(par != null ? String(par) : '')
    setEditing(false)
  }, [hole, par])

  if (hole == null) return null

  async function savePar() {
    await onSavePar(hole as number, draft.trim() ? Number(draft) : null)
    setEditing(false)
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center p-5"
      style={{ background: 'rgba(7,21,13,.78)', backdropFilter: 'blur(8px)', animation: 'mzFadeIn .2s ease' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[min(540px,100%)] overflow-hidden rounded-[22px]"
        style={{
          background: 'linear-gradient(165deg,#103024,#0a1e13)',
          border: '1px solid rgba(201,168,76,.3)',
          boxShadow: '0 40px 100px -30px rgba(0,0,0,.9)',
          animation: 'mzModalIn .3s cubic-bezier(.16,.84,.3,1)',
        }}
      >
        {/* map / placeholder */}
        {mapUrl ? (
          <div className="flex items-center justify-center" style={{ background: '#0a1e13' }}>
            <img
              src={mapUrl}
              alt={`Mappa buca ${hole}`}
              className="block h-auto w-full object-contain"
              style={{ maxHeight: '72vh' }}
            />
          </div>
        ) : (
          <div
            className="relative flex h-[230px] items-center justify-center"
            style={{ background: 'repeating-linear-gradient(135deg, #123726 0 14px, #0f2e1f 14px 28px)' }}
          >
            <div className="absolute inset-0" style={{ background: 'radial-gradient(80% 80% at 50% 40%, rgba(116,198,157,.12), transparent 70%)' }} />
            <div className="text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(116,198,157,.55)" strokeWidth="1.5">
                <path d="M5 21V4l11 3-7 2v12" />
                <circle cx="5" cy="21" r="1.4" fill="rgba(116,198,157,.55)" />
              </svg>
              <div className="mt-3 font-mono text-[10px] tracking-[3px] text-[#f4efe373]">MAPPA BUCA {hole}</div>
              <div className="mt-1.5 text-[11px] text-[#f4efe34d]">caricabile dall'admin</div>
            </div>
          </div>
        )}

        {/* body */}
        <div className="px-[26px] pb-7 pt-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[3px] text-gold">
                BUCA {hole} · PAR{' '}
                {editing ? (
                  <input
                    type="number"
                    min={3}
                    max={6}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="ml-1 h-7 w-14 rounded-md bg-[#0a1e13] px-2 text-center font-mono text-sm font-bold text-[#F4EFE3] outline-none"
                    style={{ border: '1px solid rgba(201,168,76,.4)' }}
                  />
                ) : (
                  <span className="text-[#F4EFE3]">{par ?? '—'}</span>
                )}
                {editing ? (
                  <button onClick={savePar} className="ml-1 rounded-md px-2 py-0.5 text-[10px] font-bold text-[#0d2b1d]" style={{ background: '#C9A84C' }}>
                    OK
                  </button>
                ) : (
                  <button onClick={() => setEditing(true)} className="ml-1 text-[#f4efe366] hover:text-gold" aria-label="Modifica par">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" /></svg>
                  </button>
                )}
              </div>
              {special && (
                <h3 className="mt-1.5 font-serif text-[26px] font-bold text-[#FBF7EC]">{special.label}</h3>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full text-[#f4efe3b3]"
              style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' }}
              aria-label="Chiudi"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          {special && (
            <p className="mt-3.5 text-[13.5px] leading-relaxed text-[#f4efe399]">
              Gara speciale assegnata a questa buca. Consulta la classifica per il dettaglio dei premi.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
