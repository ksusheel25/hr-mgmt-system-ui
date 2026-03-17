import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiClient } from '../../lib/apiClient'

function SuperAdminCompanyDetail() {
  const { companyId } = useParams()
  const [company, setCompany] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setError(null)
      try {
        const res = await apiClient.get(`/v1/admin/companies/${companyId}`)
        setCompany(res.data)
      } catch {
        setError('Failed to load company.')
      }
    }
    load()
  }, [companyId])

  const handleChange = (field, value) => {
    setCompany((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiClient.put(`/v1/admin/companies/${companyId}`, company)
    } catch {
      setError('Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  if (!company) {
    return (
      <div>
        <div className="page-header">
          <h2 className="page-title">Company</h2>
        </div>
        {error ? <div className="error-text">{error}</div> : <p>Loading…</p>}
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">{company.name}</h2>
          <p className="page-subtitle">Edit company information.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSave} className="form-grid">
          <div className="form-field">
            <label>
              Name
              <input
                value={company.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              Code
              <input
                value={company.code || ''}
                onChange={(e) => handleChange('code', e.target.value)}
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              Timezone
              <input
                value={company.timezone || ''}
                onChange={(e) => handleChange('timezone', e.target.value)}
              />
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
        {error && <div className="error-text">{error}</div>}
      </div>
    </div>
  )
}

export default SuperAdminCompanyDetail

