import { Flag, Target, Ruler, Bird } from 'lucide-react'
import { SPECIAL_HOLES } from '../../lib/constants'

interface Props {
  hole: number
  par: number | null
  onClick: () => void
}

const icons: Record<number, typeof Flag> = {
  2: Flag,
  7: Target,
  8: Bird,
  9: Ruler,
}

export default function HoleHeader({ hole, par, onClick }: Props) {
  const special = SPECIAL_HOLES[hole]
  const Icon = icons[hole]
  const isBirdie = hole === 8

  return (
    <button
      onClick={onClick}
      className={`flex w-full min-w-[44px] flex-col items-center gap-0.5 rounded-t-lg px-2 py-1.5 transition-colors ${
        isBirdie ? 'text-green-900' : 'text-white hover:bg-green-700'
      }`}
      style={
        isBirdie
          ? { background: 'linear-gradient(135deg, #C9A84C 0%, #F0D98A 100%)' }
          : { background: '#1B4332' }
      }
      title={special ? special.label : `Buca ${hole}`}
    >
      <span className="flex items-center gap-1 text-base font-bold leading-none">
        {hole}
        {Icon && <Icon size={13} />}
      </span>
      <span className="text-[10px] font-medium opacity-80">
        {par != null ? `Par ${par}` : 'Par —'}
      </span>
    </button>
  )
}
