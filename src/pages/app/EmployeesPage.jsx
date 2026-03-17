import { useMemo, useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import FormField from '../../components/ui/FormField'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Pagination from '../../components/ui/Pagination'
import { Table, TBody, TD, TH, THead, TR } from '../../components/ui/Table'
import { departments, employeesSeed, roles as employeeRoles, statuses as employeeStatuses } from '../../data/employees'

function statusVariant(status) {
  if (status === 'Active') return 'green'
  if (status === 'On Leave') return 'amber'
  if (status === 'Inactive') return 'rose'
  return 'slate'
}

function validateEmployee(employee) {
  const errors = {}
  if (!employee.name) errors.name = 'Name is required.'
  if (!employee.email) errors.email = 'Email is required.'
  else if (!/^\S+@\S+\.\S+$/.test(employee.email)) errors.email = 'Enter a valid email.'
  if (!employee.role) errors.role = 'Role is required.'
  if (!employee.department) errors.department = 'Department is required.'
  if (!employee.status) errors.status = 'Status is required.'
  return errors
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(employeesSeed)
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All')
  const [status, setStatus] = useState('All')

  const [page, setPage] = useState(1)
  const pageSize = 8

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: '', department: '', status: 'Active' })
  const [touched, setTouched] = useState({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return employees.filter((e) => {
      const matchesQuery =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
      const matchesDept = department === 'All' || e.department === department
      const matchesStatus = status === 'All' || e.status === status
      return matchesQuery && matchesDept && matchesStatus
    })
  }, [employees, query, department, status])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const resetModal = () => {
    setEditing(null)
    setForm({ name: '', email: '', role: '', department: '', status: 'Active' })
    setTouched({})
  }

  const openCreate = () => {
    resetModal()
    setOpen(true)
  }

  const openEdit = (emp) => {
    setEditing(emp)
    setForm({
      name: emp.name,
      email: emp.email,
      role: emp.role,
      department: emp.department,
      status: emp.status,
    })
    setTouched({})
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    resetModal()
  }

  const errors = useMemo(() => validateEmployee(form), [form])
  const canSave = Object.keys(errors).length === 0

  const onSave = () => {
    setTouched({ name: true, email: true, role: true, department: true, status: true })
    if (!canSave) return

    if (editing) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === editing.id ? { ...e, ...form } : e)),
      )
    } else {
      const nextId = `EMP-${String(1000 + employees.length + 1).padStart(4, '0')}`
      setEmployees((prev) => [{ id: nextId, ...form }, ...prev])
    }
    close()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        subtitle="Search, filter, and manage your employee directory."
        actions={
          <Button onClick={openCreate}>
            Add employee
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-inset ring-slate-200/60 md:grid-cols-3">
        <FormField label="Search">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Name, email, or ID…"
          />
        </FormField>
        <FormField label="Department">
          <Select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value)
              setPage(1)
            }}
          >
            <option value="All">All</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Status">
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
          >
            <option value="All">All</option>
            {employeeStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>ID</TH>
            <TH>Name</TH>
            <TH>Email</TH>
            <TH>Role</TH>
            <TH>Department</TH>
            <TH>Status</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {paged.map((emp) => (
            <TR key={emp.id}>
              <TD className="whitespace-nowrap font-medium text-slate-900">{emp.id}</TD>
              <TD className="whitespace-nowrap">{emp.name}</TD>
              <TD className="whitespace-nowrap text-slate-600">{emp.email}</TD>
              <TD className="whitespace-nowrap">{emp.role}</TD>
              <TD className="whitespace-nowrap">{emp.department}</TD>
              <TD className="whitespace-nowrap">
                <Badge variant={statusVariant(emp.status)}>{emp.status}</Badge>
              </TD>
              <TD className="whitespace-nowrap text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(emp)}>
                    Edit
                  </Button>
                </div>
              </TD>
            </TR>
          ))}
          {paged.length === 0 ? (
            <TR>
              <TD colSpan={7} className="py-10 text-center text-slate-600">
                No employees found.
              </TD>
            </TR>
          ) : null}
        </TBody>
      </Table>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={(p) => setPage(p)}
      />

      <Modal
        open={open}
        onClose={close}
        title={editing ? 'Edit employee' : 'Add employee'}
        description="Update employee profile details. (Dummy data only.)"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Name" required error={touched.name ? errors.name : null}>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              onBlur={() => setTouched((p) => ({ ...p, name: true }))}
              error={touched.name ? errors.name : null}
              placeholder="Full name"
            />
          </FormField>
          <FormField label="Email" required error={touched.email ? errors.email : null}>
            <Input
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              onBlur={() => setTouched((p) => ({ ...p, email: true }))}
              error={touched.email ? errors.email : null}
              placeholder="name@company.com"
            />
          </FormField>
          <FormField label="Role" required error={touched.role ? errors.role : null}>
            <Select
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              onBlur={() => setTouched((p) => ({ ...p, role: true }))}
              error={touched.role ? errors.role : null}
            >
              <option value="">Select role</option>
              {employeeRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Department" required error={touched.department ? errors.department : null}>
            <Select
              value={form.department}
              onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
              onBlur={() => setTouched((p) => ({ ...p, department: true }))}
              error={touched.department ? errors.department : null}
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Status" required error={touched.status ? errors.status : null}>
            <Select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              onBlur={() => setTouched((p) => ({ ...p, status: true }))}
              error={touched.status ? errors.status : null}
            >
              {employeeStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
      </Modal>
    </div>
  )
}

