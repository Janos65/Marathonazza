import { isBirdieHole8 } from './scoring'

export interface Tone {
  bg: string
  text: string
  weight: number
  shadow: string
}

/** Background/text tone for a Live Round score cell (dark broadcast theme). */
export function cellTone(hole: number, strokes: number | null, par: number | null): Tone {
  if (strokes == null) return { bg: 'transparent', text: 'rgba(244,239,227,.22)', weight: 400, shadow: 'none' }
  if (isBirdieHole8(hole, strokes))
    return {
      bg: 'linear-gradient(145deg,#E8CE7E,#C9A84C)',
      text: '#0d2b1d',
      weight: 700,
      shadow: '0 0 16px rgba(201,168,76,.5)',
    }
  if (par == null) return { bg: 'rgba(255,255,255,.03)', text: 'rgba(244,239,227,.85)', weight: 600, shadow: 'none' }
  const diff = strokes - par
  if (diff <= -1) return { bg: 'rgba(64,145,108,.3)', text: '#9FE3BE', weight: 700, shadow: 'none' }
  if (diff === 0) return { bg: 'rgba(255,255,255,.03)', text: 'rgba(244,239,227,.85)', weight: 600, shadow: 'none' }
  if (diff === 1) return { bg: 'rgba(224,184,104,.15)', text: '#E0B868', weight: 600, shadow: 'none' }
  return { bg: 'rgba(212,96,74,.18)', text: '#E89A8A', weight: 600, shadow: 'none' }
}
