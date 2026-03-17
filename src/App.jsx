import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider from './auth/AuthProvider'
import { useAuth } from './auth/auth-context'
import LoginPage from './pages/auth/LoginPage'
import MuiAppLayout from './layouts/MuiAppLayout'
import DashboardPage from './pages/mui/DashboardPage'
import EmployeesPage from './pages/mui/EmployeesPage'
import LeavePage from './pages/mui/LeavePage'
import ApprovalsPage from './pages/mui/ApprovalsPage'
import RolesPage from './pages/mui/RolesPage'
import { Roles } from './routes/roles'

function ProtectedRoute({ children, allowRoles }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowRoles && !allowRoles.includes(role)) {
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/app/*"
            element={
              <ProtectedRoute
                allowRoles={[Roles.SUPER_ADMIN, Roles.HR, Roles.MANAGER, Roles.EMPLOYEE]}
              >
                <MuiAppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route
              path="employees"
              element={
                <ProtectedRoute allowRoles={[Roles.SUPER_ADMIN, Roles.HR]}>
                  <EmployeesPage />
                </ProtectedRoute>
              }
            />
            <Route path="leave" element={<LeavePage />} />
            <Route
              path="approvals"
              element={
                <ProtectedRoute allowRoles={[Roles.SUPER_ADMIN, Roles.HR, Roles.MANAGER]}>
                  <ApprovalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="roles"
              element={
                <ProtectedRoute allowRoles={[Roles.SUPER_ADMIN]}>
                  <RolesPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
