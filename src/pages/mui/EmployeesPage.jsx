import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import BlockIcon from '@mui/icons-material/Block'
import { EmployeesApi } from '../../lib/api'

function StatusChip({ active }) {
  return <Chip size="small" label={active ? 'Active' : 'Inactive'} color={active ? 'success' : 'default'} />
}

function normalizeEmployee(raw) {
  const id = raw.id || raw.employeeId || raw.employeeCode || raw.email
  const name = raw.name || [raw.firstName, raw.lastName].filter(Boolean).join(' ')
  return {
    id,
    employeeCode: raw.employeeCode || raw.code || '',
    firstName: raw.firstName || '',
    lastName: raw.lastName || '',
    name,
    email: raw.email || '',
    shiftId: raw.shiftId || '',
    managerId: raw.managerId || '',
    active: raw.active !== false,
    remainingWfhBalance: raw.remainingWfhBalance ?? 0,
    raw,
  }
}

function EmployeeDialog({ open, mode, initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setForm(initial)
    setError(null)
  }, [initial])

  const canSave = form.employeeCode && form.firstName && form.lastName && form.email

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        employeeCode: form.employeeCode,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        shiftId: form.shiftId || null,
        managerId: form.managerId || null,
        active: form.active !== false,
        remainingWfhBalance: Number(form.remainingWfhBalance) || 0,
      }

      if (mode === 'edit') await EmployeesApi.update(form.id, payload)
      else await EmployeesApi.create(payload)

      onSaved?.()
      onClose?.()
    } catch {
      setError('Could not save employee. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800 }}>
        {mode === 'edit' ? 'Edit employee' : 'Add employee'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Employee code"
                value={form.employeeCode}
                onChange={(e) => setForm((p) => ({ ...p, employeeCode: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="First name"
                value={form.firstName}
                onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Last name"
                value={form.lastName}
                onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Shift ID"
                value={form.shiftId}
                onChange={(e) => setForm((p) => ({ ...p, shiftId: e.target.value }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Manager ID"
                value={form.managerId}
                onChange={(e) => setForm((p) => ({ ...p, managerId: e.target.value }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="WFH balance"
                type="number"
                value={form.remainingWfhBalance}
                onChange={(e) => setForm((p) => ({ ...p, remainingWfhBalance: e.target.value }))}
                fullWidth
              />
            </Grid>
          </Grid>
          <Typography variant="caption" color="text.secondary">
            Tip: employee activation/deactivation is available from the actions menu after creation.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save} disabled={!canSave || saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function EmployeesPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState('create')
  const [dialogInitial, setDialogInitial] = useState({
    id: '',
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    shiftId: '',
    managerId: '',
    remainingWfhBalance: 0,
    active: true,
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await EmployeesApi.list()
      setRows((data || []).map(normalizeEmployee))
    } catch {
      setError('Could not load employees. Check server and credentials.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      const hay = `${r.employeeCode} ${r.name} ${r.email}`.toLowerCase()
      return hay.includes(q)
    })
  }, [rows, query])

  const columns = useMemo(
    () => [
      { field: 'employeeCode', headerName: 'Code', flex: 1, minWidth: 120 },
      { field: 'name', headerName: 'Name', flex: 1.5, minWidth: 180 },
      { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 220 },
      { field: 'shiftId', headerName: 'Shift', flex: 1, minWidth: 110 },
      { field: 'managerId', headerName: 'Manager', flex: 1, minWidth: 110 },
      {
        field: 'active',
        headerName: 'Status',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <StatusChip active={params.value} />,
      },
      {
        field: 'actions',
        headerName: '',
        sortable: false,
        filterable: false,
        width: 210,
        renderCell: (params) => {
          const row = params.row
          return (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => {
                  setDialogMode('edit')
                  setDialogInitial(row)
                  setDialogOpen(true)
                }}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="inherit"
                startIcon={<BlockIcon />}
                disabled={!row.active}
                onClick={async () => {
                  try {
                    await EmployeesApi.deactivate(row.id)
                    await load()
                  } catch {
                    setError('Could not deactivate employee.')
                  }
                }}
              >
                Deactivate
              </Button>
            </Stack>
          )
        },
      },
    ],
    [load],
  )

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Employees
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage employee profiles, shift assignment, and reporting lines.
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <TextField
            label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, email, or code"
            fullWidth
          />
          <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', sm: 'block' } }} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogMode('create')
              setDialogInitial({
                id: '',
                employeeCode: '',
                firstName: '',
                lastName: '',
                email: '',
                shiftId: '',
                managerId: '',
                remainingWfhBalance: 0,
                active: true,
              })
              setDialogOpen(true)
            }}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add employee
          </Button>
        </Stack>
      </Paper>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ height: 560, overflow: 'hidden' }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'rgba(248,250,252,1)' },
          }}
        />
      </Paper>

      <EmployeeDialog
        open={dialogOpen}
        mode={dialogMode}
        initial={dialogInitial}
        onClose={() => setDialogOpen(false)}
        onSaved={load}
      />
    </Stack>
  )
}

