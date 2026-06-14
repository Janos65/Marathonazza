interface Props {
  value: number | null
  onChange: (value: number | null) => void
  min?: number
  max?: number
  disabled?: boolean
}

export default function StrokeStepper({ value, onChange, min = 1, max = 15, disabled = false }: Props) {
  const current = value ?? null

  function dec() {
    if (disabled || current == null) return
    // at the minimum, pressing − clears the hole (back to empty)
    if (current <= min) onChange(null)
    else onChange(current - 1)
  }
  function inc() {
    if (disabled) return
    if (current == null) onChange(min)
    else onChange(Math.min(max, current + 1))
  }

  const btn =
    'flex h-11 w-11 flex-none items-center justify-center rounded-xl text-[22px] font-bold transition-all active:scale-90 disabled:opacity-30'
  const btnStyle = { border: '1.5px solid #DCD5C4', background: '#F7F4EC', color: '#1B4332' }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={dec}
        disabled={disabled || current == null}
        className={btn}
        style={btnStyle}
        aria-label="Diminuisci"
      >
        −
      </button>
      <div
        className="min-w-[40px] text-center font-mono text-[24px] font-bold"
        style={{ color: current == null ? '#C2BCA8' : '#14271B' }}
      >
        {current ?? '–'}
      </div>
      <button
        type="button"
        onClick={inc}
        disabled={disabled || (current != null && current >= max)}
        className={btn}
        style={btnStyle}
        aria-label="Aumenta"
      >
        +
      </button>
    </div>
  )
}
