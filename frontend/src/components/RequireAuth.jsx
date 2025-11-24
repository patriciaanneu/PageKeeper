import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

export default function RequireAuth({ children }){
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(()=>{
    let mounted = true
    async function check(){
      try{
        await api.get('/auth/me')
        if(mounted) setLoading(false)
      }catch(err){
        try{
          // try refreshing once; axios interceptor will attempt refresh on 401
          await api.post('/auth/refresh')
          await api.get('/auth/me')
          if(mounted) setLoading(false)
        }catch(e){
          if(mounted) navigate('/login')
        }
      }
    }
    check()
    return ()=>{ mounted = false }
  },[navigate])

  if(loading) return <div className="p-8 text-center">Checking authentication...</div>
  return children
}
