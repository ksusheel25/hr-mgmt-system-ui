const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

let authToken = localStorage.getItem('authToken');
let tenantId = localStorage.getItem('tenantId');

const setAuthToken = (token, tenant) => {
  authToken = token;
  tenantId = tenant;
  if (token) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('tenantId', tenant);
  }
};

const clearAuthToken = () => {
  authToken = null;
  tenantId = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('tenantId');
};

const getHeaders = (isFormData = false) => {
  const headers = {
    'X-Tenant-ID': tenantId,
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }
    throw new Error(`HTTP Error: ${response.status}`);
  }
  return response.json();
};

// AUTH APIs
export const authAPI = {
  login: async (tenantId, username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, username, password }),
    });
    const data = await handleResponse(response);
    const token =
      data?.token ??
      data?.accessToken ??
      data?.jwt ??
      data?.authToken;
    if (token) {
      setAuthToken(token, tenantId);
    } else {
      console.warn('Login response did not include a token field.');
    }
    return data;
  },
};

// COMPANY APIs
export const companyAPI = {
  create: async (companyData) => {
    const response = await fetch(`${API_BASE_URL}/admin/companies`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(companyData),
    });
    return handleResponse(response);
  },

  getById: async (companyId) => {
    const response = await fetch(`${API_BASE_URL}/admin/companies/${companyId}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  update: async (companyId, companyData) => {
    const response = await fetch(`${API_BASE_URL}/admin/companies/${companyId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(companyData),
    });
    return handleResponse(response);
  },
};

// EMPLOYEE APIs
export const employeeAPI = {
  create: async (employeeData) => {
    const response = await fetch(`${API_BASE_URL}/admin/employees`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(employeeData),
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/employees/me`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  list: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/admin/employees?${params}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  update: async (employeeId, employeeData) => {
    const response = await fetch(`${API_BASE_URL}/admin/employees/${employeeId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(employeeData),
    });
    return handleResponse(response);
  },

  deactivate: async (employeeId) => {
    const response = await fetch(`${API_BASE_URL}/admin/employees/${employeeId}/deactivate`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  adjustWfhBalance: async (employeeId, delta) => {
    const response = await fetch(`${API_BASE_URL}/admin/employees/${employeeId}/wfh-balance`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ delta }),
    });
    return handleResponse(response);
  },

  getWfhBalance: async (employeeId) => {
    const response = await fetch(`${API_BASE_URL}/admin/employees/${employeeId}/wfh-balance`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// SHIFT APIs
export const shiftAPI = {
  create: async (shiftData) => {
    const response = await fetch(`${API_BASE_URL}/admin/shifts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(shiftData),
    });
    return handleResponse(response);
  },

  list: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/shifts`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  update: async (shiftId, shiftData) => {
    const response = await fetch(`${API_BASE_URL}/admin/shifts/${shiftId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(shiftData),
    });
    return handleResponse(response);
  },

  delete: async (shiftId) => {
    const response = await fetch(`${API_BASE_URL}/admin/shifts/${shiftId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// WORK POLICY APIs
export const workPolicyAPI = {
  getAdmin: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/work-policy`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateAdmin: async (policyData) => {
    const response = await fetch(`${API_BASE_URL}/admin/work-policy`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(policyData),
    });
    return handleResponse(response);
  },

  getSelf: async () => {
    const response = await fetch(`${API_BASE_URL}/work-policy`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// ATTENDANCE APIs
export const attendanceAPI = {
  checkIn: async (employeeId) => {
    const response = await fetch(`${API_BASE_URL}/attendance/check-in`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ employeeId }),
    });
    return handleResponse(response);
  },

  checkOut: async (employeeId) => {
    const response = await fetch(`${API_BASE_URL}/attendance/check-out`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ employeeId }),
    });
    return handleResponse(response);
  },

  getMe: async (fromDate, toDate) => {
    const params = new URLSearchParams({ from: fromDate, to: toDate });
    const response = await fetch(`${API_BASE_URL}/attendance/me?${params}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// BIOMETRIC APIs
export const biometricAPI = {
  receiveEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/biometric/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  receivePunch: async (punchData) => {
    const response = await fetch(`${API_BASE_URL}/biometric/punch`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(punchData),
    });
    return handleResponse(response);
  },
};

// HOLIDAY APIs
export const holidayAPI = {
  create: async (holidayData) => {
    const response = await fetch(`${API_BASE_URL}/admin/holidays`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(holidayData),
    });
    return handleResponse(response);
  },

  listAdmin: async (fromDate, toDate) => {
    const params = new URLSearchParams({ from: fromDate, to: toDate });
    const response = await fetch(`${API_BASE_URL}/admin/holidays?${params}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  update: async (holidayId, holidayData) => {
    const response = await fetch(`${API_BASE_URL}/admin/holidays/${holidayId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(holidayData),
    });
    return handleResponse(response);
  },

  delete: async (holidayId) => {
    const response = await fetch(`${API_BASE_URL}/admin/holidays/${holidayId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  listSelf: async (fromDate, toDate) => {
    const params = new URLSearchParams({ from: fromDate, to: toDate });
    const response = await fetch(`${API_BASE_URL}/holidays?${params}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// LEAVE TYPE APIs
export const leaveTypeAPI = {
  create: async (leaveTypeData) => {
    const response = await fetch(`${API_BASE_URL}/admin/leave-types`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(leaveTypeData),
    });
    return handleResponse(response);
  },

  list: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/leave-types`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  update: async (leaveTypeId, leaveTypeData) => {
    const response = await fetch(`${API_BASE_URL}/admin/leave-types/${leaveTypeId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(leaveTypeData),
    });
    return handleResponse(response);
  },

  delete: async (leaveTypeId) => {
    const response = await fetch(`${API_BASE_URL}/admin/leave-types/${leaveTypeId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// LEAVE BALANCE APIs
export const leaveBalanceAPI = {
  createOrUpdate: async (balanceData) => {
    const response = await fetch(`${API_BASE_URL}/admin/leave-balances`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(balanceData),
    });
    return handleResponse(response);
  },

  adjust: async (adjustData) => {
    const response = await fetch(`${API_BASE_URL}/admin/leave-balances/adjust`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(adjustData),
    });
    return handleResponse(response);
  },

  list: async (employeeId) => {
    const params = new URLSearchParams({ employeeId });
    const response = await fetch(`${API_BASE_URL}/admin/leave-balances?${params}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  update: async (leaveBalanceId, balanceData) => {
    const response = await fetch(`${API_BASE_URL}/admin/leave-balances/${leaveBalanceId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(balanceData),
    });
    return handleResponse(response);
  },

  delete: async (leaveBalanceId) => {
    const response = await fetch(`${API_BASE_URL}/admin/leave-balances/${leaveBalanceId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/leave-balances/me`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// LEAVE WORKFLOW APIs
export const leaveAPI = {
  apply: async (leaveData) => {
    const response = await fetch(`${API_BASE_URL}/leave/apply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(leaveData),
    });
    return handleResponse(response);
  },

  getMy: async () => {
    const response = await fetch(`${API_BASE_URL}/leave/my`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getPending: async () => {
    const response = await fetch(`${API_BASE_URL}/leave/pending`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  approve: async (leaveRequestId, remarks) => {
    const response = await fetch(`${API_BASE_URL}/leave/${leaveRequestId}/approve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ remarks }),
    });
    return handleResponse(response);
  },

  reject: async (leaveRequestId, remarks) => {
    const response = await fetch(`${API_BASE_URL}/leave/${leaveRequestId}/reject`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ remarks }),
    });
    return handleResponse(response);
  },

  // Admin leave APIs
  adminCreate: async (leaveData) => {
    const response = await fetch(`${API_BASE_URL}/admin/leaves`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(leaveData),
    });
    return handleResponse(response);
  },

  adminList: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/leaves`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  adminApprove: async (leaveRequestId) => {
    const response = await fetch(`${API_BASE_URL}/admin/leaves/${leaveRequestId}/approve`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  adminReject: async (leaveRequestId) => {
    const response = await fetch(`${API_BASE_URL}/admin/leaves/${leaveRequestId}/reject`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  adminCancel: async (leaveRequestId) => {
    const response = await fetch(`${API_BASE_URL}/admin/leaves/${leaveRequestId}/cancel`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// NOTIFICATION APIs
export const notificationAPI = {
  getMy: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/my`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  markAsRead: async (notificationId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// BULK UPLOAD APIs
export const bulkUploadAPI = {
  uploadEmployees: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/admin/users/bulk-upload`, {
      method: 'POST',
      headers: {
        'X-Tenant-ID': tenantId,
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },
};

export { setAuthToken, clearAuthToken, getHeaders };
