import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    try {
      await api.post('/auth/register', { firstName, lastName, email, password })
      // redirect to login after successful registration
      navigate('/login')
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className='max-w-md mx-auto px-4 py-8'>
      <form onSubmit={submit} className='bg-[#DCD7C9] border border-gray-200 p-6 space-y-4'>
        <h2 className='text-lg font-semibold text-center'>Register</h2>
        <p className='text-sm text-[#3F4E4F] text-center'>Already have an account? <a href='/login' className='underline'>Log in</a></p>
        <div>
          <label className='block text-sm text-[#2C3639] mb-1'>First name</label>
          <input className='w-full border border-[#DCD7C9] px-3 py-2 bg-[#EFEFEF]' value={firstName} onChange={e => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label className='block text-sm text-[#2C3639] mb-1'>Last name</label>
          <input className='w-full border border-[#DCD7C9] px-3 py-2 bg-[#EFEFEF]' value={lastName} onChange={e => setLastName(e.target.value)} required />
        </div>
        <div>
          <label className='block text-sm text-[#2C3639] mb-1'>Email</label>
          <input className='w-full border border-[#DCD7C9] px-3 py-2 bg-[#EFEFEF]' value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className='block text-sm text-[#2C3639] mb-1'>Password</label>
          <input className='w-full border border-[#DCD7C9] px-3 py-2 bg-[#EFEFEF]' type='password' value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <button className='bg-[#A27B5B] text-white px-4 py-2 rounded hover:opacity-95' type='submit'>Sign Up</button>
        </div>
        {msg && <p className='text-sm text-[#A27B5B]'>{msg}</p>}
      </form>
    </div>
  )
}
