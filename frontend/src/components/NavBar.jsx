import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function NavBar(){
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className='sticky top-0 z-40 bg-[#2C3639] text-[#EFEFEF] backdrop-blur-sm border-b border-[#2C3639]'>
      <div className='max-w-6xl mx-auto px-4 py-4 sm:py-5 flex items-center relative'>
        <div className='hidden sm:flex items-center gap-6 flex-1'>
          <NavLink to='/' end className={({isActive}) => isActive ? 'text-[#EFEFEF] underline text-base' : 'hover:opacity-80 text-base'}>Home</NavLink>
          <NavLink to='/features' className={({isActive}) => isActive ? 'text-[#EFEFEF] underline text-base' : 'hover:opacity-80 text-base'}>Features</NavLink>
          <NavLink to='/contact' className={({isActive}) => isActive ? 'text-[#EFEFEF] underline text-base' : 'hover:opacity-80 text-base'}>Contact</NavLink>
        </div>

        <div className='absolute left-1/2 transform -translate-x-1/2'>
          <div className='flex items-center gap-2'>
            <img src='/images/inverted.svg' alt='PageKeeper logo' className='w-8 h-8' />
            <div className='font-semibold text-2xl'>PageKeeper</div>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='hidden sm:flex items-center gap-4'>
            {user ? (
              <>
                <NavLink to='/books' className={({isActive}) => isActive ? 'text-[#EFEFEF] underline text-base' : 'hover:opacity-80 text-base'}>My Books</NavLink>
                <NavLink to='/books/new' className={({isActive}) => isActive ? 'text-[#EFEFEF] underline text-base' : 'hover:opacity-80 text-base'}>Add</NavLink>
                <button onClick={handleLogout} className='text-[#EFEFEF] hover:opacity-80 text-base'>Logout</button>
                <NavLink to='/profile' className='text-[#EFEFEF] hover:opacity-80 text-base'>{user.username}</NavLink>
              </>
            ) : (
              <>
                <NavLink to='/login' className={({isActive}) => isActive ? 'text-[#EFEFEF] underline text-base' : 'hover:opacity-80 text-base'}>Login</NavLink>
                <NavLink to='/register' className={({isActive}) => isActive ? 'bg-[#A27B5B] text-white px-4 py-2 rounded text-base' : 'bg-[#A27B5B] text-white px-4 py-2 rounded text-base hover:opacity-95'}>Sign Up</NavLink>
              </>
            )}
          </div>

          {/* mobile hamburger */}
          <button
            aria-label='Toggle navigation'
            aria-expanded={open}
            className='sm:hidden p-3 rounded-md text-[#EFEFEF] hover:opacity-80'
            onClick={()=>setOpen(o=>!o)}
          >
            <svg className='w-7 h-7' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              {open ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className={`sm:hidden border-t border-[#2C3639] bg-[#2C3639] transition-all duration-200 ease-out transform origin-top ${open ? 'max-h-96 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95 pointer-events-none'}`}>
        <div className={`px-6 ${open ? 'py-4' : 'py-0'} space-y-3 overflow-hidden`}>
          <NavLink onClick={()=>setOpen(false)} to='/' end className={({isActive}) => isActive ? 'block text-[#EFEFEF] underline text-base' : 'block hover:opacity-80 text-base'}>Home</NavLink>
          <NavLink onClick={()=>setOpen(false)} to='/features' className={({isActive}) => isActive ? 'block text-[#EFEFEF] underline text-base' : 'block hover:opacity-80 text-base'}>Features</NavLink>
          <NavLink onClick={()=>setOpen(false)} to='/contact' className={({isActive}) => isActive ? 'block text-[#EFEFEF] underline text-base' : 'block hover:opacity-80 text-base'}>Contact</NavLink>
          {user ? (
            <>
              <NavLink onClick={()=>setOpen(false)} to='/books' className={({isActive}) => isActive ? 'block text-[#EFEFEF] underline text-base' : 'block hover:opacity-80 text-base'}>My Books</NavLink>
              <NavLink onClick={()=>setOpen(false)} to='/books/new' className={({isActive}) => isActive ? 'block text-[#EFEFEF] underline text-base' : 'block text-[#EFEFEF] text-base'}>Add</NavLink>
              <button onClick={handleLogout} className='block text-left w-full text-[#EFEFEF] hover:opacity-80 text-base'>Logout</button>
              <NavLink onClick={()=>setOpen(false)} to='/profile' className={({isActive}) => isActive ? 'block text-[#EFEFEF] underline text-base' : 'block text-[#EFEFEF] hover:opacity-80 text-base'}>{user.username}</NavLink>
            </>
          ) : (
            <>
              <NavLink onClick={()=>setOpen(false)} to='/login' className={({isActive}) => isActive ? 'block text-[#EFEFEF] underline text-base' : 'block hover:opacity-80 text-base'}>Login</NavLink>
              <NavLink onClick={()=>setOpen(false)} to='/register' className={({isActive}) => isActive ? 'block bg-[#A27B5B] text-[#EFEFEF] px-4 py-2 rounded text-base' : 'block bg-[#A27B5B] text-[#EFEFEF] px-4 py-2 rounded hover:opacity-80 text-base'}>Sign Up</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
