import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Roles } from '../routes/roles'

const AuthContext = createContext(null)

const STORAGE_KEY = 'hrms-demo-auth'

function makeDemoUser({ email, role }) {
  const nameFromEmail = email?.split('@')?.[0] || 'User'
  return {
    id: role === Roles.EMPLOYEE ? 'emp_1023' : role === Roles.MANAGER ? 'mgr_2001' : 'adm_9001',
    name: nameFromEmail
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (m) => m.toUpperCase()),
    email,
  }
}

export function AuthProvider({ children }) {
  const [role, setRole] = useState(Roles.EMPLOYEE)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = window.sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setRole(parsed.role)
      setUser(parsed.user || null)
    }
  }, [])

  const login = async ({ email, password, role: requestedRole }) => {
    setLoading(true)
    try {
      // Demo login (no backend). Keep this function shape so it can be swapped with
      // real API auth later without rewriting the UI.
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('Invalid email')
      if (!password || password.length < 6) throw new Error('Invalid password')

      const nextRole = requestedRole || Roles.EMPLOYEE
      setRole(nextRole)
      const nextUser = makeDemoUser({ email, role: nextRole })
      setUser(nextUser)

      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ role: nextRole, user: nextUser }))
      window.location.assign('/app/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setRole(null)
    setUser(null)
    window.sessionStorage.removeItem(STORAGE_KEY)
    window.location.assign('/login')
  }

  const value = useMemo(
    () => ({
      role,
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      setRole,
      setUser,
    }),
    [role, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

