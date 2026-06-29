import { useAuthStore } from '../store/authSlice'
import { loginUser, registerUser, logoutUser, refreshToken } from '../services/auth.service'

export const useAuth = () => {
  const { user, accessToken, isAuth, setAuth, setAccessToken, logout } = useAuthStore()

  const login = async (email, password) => {
    const data = await loginUser(email, password)
    setAuth(data.user, data.accessToken)
    return data
  }

  const register = async (email, password, fullName, guestMessages = []) => {
    const data = await registerUser(email, password, fullName, guestMessages)
    setAuth(data.user, data.accessToken)
    return data
  }

  const signout = async () => {
    try { await logoutUser() } catch {}
    logout()
  }

  const tryRefresh = async () => {
    try {
      const data = await refreshToken()
      setAuth(data.user, data.accessToken)
      return true
    } catch {
      logout()
      return false
    }
  }

  return { user, accessToken, isAuth, login, register, signout, tryRefresh }
}
