import api from './api'

export const loginUser = async (email, password) => {
  const { data } = await api.post('/api/auth/login', { email, password })
  return data
}

export const registerUser = async (email, password, fullName, guestMessages = []) => {
  const { data } = await api.post('/api/auth/register', {
    email, password, fullName, guestMessages,
  })
  return data
}

export const refreshToken = async () => {
  const { data } = await api.post('/api/auth/refresh')
  return data
}

export const logoutUser = async () => {
  await api.post('/api/auth/logout')
}
