export const leaveTypes = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Work From Home']

export const leaveStatuses = ['Pending', 'Approved', 'Rejected']

export const leaveSeed = [
  {
    id: 'LV-9001',
    employeeId: 'EMP-1005',
    employeeName: 'Sneha Iyer',
    type: 'Sick Leave',
    from: '2026-03-14',
    to: '2026-03-16',
    days: 3,
    reason: 'Fever and rest',
    status: 'Approved',
    appliedAt: '2026-03-12T10:20:00Z',
  },
  {
    id: 'LV-9002',
    employeeId: 'EMP-1012',
    employeeName: 'Sahil Gupta',
    type: 'Casual Leave',
    from: '2026-03-18',
    to: '2026-03-18',
    days: 1,
    reason: 'Personal errand',
    status: 'Pending',
    appliedAt: '2026-03-16T07:10:00Z',
  },
  {
    id: 'LV-9003',
    employeeId: 'EMP-1004',
    employeeName: 'Karthik R',
    type: 'Work From Home',
    from: '2026-03-20',
    to: '2026-03-20',
    days: 1,
    reason: 'Home maintenance',
    status: 'Rejected',
    appliedAt: '2026-03-15T12:45:00Z',
  },
]

