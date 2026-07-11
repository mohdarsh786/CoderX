import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { forgotPasswordRequest, resetPasswordRequest } from '../services/auth.service'
import OtpInput from '../components/auth/OtpInput'

const inp = {
  width: '100%', padding: '0.6rem 0.75rem',
  background: '#fff', border: '0.5px solid #e0d080',
  borderRadius: 8, fontSize: 13, color: '#1a1400',
  outline: 'none', fontFamily: 'inherit'
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // 'email' | 'otp' | 'success'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return
    const id = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [countdown])

  const submitEmail = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPasswordRequest(email)
      setStep('otp')
      setCountdown(30)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const submitReset = async e => {
    e.preventDefault()
    if (otp.length < 6) return setError('Enter the complete 6-digit code')
    if (newPassword.length < 8) return setError('Password must be at least 8 characters')
    if (newPassword !== confirmPassword)
      return setError('Passwords do not match')
    setError('')
    setLoading(true)
    try {
      await resetPasswordRequest(email, otp, newPassword)
      setStep('success')
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
      setOtp('')
      setConfirmPassword('')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    setError('')
    try {
      await forgotPasswordRequest(email)
      setCountdown(30)
      setOtp('')
    } catch {
      setError('Failed to resend code')
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
            {step === 'email' && 'Reset your password'}
            {step === 'otp' && `Check your email — ${email}`}
            {step === 'success' && 'Password updated'}
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={submitEmail} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#7a6830', marginBottom: '0.35rem' }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required style={inp} placeholder="you@example.com"
              />
            </div>
            {error && <p style={{ fontSize: 12, color: '#a03020' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{
              padding: '0.65rem', borderRadius: 8, background: '#f0d840',
              border: 'none', fontSize: 13, fontWeight: 500, color: '#2c1a00',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1
            }}>
              {loading ? 'Sending code...' : 'Send reset code'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#9a8040' }}>
              <Link to="/login" style={{ color: '#7a5c00' }}>← Back to sign in</Link>
            </p>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={submitReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <OtpInput length={6} onChange={setOtp} />
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#7a6830', marginBottom: '0.35rem' }}>New password</label>
              <input
                type="password" value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required style={inp} placeholder="Min. 8 characters"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#7a6830', marginBottom: '0.35rem' }}>Confirm new password</label>
              <input
                type="password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required style={inp} placeholder="Re-enter new password"
              />
            </div>
            {error && <p style={{ fontSize: 12, color: '#a03020', textAlign: 'center' }}>{error}</p>}
            <button type="submit" disabled={loading || otp.length < 6} style={{
              padding: '0.65rem', borderRadius: 8, background: '#f0d840',
              border: 'none', fontSize: 13, fontWeight: 500, color: '#2c1a00',
              cursor: (loading || otp.length < 6) ? 'not-allowed' : 'pointer',
              opacity: (loading || otp.length < 6) ? 0.6 : 1
            }}>
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <button type="button" onClick={handleResend} disabled={countdown > 0} style={{
                background: 'none', border: 'none', fontSize: 12,
                color: countdown > 0 ? '#c0aa60' : '#7a5c00', cursor: countdown > 0 ? 'default' : 'pointer'
              }}>
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
              </button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: 32 }}>✓</div>
            <p style={{ fontSize: 13, color: '#5c4a00' }}>Your password has been reset. Sign in with your new password.</p>
            <button onClick={() => navigate('/login')} style={{
              padding: '0.65rem', borderRadius: 8, background: '#f0d840',
              border: 'none', fontSize: 13, fontWeight: 500, color: '#2c1a00', cursor: 'pointer'
            }}>
              Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
