import { useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'

function HrShiftsPage() {
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(false)
  const [editShift, setEditShift] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadShifts = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/api/v1/admin/shifts')
      setShifts(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShifts()
  }, [])

  const handleChange = (field, value) => {
    setEditShift((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editShift.id || editShift.shiftId) {
        const id = editShift.id || editShift.shiftId
        await apiClient.put(`/api/v1/admin/shifts/${id}`, editShift)
      } else {
        await apiClient.post('/api/v1/admin/shifts', editShift)
      }
      setEditShift(null)
      await loadShifts()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (shiftId) => {
    await apiClient.delete(`/api/v1/admin/shifts/${shiftId}`)
    await loadShifts()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Shifts</h2>
          <p className="page-subtitle">Define working hours and shift patterns.</p>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() =>
            setEditShift({
              name: '',
              startTime: '',
              endTime: '',
            })
          }
        >
          Add shift
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        {editShift ? (
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-field">
              <label>
                Name
                <input
                  value={editShift.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="form-field">
              <label>
                Start time
                <input
                  type="time"
                  value={editShift.startTime || ''}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="form-field">
              <label>
                End time
                <input
                  type="time"
                  value={editShift.endTime || ''}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditShift(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn" disabled={saving}>
                {saving ? 'Saving…' : 'Save shift'}
              </button>
            </div>
          </form>
        ) : (
          <p style={{ margin: 0 }}>Create a new shift or click one below to edit.</p>
        )}
      </div>

      <div className="card">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start</th>
                <th>End</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shifts.map((s) => (
                <tr key={s.id || s.shiftId}>
                  <td>{s.name}</td>
                  <td>{s.startTime}</td>
                  <td>{s.endTime}</td>
                  <td className="table-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditShift(s)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(s.id || s.shiftId)}
                    >
                      Delete
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

export default HrShiftsPage

