import { Grid, Paper, Stack, Typography } from '@mui/material'

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
  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of employees, leave requests, and trends. (Charts can be plugged in next.)
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <Stat label="Total Employees" value="—" hint="Synced from employee directory" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Stat label="Active" value="—" hint="Computed client-side" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Stat label="On Leave" value="—" hint="From leaves endpoints" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Stat label="New Joinees" value="—" hint="If backend provides" />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2.25 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Recent activity
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Notifications integration can be enabled when available.
        </Typography>
      </Paper>
    </Stack>
  )
}

