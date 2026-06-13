import { useState } from 'react'
import Button from '../ui/Button'
import type { PlayerOption } from '../../lib/types'

interface Props {
  title: string
  subtitle?: string
  players: PlayerOption[]
  currentWinnerName: string | null
  onSet: (name: string | null) => Promise<void>
}

export default function WinnerSelect({
  title,
  subtitle,
  players,
  currentWinnerName,
  onSet,
}: Props) {
  const [selected, setSelected] = useState<string>(currentWinnerName ?? '')
  const [busy, setBusy] = useState(false)

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
        <span className="font-semibold text-green-800">{currentWinnerName ?? 'Da assegnare'}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="h-11 flex-1 rounded-lg border border-green-100 bg-white px-3 text-sm focus:border-green-600 focus:outline-none"
        >
          <option value="">— Nessuno —</option>
          {players.map((p, i) => (
            <option key={i} value={p.name}>
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
