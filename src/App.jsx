import { useEffect, useState } from 'react'
import './App.css'
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
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
import { AttendanceProvider } from './context/AttendanceContext'
import LoginScreen from './pages/LoginScreen'
import DashboardContent from './pages/DashboardContent'
import AttendanceContent from './pages/AttendanceContent'
import DefaultContent from './pages/DefaultContent'
import EmployeesPage from './pages/EmployeesPage'
import LeavePage from './pages/LeavePage'
import ShiftsPage from './pages/ShiftsPage'
import CalendarPage from './pages/CalendarPage'
import PolicyPage from './pages/PolicyPage'
import NotificationsPage from './pages/NotificationsPage'
import UploadPage from './pages/UploadPage'

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

  useEffect(() => {
    const handleAuthLogout = () => {
      setIsLoggedIn(false)
      setActiveScreen('dashboard')
    }
    window.addEventListener('auth:logout', handleAuthLogout)
    return () => window.removeEventListener('auth:logout', handleAuthLogout)
  }, [])

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
        return <EmployeesPage />
      case 'attendance':
        return <AttendanceContent />
      case 'leave':
        return <LeavePage />
      case 'shifts':
        return <ShiftsPage />
      case 'calendar':
        return <CalendarPage />
      case 'policy':
        return <PolicyPage />
      case 'notifications':
        return <NotificationsPage />
      case 'upload':
        return <UploadPage />
      default:
        return <DefaultContent />
    }
  }

  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AttendanceProvider>
          <LoginScreen onLogin={handleLogin} />
        </AttendanceProvider>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AttendanceProvider>
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
      </AttendanceProvider>
    </ThemeProvider>
  )
}

export default App
