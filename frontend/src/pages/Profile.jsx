import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Profile(){
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <h1 className='text-2xl font-semibold mb-4'>Profile</h1>
        {!user ? (
          <p className='text-gray-600'>No user data available.</p>
        ) : (
          <div className='space-y-3'>
            <div>
              <span className='font-medium'>Name: </span>
              <span>{user.firstName ? `${user.firstName} ${user.lastName ?? ''}` : user.name || '—'}</span>
            </div>
            <div>
              <span className='font-medium'>Email: </span>
              <span>{user.email}</span>
            </div>
            <div>
              <span className='font-medium'>ID: </span>
              <span className='text-sm text-gray-500'>{user.id ?? user._id}</span>
            </div>

            <div className='pt-4'>
              <button onClick={handleLogout} className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
