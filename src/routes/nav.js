import { Roles } from './roles'

export const navItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    to: '/app/dashboard',
    roles: [Roles.SUPER_ADMIN, Roles.HR, Roles.MANAGER, Roles.EMPLOYEE],
  },
  {
    key: 'employees',
    label: 'Employees',
    to: '/app/employees',
    roles: [Roles.SUPER_ADMIN, Roles.HR],
  },
  {
    key: 'leave',
    label: 'Leave Management',
    to: '/app/leave',
    roles: [Roles.SUPER_ADMIN, Roles.HR, Roles.MANAGER, Roles.EMPLOYEE],
  },
  {
    key: 'approvals',
    label: 'Approvals',
    to: '/app/approvals',
    roles: [Roles.MANAGER, Roles.HR, Roles.SUPER_ADMIN],
  },
  {
    key: 'roles',
    label: 'Roles & Permissions',
    to: '/app/roles',
    roles: [Roles.SUPER_ADMIN],
  },
]

