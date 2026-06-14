import { useEffect, useState } from 'react'
import { HOLES } from '../../lib/constants'

interface Props {
  parByHole: Record<number, number | null>
  onSaveAll: (pars: Record<number, number | null>) => Promise<void>
}

export default function ParEditor({ parByHole, onSaveAll }: Props) {
  const [draft, setDraft] = useState<Record<number, number | null>>({})
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const d: Record<number, number | null> = {}
    for (const h of HOLES) d[h] = parByHole[h] ?? null
    setDraft(d)
  }, [parByHole])

  function step(hole: number, delta: number) {
    setDraft((p) => {
      const cur = p[hole] ?? 4
      return { ...p, [hole]: Math.max(3, Math.min(6, cur + delta)) }
    })
  }

  async function save() {
    setBusy(true)
    await onSaveAll(draft)
    setBusy(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const btn = 'flex h-[34px] w-[34px] items-center justify-center rounded-[9px] text-[18px] font-bold text-[#1B4332] transition-colors hover:bg-[#1B4332] hover:text-white'

  return (
    <div>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(116px,1fr))' }}>
        {HOLES.map((h) => (
          <div key={h} className="flex flex-col items-center gap-[9px] rounded-[14px] px-2 py-3.5" style={{ background: '#FAF7EF', border: '1px solid #EFE9DA' }}>
            <span className="font-mono text-[10px] tracking-[1.5px] text-[#9a947f]">BUCA {h}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => step(h, -1)} className={btn} style={{ border: '1.5px solid #DCD5C4', background: '#FFFFFF' }}>−</button>
              <span className="min-w-[22px] text-center font-mono text-[22px] font-bold text-[#14271B]">{draft[h] ?? '—'}</span>
              <button onClick={() => step(h, 1)} className={btn} style={{ border: '1.5px solid #DCD5C4', background: '#FFFFFF' }}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={save} disabled={busy} className="rounded-[10px] px-4 py-[9px] text-[13px] font-bold text-[#F7F3E8] transition-colors hover:bg-[#2D6A4F]" style={{ background: '#1B4332' }}>
          {busy ? 'Salvataggio…' : 'Salva tutti'}
        </button>
        {saved && <span className="text-[13px] font-semibold text-[#1A6B3A]">✓ Salvato</span>}
      </div>
    </div>
  )
}
