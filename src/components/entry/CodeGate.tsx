import { useState } from 'react'
import { isValidCode, normalizeCode, CODE_STORAGE_KEY } from '../../lib/constants'

interface Props {
  onUnlock: (code: string) => void
}

export default function CodeGate({ onUnlock }: Props) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (isValidCode(value)) {
      const code = normalizeCode(value)
      sessionStorage.setItem(CODE_STORAGE_KEY, code)
      onUnlock(code)
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="flex items-center justify-center p-6" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <form onSubmit={submit} className="w-[min(440px,100%)] text-center">
        <img src="/logo-deep.png" alt="" className="mx-auto mb-[22px] h-[62px] w-[62px] object-contain" style={{ animation: 'mzScaleIn .7s cubic-bezier(.16,.84,.3,1) both' }} />
        <div className="mb-3 font-mono text-[10px] tracking-[4px] text-[#9A7B2E]" style={{ animation: 'mzFadeUp .7s ease .1s both' }}>
          SCORE ENTRY
        </div>
        <h2 className="m-0 mb-2 font-serif text-[clamp(26px,5vw,34px)] font-bold leading-tight text-[#14271B]" style={{ animation: 'mzFadeUp .7s ease .15s both' }}>
          Inserisci il codice
          <br />
          del tuo gruppo
        </h2>
        <p className="mb-7 text-[14px] text-[#6B7A66]" style={{ animation: 'mzFadeUp .7s ease .2s both' }}>
          Lo trovi sulla tua scheda di gioco
        </p>
        <div className={shake ? 'shake' : ''} style={{ animation: 'mzFadeUp .7s ease .25s both' }}>
          <input
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError(false)
            }}
            placeholder="BUCA•"
            autoComplete="off"
            autoCapitalize="characters"
            className="w-full rounded-[14px] bg-white p-[18px] text-center font-mono text-[24px] font-bold uppercase tracking-[6px] text-[#14271B] outline-none"
            style={{ border: `2px solid ${error ? '#C0392B' : '#E1DAC8'}`, boxShadow: '0 8px 24px -14px rgba(20,40,25,.3)' }}
          />
          {error && (
            <div className="mt-3 flex items-center justify-center gap-[7px] text-[13.5px] font-semibold text-[#C0392B]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.5" /></svg>
              Codice non valido
            </div>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 w-full rounded-[14px] p-[17px] font-sans text-[16px] font-bold text-[#F7F3E8] transition-colors"
          style={{ background: '#1B4332', boxShadow: '0 12px 28px -12px rgba(27,67,50,.6)', animation: 'mzFadeUp .7s ease .3s both' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#2D6A4F')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#1B4332')}
        >
          Accedi
        </button>
      </form>
    </div>
  )
}
