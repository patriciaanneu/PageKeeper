import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Layout from './components/Layout'
import { AuthProvider } from './contexts/AuthContext'
import RequireAuth from './components/RequireAuth'
import Features from './pages/Features'
import Contact from './pages/Contact'
import Register from './pages/Register'
import Login from './pages/Login'

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/features' element={<Features />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      </Layout>
    </AuthProvider>
  )
}
