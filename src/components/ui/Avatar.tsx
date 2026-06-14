import { useState } from 'react'

type Ring = 'gold' | 'silver' | 'bronze' | 'none'

interface Props {
  name: string
  photoUrl?: string | null
  /** pixel diameter */
  size?: number
  ring?: Ring
  /** explicit ring color override (wins over `ring`) */
  ringColor?: string
  className?: string
}

const ringPreset: Record<Ring, string> = {
  gold: '#E8CE7E',
  silver: '#C9CFC4',
  bronze: '#D69A5C',
  none: 'rgba(201,168,76,.32)',
}

/** "Villanova / Donadini" -> "VD"; single word -> first 2 letters. */
export function initialsFromName(name: string): string {
  const parts = name
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function Avatar({
  name,
  photoUrl,
  size = 40,
  ring = 'none',
  ringColor,
  className = '',
}: Props) {
  const [errored, setErrored] = useState(false)
  const showImg = photoUrl && !errored
  const border = ringColor ?? ringPreset[ring]
  const borderWidth = ring === 'none' && !ringColor ? 1.5 : 2
  const fontSize = Math.round(size * 0.4)

  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        border: `${borderWidth}px solid ${border}`,
        boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
      }}
    >
      {showImg ? (
        <img
          src={photoUrl as string}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <div
          className="grid h-full w-full place-items-center font-serif font-bold"
          style={{
            background: 'linear-gradient(145deg,#2D6A4F,#16331f)',
            color: '#EAF2E8',
            fontSize,
          }}
        >
          {initialsFromName(name)}
        </div>
      )}
    </div>
  )
}
