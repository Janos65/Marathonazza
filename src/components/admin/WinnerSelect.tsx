import { useState } from 'react'
import Button from '../ui/Button'
import type { Pair } from '../../lib/types'

interface Props {
  title: string
  subtitle?: string
  pairs: Pair[]
  currentWinnerId: string | null
  onSet: (pairId: string | null) => Promise<void>
}

export default function WinnerSelect({
  title,
  subtitle,
  pairs,
  currentWinnerId,
  onSet,
}: Props) {
  const [selected, setSelected] = useState<string>(currentWinnerId ?? '')
  const [busy, setBusy] = useState(false)
  const currentName = pairs.find((p) => p.id === currentWinnerId)?.name

  async function save() {
    setBusy(true)
    await onSet(selected || null)
    setBusy(false)
  }

  return (
    <div className="rounded-xl border border-green-100 bg-white p-4">
      <h4 className="font-serif text-lg font-semibold text-green-800">{title}</h4>
      {subtitle && <p className="mb-2 text-xs text-gray-500">{subtitle}</p>}
      <p className="mb-3 text-sm">
        Vincitore attuale:{' '}
        <span className="font-semibold text-green-800">{currentName ?? 'Da assegnare'}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="h-11 flex-1 rounded-lg border border-green-100 bg-white px-3 text-sm focus:border-green-600 focus:outline-none"
        >
          <option value="">— Nessuno —</option>
          {pairs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Button onClick={save} disabled={busy} variant="gold">
          {busy ? '...' : 'Imposta vincitore'}
        </Button>
      </div>
    </div>
  )
}
