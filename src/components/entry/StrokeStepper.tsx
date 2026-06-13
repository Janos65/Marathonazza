import { Minus, Plus } from 'lucide-react'

interface Props {
  value: number | null
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

export default function StrokeStepper({
  value,
  onChange,
  min = 1,
  max = 15,
  disabled = false,
}: Props) {
  const current = value ?? null

  function dec() {
    if (disabled) return
    if (current == null) return // nothing to decrement yet
    onChange(Math.max(min, current - 1))
  }
  function inc() {
    if (disabled) return
    if (current == null) onChange(min)
    else onChange(Math.min(max, current + 1))
  }

  const btn =
    'grid h-11 w-11 place-items-center rounded-lg text-green-800 disabled:opacity-30 active:scale-95 transition'

  return (
    <div
      className={`inline-flex min-h-[52px] items-center gap-1 rounded-xl px-1 ${
        current != null ? 'bg-green-100' : 'bg-gray-100'
      }`}
    >
      <button
        type="button"
        onClick={dec}
        disabled={disabled || current == null || current <= min}
        className={btn}
        aria-label="Diminuisci"
      >
        <Minus size={20} />
      </button>
      <span className="tnum w-8 text-center text-xl font-bold text-green-800">
        {current ?? '—'}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={disabled || (current != null && current >= max)}
        className={btn}
        aria-label="Aumenta"
      >
        <Plus size={20} />
      </button>
    </div>
  )
}
