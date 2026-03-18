import { useMemo, useState } from 'react'
import { AuthContext } from './auth-context'
import { apiClient, setAuthToken } from '../lib/apiClient'
import { Roles } from '../routes/roles'
import { EmployeesApi } from '../lib/api'

const STORAGE_KEY = 'hrms-auth'

function readSession() {
  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY)
    if (!saved) return { token: null, role: null, employeeId: null, user: null }
    const parsed = JSON.parse(saved)
    return {
      token: parsed.token || null,
      role: parsed.role || null,
      employeeId: parsed.employeeId || null,
      user: parsed.user || null,
    }
  } catch {
    return { token: null, role: null, employeeId: null, user: null }
  }
}

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
  if (!payload) return { role: null, employeeId: null, username: null }

  const rolesClaim = payload.roles || payload.authorities || payload.scope || payload.scopes
  const roles = Array.isArray(rolesClaim)
    ? rolesClaim
    : typeof rolesClaim === 'string'
      ? rolesClaim.split(/[,\s]+/)
      : []

  const normalized = new Set(
    roles.map((r) => (typeof r === 'string' ? r.replace(/^ROLE_/, '') : r)).filter(Boolean),
  )

  let role = Roles.EMPLOYEE
  if (normalized.has(Roles.SUPER_ADMIN)) role = Roles.SUPER_ADMIN
  else if (normalized.has(Roles.HR)) role = Roles.HR
  else if (normalized.has(Roles.MANAGER)) role = Roles.MANAGER

  const employeeId = payload.employeeId || payload.empId || payload.sub || null
  const username = payload.username || payload.preferred_username || payload.email || null
  return { role, employeeId, username }
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readSession().token)
  const [role, setRole] = useState(() => readSession().role)
  const [employeeId, setEmployeeId] = useState(() => readSession().employeeId)
  const [user, setUser] = useState(() => readSession().user)
  const [loading, setLoading] = useState(false)

  // Ensure Axios gets token immediately on first paint.
  if (token) setAuthToken(token)

  const login = async ({ tenantId, username, password }) => {
    setLoading(true)
    try {
      const res = await apiClient.post('/api/v1/auth/login', { tenantId, username, password })
      const accessToken = res.data?.accessToken
      if (!accessToken) throw new Error('Missing accessToken')

      setToken(accessToken)
      setAuthToken(accessToken)

      const derived = deriveRoleAndEmployeeId(accessToken)
      setRole(derived.role)
      setEmployeeId(derived.employeeId)
      setUser({
        name: derived.username || username,
        email: derived.username || username,
      })

      // Ensure we have a concrete employeeId for attendance APIs.
      // Some tokens may not include employeeId, so fetch from /employees/me.
      let resolvedEmployeeId = derived.employeeId
      if (!resolvedEmployeeId) {
        try {
          const me = await EmployeesApi.me()
          resolvedEmployeeId = me?.employeeId || me?.id || me?.employeeCode || null
          if (resolvedEmployeeId) setEmployeeId(resolvedEmployeeId)
        } catch {
          // Non-fatal; attendance actions will show a friendly error if missing.
        }
      }

      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          token: accessToken,
          role: derived.role,
          employeeId: resolvedEmployeeId,
          user: { name: derived.username || username, email: derived.username || username },
        }),
      )

      // Full reload is intentional for now; auth state is now hydrated synchronously,
      // so the app won't bounce back to /login.
      window.location.assign('/app/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setRole(null)
    setEmployeeId(null)
    setUser(null)
    setAuthToken(null)
    window.sessionStorage.removeItem(STORAGE_KEY)
    window.location.assign('/login')
  }

  const value = useMemo(
    () => ({
      token,
      role,
      employeeId,
      user,
      isAuthenticated: !!token,
      loading,
      login,
      logout,
      setEmployeeId,
    }),
    [token, role, employeeId, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

