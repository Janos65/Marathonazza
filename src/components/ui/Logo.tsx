import { useState } from 'react'

interface Props {
  /** height in px */
  height?: number
  /** color of the fallback wordmark */
  light?: boolean
  className?: string
}

/**
 * Renders /logo.png if present, otherwise a Playfair wordmark.
 * The user adds public/logo.png manually; until then we degrade gracefully.
 */
export default function Logo({ height = 36, light = false, className = '' }: Props) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <span
        className={`font-serif font-bold tracking-tight ${light ? 'text-white' : 'text-green-800'} ${className}`}
        style={{ fontSize: height * 0.7, lineHeight: 1 }}
      >
        Marathonazza
      </span>
    )
  }

  return (
    <img
      src="/logo.png"
      alt="Marathonazza"
      style={{ height }}
      className={`w-auto object-contain ${className}`}
      onError={() => setErrored(true)}
    />
  )
}
