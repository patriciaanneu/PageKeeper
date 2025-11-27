import React, { useState } from 'react'
import api from '../api/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e) {
    e.preventDefault()
    try {
      await api.post('/auth/login', { email, password })
      setMsg('Logged in — refresh to see protected data')
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className='max-w-md mx-auto px-4 py-8'>
      <form onSubmit={submit} className='bg-white border border-gray-200 p-6 space-y-4'>
        <h2 className='text-lg font-semibold text-center'>Login</h2>
        <p className='text-sm text-gray-600 text-center'>Don't have an account? <a href='/register' className='underline'>Sign up</a></p>
        <div>
          <label className='block text-sm text-gray-700 mb-1'>Email</label>
          <input className='w-full border px-3 py-2' value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className='block text-sm text-gray-700 mb-1'>Password</label>
          <input className='w-full border px-3 py-2' type='password' value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <button className='bg-[#594A3E] text-white px-4 py-2 rounded hover:opacity-95' type='submit'>Login</button>
        </div>
        {msg && <p className='text-sm text-red-600'>{msg}</p>}
      </form>
    </div>
  )
}
