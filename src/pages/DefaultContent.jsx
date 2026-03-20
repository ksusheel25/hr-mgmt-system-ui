import { Card, CardContent, Typography } from '@mui/material'

export default function DefaultContent() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Content Coming Soon</Typography>
        <Typography variant="body2" color="textSecondary">
          This page is under development
        </Typography>
      </CardContent>
    </Card>
  )
}
