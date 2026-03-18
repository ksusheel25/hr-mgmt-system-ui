import { useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'

function ManagerTeamLeavesPage() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/api/v1/leave/pending')
      setPending(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const act = async (id, action) => {
    const path =
      action === 'approve' ? `/api/v1/leave/${id}/approve` : `/api/v1/leave/${id}/reject`
    await apiClient.post(path, { remarks: '' })
    await load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Team leave requests</h2>
          <p className="page-subtitle">Approve or reject leave for your direct reports.</p>
        </div>
      </div>

      <div className="card">
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
              {pending.map((lr) => (
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
                          onClick={() => act(lr.id || lr.leaveRequestId, 'approve')}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => act(lr.id || lr.leaveRequestId, 'reject')}
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

export default ManagerTeamLeavesPage

