import { apiClient } from './apiClient'

export const AuthApi = {
  login: async ({ tenantId, username, password }) => {
    const res = await apiClient.post('/auth/login', { tenantId, username, password })
    return res.data
  },
}

export const EmployeesApi = {
  list: async () => {
    const res = await apiClient.get('/v1/admin/employees')
    return res.data || []
  },
  create: async (payload) => {
    const res = await apiClient.post('/v1/admin/employees', payload)
    return res.data
  },
  update: async (id, payload) => {
    const res = await apiClient.put(`/v1/admin/employees/${id}`, payload)
    return res.data
  },
  deactivate: async (id) => {
    const res = await apiClient.patch(`/v1/admin/employees/${id}/deactivate`)
    return res.data
  },
}

export const LeaveApi = {
  apply: async (payload) => {
    const res = await apiClient.post('/leave/apply', payload)
    return res.data
  },
  my: async () => {
    const res = await apiClient.get('/leave/my')
    return res.data || []
  },
  pending: async () => {
    const res = await apiClient.get('/leave/pending')
    return res.data || []
  },
  approve: async (leaveRequestId, remarks = '') => {
    const res = await apiClient.post(`/leave/${leaveRequestId}/approve`, { remarks })
    return res.data
  },
  reject: async (leaveRequestId, remarks = '') => {
    const res = await apiClient.post(`/leave/${leaveRequestId}/reject`, { remarks })
    return res.data
  },
  adminList: async () => {
    const res = await apiClient.get('/v1/admin/leaves')
    return res.data || []
  },
  adminCreate: async (payload) => {
    const res = await apiClient.post('/v1/admin/leaves', payload)
    return res.data
  },
  adminApprove: async (leaveRequestId) => {
    const res = await apiClient.patch(`/v1/admin/leaves/${leaveRequestId}/approve`)
    return res.data
  },
  adminReject: async (leaveRequestId) => {
    const res = await apiClient.patch(`/v1/admin/leaves/${leaveRequestId}/reject`)
    return res.data
  },
  adminCancel: async (leaveRequestId) => {
    const res = await apiClient.patch(`/v1/admin/leaves/${leaveRequestId}/cancel`)
    return res.data
  },
}

