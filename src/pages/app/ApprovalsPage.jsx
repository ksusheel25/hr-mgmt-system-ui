import { useMemo, useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Table, TBody, TD, TH, THead, TR } from '../../components/ui/Table'
import { leaveSeed } from '../../data/leaves'

function statusVariant(status) {
  if (status === 'Approved') return 'green'
  if (status === 'Pending') return 'amber'
  if (status === 'Rejected') return 'rose'
  return 'slate'
}

export default function ApprovalsPage() {
  const [requests, setRequests] = useState(leaveSeed)

  const pending = useMemo(() => requests.filter((r) => r.status === 'Pending'), [requests])

  const setStatus = (id, status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approvals"
        subtitle="Review and action pending leave requests."
      />

      <Table>
        <THead>
          <TR>
            <TH>Request</TH>
            <TH>Employee</TH>
            <TH>Type</TH>
            <TH>Dates</TH>
            <TH>Days</TH>
            <TH>Status</TH>
            <TH className="text-right">Action</TH>
          </TR>
        </THead>
        <TBody>
          {pending.map((r) => (
            <TR key={r.id}>
              <TD className="whitespace-nowrap font-medium text-slate-900">{r.id}</TD>
              <TD className="whitespace-nowrap">
                <div className="font-medium text-slate-900">{r.employeeName}</div>
                <div className="text-xs text-slate-500">{r.employeeId}</div>
              </TD>
              <TD className="whitespace-nowrap">{r.type}</TD>
              <TD className="whitespace-nowrap text-slate-600">
                {r.from} → {r.to}
              </TD>
              <TD className="whitespace-nowrap">{r.days}</TD>
              <TD className="whitespace-nowrap">
                <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
              </TD>
              <TD className="whitespace-nowrap text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" onClick={() => setStatus(r.id, 'Approved')}>
                    Approve
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setStatus(r.id, 'Rejected')}>
                    Reject
                  </Button>
                </div>
              </TD>
            </TR>
          ))}
          {pending.length === 0 ? (
            <TR>
              <TD colSpan={7} className="py-10 text-center text-slate-600">
                No pending requests.
              </TD>
            </TR>
          ) : null}
        </TBody>
      </Table>
    </div>
  )
}

