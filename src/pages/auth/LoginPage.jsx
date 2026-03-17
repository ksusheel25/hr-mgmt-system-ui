import { useMemo, useState } from 'react'
import { useAuth } from '../../auth/auth-context'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

function validate({ tenantId, username, password }) {
  const errors = {}
  if (!tenantId) errors.tenantId = 'Tenant ID is required.'
  if (!username) errors.username = 'Username is required.'
  if (!password) errors.password = 'Password is required.'
  return errors
}

export default function LoginPage() {
  const { login, loading } = useAuth()
  const [form, setForm] = useState({
    tenantId: '11111111-1111-1111-1111-111111111111',
    username: 'hrmanager',
    password: 'password',
  })
  const [touched, setTouched] = useState({})
  const [error, setError] = useState(null)

  const errors = useMemo(() => validate(form), [form])
  const canSubmit = Object.keys(errors).length === 0 && !loading

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  const onBlur = (e) => setTouched((p) => ({ ...p, [e.target.name]: true }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setTouched({ tenantId: true, username: true, password: true })
    if (!canSubmit) return
    try {
      await login(form)
    } catch {
      setError('Login failed. Check credentials or server.')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Grid container sx={{ minHeight: '100vh', maxWidth: 1200, mx: 'auto' }}>
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'stretch',
            p: 3,
          }}
        >
          <Box
            sx={{
              flex: 1,
              borderRadius: 4,
              p: 5,
              color: 'white',
              background:
                'linear-gradient(135deg, rgba(79,70,229,1) 0%, rgba(30,41,59,1) 100%)',
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6">Acme HRMS</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                HR Attendance & Leave
              </Typography>
              <Typography sx={{ opacity: 0.85 }}>
                Modern admin console for HR, Managers, and Employees.
              </Typography>
              <Divider sx={{ borderColor: 'rgba(255,255,255,.18)', my: 2 }} />
              <Stack spacing={1}>
                <Typography sx={{ opacity: 0.9 }}>• Employee directory & profiles</Typography>
                <Typography sx={{ opacity: 0.9 }}>• Leave requests + approvals</Typography>
                <Typography sx={{ opacity: 0.9 }}>• Attendance tools</Typography>
              </Stack>
            </Stack>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: 'grid',
            placeItems: 'center',
            p: { xs: 2, sm: 3 },
          }}
        >
          <Card sx={{ width: '100%', maxWidth: 440 }}>
            <CardContent sx={{ p: 3.5 }}>
              <Stack spacing={0.75}>
                <Typography variant="h6">Sign in</Typography>
                <Typography variant="body2" color="text.secondary">
                  Welcome back. Please enter your details.
                </Typography>
              </Stack>

              <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
                <Stack spacing={2}>
                  {error ? <Alert severity="error">{error}</Alert> : null}

                  <TextField
                    name="tenantId"
                    label="Tenant ID"
                    value={form.tenantId}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(touched.tenantId && errors.tenantId)}
                    helperText={touched.tenantId ? errors.tenantId : ' '}
                    fullWidth
                  />

                  <TextField
                    name="username"
                    label="Username"
                    value={form.username}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(touched.username && errors.username)}
                    helperText={touched.username ? errors.username : ' '}
                    fullWidth
                  />

                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password ? errors.password : ' '}
                    fullWidth
                  />

                  <Button type="submit" variant="contained" size="large" disabled={!canSubmit}>
                    {loading ? 'Signing in…' : 'Sign in'}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

