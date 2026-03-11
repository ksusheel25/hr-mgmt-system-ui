import { useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'

function HrWorkPolicyPage() {
  const [policy, setPolicy] = useState({
    allowedWfhPerMonth: 0,
    autoDeduct: false,
    minimumWorkingMinutes: 0,
    halfDayAllowed: false,
    halfDayThresholdMinutes: 0,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get('/api/v1/admin/work-policy')
        if (res.data) setPolicy(res.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleChange = (field, value) => {
    setPolicy((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiClient.put('/api/v1/admin/work-policy', policy)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Work policy</h2>
          <p className="page-subtitle">Configure WFH, minimum hours, and half-day rules.</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-field">
              <label>
                Allowed WFH per month
                <input
                  type="number"
                  value={policy.allowedWfhPerMonth ?? 0}
                  onChange={(e) =>
                    handleChange('allowedWfhPerMonth', Number(e.target.value) || 0)
                  }
                />
              </label>
            </div>
            <div className="form-field">
              <label>
                Auto deduct
                <select
                  value={policy.autoDeduct ? 'true' : 'false'}
                  onChange={(e) => handleChange('autoDeduct', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>
            <div className="form-field">
              <label>
                Minimum working minutes
                <input
                  type="number"
                  value={policy.minimumWorkingMinutes ?? 0}
                  onChange={(e) =>
                    handleChange('minimumWorkingMinutes', Number(e.target.value) || 0)
                  }
                />
              </label>
            </div>
            <div className="form-field">
              <label>
                Half-day allowed
                <select
                  value={policy.halfDayAllowed ? 'true' : 'false'}
                  onChange={(e) => handleChange('halfDayAllowed', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>
            <div className="form-field">
              <label>
                Half-day threshold minutes
                <input
                  type="number"
                  value={policy.halfDayThresholdMinutes ?? 0}
                  onChange={(e) =>
                    handleChange('halfDayThresholdMinutes', Number(e.target.value) || 0)
                  }
                />
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn" disabled={saving}>
                {saving ? 'Saving…' : 'Save policy'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default HrWorkPolicyPage

