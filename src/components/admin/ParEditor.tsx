import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import Button from '../ui/Button'
import { HOLES, SPECIAL_HOLES } from '../../lib/constants'

interface Props {
  parByHole: Record<number, number | null>
  onSaveAll: (pars: Record<number, number | null>) => Promise<void>
}

export default function ParEditor({ parByHole, onSaveAll }: Props) {
  const [draft, setDraft] = useState<Record<number, string>>({})
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const d: Record<number, string> = {}
    for (const h of HOLES) d[h] = parByHole[h] != null ? String(parByHole[h]) : ''
    setDraft(d)
  }, [parByHole])

  async function save() {
    setBusy(true)
    const pars: Record<number, number | null> = {}
    for (const h of HOLES) {
      const v = draft[h]?.trim()
      pars[h] = v ? Number(v) : null
    }
    await onSaveAll(pars)
    setBusy(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="rounded-xl border border-green-100 bg-white p-4">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-9">
        {HOLES.map((h) => (
          <label key={h} className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-500">
              Buca {h} {SPECIAL_HOLES[h]?.emoji ?? ''}
            </span>
            <input
              type="number"
              min={3}
              max={6}
              inputMode="numeric"
              value={draft[h] ?? ''}
              onChange={(e) => setDraft((p) => ({ ...p, [h]: e.target.value }))}
              className="tnum h-12 w-full rounded-lg border border-green-100 text-center text-lg font-bold text-green-800 focus:border-green-600 focus:outline-none"
              placeholder="—"
            />
          </label>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button onClick={save} disabled={busy} variant="primary">
          {busy ? 'Salvataggio...' : 'Salva tutti'}
        </Button>
        {saved && (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
            <Check size={16} /> Salvato
          </span>
        )}
      </div>
    </div>
  )
}
