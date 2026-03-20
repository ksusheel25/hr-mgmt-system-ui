import {
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
import CheckInOutCard from '../components/common/CheckInOutCard'

export default function AttendanceContent() {
  return (
    <>
      <CheckInOutCard />
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Attendance Tracking
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Employee</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>09:00 AM</TableCell>
                  <TableCell>05:30 PM</TableCell>
                  <TableCell>Present</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>09:15 AM</TableCell>
                  <TableCell>06:00 PM</TableCell>
                  <TableCell>Present</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  )
}
