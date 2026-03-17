import PageHeader from '../../components/layout/PageHeader'
import Badge from '../../components/ui/Badge'
import { Card, CardContent } from '../../components/ui/Card'
import { Table, TBody, TD, TH, THead, TR } from '../../components/ui/Table'
import { Roles } from '../../routes/roles'

const permissions = [
  { key: 'view_dashboard', label: 'View dashboard' },
  { key: 'manage_employees', label: 'Manage employees' },
  { key: 'apply_leave', label: 'Apply leave' },
  { key: 'approve_leave', label: 'Approve / reject leave' },
  { key: 'manage_roles', label: 'Manage roles & permissions' },
]

const matrix = {
  [Roles.ADMIN]: new Set(['view_dashboard', 'manage_employees', 'apply_leave', 'approve_leave', 'manage_roles']),
  [Roles.MANAGER]: new Set(['view_dashboard', 'manage_employees', 'apply_leave', 'approve_leave']),
  [Roles.EMPLOYEE]: new Set(['view_dashboard', 'apply_leave']),
}

function RolePill({ role }) {
  const variant = role === Roles.ADMIN ? 'brand' : role === Roles.MANAGER ? 'amber' : 'green'
  return <Badge variant={variant}>{role}</Badge>
}

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        subtitle="A simple role-based access model used for conditional rendering in the UI."
      />

      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span>Roles:</span>
            <RolePill role={Roles.ADMIN} />
            <RolePill role={Roles.MANAGER} />
            <RolePill role={Roles.EMPLOYEE} />
          </div>
          <div className="mt-4 text-sm text-slate-600">
            In a real system, this table would be driven by backend policy/claims; for now it powers route
            protection and sidebar navigation visibility.
          </div>
        </CardContent>
      </Card>

      <Table>
        <THead>
          <TR>
            <TH>Permission</TH>
            <TH className="text-center">Admin</TH>
            <TH className="text-center">Manager</TH>
            <TH className="text-center">Employee</TH>
          </TR>
        </THead>
        <TBody>
          {permissions.map((p) => (
            <TR key={p.key}>
              <TD className="font-medium text-slate-900">{p.label}</TD>
              {[Roles.ADMIN, Roles.MANAGER, Roles.EMPLOYEE].map((r) => {
                const allowed = matrix[r].has(p.key)
                return (
                  <TD key={r} className="text-center">
                    <span className={allowed ? 'text-emerald-700' : 'text-slate-300'}>
                      {allowed ? 'Yes' : '—'}
                    </span>
                  </TD>
                )
              })}
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

