interface Props {
  hole: number
  par: number | null
  onClick: () => void
}

interface SpecialMeta {
  tint: string
  color: string
  icon: React.ReactNode
}

const SPECIAL: Record<number, SpecialMeta> = {
  2: {
    tint: 'rgba(116,198,157,.16)',
    color: '#9FE3BE',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9FE3BE" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22V4M4 4l11 3-11 3" />
      </svg>
    ),
  },
  7: {
    tint: 'rgba(90,180,200,.16)',
    color: '#86d0e0',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#86d0e0" strokeWidth="2">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v16M4 12h16" />
      </svg>
    ),
  },
  8: {
    tint: 'rgba(201,168,76,.22)',
    color: '#F0D98A',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#F0D98A">
        <path d="M22 3c-2 4-4.5 6-7.5 7C12 11 9.5 12 7 14c-1.6 1.3-2.6 3-3 5 2-.8 3.6-1 5-1-.6 1-1 2-1 3 2.4-1.3 4-3 5-5 4-1 7-4 8-9 .3-1.4.5-2.7 1-4z" />
      </svg>
    ),
  },
  9: {
    tint: 'rgba(224,184,104,.16)',
    color: '#E0B868',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E0B868" strokeWidth="2.2" strokeLinecap="round">
        <path d="M4 20L20 4M6 5l2 2M5 8l2 2M15 16l2 2M16 13l2 2" />
      </svg>
    ),
  },
}

export default function HoleHeader({ hole, par, onClick }: Props) {
  const special = SPECIAL[hole]
  return (
    <button
      onClick={onClick}
      className="w-full px-0.5 py-[9px] text-center transition-[filter] hover:brightness-125"
      style={{ background: special ? special.tint : 'transparent', borderLeft: '1px solid rgba(255,255,255,.04)' }}
    >
      <div className="mb-0.5 flex h-4 items-center justify-center">{special?.icon}</div>
      <div className="font-mono text-[16px] font-bold" style={{ color: special ? special.color : 'rgba(244,239,227,.6)' }}>
        {hole}
      </div>
      <div className="font-mono text-[8.5px] tracking-[.5px] text-[#f4efe366]">PAR {par ?? '—'}</div>
    </button>
  )
}
