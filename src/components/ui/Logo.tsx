import { useState } from 'react'

type Variant = 'gold' | 'deep' | 'cream' | 'default'

interface Props {
  /** height in px */
  height?: number
  /** which colored logo file to use */
  variant?: Variant
  /** color of the fallback wordmark */
  light?: boolean
  className?: string
}

const srcByVariant: Record<Variant, string> = {
  gold: '/logo-gold.png',
  deep: '/logo-deep.png',
  cream: '/logo-cream.png',
  default: '/logo.png',
}

/**
 * Renders the Marathonazza mark, otherwise a Playfair wordmark fallback.
 */
export default function Logo({ height = 36, variant = 'default', light = false, className = '' }: Props) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <span
        className={`font-serif font-extrabold tracking-tight ${light ? 'text-[#F4EFE3]' : 'text-green-800'} ${className}`}
        style={{ fontSize: height * 0.7, lineHeight: 1 }}
      >
        Marathonazza
      </span>
    )
  }

  return (
    <img
      src={srcByVariant[variant]}
      alt="Marathonazza"
      style={{ height, width: height }}
      className={`object-contain ${className}`}
      onError={() => setErrored(true)}
    />
  )
}
