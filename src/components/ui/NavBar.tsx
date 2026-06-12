import { NavLink } from 'react-router-dom'
import { Trophy, Activity, PenLine, Settings } from 'lucide-react'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Classifica', icon: Trophy, end: true },
  { to: '/live', label: 'Live', icon: Activity, end: false },
  { to: '/enter', label: 'Inserisci Colpi', icon: PenLine, end: false },
  { to: '/admin', label: 'Admin', icon: Settings, end: false },
]

export default function NavBar() {
  return (
    <>
      {/* Desktop / top bar */}
      <header className="sticky top-0 z-40 border-b border-green-100 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-page items-center justify-between px-6 py-3 md:px-12">
          <NavLink to="/" className="flex items-center">
            <Logo height={32} />
          </NavLink>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-800 text-white'
                      : 'text-green-800 hover:bg-green-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-green-100 bg-white sm:hidden">
        <div className="grid grid-cols-4">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                  isActive ? 'text-green-800' : 'text-gray-500'
                }`
              }
            >
              <Icon size={20} />
              <span className="leading-none">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
