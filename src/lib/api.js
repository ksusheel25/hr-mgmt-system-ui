import { apiClient } from './apiClient'

function asList(payload) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []
  // Common wrappers: { data: [] }, { items: [] }, { content: [] }, { results: [] }, etc.
  for (const key of [
    'data',
    'items',
    'content',
    'results',
    'result',
    'records',
    'rows',
    'list',
    'balances',
    'leaveBalances',
  ]) {
    if (Array.isArray(payload[key])) return payload[key]
  }
  // Some endpoints return a single object for a "me" query; treat it as a list-of-one.
  // (Used only by list-style API wrappers below.)
  if (payload.id || payload.date || payload.employeeId) return [payload]
  return []
}

export const AuthApi = {
  login: async ({ tenantId, username, password }) => {
    const res = await apiClient.post('/api/v1/auth/login', { tenantId, username, password })
    return res.data
  },
}

export const EmployeesApi = {
  me: async () => {
    const res = await apiClient.get('/api/v1/employees/me')
    return res.data
  },
  list: async () => {
    const res = await apiClient.get('/api/v1/admin/employees')
    return asList(res.data)
  },
  create: async (payload) => {
    const res = await apiClient.post('/api/v1/admin/employees', payload)
    return res.data
  },
  update: async (id, payload) => {
    const res = await apiClient.put(`/api/v1/admin/employees/${id}`, payload)
    return res.data
  },
  deactivate: async (id) => {
    const res = await apiClient.patch(`/api/v1/admin/employees/${id}/deactivate`)
    return res.data
  },
}

export const LeaveApi = {
  apply: async (payload) => {
    const res = await apiClient.post('/api/v1/leave/apply', payload)
    return res.data
  },
  my: async () => {
    const res = await apiClient.get('/api/v1/leave/my')
    return asList(res.data)
  },
  pending: async () => {
    const res = await apiClient.get('/api/v1/leave/pending')
    return asList(res.data)
  },
  approve: async (leaveRequestId, remarks = '') => {
    const res = await apiClient.post(`/api/v1/leave/${leaveRequestId}/approve`, { remarks })
    return res.data
  },
  reject: async (leaveRequestId, remarks = '') => {
    const res = await apiClient.post(`/api/v1/leave/${leaveRequestId}/reject`, { remarks })
    return res.data
  },
  adminList: async () => {
    const res = await apiClient.get('/api/v1/admin/leaves')
    return asList(res.data)
  },
  adminCreate: async (payload) => {
    const res = await apiClient.post('/api/v1/admin/leaves', payload)
    return res.data
  },
  adminApprove: async (leaveRequestId) => {
    const res = await apiClient.patch(`/api/v1/admin/leaves/${leaveRequestId}/approve`)
    return res.data
  },
  adminReject: async (leaveRequestId) => {
    const res = await apiClient.patch(`/api/v1/admin/leaves/${leaveRequestId}/reject`)
    return res.data
  },
  adminCancel: async (leaveRequestId) => {
    const res = await apiClient.patch(`/api/v1/admin/leaves/${leaveRequestId}/cancel`)
    return res.data
  },
}

export const LeaveBalancesApi = {
  me: async () => {
    const res = await apiClient.get('/api/v1/leave-balances/me')
    return asList(res.data)
  },
  listByEmployee: async ({ employeeId }) => {
    const res = await apiClient.get('/api/v1/admin/leave-balances', { params: { employeeId } })
    return asList(res.data)
  },
}

export const LeaveTypesApi = {
  list: async () => {
    // Prefer employee-accessible endpoint if available; fallback to admin route.
    try {
      const res = await apiClient.get('/api/v1/leave-types')
      return asList(res.data)
    } catch {
      const res = await apiClient.get('/api/v1/admin/leave-types')
      return asList(res.data)
    }
  },
}

export const AttendanceApi = {
  me: async ({ from, to }) => {
    const res = await apiClient.get('/api/v1/attendance/me', { params: { from, to } })
    return asList(res.data)
  },
  checkIn: async ({ employeeId }) => {
    const res = await apiClient.post('/api/v1/attendance/check-in', { employeeId })
    return res.data
  },
  checkOut: async ({ employeeId }) => {
    const res = await apiClient.post('/api/v1/attendance/check-out', { employeeId })
    return res.data
  },
}

export const HolidaysApi = {
  list: async ({ from, to }) => {
    // Employee-accessible endpoint
    const res = await apiClient.get('/api/v1/holidays', { params: { from, to } })
    return asList(res.data)
  },
  adminList: async ({ from, to }) => {
    const res = await apiClient.get('/api/v1/admin/holidays', { params: { from, to } })
    return asList(res.data)
  },
}

