import type { ScoreMap } from './types'
import { BIRDIE_HOLE, BIRDIE_STROKES, NUM_HOLES } from './constants'

/**
 * Hole play order for a shotgun start at `startingHole` (1-indexed).
 * Example: getHoleOrder(3) -> [3,4,5,6,7,8,9,1,2]
 */
export function getHoleOrder(startingHole: number): number[] {
  const order: number[] = []
  for (let i = 0; i < NUM_HOLES; i++) {
    order.push(((startingHole - 1 + i) % NUM_HOLES) + 1)
  }
  return order
}

/** Net score for a completed round: handicap subtracted once. */
export function calcNetScore(rawStrokes: number, handicap: number): number {
  return rawStrokes - handicap
}

/** Sum of entered strokes, ignoring not-yet-entered (null) holes. */
export function sumStrokes(scores: ScoreMap): number {
  return Object.values(scores).reduce<number>((acc, v) => acc + (v ?? 0), 0)
}

/** True when all 9 holes have a stroke value > 0. */
export function isRoundComplete(scores: ScoreMap): boolean {
  return Array.from({ length: NUM_HOLES }, (_, i) => i + 1).every(
    (h) => scores[h] != null && (scores[h] as number) > 0,
  )
}

/** Full word label relative to par (Eagle/Birdie/Par/Bogey/Double/+N). */
export function scoreLabel(strokes: number, par: number | null): string {
  if (!par) return String(strokes)
  const diff = strokes - par
  if (diff <= -2) return 'Eagle'
  if (diff === -1) return 'Birdie'
  if (diff === 0) return 'Par'
  if (diff === 1) return 'Bogey'
  if (diff === 2) return 'Double'
  return `+${diff}`
}

/**
 * Compact +/- label for tables. 'B' for birdie, '0' for par,
 * '+N' over, '−N' under (using a real minus sign). '' when unknown.
 */
export function shortScoreLabel(strokes: number | null, par: number | null): string {
  if (strokes == null || par == null) return ''
  const diff = strokes - par
  if (diff === -1) return 'B'
  if (diff === 0) return '0'
  if (diff > 0) return `+${diff}`
  return `−${Math.abs(diff)}`
}

/** True only when this is hole 8 scored as a birdie (2 strokes, par 3). */
export function isBirdieHole8(holeNumber: number, strokes: number | null): boolean {
  return holeNumber === BIRDIE_HOLE && strokes === BIRDIE_STROKES
}
