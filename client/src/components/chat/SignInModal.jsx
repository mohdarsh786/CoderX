import { useNavigate } from 'react-router-dom'

export default function SignInModal({ onDismiss }) {
  const navigate = useNavigate()
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(250,246,210,0.72)',
      backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, padding: '1rem'
    }}>
      <div style={{
        background: '#fdfcf5', border: '0.5px solid #e8d880',
        borderRadius: 14, padding: '2rem 1.75rem',
        width: '100%', maxWidth: 300, position: 'relative', textAlign: 'center'
      }}>
        <button onClick={onDismiss} style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          background: 'none', border: 'none', fontSize: 16,
          color: '#b8a060', cursor: 'pointer', lineHeight: 1
        }}>✕</button>
        <div style={{ fontSize: '1.05rem', fontWeight: 400, color: '#1a1400', marginBottom: '1.4rem' }}>
          Coder<span style={{ color: '#9a7a00' }}>X</span>
        </div>
        <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#1a1400', marginBottom: '0.4rem', lineHeight: 1.35 }}>
          You've used your 3 free messages
        </div>
        <p style={{ fontSize: 12, color: '#8a7030', lineHeight: 1.55, marginBottom: '1.4rem' }}>
          Create a free account to get more messages.
        </p>
        <button onClick={() => navigate('/signup')} style={{
          width: '100%', padding: '0.58rem', borderRadius: 7,
          background: '#f0d840', border: 'none', fontSize: 13,
          fontWeight: 500, color: '#2c1a00', cursor: 'pointer', marginBottom: '0.5rem'
        }}>Create free account</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.45rem 0', fontSize: 11, color: '#c0aa60' }}>
          <div style={{ flex: 1, height: '0.5px', background: '#ede8c0' }} />
          or
          <div style={{ flex: 1, height: '0.5px', background: '#ede8c0' }} />
        </div>
        <button onClick={() => navigate('/login')} style={{
          width: '100%', padding: '0.58rem', borderRadius: 7,
          background: 'transparent', border: '0.5px solid #d4b800',
          fontSize: 13, color: '#5c4a00', cursor: 'pointer'
        }}>Sign in</button>
      </div>
    </div>
  )
}
