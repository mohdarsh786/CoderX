import api from './api'

export const loginUser = async (email, password) => {
  const { data } = await api.post('/api/auth/login', { email, password })
  return data
}

export const verifyOtpCode = async (email, otp) => {
  const { data } = await api.post('/api/auth/verify-otp', { email, otp })
  return data
}

export const resendOtpCode = async (email) => {
  const { data } = await api.post('/api/auth/resend-otp', { email })
  return data
}

export const registerUser = async (email, password, fullName, guestMessages = []) => {
  const { data } = await api.post('/api/auth/register', {
    email, password, fullName, guestMessages,
  })
  return data
}

let refreshPromise = null

export const refreshToken = async () => {
  if (refreshPromise) return refreshPromise
  
  refreshPromise = api.post('/api/auth/refresh')
    .then(res => res.data)
    .finally(() => { refreshPromise = null })
    
  return refreshPromise
}

export const logoutUser = async () => {
  await api.post('/api/auth/logout')
}

export const forgotPasswordRequest = async (email) => {
  const { data } = await api.post('/api/auth/forgot-password', { email })
  return data
}

export const resetPasswordRequest = async (email, otp, newPassword) => {
  const { data } = await api.post('/api/auth/reset-password', { email, otp, newPassword })
  return data
}
