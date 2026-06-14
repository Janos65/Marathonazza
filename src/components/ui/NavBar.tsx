import { NavLink } from 'react-router-dom'
import { EVENT_DATE_LABEL } from '../../lib/constants'

const links = [
  { to: '/', label: 'Classifica', end: true },
  { to: '/live', label: 'Live', end: false },
  { to: '/enter', label: 'Inserisci Colpi', end: false },
  { to: '/admin', label: 'Admin', end: false },
]

export default function NavBar() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b px-4 py-3 backdrop-blur-xl sm:px-6 md:px-10"
      style={{
        background: 'rgba(7,21,13,.82)',
        borderColor: 'rgba(201,168,76,.16)',
        backdropFilter: 'blur(18px) saturate(1.3)',
      }}
    >
      <NavLink to="/" className="flex shrink-0 items-center gap-3">
        <img src="/logo-gold.png" alt="Marathonazza" className="h-9 w-9 object-contain" />
        <div className="flex flex-col leading-none">
          <span className="font-serif text-[18px] font-extrabold tracking-wide text-[#F4EFE3]">
            Marathonazza
          </span>
          <span className="mt-[3px] font-mono text-[8.5px] tracking-[3.4px] text-gold">
            {EVENT_DATE_LABEL.toUpperCase()}
          </span>
        </div>
      </NavLink>

      <nav className="no-scrollbar -mr-1 flex items-center gap-1 overflow-x-auto sm:gap-1.5">
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="relative shrink-0 whitespace-nowrap px-2.5 py-2 text-[13.5px] font-semibold transition-colors sm:px-3"
            style={({ isActive }) => ({
              color: isActive ? '#E8CE7E' : 'rgba(244,239,227,.62)',
            })}
          >
            {({ isActive }) => (
              <>
                <span>{label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-[1px] left-2.5 right-2.5 h-0.5 rounded-full sm:left-3 sm:right-3"
                    style={{ background: 'linear-gradient(90deg,#9A7B2E,#E8CE7E,#9A7B2E)' }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
