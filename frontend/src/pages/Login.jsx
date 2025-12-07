import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const navigate = useNavigate()
  const { login, user } = useAuth()

  // If the user is already authenticated, redirect to books list
  useEffect(() => {
    if (user) navigate('/books')
  }, [user, navigate])

  async function submit(e) {
    e.preventDefault()
    try {
      await login({ email, password })
      // redirect to books list on success
      navigate('/books')
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className='max-w-md mx-auto px-4 py-8'>
      <form onSubmit={submit} className='bg-[#DCD7C9] border border-[#DCD7C9] p-6 space-y-4 shadow-sm'>
        <h2 className='text-lg font-semibold text-center'>Login</h2>
        <p className='text-sm text-[#3F4E4F] text-center'>Don't have an account? <a href='/register' className='underline'>Sign up</a></p>
        <div>
          <label className='block text-sm text-[#3F4E4F] mb-1'>Email</label>
          <input className='w-full border border-[#DCD7C9] px-3 py-2 bg-[#EFEFEF]' value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className='block text-sm text-[#3F4E4F] mb-1'>Password</label>
          <input className='w-full border border-[#DCD7C9] px-3 py-2 bg-[#EFEFEF]' type='password' value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <button className='bg-[#A27B5B] text-white px-4 py-2 rounded hover:opacity-95' type='submit'>Login</button>
        </div>
        {msg && <p className='text-sm text-[#2C3639]'>{msg}</p>}
      </form>
    </div>
  )
}
