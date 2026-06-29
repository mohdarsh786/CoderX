import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

function ProtectedRoute({ children }) {
  const { isAuth } = useAuth()
  return isAuth ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { isAuth, tryRefresh } = useAuth()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // On cold load, attempt silent refresh using the HTTP-only cookie
    tryRefresh().finally(() => setReady(true))
  }, [])

  if (!ready) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

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
