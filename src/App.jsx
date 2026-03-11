import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import LoginPage from './pages/auth/LoginPage'
import SuperAdminLayout from './layouts/SuperAdminLayout'
import HrLayout from './layouts/HrLayout'
import EmployeeLayout from './layouts/EmployeeLayout'
import ManagerLayout from './layouts/ManagerLayout'
import SuperAdminCompaniesList from './pages/superadmin/SuperAdminCompaniesList'
import SuperAdminCompanyDetail from './pages/superadmin/SuperAdminCompanyDetail'
import HrDashboard from './pages/hr/HrDashboard'
import HrEmployeesPage from './pages/hr/HrEmployeesPage'
import HrShiftsPage from './pages/hr/HrShiftsPage'
import HrWorkPolicyPage from './pages/hr/HrWorkPolicyPage'
import HrHolidaysPage from './pages/hr/HrHolidaysPage'
import HrLeaveTypesBalancesPage from './pages/hr/HrLeaveTypesBalancesPage'
import HrLeaveAdminPage from './pages/hr/HrLeaveAdminPage'
import HrBiometricPage from './pages/hr/HrBiometricPage'
import HrNotificationsPage from './pages/hr/HrNotificationsPage'
import HrBulkUploadPage from './pages/hr/HrBulkUploadPage'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import EmployeeAttendancePage from './pages/employee/EmployeeAttendancePage'
import EmployeeLeavesPage from './pages/employee/EmployeeLeavesPage'
import EmployeeNotificationsPage from './pages/employee/EmployeeNotificationsPage'
import ManagerTeamLeavesPage from './pages/manager/ManagerTeamLeavesPage'
import ManagerNotificationsPage from './pages/manager/ManagerNotificationsPage'
import './index.css'

function ProtectedRoute({ children, allowRoles }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowRoles && !allowRoles.includes(role)) {
    return <Navigate to="/" replace />
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
            path="/super-admin/*"
            element={
              <ProtectedRoute allowRoles={['SUPER_ADMIN']}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SuperAdminCompaniesList />} />
            <Route path="companies" element={<SuperAdminCompaniesList />} />
            <Route path="companies/:companyId" element={<SuperAdminCompanyDetail />} />
          </Route>

          <Route
            path="/hr/*"
            element={
              <ProtectedRoute allowRoles={['SUPER_ADMIN', 'HR']}>
                <HrLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HrDashboard />} />
            <Route path="dashboard" element={<HrDashboard />} />
            <Route path="employees" element={<HrEmployeesPage />} />
            <Route path="shifts" element={<HrShiftsPage />} />
            <Route path="work-policy" element={<HrWorkPolicyPage />} />
            <Route path="holidays" element={<HrHolidaysPage />} />
            <Route path="leave-types-balances" element={<HrLeaveTypesBalancesPage />} />
            <Route path="leave-requests" element={<HrLeaveAdminPage />} />
            <Route path="biometric" element={<HrBiometricPage />} />
            <Route path="notifications" element={<HrNotificationsPage />} />
            <Route path="bulk-upload" element={<HrBulkUploadPage />} />
          </Route>

          <Route
            path="/employee/*"
            element={
              <ProtectedRoute allowRoles={['EMPLOYEE', 'HR', 'SUPER_ADMIN']}>
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<EmployeeDashboard />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="attendance" element={<EmployeeAttendancePage />} />
            <Route path="leaves" element={<EmployeeLeavesPage />} />
            <Route path="notifications" element={<EmployeeNotificationsPage />} />
          </Route>

          <Route
            path="/manager/*"
            element={
              <ProtectedRoute allowRoles={['EMPLOYEE', 'HR', 'SUPER_ADMIN']}>
                <ManagerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ManagerTeamLeavesPage />} />
            <Route path="team-leaves" element={<ManagerTeamLeavesPage />} />
            <Route path="notifications" element={<ManagerNotificationsPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
