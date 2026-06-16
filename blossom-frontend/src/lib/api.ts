import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  try {
    const raw   = localStorage.getItem('blossom-auth')
    const token = raw ? JSON.parse(raw)?.state?.accessToken : null
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {
    // continue without token
  }
  return config
})

// If we get a 401, clear auth and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('blossom-auth')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export default api

export const authApi = {
  register: (data: {
    email: string
    name: string
    password: string
    password2: string
    theme?: string
  }) => api.post('/api/accounts/register/', data),

  login: (data: { email: string; password: string }) =>
    api.post('/api/accounts/login/', data),

  getProfile: () =>
    api.get('/api/accounts/me/'),

  updateOnboarding: (data: {
    date_of_birth?: string
    cycle_length?: number
    last_period_date?: string
    health_conditions?: string[]
    theme?: string
    onboarding_complete?: boolean
  }) => api.patch('/api/accounts/onboarding/', data),

  resendVerification: () =>
    api.post('/api/accounts/resend-verification/'),
}