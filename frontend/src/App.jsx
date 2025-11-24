import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Layout from './components/Layout'
import { AuthProvider } from './contexts/AuthContext'
import RequireAuth from './components/RequireAuth'

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
        <Route path='/' element={<HomePage />} />
        
      </Routes>
      </Layout>
    </AuthProvider>
  )
}
