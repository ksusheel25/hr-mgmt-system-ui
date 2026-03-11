import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/apiClient'

function SuperAdminCompaniesList() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', timezone: '' })
  const navigate = useNavigate()

  const loadCompanies = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/api/v1/admin/companies')
      setCompanies(res.data || [])
    } catch (err) {
      setError('Failed to load companies.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompanies()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await apiClient.post('/api/v1/admin/companies', form)
      setForm({ name: '', code: '', timezone: '' })
      await loadCompanies()
    } catch (err) {
      // surface minimal error
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Companies</h2>
          <p className="page-subtitle">Manage tenants and company configuration.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 className="card-title">Create company</h3>
        <form onSubmit={handleCreate} className="form-grid">
          <div className="form-field">
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              Code
              <input
                name="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              Timezone
              <input
                name="timezone"
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn" disabled={creating}>
              {creating ? 'Creating…' : 'Create company'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="card-title">All companies</h3>
        {error && <div className="error-text">{error}</div>}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Timezone</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id || c.companyId}>
                  <td>{c.name}</td>
                  <td>{c.code}</td>
                  <td>{c.timezone}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate(`/super-admin/companies/${c.id || c.companyId}`)}
                    >
                      View / edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default SuperAdminCompaniesList

