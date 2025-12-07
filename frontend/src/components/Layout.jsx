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

  //routes where the Navbar should appear for anonymous users
  const publicNavbarPaths = ['/', '/features', '/contact', '/login', '/register']
  const isPublicPath = publicNavbarPaths.includes(pathname)
  
  // Only show the Sidebar when the user is authenticated and NOT on a public page
  const showNavbar = isPublicPath || !user
  const mainShiftClass = (user && !isPublicPath) ? 'md:ml-64' : ''
  // If we're still checking auth, hold rendering of the full layout
  if (loading) {
    return (
      <div className='app min-h-screen flex items-center justify-center'>
        <ThreeDot text='Loading...' size='large' color='#A27B5B' />
      </div>
    )
  }

  return (
    <div className='app'>
      {showNavbar ? <NavBar /> : <Sidebar />}

      <main className={`${mainShiftClass} transition-all`}>
        {children}
      </main>

      <Footer repoUrl={import.meta.env.VITE_GITHUB_URL || '#'} />
    </div>
  )
}
