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

  return (
    <aside className='fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4 hidden md:flex flex-col gap-4'>
      <div className='flex items-center gap-3 px-1'>
        <div className='font-bold text-lg'>Book Catalog</div>
      </div>

      <nav className='mt-6 flex-1'>
        <ul className='space-y-2'>
          <li>
            <NavLink to='/books' className={({isActive}) => isActive ? 'block px-3 py-2 rounded bg-gray-100' : 'block px-3 py-2 rounded hover:bg-gray-50'}>My Books</NavLink>
          </li>
          <li>
            <NavLink to='/books/new' className={({isActive}) => isActive ? 'block px-3 py-2 rounded bg-gray-100' : 'block px-3 py-2 rounded hover:bg-gray-50'}>Add Book</NavLink>
          </li>
          <li>
            <NavLink to='/profile' className={({isActive}) => isActive ? 'block px-3 py-2 rounded bg-gray-100' : 'block px-3 py-2 rounded hover:bg-gray-50'}>Profile</NavLink>
          </li>
        </ul>
      </nav>

      <div className='mt-auto'>
        <div className='px-1 text-sm text-gray-600'>Signed in as</div>
        <div className='px-1 font-medium text-gray-900'>{user?.username}</div>
        <button onClick={onLogout} className='mt-4 w-full bg-red-600 text-white py-2 rounded'>Logout</button>
      </div>
    </aside>
  )
}
