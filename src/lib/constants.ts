import type { CompetitionType } from './types'

export const ACCESS_CODES = [
  'BUCA1',
  'BUCA2',
  'BUCA3',
  'BUCA4',
  'BUCA5',
  'BUCA6',
  'BUCA7',
] as const

export const ROUNDS = [1, 2, 3, 4, 5] as const
export const HOLES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
export const TOTAL_ROUNDS = 5
export const NUM_HOLES = 9

/** sessionStorage key for the unlocked group code on /enter */
export const CODE_STORAGE_KEY = 'mz_code'

/** Hole 8 is a fixed par 3 (birdie = 2 strokes) per tournament rules. */
export const BIRDIE_HOLE = 8
export const BIRDIE_STROKES = 2
export const NEAREST_PIN_HOLE = 2

export interface SpecialHoleMeta {
  hole: number
  key: 'ntp' | 'line' | 'birdie' | 'drive'
  label: string
  emoji: string
}

export const SPECIAL_HOLES: Record<number, SpecialHoleMeta> = {
  2: { hole: 2, key: 'ntp', label: 'Nearest to the Pin', emoji: '📍' },
  7: { hole: 7, key: 'line', label: 'Closest to the Line', emoji: '⊕' },
  8: { hole: 8, key: 'birdie', label: 'BirdieCup', emoji: '🐦' },
  9: { hole: 9, key: 'drive', label: 'Drive in Contest', emoji: '📏' },
}

export const COMPETITION_LABELS: Record<CompetitionType, string> = {
  closest_to_line: 'Closest to the Line',
  drive_in_contest: 'Drive in Contest',
}

export function normalizeCode(input: string): string {
  return input.trim().toUpperCase()
}

export function isValidCode(input: string): boolean {
  return (ACCESS_CODES as readonly string[]).includes(normalizeCode(input))
}

/** Group label shown after unlocking, e.g. "Gruppo Buca 3". */
export function groupLabel(code: string): string {
  const n = normalizeCode(code).replace('BUCA', '')
  return `Gruppo Buca ${n}`
}
