import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../auth/auth-context'
import { navItems } from '../routes/nav'

const drawerWidth = 280

function RoleChip({ role }) {
  const color = role === 'SUPER_ADMIN' ? 'primary' : role === 'HR' ? 'secondary' : role === 'MANAGER' ? 'warning' : 'success'
  return <Chip size="small" label={role} color={color} />
}

export default function MuiAppLayout() {
  const { role, user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const items = useMemo(() => navItems.filter((i) => i.roles.includes(role)), [role])
  const title = useMemo(() => {
    const match = navItems.find((n) => location.pathname.startsWith(n.to))
    return match?.label || 'Acme HRMS'
  }, [location.pathname])

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" noWrap>
              Acme HRMS
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              HR Management System
            </Typography>
          </Box>
          <RoleChip role={role} />
        </Box>
      </Box>
      <Divider />
      <List sx={{ px: 1, py: 1, flex: 1 }}>
        {items.map((item) => (
          <ListItemButton
            key={item.key}
            component={NavLink}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              '&.active': {
                bgcolor: 'rgba(79,70,229,.10)',
                color: 'primary.main',
              },
            }}
          >
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>{(user?.name || 'U').slice(0, 1).toUpperCase()}</Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user?.email || ''}
          </Typography>
        </Box>
        <IconButton onClick={logout} aria-label="Logout">
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid rgba(226,232,240,.9)' }}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }}>
            {title}
          </Typography>
          <RoleChip role={role} />
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3 }, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

