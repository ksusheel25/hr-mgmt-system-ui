import { useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'
import { useAuth } from '../../auth/auth-context'

function EmployeeAttendancePage() {
  const { employeeId } = useAuth()
  const [range, setRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
  })
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [punching, setPunching] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/v1/attendance/me', {
        params: { from: range.from, to: range.to },
      })
      setRows(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const punch = async (type) => {
    if (!employeeId) return
    setPunching(true)
    try {
      const path =
        type === 'in' ? '/v1/attendance/check-in' : '/v1/attendance/check-out'
      await apiClient.post(path, { employeeId })
      await load()
    } finally {
      setPunching(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">My attendance</h2>
          <p className="page-subtitle">View daily status and punch in/out.</p>
        </div>
        <div className="table-actions">
          <button
            type="button"
            className="btn"
            disabled={punching}
            onClick={() => punch('in')}
          >
            Check-in
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={punching}
            onClick={() => punch('out')}
          >
            Check-out
          </button>
        </div>
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
            <button type="button" className="btn btn-secondary" onClick={load}>
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Mode</th>
                <th>Worked minutes</th>
                <th>Late arrival</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.date}>
                  <td>{r.date}</td>
                  <td>{r.status}</td>
                  <td>{r.mode}</td>
                  <td>{r.workedMinutes}</td>
                  <td>{r.lateArrival ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default EmployeeAttendancePage

