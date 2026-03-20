import { useEffect, useMemo, useState } from 'react'
import { attendanceAPI } from '../lib/api'
import CheckInOutCard from '../components/common/CheckInOutCard'
import { useAttendance } from '../context/AttendanceContext'

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const formatDateKey = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const formatMonthLabel = (date) => (
  new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
)

const parseDateKey = (value) => {
  if (!value) return null
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed.length >= 10 && trimmed[4] === '-' && trimmed[7] === '-') {
      return trimmed.slice(0, 10)
    }
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return formatDateKey(parsed)
}

const parseHours = (value) => {
  if (value === null || value === undefined) return null
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase()
    if (!trimmed) return null
    if (trimmed.includes('h')) {
      const hMatch = trimmed.match(/(\d+(?:\.\d+)?)h/)
      const mMatch = trimmed.match(/(\d+)\s?m/)
      const hours = hMatch ? parseFloat(hMatch[1]) : 0
      const minutes = mMatch ? parseFloat(mMatch[1]) : 0
      return hours + minutes / 60
    }
    if (trimmed.includes(':')) {
      const parts = trimmed.split(':').map((part) => parseFloat(part))
      if (parts.length >= 2 && parts.every((n) => !Number.isNaN(n))) {
        return parts[0] + parts[1] / 60 + (parts[2] ? parts[2] / 3600 : 0)
      }
    }
    const numeric = parseFloat(trimmed)
    return Number.isNaN(numeric) ? null : numeric
  }
  return null
}

const parseTime = (value, dateKey) => {
  if (!value) return null
  if (typeof value === 'string') {
    if (value.includes('T')) {
      const parsed = new Date(value)
      return Number.isNaN(parsed.getTime()) ? null : parsed
    }
    if (dateKey) {
      const parsed = new Date(`${dateKey}T${value}`)
      return Number.isNaN(parsed.getTime()) ? null : parsed
    }
  }
  if (value instanceof Date) return value
  return null
}

const formatTime = (value, dateKey) => {
  const parsed = parseTime(value, dateKey)
  if (!parsed) return '--:--'
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(parsed)
}

const getWeekStart = (date) => {
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

const getWeekDates = (date) => {
  const start = getWeekStart(date)
  return Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(start)
    d.setDate(start.getDate() + idx)
    return d
  })
}

const normalizeStatus = (value) => {
  if (!value) return null
  const normalized = String(value).toLowerCase()
  if (normalized.includes('present')) return 'present'
  if (normalized.includes('absent')) return 'absent'
  if (normalized.includes('late')) return 'late'
  if (normalized.includes('leave')) return 'leave'
  if (normalized.includes('holiday')) return 'holiday'
  if (normalized.includes('weekend')) return 'weekend'
  return normalized
}

const buildAttendanceMap = (records) => {
  const map = new Map()
  records.forEach((record) => {
    const key = parseDateKey(
      record?.date ||
      record?.attendanceDate ||
      record?.workDate ||
      record?.day ||
      record?.checkInTime ||
      record?.checkOutTime
    )
    if (!key) return
    map.set(key, {
      status: normalizeStatus(record?.status || record?.attendanceStatus),
      checkIn: record?.checkInTime || record?.checkIn || record?.inTime,
      checkOut: record?.checkOutTime || record?.checkOut || record?.outTime,
      hours: parseHours(
        record?.totalHours ||
        record?.hours ||
        record?.workedHours ||
        record?.duration ||
        record?.totalHoursInHours
      ),
      raw: record,
    })
  })
  return map
}

const getDayStatus = (date, attendanceMap, today, liveOverride) => {
  const key = formatDateKey(date)
  const record = liveOverride?.key === key ? liveOverride.data : attendanceMap.get(key)
  const isToday = key === formatDateKey(today)
  const isFuture = date > today && !isToday
  const isWeekend = date.getDay() === 0 || date.getDay() === 6

  if (isFuture) {
    return { status: 'future', hours: 0, checkIn: '--:--', checkOut: '--:--' }
  }

  if (record) {
    const status = record.status || (record.hours ? 'present' : null)
    return {
      status: status || (isWeekend ? 'weekend' : 'absent'),
      hours: record.hours ?? 0,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
    }
  }

  if (isWeekend) {
    return { status: 'weekend', hours: 0, checkIn: '--:--', checkOut: '--:--' }
  }

  return { status: 'absent', hours: 0, checkIn: '--:--', checkOut: '--:--' }
}

const STATUS_LABELS = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  leave: 'Leave',
  holiday: 'Holiday',
  weekend: 'Weekend',
  future: '—',
}

export default function AttendanceContent() {
  const today = useMemo(() => new Date(), [])
  const [selectedDate, setSelectedDate] = useState(today)
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { isCheckedIn, checkInAt, checkOutAt, elapsedSeconds, lastSessionSeconds } = useAttendance()

  const monthLabel = formatMonthLabel(selectedDate)
  const monthStart = useMemo(() => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1), [selectedDate])
  const monthEnd = useMemo(() => new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0), [selectedDate])

  useEffect(() => {
    let isActive = true
    setLoading(true)
    setError('')
    attendanceAPI
      .getMe(formatDateKey(monthStart), formatDateKey(monthEnd))
      .then((data) => {
        if (!isActive) return
        const list = Array.isArray(data) ? data : (data?.data || data?.content || data?.attendance || data?.records || [])
        setAttendanceRecords(list)
      })
      .catch((err) => {
        if (!isActive) return
        console.error('Failed to load attendance', err)
        setAttendanceRecords([])
        setError('Failed to load attendance.')
      })
      .finally(() => {
        if (!isActive) return
        setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [monthStart, monthEnd])

  const attendanceMap = useMemo(() => buildAttendanceMap(attendanceRecords), [attendanceRecords])

  const liveOverride = useMemo(() => {
    const key = formatDateKey(today)
    const durationSeconds = isCheckedIn ? elapsedSeconds : lastSessionSeconds
    if (!checkInAt && !checkOutAt) return null
    return {
      key,
      data: {
        status: 'present',
        checkIn: checkInAt ? new Date(checkInAt).toISOString() : null,
        checkOut: checkOutAt ? new Date(checkOutAt).toISOString() : null,
        hours: durationSeconds ? durationSeconds / 3600 : 0,
      },
    }
  }, [today, isCheckedIn, checkInAt, checkOutAt, elapsedSeconds, lastSessionSeconds])

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])

  const summary = useMemo(() => {
    const daysInMonth = monthEnd.getDate()
    let present = 0
    let absent = 0
    let late = 0
    let leave = 0
    let hours = 0
    let workdays = 0

    for (let d = 1; d <= daysInMonth; d += 1) {
      const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), d)
      if (date > today && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
        break
      }
      const { status, hours: dayHours } = getDayStatus(date, attendanceMap, today, liveOverride)
      if (status === 'weekend' || status === 'holiday') continue
      workdays += 1
      if (status === 'present') {
        present += 1
        hours += dayHours || 0
      }
      if (status === 'late') {
        present += 1
        late += 1
        hours += dayHours || 0
      }
      if (status === 'absent') absent += 1
      if (status === 'leave') leave += 1
    }

    return {
      present,
      absent,
      late,
      leave,
      hours,
      workdays,
      average: present ? hours / present : 0,
    }
  }, [attendanceMap, liveOverride, monthStart, monthEnd, today])

  const weekSummary = useMemo(() => {
    let present = 0
    let absent = 0
    let late = 0
    let leave = 0
    let hours = 0
    weekDates.forEach((date) => {
      const { status, hours: dayHours } = getDayStatus(date, attendanceMap, today, liveOverride)
      if (status === 'present') {
        present += 1
        hours += dayHours || 0
      }
      if (status === 'late') {
        present += 1
        late += 1
        hours += dayHours || 0
      }
      if (status === 'absent') absent += 1
      if (status === 'leave') leave += 1
    })
    return { present, absent, late, leave, hours }
  }, [weekDates, attendanceMap, today, liveOverride])

  const logRows = useMemo(() => {
    const rows = []
    const daysInMonth = monthEnd.getDate()
    for (let d = 1; d <= daysInMonth; d += 1) {
      const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), d)
      if (date > today && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
        break
      }
      if (date.getDay() === 0 || date.getDay() === 6) continue
      const info = getDayStatus(date, attendanceMap, today, liveOverride)
      rows.push({ date, info })
    }
    return rows.reverse()
  }, [attendanceMap, liveOverride, monthStart, monthEnd, today])

  const handleMonthChange = (delta) => {
    const next = new Date(selectedDate)
    next.setMonth(selectedDate.getMonth() + delta, 1)
    setSelectedDate(next)
  }

  const handleWeekChange = (delta) => {
    const next = new Date(selectedDate)
    next.setDate(selectedDate.getDate() + delta * 7)
    setSelectedDate(next)
  }

  const handleToday = () => {
    setSelectedDate(new Date())
  }

  return (
    <div className="attendance-page">
      <div className="page-header attendance-header">
        <div>
          <div className="page-title">My Attendance</div>
          <div className="page-sub">{monthLabel}</div>
        </div>
        <div className="header-actions">
          <div className="month-nav">
            <button className="month-nav-btn" onClick={() => handleMonthChange(-1)} aria-label="Previous month">←</button>
            <div className="month-nav-label">{monthLabel}</div>
            <button className="month-nav-btn" onClick={() => handleMonthChange(1)} aria-label="Next month">→</button>
          </div>
          <button className="btn btn-outline">Export</button>
          <button className="btn btn-primary">+ Regularise</button>
        </div>
      </div>

      {error && <div style={{ marginBottom: '12px', color: 'var(--red)' }}>{error}</div>}

      <div className="summary-row">
        <div className="summary-card present">
          <div className="summary-label">Present Days</div>
          <div className="summary-value present">{summary.present}</div>
          <div className="summary-sub">out of <span>{summary.workdays}</span> working days</div>
        </div>
        <div className="summary-card absent">
          <div className="summary-label">Absent Days</div>
          <div className="summary-value absent">{summary.absent}</div>
          <div className="summary-sub">including uninformed</div>
        </div>
        <div className="summary-card late">
          <div className="summary-label">Late Arrivals</div>
          <div className="summary-value late">{summary.late}</div>
          <div className="summary-sub">grace period exceeded</div>
        </div>
        <div className="summary-card leave">
          <div className="summary-label">On Leave</div>
          <div className="summary-value leave">{summary.leave}</div>
          <div className="summary-sub">approved leaves</div>
        </div>
        <div className="summary-card hours">
          <div className="summary-label">Total Hours</div>
          <div className="summary-value hours">{Math.round(summary.hours)}h</div>
          <div className="summary-sub">avg <span>{summary.average.toFixed(1)}</span>h/day</div>
        </div>
      </div>

      <div className="week-strip-wrap">
        <div className="week-strip-header">
          <div className="week-strip-title">
            Week of {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –
            {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="week-nav">
            <button className="week-nav-btn" onClick={() => handleWeekChange(-1)}>←</button>
            <button className="today-btn" onClick={handleToday}>This week</button>
            <button className="week-nav-btn" onClick={() => handleWeekChange(1)}>→</button>
          </div>
        </div>
        <div className="week-days">
          {weekDates.map((date) => {
            const isToday = formatDateKey(date) === formatDateKey(today)
            const info = getDayStatus(date, attendanceMap, today, liveOverride)
            const status = info.status
            const showHours = status === 'present' || status === 'late'
            const hours = info.hours || 0
            const pct = Math.min((hours / 9) * 100, 100)
            const fillClass = status === 'late' ? 'fill-late' : 'fill-present'
            const dotClass = status === 'present'
              ? 'dot-present'
              : status === 'absent'
                ? 'dot-absent'
                : status === 'late'
                  ? 'dot-late'
                  : status === 'leave'
                    ? 'dot-leave'
                    : ''
            return (
              <div
                key={formatDateKey(date)}
                className={`day-card ${status} ${isToday ? 'today' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="day-name">{DAYS_SHORT[date.getDay()]}</div>
                {isToday
                  ? <div className="today-ring">{date.getDate()}</div>
                  : <div className="day-date">{date.getDate()}</div>}
                <span className={`day-status-badge ${status}`}>
                  {dotClass ? <span className={`status-dot ${dotClass}`}></span> : null}
                  {STATUS_LABELS[status] || status}
                </span>
                {showHours ? (
                  <>
                    <div className="day-hours">{hours.toFixed(1)}h</div>
                    <div className="day-checkin-out">
                      {formatTime(info.checkIn, formatDateKey(date))} – {formatTime(info.checkOut, formatDateKey(date))}
                    </div>
                    <div className="hours-bar-wrap">
                      <div className="hours-bar-track">
                        <div className={`hours-bar-fill ${fillClass}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`day-hours ${status === 'weekend' || status === 'future' ? 'dim' : ''}`}>
                      {status === 'weekend' || status === 'future' ? '—' : '0h'}
                    </div>
                    <div className="hours-bar-wrap">
                      <div className="hours-bar-track">
                        <div className="hours-bar-fill fill-absent" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
        <div className="week-totals">
          <div className="week-total-item">
            <div className="week-total-dot" style={{ background: 'var(--green)' }}></div>
            <span className="week-total-label">Present</span>
            <span className="week-total-val">{weekSummary.present}</span>
          </div>
          <div className="week-total-item">
            <div className="week-total-dot" style={{ background: 'var(--red)' }}></div>
            <span className="week-total-label">Absent</span>
            <span className="week-total-val">{weekSummary.absent}</span>
          </div>
          <div className="week-total-item">
            <div className="week-total-dot" style={{ background: 'var(--amber)' }}></div>
            <span className="week-total-label">Late</span>
            <span className="week-total-val">{weekSummary.late}</span>
          </div>
          <div className="week-total-item">
            <div className="week-total-dot" style={{ background: 'var(--blue)' }}></div>
            <span className="week-total-label">Leave</span>
            <span className="week-total-val">{weekSummary.leave}</span>
          </div>
          <div className="week-hours-total">
            This week: <strong>{weekSummary.hours.toFixed(1)}h</strong> logged
          </div>
        </div>
      </div>

      <div className="month-section">
        <div className="month-section-header">
          <div className="month-section-title">{monthLabel} — Full Calendar</div>
          <div className="legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--green)' }}></div>Present</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--red)' }}></div>Absent</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--amber)' }}></div>Late</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--blue)' }}></div>Leave</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: '#7C3AED' }}></div>Holiday</div>
          </div>
        </div>
        <div className="month-cal">
          <div className="cal-head-row">
            {DAYS_SHORT.map((day) => (
              <div key={day} className="cal-head-cell">{day}</div>
            ))}
          </div>
          <div className="cal-grid">
            {Array.from({ length: monthStart.getDay() }).map((_, idx) => (
              <div key={`empty-${idx}`} className="cal-cell empty"></div>
            ))}
            {Array.from({ length: monthEnd.getDate() }).map((_, idx) => {
              const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), idx + 1)
              const info = getDayStatus(date, attendanceMap, today, liveOverride)
              const isToday = formatDateKey(date) === formatDateKey(today)
              const statusClass = `c-${info.status}`
              const hoursText = info.status === 'present' || info.status === 'late'
                ? `${(info.hours || 0).toFixed(1)}h`
                : info.status === 'absent'
                  ? '0h'
                  : ''
              return (
                <div
                  key={formatDateKey(date)}
                  className={`cal-cell ${statusClass} ${isToday ? 'c-today' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="cal-day-num">{idx + 1}</div>
                  {hoursText ? <div className="cal-day-hrs">{hoursText}</div> : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="detail-row">
        <div className="attendance-log">
          <div className="log-header">
            <div className="log-title">Daily Log</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select className="attendance-filter">
                <option>All Status</option>
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
                <option>Leave</option>
              </select>
            </div>
          </div>
          <div className="log-scroll">
            <table className="log-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '16px' }}>Loading attendance...</td>
                  </tr>
                )}
                {!loading && logRows.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '16px' }}>No attendance records.</td>
                  </tr>
                )}
                {!loading && logRows.map(({ date, info }) => {
                  const hours = info.hours || 0
                  const hoursText = hours ? `${hours.toFixed(1)}h` : '—'
                  const hoursClass = hours >= 9 ? 'good' : (hours > 0 ? 'short' : 'missing')
                  const badgeMap = {
                    present: 'badge-green',
                    absent: 'badge-red',
                    late: 'badge-amber',
                    leave: 'badge-blue',
                    holiday: 'badge-purple',
                    weekend: 'badge-gray',
                  }
                  return (
                    <tr key={formatDateKey(date)}>
                      <td>
                        <div className="log-date">{date.getDate()} {date.toLocaleDateString('en-US', { month: 'short' })}</div>
                        <div className="log-day">{DAYS_FULL[date.getDay()]}</div>
                      </td>
                      <td><span className="log-time">{formatTime(info.checkIn, formatDateKey(date))}</span></td>
                      <td><span className="log-time">{formatTime(info.checkOut, formatDateKey(date))}</span></td>
                      <td><span className={`log-hours ${hoursClass}`}>{hoursText}</span></td>
                      <td><span className={`badge ${badgeMap[info.status] || 'badge-gray'}`}>{STATUS_LABELS[info.status] || info.status}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="side-panel">
          <CheckInOutCard />
          <div className="panel-card">
            <div className="panel-header">Leave Balance {today.getFullYear()}</div>
            <div className="panel-body">
              <div className="leave-bal-grid">
                <div className="lb-item">
                  <div className="lb-num">12</div>
                  <div className="lb-label">Earned Leave</div>
                </div>
                <div className="lb-item">
                  <div className="lb-num">5</div>
                  <div className="lb-label">Sick Leave</div>
                </div>
                <div className="lb-item">
                  <div className="lb-num">3</div>
                  <div className="lb-label">Casual Leave</div>
                </div>
                <div className="lb-item">
                  <div className="lb-num" style={{ color: 'var(--amber)' }}>2</div>
                  <div className="lb-label">Pending Requests</div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-header">Regularisation Requests</div>
            <div className="panel-body">
              <div className="reg-item">
                <div>
                  <div className="reg-date">Mar 5</div>
                  <div className="reg-reason">Forgot to check out</div>
                </div>
                <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>Pending</span>
              </div>
              <div className="reg-item">
                <div>
                  <div className="reg-date">Feb 28</div>
                  <div className="reg-reason">System downtime</div>
                </div>
                <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Approved</span>
              </div>
              <div className="reg-item">
                <div>
                  <div className="reg-date">Feb 14</div>
                  <div className="reg-reason">WFH missed punch</div>
                </div>
                <span className="badge badge-red" style={{ marginLeft: 'auto' }}>Rejected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
