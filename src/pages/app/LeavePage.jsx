import { useMemo, useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import FormField from '../../components/ui/FormField'
import Badge from '../../components/ui/Badge'
import { Card, CardContent } from '../../components/ui/Card'
import { Table, TBody, TD, TH, THead, TR } from '../../components/ui/Table'
import { useAuth } from '../../auth/auth-context'
import { Roles } from '../../routes/roles'
import { leaveSeed, leaveStatuses, leaveTypes } from '../../data/leaves'

function statusVariant(status) {
  if (status === 'Approved') return 'green'
  if (status === 'Pending') return 'amber'
  if (status === 'Rejected') return 'rose'
  return 'slate'
}

function daysBetween(from, to) {
  const a = new Date(from)
  const b = new Date(to)
  const ms = b.getTime() - a.getTime()
  return Math.max(1, Math.floor(ms / (1000 * 60 * 60 * 24)) + 1)
}

function validateApply(form) {
  const errors = {}
  if (!form.type) errors.type = 'Leave type is required.'
  if (!form.from) errors.from = 'Start date is required.'
  if (!form.to) errors.to = 'End date is required.'
  if (form.from && form.to && new Date(form.to) < new Date(form.from)) {
    errors.to = 'End date must be after start date.'
  }
  if (!form.reason) errors.reason = 'Reason is required.'
  return errors
}

export default function LeavePage() {
  const { role, user } = useAuth()
  const [leaves, setLeaves] = useState(leaveSeed)

  const [apply, setApply] = useState({
    type: 'Casual Leave',
    from: '2026-03-21',
    to: '2026-03-21',
    reason: '',
  })
  const [touched, setTouched] = useState({})

  const applyErrors = useMemo(() => validateApply(apply), [apply])
  const canApply = Object.keys(applyErrors).length === 0

  const visibleLeaves = useMemo(() => {
    if (role === Roles.EMPLOYEE) {
      return leaves.filter((l) => l.employeeId === 'EMP-1005' || l.employeeName?.toLowerCase().includes(user?.name?.toLowerCase() || ''))
    }
    return leaves
  }, [leaves, role, user?.name])

  const onApply = () => {
    setTouched({ type: true, from: true, to: true, reason: true })
    if (!canApply) return

    const next = {
      id: `LV-${9000 + leaves.length + 1}`,
      employeeId: role === Roles.EMPLOYEE ? 'EMP-1005' : 'EMP-1003',
      employeeName: user?.name || 'Employee',
      type: apply.type,
      from: apply.from,
      to: apply.to,
      days: daysBetween(apply.from, apply.to),
      reason: apply.reason,
      status: 'Pending',
      appliedAt: new Date().toISOString(),
    }

    setLeaves((prev) => [next, ...prev])
    setApply((p) => ({ ...p, reason: '' }))
    setTouched({})
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        subtitle={role === Roles.EMPLOYEE ? 'Apply for leave and track status.' : 'View leave requests and history.'}
      />

      {role === Roles.EMPLOYEE ? (
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Leave type" required error={touched.type ? applyErrors.type : null}>
                <Select
                  value={apply.type}
                  onChange={(e) => setApply((p) => ({ ...p, type: e.target.value }))}
                  onBlur={() => setTouched((p) => ({ ...p, type: true }))}
                  error={touched.type ? applyErrors.type : null}
                >
                  {leaveTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </FormField>
              <div className="hidden sm:block" />
              <FormField label="From" required error={touched.from ? applyErrors.from : null}>
                <Input
                  type="date"
                  value={apply.from}
                  onChange={(e) => setApply((p) => ({ ...p, from: e.target.value }))}
                  onBlur={() => setTouched((p) => ({ ...p, from: true }))}
                  error={touched.from ? applyErrors.from : null}
                />
              </FormField>
              <FormField label="To" required error={touched.to ? applyErrors.to : null}>
                <Input
                  type="date"
                  value={apply.to}
                  onChange={(e) => setApply((p) => ({ ...p, to: e.target.value }))}
                  onBlur={() => setTouched((p) => ({ ...p, to: true }))}
                  error={touched.to ? applyErrors.to : null}
                />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Reason" required error={touched.reason ? applyErrors.reason : null}>
                  <textarea
                    className="min-h-24 w-full resize-none rounded-2xl bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-600/30 focus:ring-inset"
                    value={apply.reason}
                    onChange={(e) => setApply((p) => ({ ...p, reason: e.target.value }))}
                    onBlur={() => setTouched((p) => ({ ...p, reason: true }))}
                    placeholder="Short reason for leave…"
                  />
                </FormField>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button onClick={onApply} disabled={!canApply}>
                Apply leave
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Table>
        <THead>
          <TR>
            <TH>Request</TH>
            <TH>Employee</TH>
            <TH>Type</TH>
            <TH>Dates</TH>
            <TH>Days</TH>
            <TH>Status</TH>
          </TR>
        </THead>
        <TBody>
          {visibleLeaves.map((l) => (
            <TR key={l.id}>
              <TD className="whitespace-nowrap font-medium text-slate-900">{l.id}</TD>
              <TD className="whitespace-nowrap">
                <div className="font-medium text-slate-900">{l.employeeName}</div>
                <div className="text-xs text-slate-500">{l.employeeId}</div>
              </TD>
              <TD className="whitespace-nowrap">{l.type}</TD>
              <TD className="whitespace-nowrap text-slate-600">
                {l.from} → {l.to}
              </TD>
              <TD className="whitespace-nowrap">{l.days}</TD>
              <TD className="whitespace-nowrap">
                <Badge variant={statusVariant(l.status)}>{l.status}</Badge>
              </TD>
            </TR>
          ))}
          {visibleLeaves.length === 0 ? (
            <TR>
              <TD colSpan={6} className="py-10 text-center text-slate-600">
                No leave records yet.
              </TD>
            </TR>
          ) : null}
        </TBody>
      </Table>

      <div className="text-xs text-slate-500">
        Statuses: {leaveStatuses.join(' • ')}
      </div>
    </div>
  )
}

