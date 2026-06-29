import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const inp = {
  width: '100%', padding: '0.6rem 0.75rem',
  background: '#fff', border: '0.5px solid #e0d080',
  borderRadius: 8, fontSize: 13, color: '#1a1400',
  outline: 'none', fontFamily: 'inherit'
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/chat')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fdfcf5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 340 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 500, color: '#1a1400', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Coder<span style={{ color: '#9a7a00' }}>X</span>
          </div>
          <p style={{ fontSize: 13, color: '#9a8040' }}>Sign in to your account</p>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#7a6830', marginBottom: '0.35rem' }}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} required style={inp} placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#7a6830', marginBottom: '0.35rem' }}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} required style={inp} placeholder="••••••••" />
          </div>
          {error && <p style={{ fontSize: 12, color: '#a03020' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            padding: '0.65rem', borderRadius: 8, background: '#f0d840',
            border: 'none', fontSize: 13, fontWeight: 500, color: '#2c1a00',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
            marginTop: '0.25rem'
          }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#9a8040', marginTop: '1.25rem' }}>
          No account?{' '}
          <Link to="/signup" style={{ color: '#7a5c00' }}>Sign up</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <button onClick={() => navigate('/')} style={{ fontSize: 11, color: '#c0aa60', background: 'none', border: 'none', cursor: 'pointer' }}>← Back to home</button>
        </p>
      </div>
    </div>
  )
}
