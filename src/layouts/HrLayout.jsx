import BaseLayout from './BaseLayout'

function HrLayout() {
  const navItems = [
    { to: '/hr/dashboard', label: 'Dashboard', end: true },
    { to: '/hr/employees', label: 'Employees' },
    { to: '/hr/shifts', label: 'Shifts' },
    { to: '/hr/work-policy', label: 'Work Policy' },
    { to: '/hr/holidays', label: 'Holidays' },
    { to: '/hr/leave-types-balances', label: 'Leave Types & Balances' },
    { to: '/hr/leave-requests', label: 'Leave Requests' },
    { to: '/hr/biometric', label: 'Biometric Monitor' },
    { to: '/hr/notifications', label: 'Notifications' },
    { to: '/hr/bulk-upload', label: 'Bulk Upload' },
  ]

  return <BaseLayout title="HR Admin" navItems={navItems} />
}

export default HrLayout

