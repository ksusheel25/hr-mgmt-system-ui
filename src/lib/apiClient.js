import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
})

function readStoredToken() {
  try {
    const raw = window.sessionStorage.getItem('hrms-auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.token || null
  } catch {
    return null
  }
}

apiClient.interceptors.request.use((config) => {
  // Always attach latest token from storage (covers refresh / multi-tab cases).
  const token =
    config?.headers?.Authorization?.toString()?.replace(/^Bearer\s+/i, '') || readStoredToken()
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Let calling code handle, but tag it.
      error.isAuthError = true
    }
    return Promise.reject(error)
  },
)

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common.Authorization
  }
}

export { apiClient }

