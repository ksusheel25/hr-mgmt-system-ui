import { useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'
import { useAuth } from '../../auth/auth-context'

function EmployeeDashboard() {
  const { employeeId } = useAuth()
  const [today, setToday] = useState(null)
  const [nextLeave, setNextLeave] = useState(null)

  useEffect(() => {
    const load = async () => {
      const todayStr = new Date().toISOString().slice(0, 10)
      const resAttendance = await apiClient.get('/v1/attendance/me', {
        params: { from: todayStr, to: todayStr },
      })
      setToday(resAttendance.data?.[0] || null)

      const resLeaves = await apiClient.get('/leave/my')
      const upcoming =
        (resLeaves.data || []).find(
          (lr) => lr.status === 'APPROVED' && new Date(lr.fromDate) >= new Date(),
        ) || null
      setNextLeave(upcoming)
    }
    load()
  }, [])

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">My dashboard</h2>
          <p className="page-subtitle">Today&apos;s status, upcoming leave, and key stats.</p>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="card-title">Today&apos;s status</div>
          <div className="card-value">{today ? today.status : '—'}</div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Mode: {today?.mode || '—'}, Worked: {today?.workedMinutes ?? '—'} minutes
          </div>
        </div>
        <div className="card">
          <div className="card-title">Next leave</div>
          <div className="card-value">
            {nextLeave ? `${nextLeave.fromDate} → ${nextLeave.toDate}` : 'None'}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Employee ID</div>
          <div className="card-value" style={{ fontSize: '1rem', wordBreak: 'break-all' }}>
            {employeeId || '—'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard

