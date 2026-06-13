import { isBirdieHole8 } from './scoring'

export interface Tone {
  bg: string
  text: string
  bold: boolean
}

/** Background/text tone for a Live Round score cell. */
export function cellTone(hole: number, strokes: number | null, par: number | null): Tone {
  if (strokes == null) return { bg: 'transparent', text: '#7A8A75', bold: false }
  if (isBirdieHole8(hole, strokes)) return { bg: '#D8F3DC', text: '#1B4332', bold: true }
  if (par == null) return { bg: 'transparent', text: '#1C2B1A', bold: false }
  const diff = strokes - par
  if (diff < 0) return { bg: '#E8F5E9', text: '#1B4332', bold: false }
  if (diff === 0) return { bg: 'transparent', text: '#1C2B1A', bold: false }
  if (diff === 1) return { bg: '#FFF3E0', text: '#8a5a1a', bold: false }
  return { bg: '#FDECEA', text: '#a3392b', bold: false }
}
