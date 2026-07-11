import { useAuthStore } from '../store/authSlice'
import { loginUser, registerUser, logoutUser, refreshToken, verifyOtpCode, resendOtpCode } from '../services/auth.service'

export const useAuth = () => {
  const { user, accessToken, isAuth, isLoading, setAuth, setAccessToken, logout, setLoading } = useAuthStore()

  const login = async (email, password) => {
    const data = await loginUser(email, password)
    // Do NOT call setAuth here — tokens not issued yet
    return data // { otpRequired: true, email }
  }

  const verifyOtp = async (email, otp) => {
    const data = await verifyOtpCode(email, otp)
    setAuth(data.user, data.accessToken)
    return data
  }

  const resendOtp = async (email) => {
    return resendOtpCode(email)
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
    setLoading(true)
    try {
      const data = await refreshToken()
      setAuth(data.user, data.accessToken)
      return true
    } catch (err) {
      if (err.response?.status === 401) {
        logout()
      } else {
        setLoading(false)
      }
      return false
    }
  }

  return { user, accessToken, isAuth, isLoading, login, register, signout, tryRefresh, verifyOtp, resendOtp }
}
