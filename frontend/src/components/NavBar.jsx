import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar(){
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5 flex items-center relative">
        <div className="hidden sm:flex items-center gap-6 flex-1">
          <NavLink to="/" end className={({isActive}) => isActive ? 'text-gray-900 underline text-base' : 'text-gray-600 hover:text-gray-900 text-base'}>Home</NavLink>
          <NavLink to="/features" className={({isActive}) => isActive ? 'text-gray-900 underline text-base' : 'text-gray-600 hover:text-gray-900 text-base'}>Features</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? 'text-gray-900 underline text-base' : 'text-gray-600 hover:text-gray-900 text-base'}>Contact</NavLink>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="font-semibold text-2xl">PageKeeper</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <NavLink to="/login" className={({isActive}) => isActive ? 'text-gray-900 underline text-base' : 'text-gray-600 hover:text-gray-900 text-base'}>Login</NavLink>
            <NavLink to="/register" className={({isActive}) => isActive ? 'bg-[#594A3E] text-white px-4 py-2 rounded text-base' : 'bg-[#594A3E] text-white px-4 py-2 rounded text-base hover:opacity-95'}>Sign Up</NavLink>
          </div>

          <button
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="sm:hidden p-3 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={()=>setOpen(o=>!o)}
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className={`sm:hidden border-t border-gray-100 bg-white transition-all duration-200 ease-out transform origin-top ${open ? 'max-h-96 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95 pointer-events-none'}`}>
        <div className={`px-6 ${open ? 'py-4' : 'py-0'} space-y-3 overflow-hidden`}>
          <NavLink onClick={()=>setOpen(false)} to="/" end className={({isActive}) => isActive ? 'block text-gray-900 underline text-base' : 'block text-gray-700 hover:text-gray-900 text-base'}>Home</NavLink>
          <NavLink onClick={()=>setOpen(false)} to="/features" className={({isActive}) => isActive ? 'block text-gray-900 underline text-base' : 'block text-gray-700 hover:text-gray-900 text-base'}>Features</NavLink>
          <NavLink onClick={()=>setOpen(false)} to="/contact" className={({isActive}) => isActive ? 'block text-gray-900 underline text-base' : 'block text-gray-700 hover:text-gray-900 text-base'}>Contact</NavLink>
          <NavLink onClick={()=>setOpen(false)} to="/login" className={({isActive}) => isActive ? 'block text-gray-900 underline text-base' : 'block text-gray-700 hover:text-gray-900 text-base'}>Login</NavLink>
          <NavLink onClick={()=>setOpen(false)} to="/register" className={({isActive}) => isActive ? 'block bg-[#786454] text-white px-4 py-2 rounded text-base' : 'block bg-[#786454] text-white px-4 py-2 rounded hover:opacity-95 text-base'}>Sign Up</NavLink>
        </div>
      </div>
    </header>
  )
}
