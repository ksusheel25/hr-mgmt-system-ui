import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import { AttendanceApi } from '../../lib/api'
import { useAuth } from '../../auth/auth-context'
import { EmployeesApi } from '../../lib/api'

function formatMinutes(min) {
  if (min == null || Number.isNaN(Number(min))) return '—'
  const total = Math.max(0, Number(min))
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${h}h ${m}m`
}

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay() // 0 Sun, 1 Mon
  const diff = (day + 6) % 7 // make Monday = 0
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function pulseSx() {
  return {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: -6,
      borderRadius: 999,
      backgroundColor: 'rgba(34,197,94,.18)',
      animation: 'pulse 1.6s ease-out infinite',
    },
    '@keyframes pulse': {
      '0%': { transform: 'scale(0.85)', opacity: 0.75 },
      '70%': { transform: 'scale(1.15)', opacity: 0 },
      '100%': { transform: 'scale(1.15)', opacity: 0 },
    },
  }
}

function weekDayLabel(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { weekday: 'short' })
}

function isWeekend(iso) {
  const d = new Date(iso)
  const day = d.getDay()
  return day === 0 ? 'sun' : day === 6 ? 'sat' : null
}

function Timeline({ checkIn, checkOut, inProgress }) {
  const hasIn = checkIn && checkIn !== '—'
  const hasOut = checkOut && checkOut !== '—'
  const active = inProgress || (hasIn && hasOut)

  return (
    <Box sx={{ mt: 1.25 }}>
      <Box sx={{ position: 'relative', width: '100%', pt: 2.25 }}>
        {/* End labels */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            fontSize: 12,
            color: 'text.secondary',
            fontWeight: 700,
          }}
        >
          {hasIn ? checkIn : '—'}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            fontSize: 12,
            color: 'text.secondary',
            fontWeight: 700,
          }}
        >
          {hasOut ? checkOut : inProgress ? 'Now' : '—'}
        </Box>

        {/* Full-width bar */}
        <Box sx={{ position: 'relative', height: 12, display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: 5,
              borderRadius: 999,
              bgcolor: active ? 'rgba(34,197,94,.22)' : 'rgba(148,163,184,.35)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              width: 10,
              height: 10,
              borderRadius: 999,
              bgcolor: active ? 'success.main' : 'grey.400',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              width: 10,
              height: 10,
              borderRadius: 999,
              bgcolor: hasOut ? 'success.main' : inProgress ? 'success.main' : 'grey.400',
              ...(inProgress && !hasOut
                ? {
                    boxShadow: '0 0 0 6px rgba(34,197,94,.18)',
                    animation: 'pulseDot 1.6s ease-out infinite',
                    '@keyframes pulseDot': {
                      '0%': { transform: 'scale(0.9)', opacity: 0.95 },
                      '70%': { transform: 'scale(1.15)', opacity: 0.25 },
                      '100%': { transform: 'scale(1.15)', opacity: 0 },
                    },
                  }
                : null),
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default function AttendancePage() {
  const { employeeId, setEmployeeId } = useAuth()
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [punching, setPunching] = useState(false)

  const [now, setNow] = useState(() => Date.now())

  const from = useMemo(() => isoDate(weekStart), [weekStart])
  const to = useMemo(() => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 6)
    return isoDate(d)
  }, [weekStart])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await AttendanceApi.me({ from, to })
      setRows(Array.isArray(data) ? data : [])
    } catch {
      setError('Could not load attendance.')
    } finally {
      setLoading(false)
    }
  }, [from, to])

  useEffect(() => {
    load()
  }, [load])

  // If employeeId isn't present in token/session, fetch it from /employees/me.
  useEffect(() => {
    const ensureEmployeeId = async () => {
      if (employeeId) return
      try {
        const me = await EmployeesApi.me()
        const id = me?.employeeId || me?.id || me?.employeeCode || null
        if (id) setEmployeeId?.(id)
      } catch {
        // ignore; attendance punch will show a friendly error
      }
    }
    ensureEmployeeId()
  }, [employeeId, setEmployeeId])

  // Live timer tick (only if checked-in today)
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const todayStr = useMemo(() => isoDate(new Date()), [])
  const today = useMemo(() => (rows || []).find((r) => r.date === todayStr) || null, [rows, todayStr])

  const isCheckedIn = Boolean(
    today &&
      (String(today.status || '').toUpperCase().includes('IN') ||
        String(today.status || '').toUpperCase().includes('PRESENT')) &&
      (today.checkOutTime == null && today.checkoutTime == null && today.checkOut == null),
  )

  const checkedInAt = today?.checkInTime || today?.checkinTime || today?.checkIn || null

  const runningWorked = useMemo(() => {
    if (!isCheckedIn || !checkedInAt) return null
    const t = Date.parse(`${todayStr}T${checkedInAt}`)
    if (Number.isNaN(t)) return null
    return Math.floor((now - t) / (1000 * 60))
  }, [isCheckedIn, checkedInAt, now, todayStr])

  const punch = async (type) => {
    if (!employeeId) {
      setError('Employee profile not loaded yet. Please refresh in a moment.')
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

  const weekDays = useMemo(() => {
    const list = []
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      list.push(isoDate(d))
    }
    return list
  }, [weekStart])

  const byDate = useMemo(() => {
    const map = new Map()
    ;(rows || []).forEach((r) => map.set(r.date, r))
    return map
  }, [rows])

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Attendance
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Weekly view of check-in/out, presence, and worked time.
        </Typography>
      </Box>

      <Paper sx={{ p: 2.25 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ md: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Chip
              icon={<AccessTimeIcon />}
              label={isCheckedIn ? `Checked in • Worked ${formatMinutes(runningWorked)}` : 'Not checked in'}
              color={isCheckedIn ? 'success' : 'default'}
              sx={isCheckedIn ? pulseSx() : undefined}
            />
            <Typography variant="body2" color="text.secondary">
              Today: {todayStr}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              disabled={punching || isCheckedIn}
              onClick={() => punch('in')}
            >
              Check in
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              disabled={punching || !isCheckedIn}
              onClick={() => punch('out')}
            >
              Check out
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Week
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              onClick={() => {
                const d = new Date(weekStart)
                d.setDate(d.getDate() - 7)
                setWeekStart(startOfWeek(d))
              }}
            >
              Previous
            </Button>
            <Button size="small" onClick={() => setWeekStart(startOfWeek(new Date()))}>
              Current
            </Button>
            <Button
              size="small"
              onClick={() => {
                const d = new Date(weekStart)
                d.setDate(d.getDate() + 7)
                setWeekStart(startOfWeek(d))
              }}
            >
              Next
            </Button>
          </Stack>
        </Stack>

        {error ? <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert> : null}

        <Stack spacing={1.25} sx={{ mt: 2 }}>
          {weekDays.map((date) => {
            const r = byDate.get(date)
            const statusRaw = r?.status || (r ? '—' : 'Absent')
            const status = String(statusRaw || '—')
            const worked = r?.workedMinutes ?? null
            const checkIn = r?.checkInTime || r?.checkinTime || '—'
            const checkOut = r?.checkOutTime || r?.checkoutTime || '—'

            const isToday = date === todayStr
            const weekend = isWeekend(date) // 'sat' | 'sun' | null
            const isPresent =
              status.toUpperCase().includes('PRESENT') || status.toUpperCase().includes('IN')
            const chipColor = isPresent
              ? 'success'
              : status.toUpperCase().includes('LEAVE')
                ? 'warning'
                : 'default'
            const inProgress = isToday && isCheckedIn

            return (
              <Paper
                key={date}
                sx={{
                  p: 1.75,
                  borderColor: isToday ? 'rgba(79,70,229,.35)' : undefined,
                  boxShadow: isToday ? '0 0 0 3px rgba(79,70,229,.08)' : undefined,
                  bgcolor:
                    weekend === 'sat'
                      ? 'rgba(99,102,241,.08)' // indigo tint
                      : weekend === 'sun'
                        ? 'rgba(244,63,94,.07)' // rose tint
                        : 'background.paper',
                  borderLeft: weekend ? '4px solid' : undefined,
                  borderLeftColor:
                    weekend === 'sat'
                      ? 'rgba(99,102,241,.55)'
                      : weekend === 'sun'
                        ? 'rgba(244,63,94,.55)'
                        : undefined,
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.25}
                  alignItems={{ sm: 'center' }}
                  justifyContent="space-between"
                >
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                        {weekDayLabel(date)}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                        {date}
                      </Typography>
                      {weekend ? (
                        <Chip
                          size="small"
                          label={weekend === 'sat' ? 'Saturday' : 'Sunday'}
                          variant="outlined"
                        />
                      ) : null}
                      <Chip
                        size="small"
                        label={status}
                        color={chipColor}
                        sx={isToday && isCheckedIn ? pulseSx() : undefined}
                      />
                    </Stack>

                    <Stack direction="row" spacing={1.5} flexWrap="wrap">
                      <Typography variant="caption" color="text.secondary">
                        Check-in:{' '}
                        <Box
                          component="span"
                          sx={{ fontWeight: 900, color: isPresent ? 'success.main' : 'text.primary' }}
                        >
                          {checkIn}
                        </Box>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Check-out:{' '}
                        <Box
                          component="span"
                          sx={{ fontWeight: 900, color: checkOut !== '—' ? 'success.main' : 'text.primary' }}
                        >
                          {checkOut}
                        </Box>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Worked:{' '}
                        <Box
                          component="span"
                          sx={{ fontWeight: 900, color: worked != null ? 'success.main' : 'text.primary' }}
                        >
                          {formatMinutes(worked)}
                        </Box>
                      </Typography>
                    </Stack>

                    <Timeline checkIn={checkIn} checkOut={checkOut} inProgress={inProgress} />
                  </Stack>
                </Stack>
              </Paper>
            )
          })}
        </Stack>

        {loading ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading…
          </Typography>
        ) : null}
      </Paper>
    </Stack>
  )
}

