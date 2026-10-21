import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm sm:px-6 sm:py-4">
        <NavLink to="/" className="text-base font-semibold tracking-tight text-indigo-600 sm:text-lg">
            PasteApp
        </NavLink>
        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/pastes"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            Pastes
        </NavLink>
        </div>
    </nav>
  )
}

export default Navbar