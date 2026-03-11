import BaseLayout from './BaseLayout'

function ManagerLayout() {
  const navItems = [
    { to: '/manager/team-leaves', label: 'Team Leave Requests', end: true },
    { to: '/manager/notifications', label: 'Notifications' },
  ]

  return <BaseLayout title="Manager" navItems={navItems} />
}

export default ManagerLayout

