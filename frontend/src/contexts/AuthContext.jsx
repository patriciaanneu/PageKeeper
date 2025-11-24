import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const init = async () => {
            try {
                const res = await api.get('/auth/me')
                if (!mounted) return
                setUser(res.data?.user ?? null)
            } catch (err) {
                setUser(null)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        init()
        return () => { mounted = false }
    }, [])

    const login = async (credentials) => {
        const res = await api.post('auth/login', credentials)
        //backend should return user in response; otherwise you may call /auth/me after login
        setUser(res.data?.user ?? null)
        return res.data
    }

    const logout = async () => {
        try {
            await api.post('/auth/logout')
        } catch (e) {
            //ignore network errors
        } finally {
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider value = {{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}

export default AuthContext