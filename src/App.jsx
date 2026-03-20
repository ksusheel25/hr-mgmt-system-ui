import { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Divider,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
  Alert,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  EventNote as EventNoteIcon,
  Schedule as ScheduleIcon,
  CalendarMonth as CalendarIcon,
  Settings as PolicyIcon,
  Notifications as NotificationsIcon,
  CloudUpload as CloudUploadIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { authAPI } from './lib/api'

const theme = createTheme({
  palette: {
    primary: {
      main: '#4F46E5',
    },
    secondary: {
      main: '#10B981',
    },
  },
})

const DRAWER_WIDTH = 260

const pageConfig = {
  dashboard: { title: 'Dashboard' },
  employees: { title: 'Employee Management' },
  attendance: { title: 'Attendance' },
  leave: { title: 'Leave Management' },
  shifts: { title: 'Shift Management' },
  calendar: { title: 'Holiday Calendar' },
  policy: { title: 'Work Policy' },
  notifications: { title: 'Notifications' },
  upload: { title: 'Bulk Upload' },
}

function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('hr')
  const [formData, setFormData] = useState({
    tenantId: 'acmecorp',
    username: 'admin@acmecorp.com',
    password: 'password123',
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
      await authAPI.login(formData.tenantId, formData.username, formData.password)
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

function DashboardContent({ userRole }) {
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Employees
              </Typography>
              <Typography variant="h5">245</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Present Today
              </Typography>
              <Typography variant="h5">220</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                On Leave
              </Typography>
              <Typography variant="h5">15</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Employees
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Engineering</TableCell>
                  <TableCell>Senior Developer</TableCell>
                  <TableCell>
                    <Badge color="success" variant="dot" sx={{ ml: 1 }}>
                      <Typography variant="body2">Active</Typography>
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>HR</TableCell>
                  <TableCell>HR Manager</TableCell>
                  <TableCell>
                    <Badge color="success" variant="dot" sx={{ ml: 1 }}>
                      <Typography variant="body2">Active</Typography>
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  )
}

function EmployeesContent() {
  const [employees] = useState([
    { id: 1, name: 'John Doe', department: 'Engineering', position: 'Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', department: 'HR', position: 'Manager', status: 'Active' },
    { id: 3, name: 'Bob Johnson', department: 'Sales', position: 'Executive', status: 'Active' },
  ])

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Employees</Typography>
          <Button variant="contained" size="small">
            Add Employee
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>{emp.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

function AttendanceContent() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Attendance Tracking
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Employee</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>09:00 AM</TableCell>
                <TableCell>05:30 PM</TableCell>
                <TableCell>Present</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>09:15 AM</TableCell>
                <TableCell>06:00 PM</TableCell>
                <TableCell>Present</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

function DefaultContent() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Content Coming Soon</Typography>
        <Typography variant="body2" color="textSecondary">
          This page is under development
        </Typography>
      </CardContent>
    </Card>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('hr')
  const [activeScreen, setActiveScreen] = useState('dashboard')

  const handleLogin = (role) => {
    setUserRole(role)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'employees', label: 'Employees', icon: <PeopleIcon /> },
    { id: 'attendance', label: 'Attendance', icon: <AccessTimeIcon /> },
    { id: 'leave', label: 'Leave', icon: <EventNoteIcon /> },
    { id: 'shifts', label: 'Shifts', icon: <ScheduleIcon /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { id: 'policy', label: 'Policy', icon: <PolicyIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
    { id: 'upload', label: 'Bulk Upload', icon: <CloudUploadIcon /> },
  ]

  const renderContent = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardContent userRole={userRole} />
      case 'employees':
        return <EmployeesContent />
      case 'attendance':
        return <AttendanceContent />
      default:
        return <DefaultContent />
    }
  }

  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginScreen onLogin={handleLogin} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Sidebar */}
        <Drawer
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box sx={{ p: 2, fontWeight: 'bold', fontSize: '1.2rem', color: 'primary.main' }}>
            HiveHR
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={activeScreen === item.id}
                  onClick={() => setActiveScreen(item.id)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mt: 'auto' }} />
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flex: 1 }}>
                {menuItems.find((item) => item.id === activeScreen)?.label || 'Dashboard'}
              </Typography>
              <IconButton color="inherit" onClick={() => {}}>
                <NotificationsIcon />
              </IconButton>
              <Avatar sx={{ ml: 2, cursor: 'pointer' }}>AK</Avatar>
            </Toolbar>
          </AppBar>

          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 3,
              backgroundColor: '#f5f5f5',
            }}
          >
            {renderContent()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
