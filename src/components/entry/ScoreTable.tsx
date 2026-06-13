import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import StrokeStepper from './StrokeStepper'
import { getHoleOrder, sumStrokes, calcNetScore, shortScoreLabel, isBirdieHole8 } from '../../lib/scoring'
import { isRoundComplete } from '../../lib/scoring'
import type { Pair, ScoreMap } from '../../lib/types'

interface Props {
  pair: Pair
  roundNumber: number
  parByHole: Record<number, number | null>
  scores: ScoreMap
  submitted: boolean
  birdieCount: number
  submittedRoundsCount: number
  onSetStroke: (hole: number, strokes: number) => void
  onSubmit: () => void
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
  const net = calcNetScore(raw, pair.handicap)
  const complete = isRoundComplete(scores)

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <Avatar name={pair.name} photoUrl={pair.photo_url} size={56} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg font-semibold text-green-800">{pair.name}</p>
          <p className="text-xs font-medium text-gray-500">HCP: {pair.handicap}</p>
        </div>
      </div>

      {submitted ? (
        <div className="flex items-center gap-3 rounded-xl bg-green-50 p-5 text-green-800">
          <CheckCircle size={28} />
          <div>
            <p className="font-semibold">Giro {roundNumber} confermato</p>
            <p className="tnum text-sm">
              Lordo {raw} · Netto {net}
            </p>
          </div>
        </div>
      ) : (
        <>
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold text-gray-500">
                <th className="py-1 text-left">Buca</th>
                <th className="py-1 text-center">Colpi</th>
                <th className="py-1 text-center">Par</th>
                <th className="py-1 text-right">+/−</th>
              </tr>
            </thead>
            <tbody>
              {order.map((hole) => {
                const par = parByHole[hole] ?? null
                const strokes = scores[hole] ?? null
                const birdie = isBirdieHole8(hole, strokes)
                return (
                  <tr
                    key={hole}
                    className={`border-t border-green-50 ${
                      hole === 8 ? 'bg-gold-light/30' : ''
                    }`}
                  >
                    <td className="py-2 font-semibold text-green-800">
                      {hole}
                      {hole === 8 && <span className="ml-1">🐦</span>}
                      {hole === 2 && <span className="ml-1">📍</span>}
                    </td>
                    <td className="py-1.5 text-center">
                      <StrokeStepper
                        value={strokes}
                        onChange={(v) => onSetStroke(hole, v)}
                      />
                    </td>
                    <td className="tnum py-2 text-center text-gray-500">{par ?? '—'}</td>
                    <td
                      className={`tnum py-2 text-right font-bold ${
                        birdie ? 'text-birdie' : 'text-gray-600'
                      }`}
                    >
                      {shortScoreLabel(strokes, par)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 text-sm">
            <span className="font-medium text-green-800">
              Lordo: <span className="tnum">{raw}</span>
            </span>
            <span className="font-medium text-green-800">
              Netto: <span className="tnum">{raw}</span> − {pair.handicap} ={' '}
              <span className="tnum font-bold">{net}</span>
            </span>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!complete}
            className={`mt-3 ${complete ? 'btn-submit-active' : ''}`}
            onClick={() => setConfirmOpen(true)}
          >
            Conferma giro
          </Button>
        </>
      )}

      <p className="mt-3 text-center text-sm font-medium text-green-700">
        🐦 BirdieCup: {birdieCount} birdie alla buca 8 (su {submittedRoundsCount} giri confermati)
      </p>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Conferma giro">
        <p className="text-sm text-gray-700">
          Confermi i colpi del Giro {roundNumber} per{' '}
          <span className="font-semibold">{pair.name}</span>? Questa azione può essere modificata
          dall’admin.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
            Annulla
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setConfirmOpen(false)
              onSubmit()
            }}
          >
            Conferma
          </Button>
        </div>
      </Modal>
    </div>
  )
}
