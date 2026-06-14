import { ROUNDS } from '../../lib/constants'

interface Props {
  value: number
  onChange: (round: number) => void
  /** label prefix kept for API compatibility */
  prefix?: 'G' | 'Giro'
  theme?: 'dark' | 'light'
}

export default function SegmentedRounds({ value, onChange, theme = 'dark' }: Props) {
  if (theme === 'light') {
    return (
      <div className="flex gap-1.5">
        {ROUNDS.map((r) => {
          const active = value === r
          return (
            <button
              key={r}
              onClick={() => onChange(r)}
              className="min-w-[46px] rounded-[10px] px-3 py-[9px] text-center font-mono text-[13px] font-bold transition-all"
              style={{
                background: active ? '#1B4332' : '#FFFFFF',
                color: active ? '#F4EFE6' : '#46553f',
                border: `1.5px solid ${active ? '#1B4332' : '#E1DAC8'}`,
              }}
            >
              G{r}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className="flex gap-1.5 rounded-[14px] p-1.5"
      style={{ background: 'rgba(7,21,13,.6)', border: '1px solid rgba(201,168,76,.18)' }}
    >
      {ROUNDS.map((r) => {
        const active = value === r
        return (
          <button
            key={r}
            onClick={() => onChange(r)}
            className="rounded-[9px] px-4 py-[9px] font-mono text-[13px] font-semibold transition-all"
            style={{
              background: active ? 'linear-gradient(145deg,#C9A84C,#9A7B2E)' : 'transparent',
              color: active ? '#0d2b1d' : 'rgba(244,239,227,.6)',
            }}
          >
            G{r}
          </button>
        )
      })}
    </div>
  )
}
