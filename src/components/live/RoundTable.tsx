import { useMemo } from 'react'
import HoleHeader from './HoleHeader'
import Avatar from '../ui/Avatar'
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

const GRID = '178px repeat(9,1fr) 64px'

export default function RoundTable({ pairs, parByHole, scores, onHoleClick }: Props) {
  const ordered = useMemo(
    () =>
      [...pairs].sort(
        (a, b) => a.starting_hole - b.starting_hole || (a.display_order ?? 0) - (b.display_order ?? 0),
      ),
    [pairs],
  )

  return (
    <div
      className="overflow-hidden rounded-[18px] border"
      style={{ borderColor: 'rgba(201,168,76,.16)', background: 'rgba(11,32,21,.5)', boxShadow: '0 30px 70px -40px rgba(0,0,0,.9)' }}
    >
      <div className="overflow-x-auto">
        <div style={{ minWidth: 730 }}>
          {/* header */}
          <div
            className="grid items-stretch border-b"
            style={{ gridTemplateColumns: GRID, background: 'rgba(7,21,13,.55)', borderColor: 'rgba(201,168,76,.16)' }}
          >
            <div className="flex items-center px-4 py-3 font-mono text-[10px] tracking-[1.5px] text-[#f4efe380]">COPPIA</div>
            {HOLES.map((h) => (
              <HoleHeader key={h} hole={h} par={parByHole[h] ?? null} onClick={() => onHoleClick(h)} />
            ))}
            <div
              className="flex items-center justify-center px-1 py-3 text-center font-mono text-[9.5px] tracking-[.5px] text-gold"
              style={{ borderLeft: '1px solid rgba(201,168,76,.16)' }}
            >
              TOT
            </div>
          </div>

          {/* rows */}
          {ordered.map((pair) => {
            const ps = scores[pair.id] ?? {}
            const entered = HOLES.filter((h) => ps[h] != null).length
            const inCorso = entered > 0 && entered < 9
            const total = sumStrokes(ps)
            return (
              <div
                key={pair.id}
                className="grid items-stretch"
                style={{ gridTemplateColumns: GRID, borderBottom: '1px solid rgba(255,255,255,.04)' }}
              >
                <div className="flex min-w-0 items-center gap-[9px] px-3.5 py-2">
                  <Avatar name={pair.name} photoUrl={pair.photo_url} size={32} ringColor="rgba(201,168,76,.3)" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[13px] font-semibold text-[#F4EFE3]">{pair.name}</span>
                      {inCorso && (
                        <span
                          className="h-1.5 w-1.5 flex-none rounded-full"
                          style={{ background: '#74C69D', boxShadow: '0 0 8px #74C69D', animation: 'mzBadge 1.6s ease-in-out infinite' }}
                        />
                      )}
                    </div>
                    <div className="text-[10px] text-[#f4efe361]">buca {pair.starting_hole}</div>
                  </div>
                </div>
                {HOLES.map((h) => {
                  const strokes = ps[h] ?? null
                  const tone = cellTone(h, strokes, parByHole[h] ?? null)
                  return (
                    <div
                      key={h}
                      className="flex items-center justify-center font-mono text-[15px]"
                      style={{ borderLeft: '1px solid rgba(255,255,255,.04)', background: tone.bg, color: tone.text, fontWeight: tone.weight, boxShadow: tone.shadow }}
                    >
                      {strokes ?? '—'}
                    </div>
                  )
                })}
                <div
                  className="flex items-center justify-center font-mono text-[16px] font-bold"
                  style={{ borderLeft: '1px solid rgba(201,168,76,.14)', color: total ? '#F4EFE3' : 'rgba(244,239,227,.25)' }}
                >
                  {total || '—'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
