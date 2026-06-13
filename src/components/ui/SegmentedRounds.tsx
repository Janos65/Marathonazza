import { ROUNDS } from '../../lib/constants'

interface Props {
  value: number
  onChange: (round: number) => void
  /** "G" -> "G1", "Giro" -> "Giro 1" */
  prefix?: 'G' | 'Giro'
}

export default function SegmentedRounds({ value, onChange, prefix = 'G' }: Props) {
  return (
    <div className="inline-flex rounded-xl border border-green-100 bg-white p-1">
      {ROUNDS.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            value === r ? 'bg-green-800 text-white' : 'text-green-800 hover:bg-green-50'
          }`}
        >
          {prefix === 'G' ? `G${r}` : `Giro ${r}`}
        </button>
      ))}
    </div>
  )
}
