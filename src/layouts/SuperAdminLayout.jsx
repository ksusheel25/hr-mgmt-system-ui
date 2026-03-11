import BaseLayout from './BaseLayout'

function SuperAdminLayout() {
  const navItems = [
    { to: '/super-admin/companies', label: 'Companies', end: false },
  ]

  return <BaseLayout title="Super Admin" navItems={navItems} />
}

export default SuperAdminLayout

