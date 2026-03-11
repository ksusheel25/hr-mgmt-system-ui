import { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

function LoginPage() {
  const { login, loading } = useAuth()
  const [form, setForm] = useState({
    tenantId: '',
    username: '',
    password: '',
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login(form)
    } catch (err) {
      setError('Invalid credentials or server error.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">HR Attendance Portal</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Tenant ID
            <input
              name="tenantId"
              type="text"
              value={form.tenantId}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Username
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          {error && <div className="error-text">{error}</div>}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

