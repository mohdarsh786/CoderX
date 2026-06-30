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
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (form.password.length < 8) return setError('Password must be at least 8 characters')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
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
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handle}
                required
                style={{ ...inp, paddingRight: '2.5rem' }}
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7a6830',
                  padding: '4px',
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#7a6830', marginBottom: '0.35rem' }}>Confirm password</label>
            <div style={{ position: 'relative' }}>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handle}
                required
                style={{ ...inp, paddingRight: '2.5rem' }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(p => !p)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7a6830',
                  padding: '4px',
                }}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
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
