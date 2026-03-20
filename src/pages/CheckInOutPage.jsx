import { Box, Grid, Paper } from '@mui/material'
import CheckInOutCard from '../components/common/CheckInOutCard'

const Item = ({ children }) => (
  <Paper sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
    {children}
  </Paper>
)

function CheckInOutPage() {
  return (
    <Box>
      <CheckInOutCard />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Item>1</Item>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Item>2</Item>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Item>3</Item>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Item>4</Item>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CheckInOutPage
