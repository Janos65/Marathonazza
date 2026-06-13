import { useMemo } from 'react'
import HoleHeader from './HoleHeader'
import { HOLES } from '../../lib/constants'
import { cellTone } from '../../lib/cellTone'
import { sumStrokes } from '../../lib/scoring'
import type { Pair, ScoreMap } from '../../lib/types'

interface Props {
  pairs: Pair[]
  parByHole: Record<number, number | null>
  scores: Record<string, ScoreMap>
  onHoleClick: (hole: number) => void
}

export default function RoundTable({ pairs, parByHole, scores, onHoleClick }: Props) {
  const ordered = useMemo(
    () =>
      [...pairs].sort(
        (a, b) =>
          a.starting_hole - b.starting_hole ||
          (a.display_order ?? 0) - (b.display_order ?? 0),
      ),
    [pairs],
  )

  return (
    <div className="overflow-x-auto rounded-2xl border border-green-100 bg-white">
      <table className="w-full border-separate border-spacing-0">
        <thead className="sticky top-0 z-10">
          <tr>
            <th className="sticky left-0 z-20 bg-green-800 px-3 py-1.5 text-left text-xs font-semibold text-white">
              Coppia
            </th>
            {HOLES.map((h) => (
              <th key={h} className="bg-green-800 p-0.5">
                <HoleHeader hole={h} par={parByHole[h] ?? null} onClick={() => onHoleClick(h)} />
              </th>
            ))}
            <th className="bg-green-800 px-3 py-1.5 text-xs font-semibold text-white">Tot</th>
          </tr>
        </thead>
        <tbody>
          {ordered.map((pair) => {
            const ps = scores[pair.id] ?? {}
            const total = sumStrokes(ps)
            return (
              <tr key={pair.id} className="border-t border-green-50">
                <td className="sticky left-0 z-10 max-w-[140px] truncate border-t border-green-50 bg-white px-3 py-2 text-sm font-medium text-green-800">
                  {pair.name}
                </td>
                {HOLES.map((h) => {
                  const strokes = ps[h] ?? null
                  const tone = cellTone(h, strokes, parByHole[h] ?? null)
                  return (
                    <td
                      key={h}
                      className="tnum border-t border-green-50 px-2 py-2 text-center text-sm"
                      style={{
                        background: tone.bg,
                        color: tone.text,
                        fontWeight: tone.bold ? 700 : 400,
                      }}
                    >
                      {strokes ?? '—'}
                    </td>
                  )
                })}
                <td className="tnum border-t border-green-50 bg-green-50 px-3 py-2 text-center text-sm font-bold text-green-800">
                  {total || '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
