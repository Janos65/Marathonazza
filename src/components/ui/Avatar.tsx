import { useState } from 'react'

type Ring = 'gold' | 'silver' | 'bronze' | 'none'

interface Props {
  name: string
  photoUrl?: string | null
  /** pixel diameter */
  size?: number
  ring?: Ring
  className?: string
}

const ringColor: Record<Ring, string> = {
  gold: '#C9A84C',
  silver: '#A8B5A0',
  bronze: '#C17F3A',
  none: '#FFFFFF',
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

export default function Avatar({ name, photoUrl, size = 40, ring = 'none', className = '' }: Props) {
  const [errored, setErrored] = useState(false)
  const showImg = photoUrl && !errored
  const borderWidth = ring === 'none' ? 2 : 3
  const fontSize = Math.round(size * 0.38)

  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        border: `${borderWidth}px solid ${ringColor[ring]}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
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
          className="grid h-full w-full place-items-center bg-green-700 font-sans font-semibold text-white"
          style={{ fontSize }}
        >
          {initialsFromName(name)}
        </div>
      )}
    </div>
  )
}
