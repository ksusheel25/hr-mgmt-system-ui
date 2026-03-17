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
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import { LeaveApi } from '../../lib/api'
import { useAuth } from '../../auth/auth-context'
import { Roles } from '../../routes/roles'

function StatusChip({ status }) {
  const color =
    status === 'APPROVED' || status === 'Approved'
      ? 'success'
      : status === 'REJECTED' || status === 'Rejected'
        ? 'error'
        : 'warning'
  return <Chip size="small" label={status} color={color} />
}

function normalizeLeave(raw) {
  return {
    id: raw.id || raw.leaveRequestId || `${raw.employeeId || 'emp'}-${raw.fromDate}-${raw.toDate}`,
    employeeId: raw.employeeId || '',
    leaveType: raw.leaveType || raw.type || '',
    fromDate: raw.fromDate || raw.from || '',
    toDate: raw.toDate || raw.to || '',
    status: raw.status || 'PENDING',
    reason: raw.reason || '',
    raw,
  }
}

function ApplyDialog({ open, onClose, onApplied }) {
  const [form, setForm] = useState({ leaveType: '', fromDate: '', toDate: '', reason: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open) {
      setForm({ leaveType: '', fromDate: '', toDate: '', reason: '' })
      setError(null)
    }
  }, [open])

  const canSubmit = form.leaveType && form.fromDate && form.toDate

  const submit = async () => {
    setSaving(true)
    setError(null)
    try {
      await LeaveApi.apply(form)
      onApplied?.()
      onClose?.()
    } catch {
      setError('Could not submit leave request.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>Apply leave</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField
            label="Leave type"
            value={form.leaveType}
            onChange={(e) => setForm((p) => ({ ...p, leaveType: e.target.value }))}
            placeholder="ANNUAL / SICK / WFH"
            required
            fullWidth
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="From"
                type="date"
                value={form.fromDate}
                onChange={(e) => setForm((p) => ({ ...p, fromDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="To"
                type="date"
                value={form.toDate}
                onChange={(e) => setForm((p) => ({ ...p, toDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
            </Grid>
          </Grid>
          <TextField
            label="Reason (optional)"
            value={form.reason}
            onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
            multiline
            minRows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={!canSubmit || saving}>
          {saving ? 'Submitting…' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function LeavePage() {
  const { role } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [applyOpen, setApplyOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data =
        role === Roles.EMPLOYEE ? await LeaveApi.my() : await LeaveApi.adminList()
      setRows((data || []).map(normalizeLeave))
    } catch {
      setError('Could not load leave requests.')
    } finally {
      setLoading(false)
    }
  }, [role])

  useEffect(() => {
    load()
  }, [load])

  const columns = useMemo(() => {
    const base = [
      { field: 'leaveType', headerName: 'Type', flex: 1, minWidth: 140 },
      { field: 'fromDate', headerName: 'From', flex: 1, minWidth: 120 },
      { field: 'toDate', headerName: 'To', flex: 1, minWidth: 120 },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 140,
        renderCell: (params) => <StatusChip status={params.value} />,
      },
    ]

    if (role !== Roles.EMPLOYEE) {
      return [{ field: 'employeeId', headerName: 'Employee', flex: 1, minWidth: 140 }, ...base]
    }
    return base
  }, [role])

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Leave
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {role === Roles.EMPLOYEE
            ? 'Apply for leave and track your requests.'
            : 'Review leave requests across the organization.'}
        </Typography>
      </Box>

      {role === Roles.EMPLOYEE ? (
        <Paper sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              Submit a request with type and dates. Manager approvals appear in the Approvals section.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setApplyOpen(true)}>
              Apply leave
            </Button>
          </Stack>
        </Paper>
      ) : null}

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ height: 560, overflow: 'hidden' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          sx={{ border: 0, '& .MuiDataGrid-columnHeaders': { bgcolor: 'rgba(248,250,252,1)' } }}
        />
      </Paper>

      <ApplyDialog open={applyOpen} onClose={() => setApplyOpen(false)} onApplied={load} />
    </Stack>
  )
}

