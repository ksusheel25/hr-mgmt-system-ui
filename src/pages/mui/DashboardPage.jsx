import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Grid,
  Paper,
  Stack,
  Typography,
  Button,
  Alert,
  Chip,
  Box,
  LinearProgress,
  Tooltip,
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { AttendanceApi, HolidaysApi, LeaveApi, LeaveBalancesApi, LeaveTypesApi, EmployeesApi } from '../../lib/api'
import { useAuth } from '../../auth/auth-context'
import { Roles } from '../../routes/roles'

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
  const { employeeId, setEmployeeId, role } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [myLeaves, setMyLeaves] = useState([])
  const [holidays, setHolidays] = useState([])
  const [leaveBalances, setLeaveBalances] = useState([])
  const [leaveTypes, setLeaveTypes] = useState([])
  const [profile, setProfile] = useState(null)
  const [punching, setPunching] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [selectedBalanceId, setSelectedBalanceId] = useState(null)

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  function normalizeIsoDate(value) {
    if (!value) return null
    const s = String(value)
    const m = s.match(/^\d{4}-\d{2}-\d{2}/)
    return m ? m[0] : null
  }

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [att, leaves, hol, balances, me, types] = await Promise.all([
        AttendanceApi.me({ from: todayStr, to: todayStr }),
        LeaveApi.my().catch(() => []),
        HolidaysApi.list({
          from: todayStr,
          to: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
        }).catch(() => []),
        LeaveBalancesApi.me().catch(() => []),
        EmployeesApi.me().catch(() => null),
        LeaveTypesApi.list().catch(() => []),
      ])
      const attList = att || []
      const todayRow =
        attList.find((r) => normalizeIsoDate(r.date) === todayStr) ||
        attList.find((r) => normalizeIsoDate(r.attendanceDate) === todayStr) ||
        attList[0] ||
        null
      setTodayAttendance(todayRow)
      setMyLeaves(leaves || [])
      setHolidays(hol || [])
      setLeaveBalances(balances || [])
      setProfile(me)
      setLeaveTypes(types || [])
    } catch {
      setError('Could not load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [todayStr, role])

  useEffect(() => {
    load()
  }, [load])

  const checkedInAt = todayAttendance?.checkInTime || todayAttendance?.checkinTime || todayAttendance?.checkIn || null
  const checkedOutAt =
    todayAttendance?.checkOutTime || todayAttendance?.checkoutTime || todayAttendance?.checkOut || null

  const isCheckedIn = Boolean(checkedInAt && !checkedOutAt)

  const todayLabel = useMemo(() => {
    if (loading) return 'Loading…'
    if (isCheckedIn) return 'Checked in'
    if (checkedInAt && checkedOutAt) return 'Checked out'
    const raw = String(todayAttendance?.status || '').trim()
    if (raw) return raw
    return 'Not marked'
  }, [loading, isCheckedIn, checkedInAt, checkedOutAt, todayAttendance])

  const runningWorkedMin = useMemo(() => {
    if (!isCheckedIn || !checkedInAt) return null
    const t = Date.parse(`${todayStr}T${checkedInAt}`)
    if (Number.isNaN(t)) return null
    return Math.max(0, Math.floor((now - t) / (1000 * 60)))
  }, [isCheckedIn, checkedInAt, now, todayStr])

  function isUuid(value) {
    if (!value) return false
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      String(value).trim(),
    )
  }

  const punch = async (type) => {
    let id = employeeId
    if (!id || !isUuid(id)) {
      try {
        const me = await EmployeesApi.me()
        id = me?.id || me?.employeeId || null
        if (id) setEmployeeId?.(id)
      } catch {
        // ignore; handled below
      }
    }
    if (!id || !isUuid(id)) {
      setError('Employee profile not loaded yet. Please retry in a moment.')
      return
    }
    setPunching(true)
    setError(null)
    try {
      if (type === 'in') await AttendanceApi.checkIn({ employeeId: id })
      else await AttendanceApi.checkOut({ employeeId: id })
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

  const sickLeave = useMemo(() => {
    const list = leaveBalances || []
    const match =
      list.find((b) => String(b.leaveType || b.type || b.name || '').toUpperCase().includes('SICK')) ||
      list.find((b) => String(b.leaveTypeCode || b.code || '').toUpperCase().includes('SICK')) ||
      null
    if (!match) return null

    const allocated = match.allocated ?? match.total ?? match.quota ?? null
    const used = match.used ?? match.consumed ?? null
    const remaining =
      match.remaining ?? (allocated != null && used != null ? Number(allocated) - Number(used) : null)
    return { allocated, used, remaining }
  }, [leaveBalances, leaveTypes])

  const totalLeaveRemaining = useMemo(() => {
    const list = leaveBalances || []
    const currentYear = new Date().getFullYear()
    const filtered = list.filter((b) => Number(b.year) === currentYear || b.year == null)
    const sum = filtered.reduce((acc, b) => acc + (Number(b.remaining) || 0), 0)
    return Number.isFinite(sum) && filtered.length ? sum : null
  }, [leaveBalances])

  const balancesCurrentYear = useMemo(() => {
    const list = leaveBalances || []
    const currentYear = new Date().getFullYear()
    return list
      .filter((b) => Number(b.year) === currentYear || b.year == null)
      .slice()
      .sort((a, b) => Number(b.remaining || 0) - Number(a.remaining || 0))
  }, [leaveBalances])

  function prettyLeaveTypeName(raw) {
    const s = String(raw || '').trim()
    const up = s.toUpperCase()
    if (up === 'WFH' || up.includes('WORK FROM HOME')) return 'WFH'
    if (up.includes('SICK')) return 'Sick leave'
    if (up.includes('ANNUAL')) return 'Annual leave'
    if (up.includes('CASUAL')) return 'Casual leave'
    if (up.includes('MATERNITY')) return 'Maternity leave'
    if (up.includes('PATERNITY')) return 'Paternity leave'
    // Title case fallback
    return s
      ? s
          .toLowerCase()
          .split(/[\s_-]+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
      : 'Leave'
  }

  function accentForLeaveType(label) {
    const up = String(label || '').toUpperCase()
    if (up.includes('SICK')) return { main: 'rgba(244,63,94,1)', soft: 'rgba(244,63,94,.10)' } // rose
    if (up === 'WFH' || up.includes('WORK FROM HOME')) return { main: 'rgba(59,130,246,1)', soft: 'rgba(59,130,246,.10)' } // blue
    if (up.includes('ANNUAL')) return { main: 'rgba(34,197,94,1)', soft: 'rgba(34,197,94,.10)' } // green
    if (up.includes('CASUAL')) return { main: 'rgba(168,85,247,1)', soft: 'rgba(168,85,247,.10)' } // purple
    return { main: 'rgba(99,102,241,1)', soft: 'rgba(99,102,241,.10)' } // indigo default
  }

  function pctUsed(used, allocated) {
    const u = Number(used)
    const a = Number(allocated)
    if (!Number.isFinite(u) || !Number.isFinite(a) || a <= 0) return null
    return Math.max(0, Math.min(100, Math.round((u / a) * 100)))
  }

  const balancesForCards = useMemo(() => {
    return (balancesCurrentYear || []).map((b) => {
      const directType = b.leaveType || b.type || b.name || null
      const label = prettyLeaveTypeName(directType) || 'Leave'
      return {
        id: b.id || `${b.leaveTypeId}-${b.year}`,
        label,
        remaining: b.remaining ?? null,
        used: b.used ?? null,
        allocated: b.allocated ?? null,
        year: b.year ?? null,
      }
    })
  }, [balancesCurrentYear])

  const wfhBalance = useMemo(() => {
    return (
      profile?.remainingWfhBalance ??
      profile?.wfhBalance ??
      profile?.remainingWfh ??
      null
    )
  }, [profile])

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
        <Grid item xs={12}>
          <Paper sx={{ p: 2.5 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ md: 'center' }}
              justifyContent="space-between"
            >
              <Stack spacing={0.75}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                  Today
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip
                    icon={<AccessTimeIcon />}
                    label={
                      isCheckedIn
                        ? `Checked in${checkedInAt ? ` at ${checkedInAt}` : ''}${
                            runningWorkedMin != null ? ` • ${runningWorkedMin}m` : ''
                          }`
                        : todayLabel
                    }
                    color={isCheckedIn ? 'success' : 'default'}
                    sx={isCheckedIn ? { fontWeight: 800 } : { fontWeight: 800 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                    {todayStr}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Updates in real time
                  </Typography>
                </Stack>
              </Stack>

              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
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
        </Grid>
      </Grid>

      {balancesForCards.length ? (
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack spacing={0.25}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                Leave balances ({new Date().getFullYear()})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remaining and used days by leave type.
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {balancesForCards.map((b) => (
                <Grid key={b.id} item xs={12} sm={6} md={4} lg={3}>
                  {(() => {
                    const accent = accentForLeaveType(b.label)
                    const selected = selectedBalanceId === b.id
                    const usedPct = pctUsed(b.used, b.allocated)
                    const usedNum = b.used ?? '—'
                    const allocNum = b.allocated ?? '—'
                    const remNum = b.remaining ?? '—'

                    return (
                      <Tooltip
                        arrow
                        title={
                          usedPct == null
                            ? `${b.label} • Used ${usedNum} • Alloc ${allocNum}`
                            : `${b.label} • Used ${usedNum}/${allocNum} (${usedPct}%)`
                        }
                      >
                        <Paper
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedBalanceId((cur) => (cur === b.id ? null : b.id))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setSelectedBalanceId((cur) => (cur === b.id ? null : b.id))
                            }
                          }}
                          variant="outlined"
                          sx={{
                            p: 3,
                            minHeight: 176,
                            borderRadius: 3,
                            cursor: 'pointer',
                            userSelect: 'none',
                            bgcolor: selected ? accent.soft : 'background.paper',
                            borderColor: selected ? accent.main : 'rgba(148,163,184,.35)',
                            boxShadow: selected ? `0 0 0 3px ${accent.soft}` : 'none',
                            transition: 'transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background-color 140ms ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              borderColor: accent.main,
                              boxShadow: `0 10px 30px -18px rgba(2,6,23,.35)`,
                            },
                            '&:focus-visible': {
                              outline: `3px solid ${accent.soft}`,
                              outlineOffset: 2,
                            },
                          }}
                        >
                          <Stack spacing={1.25}>
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                              <Typography variant="subtitle2" sx={{ fontWeight: 950 }}>
                                {String(b.label || 'Leave')}
                              </Typography>
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: 999,
                                  bgcolor: accent.main,
                                  boxShadow: `0 0 0 6px ${accent.soft}`,
                                }}
                              />
                            </Stack>

                            <Stack direction="row" spacing={1.5} alignItems="baseline">
                              <Typography
                                variant="h3"
                                sx={{
                                  fontWeight: 950,
                                  letterSpacing: '-0.03em',
                                  lineHeight: 1.05,
                                  color: accent.main,
                                }}
                              >
                                {remNum}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>
                                remaining
                              </Typography>
                            </Stack>

                            {usedPct != null ? (
                              <Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={usedPct}
                                  sx={{
                                    height: 8,
                                    borderRadius: 999,
                                    bgcolor: 'rgba(148,163,184,.35)',
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 999,
                                      backgroundColor: accent.main,
                                    },
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                                  Used {usedNum}/{allocNum} ({usedPct}%)
                                </Typography>
                              </Box>
                            ) : (
                              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Chip size="small" variant="outlined" label={`Used: ${usedNum}`} sx={{ fontWeight: 800 }} />
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  label={`Allocated: ${allocNum}`}
                                  sx={{ fontWeight: 800 }}
                                />
                              </Stack>
                            )}

                            {selected ? (
                              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Chip size="small" color="success" label={`Remaining: ${remNum}`} sx={{ fontWeight: 900 }} />
                                <Chip size="small" variant="outlined" label={`Used: ${usedNum}`} sx={{ fontWeight: 900 }} />
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  label={`Allocated: ${allocNum}`}
                                  sx={{ fontWeight: 900 }}
                                />
                              </Stack>
                            ) : null}
                          </Stack>
                        </Paper>
                      </Tooltip>
                    )
                  })()}
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  )
}

