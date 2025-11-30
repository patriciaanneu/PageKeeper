import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = async () => {
    await logout()
    navigate('/')
  }

  const initials = (() => {
    const a = user?.firstName?.[0] || user?.email?.[0] || ''
    const b = user?.lastName?.[0] || ''
    return (a + b).toUpperCase()
  })()

  const displayName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Account'

  return (
    <aside className='fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4 hidden md:flex flex-col'>
      {/* Site name */}
      <div className='px-1'>
        <div className='font-bold text-lg'>PageKeeper</div>
      </div>

      {/* divider */}
      <div className='border-t border-gray-200 my-4' />

      {/* navigation */}
      <nav className='flex-1'>
        <ul className='space-y-2'>
          <li>
            <NavLink to='/books' className={({isActive}) => isActive ? 'block px-3 py-2 rounded bg-gray-100' : 'block px-3 py-2 rounded hover:bg-gray-50'}>My Books</NavLink>
          </li>
          <li>
            <NavLink to='/books/new' className={({isActive}) => isActive ? 'block px-3 py-2 rounded bg-gray-100' : 'block px-3 py-2 rounded hover:bg-gray-50'}>Add Book</NavLink>
          </li>
        </ul>
      </nav>

      {/* bottom divider */}
      <div className='border-t border-gray-200 mt-4' />

      {/* profile + logout */}
      <div className='mt-4'>
        <div
          role='button'
          tabIndex={0}
          onClick={() => navigate('/profile')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/profile') }}
          aria-label='Open profile'
          className='flex items-center gap-3 px-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#594A3E]'
        >
          <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700'>
            {initials || 'U'}
          </div>
          <div>
            <div className='text-sm text-gray-600'>Profile</div>
            <div className='font-medium text-gray-900'>{displayName}</div>
          </div>
        </div>

        <div className='mt-4 px-1'>
          <button onClick={onLogout} className='w-full bg-[#594A3E] text-white py-2 rounded hover: opacity-95'>Logout</button>
        </div>
      </div>
    </aside>
  )
}
