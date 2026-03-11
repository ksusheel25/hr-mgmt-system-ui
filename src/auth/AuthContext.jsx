import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiClient, setAuthToken } from '../lib/apiClient'

const AuthContext = createContext(null)

function decodeJwt(token) {
  if (!token) return null
  try {
    const [, payload] = token.split('.')
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

function deriveRoleAndEmployeeId(token) {
  const payload = decodeJwt(token)
  if (!payload) return { role: null, employeeId: null }

  const rolesClaim = payload.roles || payload.authorities || payload.scope || payload.scopes
  const roles = Array.isArray(rolesClaim)
    ? rolesClaim
    : typeof rolesClaim === 'string'
      ? rolesClaim.split(/[,\s]+/)
      : []

  let primaryRole = 'EMPLOYEE'
  if (roles.includes('SUPER_ADMIN') || roles.includes('ROLE_SUPER_ADMIN')) {
    primaryRole = 'SUPER_ADMIN'
  } else if (roles.includes('HR') || roles.includes('ROLE_HR')) {
    primaryRole = 'HR'
  }

  const employeeId =
    payload.employeeId || payload.empId || payload.sub || null

  return { role: primaryRole, employeeId }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null)
  const [employeeId, setEmployeeId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = window.sessionStorage.getItem('hr-auth')
    if (saved) {
      const parsed = JSON.parse(saved)
      setToken(parsed.token)
      setRole(parsed.role)
      setEmployeeId(parsed.employeeId || null)
      setAuthToken(parsed.token)
    }
  }, [])

  const login = async ({ tenantId, username, password }) => {
    setLoading(true)
    try {
      const res = await apiClient.post('/auth/login', { tenantId, username, password })
      const accessToken = res.data.accessToken

      setToken(accessToken)
      setAuthToken(accessToken)

      const { role: derivedRole, employeeId: derivedEmployeeId } =
        deriveRoleAndEmployeeId(accessToken)

      setRole(derivedRole)
      setEmployeeId(derivedEmployeeId)

      window.sessionStorage.setItem(
        'hr-auth',
        JSON.stringify({ token: accessToken, role: derivedRole, employeeId: derivedEmployeeId }),
      )

      if (derivedRole === 'SUPER_ADMIN') window.location.assign('/super-admin')
      else if (derivedRole === 'HR') window.location.assign('/hr')
      else window.location.assign('/employee')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setRole(null)
    setEmployeeId(null)
    setAuthToken(null)
    window.sessionStorage.removeItem('hr-auth')
    window.location.assign('/login')
  }

  const value = useMemo(
    () => ({
      token,
      role,
      employeeId,
      isAuthenticated: !!token,
      loading,
      login,
      logout,
      setRole,
      setEmployeeId,
    }),
    [token, role, employeeId, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

