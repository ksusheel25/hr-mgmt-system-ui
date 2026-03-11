import { useState } from 'react'
import { apiClient } from '../../lib/apiClient'

function HrBiometricPage() {
  const [eventPayload, setEventPayload] = useState('{\n  "deviceId": "DEVICE-1",\n  "timestamp": "2026-01-01T09:00:00Z"\n}')
  const [punchPayload, setPunchPayload] = useState('{\n  "employeeId": "<EMPLOYEE_UUID>",\n  "timestamp": "2026-01-01T09:00:00Z"\n}')
  const [responseText, setResponseText] = useState('')

  const send = async (path, payload) => {
    try {
      const body = JSON.parse(payload)
      const res = await apiClient.post(path, body)
      setResponseText(JSON.stringify(res.data, null, 2))
    } catch (err) {
      setResponseText(err.message || 'Error sending request')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Biometric monitor</h2>
          <p className="page-subtitle">Send test biometric events and punches into the system.</p>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3 className="card-title">Test /api/v1/biometric/events</h3>
          <textarea
            rows={8}
            value={eventPayload}
            onChange={(e) => setEventPayload(e.target.value)}
            style={{ width: '100%' }}
          />
          <div className="form-actions">
            <button
              type="button"
              className="btn"
              onClick={() => send('/api/v1/biometric/events', eventPayload)}
            >
              Send event
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Test /api/v1/biometric/punch</h3>
          <textarea
            rows={8}
            value={punchPayload}
            onChange={(e) => setPunchPayload(e.target.value)}
            style={{ width: '100%' }}
          />
          <div className="form-actions">
            <button
              type="button"
              className="btn"
              onClick={() => send('/api/v1/biometric/punch', punchPayload)}
            >
              Send punch
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h3 className="card-title">Server response</h3>
        <pre style={{ maxHeight: 260, overflow: 'auto' }}>{responseText || '—'}</pre>
      </div>
    </div>
  )
}

export default HrBiometricPage

