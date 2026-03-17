import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { LeaveApi } from '../../lib/api'

function normalizeLeave(raw) {
  return {
    id: raw.id || raw.leaveRequestId || `${raw.employeeId || 'emp'}-${raw.fromDate}-${raw.toDate}`,
    employeeId: raw.employeeId || '',
    leaveType: raw.leaveType || '',
    fromDate: raw.fromDate || '',
    toDate: raw.toDate || '',
    status: raw.status || 'PENDING',
    raw,
  }
}

function RemarksDialog({ open, title, onClose, onSubmit }) {
  const [remarks, setRemarks] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setRemarks('')
  }, [open])

  const submit = async () => {
    setSaving(true)
    try {
      await onSubmit(remarks)
      onClose?.()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>{title}</DialogTitle>
      <DialogContent>
        <TextField
          label="Remarks (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={saving}>
          {saving ? 'Saving…' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function ApprovalsPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [dialog, setDialog] = useState({ open: false, mode: null, id: null })

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await LeaveApi.pending()
      setRows((data || []).map(normalizeLeave))
    } catch {
      setError('Could not load pending requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const columns = useMemo(
    () => [
      { field: 'employeeId', headerName: 'Employee', flex: 1, minWidth: 140 },
      { field: 'leaveType', headerName: 'Type', flex: 1, minWidth: 140 },
      { field: 'fromDate', headerName: 'From', flex: 1, minWidth: 120 },
      { field: 'toDate', headerName: 'To', flex: 1, minWidth: 120 },
      { field: 'status', headerName: 'Status', flex: 1, minWidth: 120 },
      {
        field: 'actions',
        headerName: '',
        sortable: false,
        filterable: false,
        width: 240,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={() => setDialog({ open: true, mode: 'approve', id: params.row.id })}
            >
              Approve
            </Button>
            <Button
              size="small"
              color="error"
              variant="contained"
              startIcon={<CloseIcon />}
              onClick={() => setDialog({ open: true, mode: 'reject', id: params.row.id })}
            >
              Reject
            </Button>
          </Stack>
        ),
      },
    ],
    [],
  )

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Approvals
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review pending leave requests for your team.
        </Typography>
      </Box>

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

      <RemarksDialog
        open={dialog.open}
        title={dialog.mode === 'approve' ? 'Approve request' : 'Reject request'}
        onClose={() => setDialog({ open: false, mode: null, id: null })}
        onSubmit={async (remarks) => {
          try {
            if (dialog.mode === 'approve') await LeaveApi.approve(dialog.id, remarks)
            else await LeaveApi.reject(dialog.id, remarks)
            await load()
          } catch {
            setError('Action failed. Please retry.')
          }
        }}
      />
    </Stack>
  )
}

