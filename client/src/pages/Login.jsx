import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { migrateGuestMessagesManually } from '../services/chat.service'
import OtpInput from '../components/auth/OtpInput'

const inp = {
  width: '100%', padding: '0.6rem 0.75rem',
  background: '#fff', border: '0.5px solid #e0d080',
  borderRadius: 8, fontSize: 13, color: '#1a1400',
  outline: 'none', fontFamily: 'inherit'
}

export default function Login() {
  const navigate = useNavigate()
  const { login, verifyOtp, resendOtp } = useAuth()

  const [step, setStep] = useState('credentials') // 'credentials' | 'otp'
  const [form, setForm] = useState({ email: '', password: '' })
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return
    const id = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [countdown])

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submitCredentials = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      if (data.otpRequired) {
        setStep('otp')
        setCountdown(30) // 30s before resend allowed
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const submitOtp = async e => {
    e.preventDefault()
    if (otp.length < 6) return setError('Enter the complete 6-digit code')
    setError('')
    setLoading(true)
    try {
      await verifyOtp(form.email, otp)

      // Migrate guest messages if any exist
      const raw = sessionStorage.getItem('guestMessages')
      if (raw) {
        try {
          const guestMessages = JSON.parse(raw)
          await migrateGuestMessagesManually(guestMessages)
          sessionStorage.removeItem('guestMessages')
        } catch {
          // Migration failure should not block login
          sessionStorage.removeItem('guestMessages')
        }
      }

      navigate('/chat')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code')
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0 || resending) return
    setResending(true)
    setError('')
    try {
      await resendOtp(form.email)
      setCountdown(30)
      setOtp('')
    } catch (err) {
      setError('Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fdfcf5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 340 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#1a1400', marginBottom: '0.4rem' }}>
            Coder<span style={{ color: '#9a7a00' }}>X</span>
          </div>
          <p style={{ fontSize: 13, color: '#9a8040' }}>
            {step === 'credentials' ? 'Sign in to your account' : `Check your email — ${form.email}`}
          </p>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={submitCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#7a6830', marginBottom: '0.35rem' }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handle} required style={inp} placeholder="you@example.com" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#7a6830', marginBottom: '0.35rem' }}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handle} required style={inp} placeholder="••••••••" />
            </div>
            <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
              <Link to="/forgot-password" style={{ fontSize: 11, color: '#b8a060' }}>Forgot password?</Link>
            </div>
            {error && <p style={{ fontSize: 12, color: '#a03020' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{
              padding: '0.65rem', borderRadius: 8, background: '#f0d840',
              border: 'none', fontSize: 13, fontWeight: 500, color: '#2c1a00',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
              marginTop: '0.25rem'
            }}>
              {loading ? 'Sending code...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <OtpInput length={6} onChange={setOtp} />
            {error && <p style={{ fontSize: 12, color: '#a03020', textAlign: 'center' }}>{error}</p>}
            <button type="submit" disabled={loading || otp.length < 6} style={{
              padding: '0.65rem', borderRadius: 8, background: '#f0d840',
              border: 'none', fontSize: 13, fontWeight: 500, color: '#2c1a00',
              cursor: (loading || otp.length < 6) ? 'not-allowed' : 'pointer',
              opacity: (loading || otp.length < 6) ? 0.6 : 1
            }}>
              {loading ? 'Verifying...' : 'Verify code'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resending}
                style={{
                  background: 'none', border: 'none', cursor: countdown > 0 ? 'default' : 'pointer',
                  fontSize: 12, color: countdown > 0 ? '#c0aa60' : '#7a5c00'
                }}
              >
                {countdown > 0 ? `Resend code in ${countdown}s` : resending ? 'Resending...' : 'Resend code'}
              </button>
            </div>
            <button
              type="button"
              onClick={() => { setStep('credentials'); setError(''); setOtp('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#c0aa60', textAlign: 'center' }}
            >
              ← Use a different email
            </button>
          </form>
        )}

        {step === 'credentials' && (
          <>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#9a8040', marginTop: '1.25rem' }}>
              No account?{' '}
              <Link to="/signup" style={{ color: '#7a5c00' }}>Sign up</Link>
            </p>
            <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
              <button onClick={() => navigate('/')} style={{ fontSize: 11, color: '#c0aa60', background: 'none', border: 'none', cursor: 'pointer' }}>← Back to home</button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
