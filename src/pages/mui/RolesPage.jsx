import { Box, Paper, Stack, Typography } from '@mui/material'

export default function RolesPage() {
  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Roles & Permissions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure permissions in the backend. This screen will reflect policy once endpoints are available.
        </Typography>
      </Box>

      <Paper sx={{ p: 2.25 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Coming next
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          When you share the roles/permissions API endpoints (or add them to the Postman collection),
          this page will become a full CRUD view with role assignment, feature toggles, and audit trail.
        </Typography>
      </Paper>
    </Stack>
  )
}

