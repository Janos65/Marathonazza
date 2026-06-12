import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'gold' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-sans font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary: 'bg-green-800 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500',
  ghost: 'bg-transparent text-green-800 hover:bg-green-50 border border-green-100',
  gold: 'bg-gold text-green-900 hover:bg-gold-light disabled:bg-gray-300 disabled:text-gray-500',
  danger: 'bg-error text-white hover:opacity-90 disabled:bg-gray-300 disabled:text-gray-500',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-[52px] px-6 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
