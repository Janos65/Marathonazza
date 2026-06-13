import { useMemo, useState } from 'react'
import { Flag } from 'lucide-react'
import Button from '../ui/Button'
import { ROUNDS } from '../../lib/constants'
import type { NearestToPin, Pair } from '../../lib/types'

interface PlayerOption {
  pairId: string
  name: string
}

interface Props {
  pairs: Pair[]
  entries: NearestToPin[]
  defaultRound: number
  onAdd: (playerName: string, pairId: string, round: number, distanceCm: number) => Promise<void>
}

export default function NearestPinForm({ pairs, entries, defaultRound, onAdd }: Props) {
  const players = useMemo<PlayerOption[]>(
    () =>
      pairs.flatMap((p) => [
        { pairId: p.id, name: p.player1_name },
        { pairId: p.id, name: p.player2_name },
      ]),
    [pairs],
  )

  const [playerIdx, setPlayerIdx] = useState(0)
  const [distance, setDistance] = useState('')
  const [round, setRound] = useState(defaultRound)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const dist = Number(distance)
    if (!dist || dist <= 0) return
    const player = players[playerIdx]
    setBusy(true)
    await onAdd(player.name, player.pairId, round, dist)
    setBusy(false)
    setDistance('')
    setDone(true)
    setTimeout(() => setDone(false), 1800)
  }

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <Flag size={20} className="text-green-700" />
        <h3 className="font-serif text-lg font-semibold text-green-800">
          Nearest to the Pin — Buca 2
        </h3>
      </div>
      <p className="mb-4 text-sm text-gray-500">
        Inserisci la distanza dal primo colpo alla buca 2.
      </p>

      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-600">Giocatore</span>
          <select
            value={playerIdx}
            onChange={(e) => setPlayerIdx(Number(e.target.value))}
            className="h-11 rounded-lg border border-green-100 bg-white px-3 focus:border-green-600 focus:outline-none"
          >
            {players.map((p, i) => (
              <option key={i} value={i}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-600">Distanza (cm)</span>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="es. 240"
            className="tnum h-11 rounded-lg border border-green-100 px-3 focus:border-green-600 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-600">Giro</span>
          <select
            value={round}
            onChange={(e) => setRound(Number(e.target.value))}
            className="h-11 rounded-lg border border-green-100 bg-white px-3 focus:border-green-600 focus:outline-none"
          >
            {ROUNDS.map((r) => (
              <option key={r} value={r}>
                Giro {r}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <Button type="submit" variant="primary" fullWidth disabled={busy}>
            {busy ? 'Invio...' : done ? '✓ Inviata' : 'Invia misura'}
          </Button>
        </div>
      </form>

      {entries.length > 0 && (
        <div className="mt-4">
          <p className="mb-1 text-xs font-semibold text-gray-500">Misure del gruppo</p>
          <ul className="divide-y divide-green-50 text-sm">
            {entries.map((e) => (
              <li key={e.id} className="flex justify-between py-1.5">
                <span className="text-green-800">{e.player_name}</span>
                <span className="tnum text-gray-500">
                  {e.distance_cm} cm · G{e.round_number}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
