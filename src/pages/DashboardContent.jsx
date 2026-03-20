import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material'
import CheckInOutCard from '../components/common/CheckInOutCard'
import { employeeAPI, leaveBalanceAPI } from '../lib/api'

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload
  return payload?.content || payload?.data || payload?.items || payload?.employees || payload?.holidays || []
}

const getEmployeeName = (employee) => {
  if (employee?.name) return employee.name
  const fullName = [employee?.firstName, employee?.lastName].filter(Boolean).join(' ')
  if (fullName) return fullName
  return employee?.fullName || 'Unknown'
}

const getBirthDate = (employee) => (
  employee?.dateOfBirth ||
  employee?.dob ||
  employee?.birthDate ||
  employee?.birthday
)

const getUpcomingBirthdays = (employees, now, limit = 6) => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const results = []
  employees.forEach((emp) => {
    const birth = parseDateValue(getBirthDate(emp))
    if (!birth) return
    const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
    if (next < today) {
      next.setFullYear(today.getFullYear() + 1)
    }
    results.push({ employee: emp, next })
  })
  return results
    .sort((a, b) => a.next - b.next)
    .slice(0, limit)
}

const formatBirthday = (date) => (
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
)

export default function DashboardContent({ userRole: _userRole }) {
  const [leaveState, setLeaveState] = useState({ items: [], loading: false, error: '' })
  const [birthdayState, setBirthdayState] = useState({ items: [], loading: false, error: '' })

  const today = useMemo(() => new Date(), [])
  // Holiday API call disabled for now per request.

  useEffect(() => {
    let isActive = true
    setLeaveState((prev) => ({ ...prev, loading: true, error: '' }))
    leaveBalanceAPI
      .getMe()
      .then((data) => {
        if (!isActive) return
        const list = normalizeList(data)
        setLeaveState({ items: list, loading: false, error: '' })
      })
      .catch((err) => {
        if (!isActive) return
        console.error('Failed to load leave balances', err)
        setLeaveState({ items: [], loading: false, error: 'Failed to load leave balances.' })
      })

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    let isActive = true
    setBirthdayState((prev) => ({ ...prev, loading: true, error: '' }))
    employeeAPI
      .list({ page: 0, size: 200 })
      .then((data) => {
        if (!isActive) return
        const list = normalizeList(data)
        const upcoming = getUpcomingBirthdays(list, today)
        setBirthdayState({ items: upcoming, loading: false, error: '' })
      })
      .catch((err) => {
        if (!isActive) return
        console.error('Failed to load birthdays', err)
        setBirthdayState({ items: [], loading: false, error: 'Failed to load birthdays.' })
      })

    return () => {
      isActive = false
    }
  }, [today])

  const leaveSummary = useMemo(() => {
    const list = Array.isArray(leaveState.items) ? leaveState.items : normalizeList(leaveState.items)
    const byType = new Map()

    list.forEach((item) => {
      const type = String(item?.leaveType || item?.type || item?.leaveTypeName || '').toUpperCase()
      if (!type) return
      const existing = byType.get(type)
      const currentYear = item?.year ?? 0
      if (!existing || currentYear >= existing.year) {
        byType.set(type, {
          code: type,
          year: currentYear,
          allocated: item?.allocated ?? 0,
          used: item?.used ?? 0,
          remaining: item?.remaining ?? 0,
        })
      }
    })

    const labelMap = {
      ANNUAL: 'Annual Leave',
      SICK: 'Sick Leave',
      WFH: 'WFH',
    }

    return Array.from(byType.values()).map((item) => ({
      ...item,
      label: labelMap[item.code] || item.code,
    }))
  }, [leaveState.items])

  return (
    <Box>
      <CheckInOutCard />
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Employees
              </Typography>
              <Typography variant="h5">245</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Present Today
              </Typography>
              <Typography variant="h5">220</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                On Leave
              </Typography>
              <Typography variant="h5">15</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Approvals
              </Typography>
              <Typography variant="h5">8</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Upcoming Holidays
              </Typography>
              <Typography color="textSecondary">
                Holiday feed will be enabled soon.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Leave Balances
              </Typography>
              {leaveState.loading && <Typography color="textSecondary">Loading leave balances...</Typography>}
              {!leaveState.loading && leaveState.error && (
                <Typography color="error">{leaveState.error}</Typography>
              )}
              {!leaveState.loading && !leaveState.error && leaveSummary.length === 0 && (
                <Typography color="textSecondary">No leave balances found.</Typography>
              )}
              {!leaveState.loading && !leaveState.error && leaveSummary.length > 0 && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                    gap: 2,
                  }}
                >
                  {leaveSummary.map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        border: '1px solid var(--border)',
                        borderRadius: 2,
                        padding: 2,
                        backgroundColor: '#fff',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        {item.label}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">Assigned</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.allocated}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">Available</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.remaining}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Taken</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.used}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Upcoming Birthdays
          </Typography>
          {birthdayState.loading && <Typography color="textSecondary">Loading birthdays...</Typography>}
          {!birthdayState.loading && birthdayState.error && (
            <Typography color="error">{birthdayState.error}</Typography>
          )}
          {!birthdayState.loading && !birthdayState.error && birthdayState.items.length === 0 && (
            <Typography color="textSecondary">No upcoming birthdays.</Typography>
          )}
          {!birthdayState.loading && !birthdayState.error && birthdayState.items.map(({ employee, next }) => (
            <Box key={`${employee?.id || employee?.employeeId || getEmployeeName(employee)}-${next.toISOString()}`} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{getEmployeeName(employee)}</Typography>
              <Typography variant="body2" color="textSecondary">{formatBirthday(next)}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  )
}
