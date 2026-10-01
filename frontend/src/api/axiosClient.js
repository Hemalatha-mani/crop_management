import axios from 'axios'

// Falls back to the local backend so the app still works even if .env is missing.
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // AI inference on the first request can be slow (model loading)
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('agriguard_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth endpoints return 401 for "wrong password" - that must NOT log the user out
// or reload the page (otherwise the error message would vanish instantly).
const isAuthEndpoint = (url = '') => url.includes('/api/auth/login') || url.includes('/api/auth/register')

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401 && !isAuthEndpoint(error.config?.url)) {
      localStorage.removeItem('agriguard_token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

/** Turns any axios error into a short, human-readable message. */
export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (!err.response) {
    return 'Cannot reach the server. Make sure the backend is running (http://localhost:8000).'
  }
  const detail = err.response.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail.length) {
    // FastAPI validation errors: [{ loc, msg, ... }]
    return detail.map((d) => d.msg?.replace(/^Value error, /, '')).filter(Boolean).join('. ')
  }
  return fallback
}

export default axiosClient
