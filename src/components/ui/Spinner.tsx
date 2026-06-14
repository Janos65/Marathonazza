interface Props {
  size?: number
  className?: string
}

export default function Spinner({ size = 28, className = '' }: Props) {
  return (
    <svg
      className={`animate-spin text-gold ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Caricamento"
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export function FullPageSpinner() {
  return (
    <div className="grid place-items-center py-24">
      <Spinner size={40} />
    </div>
  )
}
