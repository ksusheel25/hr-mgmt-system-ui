import { useState } from 'react'
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { authAPI, employeeAPI } from '../lib/api'

export default function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('hr')
  const [formData, setFormData] = useState({
    tenantId: 'tanant123',
    username: 'emp001',
    password: 'ChangeMe@123',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async () => {
    setIsLoading(true)
    setError('')
    try {
      const loginData = await authAPI.login(formData.tenantId, formData.username, formData.password)
      const fromLogin =
        loginData?.employeeId ??
        loginData?.employee?.id ??
        loginData?.employee?.employeeId ??
        loginData?.user?.employeeId ??
        loginData?.user?.id

      if (fromLogin) {
        localStorage.setItem('employeeId', fromLogin)
      } else {
        try {
          const me = await employeeAPI.getMe()
          const resolvedId =
            me?.employeeId ??
            me?.id ??
            me?.empId ??
            me?.employee?.id ??
            me?.employee?.employeeId
          if (resolvedId) {
            localStorage.setItem('employeeId', resolvedId)
          } else {
            localStorage.removeItem('employeeId')
            console.warn('Employee id not found in /employees/me response')
          }
        } catch (profileErr) {
          console.error('Failed to load employee profile', profileErr)
        }
      }
      onLogin(role)
    } catch (err) {
      setError('Login failed. Please check your credentials.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4F46E5', mb: 1 }}>
            HiveHR
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Sign in to your workspace
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button
            fullWidth
            variant={role === 'hr' ? 'contained' : 'outlined'}
            onClick={() => setRole('hr')}
            size="small"
          >
            HR Admin
          </Button>
          <Button
            fullWidth
            variant={role === 'employee' ? 'contained' : 'outlined'}
            onClick={() => setRole('employee')}
            size="small"
          >
            Employee
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Tenant ID"
          name="tenantId"
          value={formData.tenantId}
          onChange={handleChange}
          margin="normal"
          size="small"
        />
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          size="small"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          size="small"
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        <Typography variant="caption" display="block" sx={{ textAlign: 'center', color: 'textSecondary' }}>
          Forgot password? <span style={{ color: '#4F46E5', cursor: 'pointer' }}>Reset here</span>
        </Typography>
      </Paper>
    </Box>
  )
}
