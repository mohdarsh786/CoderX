import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

export default function App() {
  const { isAuth, tryRefresh } = useAuth()

  useEffect(() => {
    tryRefresh()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={isAuth ? <Navigate to="/chat" replace /> : <Login />} />
        <Route path="/signup" element={isAuth ? <Navigate to="/chat" replace /> : <Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
