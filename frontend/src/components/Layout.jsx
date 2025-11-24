import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import { ThreeDot } from 'react-loading-indicators'

export default function Layout({ children }){
  const { loading, user } = useAuth()
  const { pathname } = useLocation()

  // Routes where the top Navbar should appear for anonymous users
  const publicNavbarPaths = ['/', '/features', '/contact', '/login', '/register']
  const showPublicNavbar = publicNavbarPaths.includes(pathname)

  const mainShiftClass = user ? 'md:ml-64' : ''
  // If we're still checking auth, hold rendering of the full layout
  if (loading) {
    return (
      <div className='app min-h-screen flex items-center justify-center'>
        <ThreeDot text='Loading...' size='large' color='#BF7C63' />
      </div>
    )
  }

  return (
    <div className='app'>
      {user ? (
        <Sidebar />
      ) : (
        showPublicNavbar && <NavBar />
      )}

      <main className={`${mainShiftClass} transition-all`}>
        {children}
      </main>

      <Footer repoUrl={import.meta.env.VITE_GITHUB_URL || '#'} />
    </div>
  )
}
