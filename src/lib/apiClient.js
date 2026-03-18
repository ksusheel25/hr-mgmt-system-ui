import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
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

