import { useCallback, useEffect, useMemo, useState } from 'react'
import { Grid, Paper, Stack, Typography, Button, Alert, Chip, Box } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { AttendanceApi, HolidaysApi, LeaveApi } from '../../lib/api'
import { useAuth } from '../../auth/auth-context'

function Stat({ label, value, hint }) {
  return (
    <Paper sx={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          {value}
        </Typography>
        {hint ? (
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  )
}

export default function DashboardPage() {
  const { employeeId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [myLeaves, setMyLeaves] = useState([])
  const [holidays, setHolidays] = useState([])
  const [punching, setPunching] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [att, leaves, hol] = await Promise.all([
        AttendanceApi.me({ from: todayStr, to: todayStr }),
        LeaveApi.my().catch(() => []),
        HolidaysApi.list({
          from: todayStr,
          to: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
        }).catch(() => []),
      ])
      setTodayAttendance((att || [])[0] || null)
      setMyLeaves(leaves || [])
      setHolidays(hol || [])
    } catch {
      setError('Could not load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [todayStr])

  useEffect(() => {
    load()
  }, [load])

  const isCheckedIn = Boolean(
    todayAttendance &&
      (String(todayAttendance.status || '').toUpperCase().includes('IN') ||
        String(todayAttendance.status || '').toUpperCase().includes('PRESENT')) &&
      (todayAttendance.checkOutTime == null && todayAttendance.checkoutTime == null),
  )

  const checkedInAt = todayAttendance?.checkInTime || todayAttendance?.checkinTime || null
  const runningWorkedMin = useMemo(() => {
    if (!isCheckedIn || !checkedInAt) return null
    const t = Date.parse(`${todayStr}T${checkedInAt}`)
    if (Number.isNaN(t)) return null
    return Math.floor((now - t) / (1000 * 60 * 60 * 24) * 24 * 60) // minute approx without timezone issues
  }, [isCheckedIn, checkedInAt, now, todayStr])

  const punch = async (type) => {
    if (!employeeId) {
      setError('Employee ID missing in token.')
      return
    }
    setPunching(true)
    setError(null)
    try {
      if (type === 'in') await AttendanceApi.checkIn({ employeeId })
      else await AttendanceApi.checkOut({ employeeId })
      await load()
    } catch {
      setError('Action failed. Please try again.')
    } finally {
      setPunching(false)
    }
  }

  const leaveCounts = useMemo(() => {
    const counts = { pending: 0, approved: 0, rejected: 0 }
    ;(myLeaves || []).forEach((l) => {
      const s = String(l.status || '').toUpperCase()
      if (s.includes('PEND')) counts.pending += 1
      else if (s.includes('APPROV')) counts.approved += 1
      else if (s.includes('REJ')) counts.rejected += 1
    })
    return counts
  }, [myLeaves])

  const upcomingHoliday = useMemo(() => {
    const sorted = [...(holidays || [])].sort((a, b) => String(a.date).localeCompare(String(b.date)))
    return sorted[0] || null
  }, [holidays])

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quick view of today’s status, upcoming items, and your requests.
        </Typography>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <Stat
            label="Today"
            value={todayAttendance?.status || (loading ? 'Loading…' : '—')}
            hint={todayStr}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Stat label="Leave pending" value={leaveCounts.pending} hint="Your requests" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Stat
            label="Upcoming holiday"
            value={upcomingHoliday ? upcomingHoliday.name : '—'}
            hint={upcomingHoliday ? upcomingHoliday.date : 'Next 30 days'}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Stat label="WFH balance" value="—" hint="From employee profile" />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2.25 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Check-in / Check-out
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                icon={<AccessTimeIcon />}
                label={
                  isCheckedIn
                    ? `Checked in${checkedInAt ? ` at ${checkedInAt}` : ''}${runningWorkedMin != null ? ` • ${runningWorkedMin}m` : ''}`
                    : 'Not checked in'
                }
                color={isCheckedIn ? 'success' : 'default'}
              />
              <Typography variant="caption" color="text.secondary">
                Updates in real time
              </Typography>
            </Stack>
          </Stack>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              disabled={punching || isCheckedIn || loading}
              onClick={() => punch('in')}
            >
              Check in
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              disabled={punching || !isCheckedIn || loading}
              onClick={() => punch('out')}
            >
              Check out
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  )
}

