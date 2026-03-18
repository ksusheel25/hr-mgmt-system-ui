import { useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'

function EmployeeLeavesPage() {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newLeave, setNewLeave] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
  })

  const load = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/api/v1/leave/my')
      setLeaves(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const applyLeave = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await apiClient.post('/api/v1/leave/apply', newLeave)
      setNewLeave({
        leaveType: '',
        fromDate: '',
        toDate: '',
        reason: '',
      })
      await load()
    } finally {
      setCreating(false)
    }
  }

  const cancelLeave = async (id) => {
    await apiClient.patch(`/v1/admin/leaves/${id}/cancel`)
    await load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">My leaves</h2>
          <p className="page-subtitle">Apply for leave or WFH and track status.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 className="card-title">Apply for leave / WFH</h3>
        <form onSubmit={applyLeave} className="form-grid">
          <div className="form-field">
            <label>
              Leave type (ANNUAL, WFH, etc.)
              <input
                value={newLeave.leaveType}
                onChange={(e) => setNewLeave((l) => ({ ...l, leaveType: e.target.value }))}
                required
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              From
              <input
                type="date"
                value={newLeave.fromDate}
                onChange={(e) => setNewLeave((l) => ({ ...l, fromDate: e.target.value }))}
                required
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              To
              <input
                type="date"
                value={newLeave.toDate}
                onChange={(e) => setNewLeave((l) => ({ ...l, toDate: e.target.value }))}
                required
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              Reason
              <textarea
                rows={3}
                value={newLeave.reason}
                onChange={(e) => setNewLeave((l) => ({ ...l, reason: e.target.value }))}
              />
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn" disabled={creating}>
              {creating ? 'Submitting…' : 'Submit request'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="card-title">My leave requests</h3>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {leaves.map((lr) => (
                <tr key={lr.id || lr.leaveRequestId}>
                  <td>{lr.leaveType}</td>
                  <td>{lr.fromDate}</td>
                  <td>{lr.toDate}</td>
                  <td>{lr.status}</td>
                  <td className="table-actions">
                    {(lr.status === 'PENDING' || lr.status === 'APPROVED') && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => cancelLeave(lr.id || lr.leaveRequestId)}
                      >
                        Cancel
                      </button>
                    )}
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

export default EmployeeLeavesPage

