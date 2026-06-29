import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const inp = {
  width: '100%', padding: '0.6rem 0.75rem',
  background: '#fff', border: '0.5px solid #e0d080',
  borderRadius: 8, fontSize: 13, color: '#1a1400',
  outline: 'none', fontFamily: 'inherit'
}

export default function Signup() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (form.password.length < 8) return setError('Password must be at least 8 characters')
    setError('')
    setLoading(true)
    try {
      const raw = sessionStorage.getItem('guestMessages')
      const guestMessages = raw ? JSON.parse(raw) : []
      await register(form.email, form.password, form.fullName, guestMessages)
      sessionStorage.removeItem('guestMessages')
      navigate('/chat')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fdfcf5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 340 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 500, color: '#1a1400', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Coder<span style={{ color: '#9a7a00' }}>X</span>
          </div>
          <p style={{ fontSize: 13, color: '#9a8040' }}>Create your free account</p>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#7a6830', marginBottom: '0.35rem' }}>Full name</label>
            <input name="fullName" type="text" value={form.fullName} onChange={handle} required style={inp} placeholder="Your name" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#7a6830', marginBottom: '0.35rem' }}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} required style={inp} placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#7a6830', marginBottom: '0.35rem' }}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} required style={inp} placeholder="Min. 8 characters" />
          </div>
          {error && <p style={{ fontSize: 12, color: '#a03020' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            padding: '0.65rem', borderRadius: 8, background: '#f0d840',
            border: 'none', fontSize: 13, fontWeight: 500, color: '#2c1a00',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
            marginTop: '0.25rem'
          }}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#9a8040', marginTop: '1.25rem' }}>
          Have an account?{' '}
          <Link to="/login" style={{ color: '#7a5c00' }}>Sign in</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <button onClick={() => navigate('/')} style={{ fontSize: 11, color: '#c0aa60', background: 'none', border: 'none', cursor: 'pointer' }}>← Back to home</button>
        </p>
      </div>
    </div>
  )
}
