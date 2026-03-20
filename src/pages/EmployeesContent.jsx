import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEmployees } from '../hooks/useEmployees'

const getEmployeeName = (employee) => {
  if (employee?.name) return employee.name
  const fullName = [employee?.firstName, employee?.lastName].filter(Boolean).join(' ')
  if (fullName) return fullName
  return employee?.fullName || 'Unknown'
}

const getDepartment = (employee) => (
  employee?.department?.name ||
  employee?.departmentName ||
  employee?.dept ||
  '—'
)

const getDesignation = (employee) => (
  employee?.designation ||
  employee?.position ||
  employee?.role ||
  '—'
)

const getStatus = (employee) => (
  employee?.status ||
  employee?.employmentStatus ||
  'Active'
)

export default function EmployeesContent() {
  const { employees, loading, error } = useEmployees({ limit: 8 })

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Employees</Typography>
          <Button variant="contained" size="small">
            Add Employee
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={4} align="center">Loading employees...</TableCell>
                </TableRow>
              )}
              {!loading && error && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: 'error.main' }}>{error}</TableCell>
                </TableRow>
              )}
              {!loading && !error && employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No employees found.</TableCell>
                </TableRow>
              )}
              {!loading && !error && employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{getEmployeeName(emp)}</TableCell>
                  <TableCell>{getDepartment(emp)}</TableCell>
                  <TableCell>{getDesignation(emp)}</TableCell>
                  <TableCell>{getStatus(emp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
