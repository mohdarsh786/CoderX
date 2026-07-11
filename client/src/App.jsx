import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import NotFound from './pages/NotFound'

export default function App() {
  const { isAuth, tryRefresh } = useAuth()
  const didInit = useRef(false)

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true
      tryRefresh()
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuth ? <Navigate to="/chat" replace /> : <Landing />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={isAuth ? <Navigate to="/chat" replace /> : <Login />} />
        <Route path="/signup" element={isAuth ? <Navigate to="/chat" replace /> : <Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
