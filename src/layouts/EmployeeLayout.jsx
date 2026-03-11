import BaseLayout from './BaseLayout'

function EmployeeLayout() {
  const navItems = [
    { to: '/employee/dashboard', label: 'My Dashboard', end: true },
    { to: '/employee/attendance', label: 'My Attendance' },
    { to: '/employee/leaves', label: 'My Leaves' },
    { to: '/employee/notifications', label: 'Notifications' },
  ]

  return <BaseLayout title="Employee" navItems={navItems} />
}

export default EmployeeLayout

