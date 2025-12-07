import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiBook, FiPlus } from 'react-icons/fi'

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
    <aside className='fixed left-0 top-0 h-screen w-64 bg-[#2C3639] border-r border-gray-200 p-4 hidden md:flex flex-col text-[#EFEFEF]'>
      {/* Site name */}
      <div className='px-1'>
        <div className='flex items-center gap-2'>
          <img src='/images/inverted.png' alt='PageKeeper logo' className='w-6 h-6' />
          <div className='font-bold text-lg'>PageKeeper</div>
        </div>
      </div>

      {/* divider */}
      <div className='border-t border-gray-200 my-4' />

      {/* navigation */}
      <nav className='flex-1'>
        <ul className='space-y-2'>
          <li>
            <NavLink to='/books' end className={({isActive}) => isActive ? 'flex items-center px-3 py-2 rounded bg-white text-[#2C3639]' : 'flex items-center px-3 py-2 rounded bg-[#2C3639] text-[#EFEFEF] hover:opacity-85'}>
              <FiBook className='w-5 h-5 mr-3' aria-hidden='true' />
              <span>My Books</span>
            </NavLink>
          </li>
          <li>
            <NavLink to='/books/new' className={({isActive}) => isActive ? 'flex items-center px-3 py-2 rounded bg-white text-[#2C3639]' : 'flex items-center px-3 py-2 rounded bg-[#2C3639] text-[#EFEFEF] hover:opacity-85'}>
              <FiPlus className='w-5 h-5 mr-3' aria-hidden='true' />
              <span>Add Book</span>
            </NavLink>
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
          className='flex items-center gap-3 px-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A27B5B]'
        >
          <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-[#2C3639]'>
            {initials || 'U'}
          </div>
          <div>
            <div className='text-sm text-[#EFEFEF]'>Profile</div>
            <div className='font-medium text-[#EFEFEF]'>{displayName}</div>
          </div>
        </div>

        <div className='mt-4 px-1'>
          <button onClick={onLogout} className='w-full bg-[#A27B5B] text-white py-2 rounded hover:opacity-95'>Logout</button>
        </div>
      </div>
    </aside>
  )
}
