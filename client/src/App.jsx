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
  const { isAuth, isLoading, tryRefresh } = useAuth()
  const didInit = useRef(false)

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true
      tryRefresh()
    }
  }, [])

  if (isLoading) return (
    <div style={{
      minHeight: '100vh', background: '#fdfcf5',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: 18, height: 18,
        border: '2px solid #e0d080',
        borderTopColor: '#d4b800',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

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
