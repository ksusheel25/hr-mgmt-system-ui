import { useMemo } from 'react'
import { useAttendance } from '../../context/AttendanceContext'

const formatDuration = (totalSeconds) => {
  const seconds = Math.max(0, totalSeconds)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp))
}

const formatDate = () => {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())
}

const CheckInOutCard = ({ employeeId }) => {
  const {
    isCheckedIn,
    checkInAt,
    checkOutAt,
    lastSessionSeconds,
    elapsedSeconds,
    isLoading,
    error,
    checkIn,
    checkOut,
  } = useAttendance()

  const resolvedEmployeeId = useMemo(() => {
    if (employeeId) return employeeId
    if (typeof window !== 'undefined') {
      return localStorage.getItem('employeeId')
    }
    return null
  }, [employeeId])

  const totalSeconds = isCheckedIn ? elapsedSeconds : lastSessionSeconds
  const statusLine = isCheckedIn
    ? `Checked in at ${formatTime(checkInAt)}`
    : checkOutAt
      ? `Checked out at ${formatTime(checkOutAt)}`
      : 'Not checked in yet'

  const handleAction = () => {
    if (!resolvedEmployeeId) {
      return
    }
    if (isCheckedIn) {
      checkOut(resolvedEmployeeId)
      return
    }
    checkIn(resolvedEmployeeId)
  }

  return (
    <div className="checkin-card">
      <div style={{ fontSize: '13px', opacity: 0.85 }}>Work Session</div>
      <div className="checkin-time">{formatDuration(totalSeconds)}</div>
      <div className="checkin-date">{formatDate()} · {statusLine}</div>
      <button className="checkin-btn" onClick={handleAction} disabled={isLoading || !resolvedEmployeeId}>
        {isLoading ? 'Please wait...' : isCheckedIn ? 'Check Out' : 'Check In'}
      </button>
      {error || !resolvedEmployeeId ? (
        <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.9 }}>
          {!resolvedEmployeeId ? 'Employee ID missing. Please log in again.' : error}
        </div>
      ) : null}
    </div>
  )
}

export default CheckInOutCard
