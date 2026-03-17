import { useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'

function HrHolidaysPage() {
  const [holidays, setHolidays] = useState([])
  const [range, setRange] = useState({ from: '', to: '' })
  const [editHoliday, setEditHoliday] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadHolidays = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/v1/admin/holidays', {
        params: { from: range.from, to: range.to },
      })
      setHolidays(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHolidays()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editHoliday.id || editHoliday.holidayId) {
      const id = editHoliday.id || editHoliday.holidayId
      await apiClient.put(`/v1/admin/holidays/${id}`, editHoliday)
    } else {
      await apiClient.post('/v1/admin/holidays', editHoliday)
    }
    setEditHoliday(null)
    await loadHolidays()
  }

  const handleDelete = async (id) => {
    await apiClient.delete(`/v1/admin/holidays/${id}`)
    await loadHolidays()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Holidays</h2>
          <p className="page-subtitle">Manage company-wide holidays.</p>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() =>
            setEditHoliday({
              name: '',
              date: '',
            })
          }
        >
          Add holiday
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="form-grid">
          <div className="form-field">
            <label>
              From
              <input
                type="date"
                value={range.from}
                onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              To
              <input
                type="date"
                value={range.to}
                onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
              />
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={loadHolidays}>
              Apply filter
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        {editHoliday ? (
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-field">
              <label>
                Name
                <input
                  value={editHoliday.name || ''}
                  onChange={(e) => setEditHoliday((h) => ({ ...h, name: e.target.value }))}
                  required
                />
              </label>
            </div>
            <div className="form-field">
              <label>
                Date
                <input
                  type="date"
                  value={editHoliday.date || ''}
                  onChange={(e) => setEditHoliday((h) => ({ ...h, date: e.target.value }))}
                  required
                />
              </label>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditHoliday(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Save holiday
              </button>
            </div>
          </form>
        ) : (
          <p style={{ margin: 0 }}>Create a new holiday or click a row to edit.</p>
        )}
      </div>

      <div className="card">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {holidays.map((h) => (
                <tr
                  key={h.id || h.holidayId}
                  onClick={() => setEditHoliday(h)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{h.date}</td>
                  <td>{h.name}</td>
                  <td className="table-actions">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(h.id || h.holidayId)
                      }}
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

export default HrHolidaysPage

