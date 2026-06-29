import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`,
  withCredentials: true, // sends the refresh token cookie automatically
})

// Attach access token to every request
api.interceptors.request.use(config => {
  const token = useAuthStore?.getState?.()?.accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
let refreshing = false
let queue = []

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    const isAuthRoute = original.url?.includes('/auth/login') || original.url?.includes('/auth/register') || original.url?.includes('/auth/refresh')
    if (err.response?.status === 401 && !original._retry && !isAuthRoute) {
      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }
      original._retry = true
      refreshing = true
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const newToken = data.accessToken
        useAuthStore.getState().setAccessToken(newToken)
        queue.forEach(p => p.resolve(newToken))
        queue = []
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        queue.forEach(p => p.reject())
        queue = []
        useAuthStore.getState().logout()
        window.location.href = '/login'
      } finally {
        refreshing = false
      }
    }
    return Promise.reject(err)
  }
)

// Late import to avoid circular dependency
import { useAuthStore } from '../store/authSlice'

export default api
