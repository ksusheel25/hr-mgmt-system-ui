import { useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'

function HrNotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/notifications/my')
      setNotifications(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const markRead = async (id) => {
    await apiClient.put(`/notifications/${id}/read`)
    await load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Notifications</h2>
          <p className="page-subtitle">System notifications for HR users.</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading…</p>
        ) : notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notifications.map((n) => (
              <li
                key={n.id || n.notificationId}
                style={{
                  padding: '0.6rem 0',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: n.read ? 400 : 600 }}>
                    {n.title || n.type}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{n.message}</div>
                </div>
                {!n.read && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => markRead(n.id || n.notificationId)}
                  >
                    Mark read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default HrNotificationsPage

