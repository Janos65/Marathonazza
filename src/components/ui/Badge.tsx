import type { ReactNode } from 'react'

type Tone = 'green' | 'gold' | 'gray' | 'success'

interface Props {
  children: ReactNode
  tone?: Tone
  pulse?: boolean
  className?: string
}

const tones: Record<Tone, string> = {
  green: 'bg-green-100 text-green-800',
  gold: 'bg-gold-light text-green-900',
  gray: 'bg-gray-100 text-gray-700',
  success: 'bg-green-600 text-white',
}

export default function Badge({ children, tone = 'green', pulse = false, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${
        pulse ? 'animate-pulse' : ''
      } ${className}`}
    >
      {children}
    </span>
  )
}
