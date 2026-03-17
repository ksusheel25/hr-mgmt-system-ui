import { useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'

function HrLeaveAdminPage() {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newLeave, setNewLeave] = useState({
    employeeId: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
  })

  const loadLeaves = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/v1/admin/leaves')
      setLeaves(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeaves()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await apiClient.post('/v1/admin/leaves', newLeave)
      setNewLeave({
        employeeId: '',
        leaveType: '',
        fromDate: '',
        toDate: '',
        reason: '',
      })
      await loadLeaves()
    } finally {
      setCreating(false)
    }
  }

  const updateStatus = async (id, action) => {
    const path =
      action === 'approve'
        ? `/v1/admin/leaves/${id}/approve`
        : `/v1/admin/leaves/${id}/reject`
    await apiClient.patch(path)
    await loadLeaves()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Leave requests (admin)</h2>
          <p className="page-subtitle">
            HR overview of all leave requests, plus the ability to create, approve and reject.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 className="card-title">Create leave for employee</h3>
        <form onSubmit={handleCreate} className="form-grid">
          <div className="form-field">
            <label>
              Employee ID
              <input
                value={newLeave.employeeId}
                onChange={(e) => setNewLeave((l) => ({ ...l, employeeId: e.target.value }))}
                required
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              Leave type (e.g. ANNUAL, WFH)
              <input
                value={newLeave.leaveType}
                onChange={(e) => setNewLeave((l) => ({ ...l, leaveType: e.target.value }))}
                required
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              From date
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
              To date
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
              {creating ? 'Creating…' : 'Create leave'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="card-title">All leave requests</h3>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
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
                  <td>{lr.employeeId}</td>
                  <td>{lr.leaveType}</td>
                  <td>{lr.fromDate}</td>
                  <td>{lr.toDate}</td>
                  <td>{lr.status}</td>
                  <td className="table-actions">
                    {lr.status === 'PENDING' && (
                      <>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => updateStatus(lr.id || lr.leaveRequestId, 'approve')}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => updateStatus(lr.id || lr.leaveRequestId, 'reject')}
                        >
                          Reject
                        </button>
                      </>
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

export default HrLeaveAdminPage

