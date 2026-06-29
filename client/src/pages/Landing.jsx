import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#fdfcf5' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.1rem 2.5rem', borderBottom: '0.5px solid #ede8c0',
        background: '#fdfcf5'
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#1a1400', letterSpacing: '-0.01em' }}>
          Coder<span style={{ color: '#9a7a00' }}>X</span>
        </span>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button onClick={() => navigate('/login')} style={{
            fontSize: 14.3, color: '#5c4a00', background: 'transparent',
            border: '0.5px solid #d4b800', borderRadius: 6,
            padding: '0.3rem 0.8rem', cursor: 'pointer'
          }}>Sign in</button>
          <button onClick={() => navigate('/signup')} style={{
            fontSize: 14.3, color: '#2c1a00', background: '#f0d840',
            border: 'none', borderRadius: 6,
            padding: '0.3rem 0.8rem', fontWeight: 500, cursor: 'pointer'
          }}>Get started</button>
        </div>
      </nav>

      <div style={{ padding: '5rem 2.5rem 5rem', background: '#fdfcf5', flex: 1 }}>
        <h1 style={{
          fontSize: '3.54rem', fontWeight: 400, color: '#1a1400',
          lineHeight: 1.18, maxWidth: 520, letterSpacing: '-0.02em', marginBottom: '1.25rem'
        }}>
          Code faster.<br />
          <em style={{ fontStyle: 'italic', color: '#9a7a00' }}>Think clearer.</em>
        </h1>
        <p style={{
          fontSize: '1.1rem', color: '#7a6830', maxWidth: 400,
          lineHeight: 1.65, marginBottom: '2.5rem', fontWeight: 400
        }}>
          An AI coding assistant that generates, debugs, and explains code — in plain conversation.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/chat')} style={{
            padding: '0.65rem 1.5rem', borderRadius: 7, background: '#f0d840',
            border: 'none', fontSize: 15.4, fontWeight: 500, color: '#2c1a00', cursor: 'pointer'
          }}>Try it free</button>
          <button onClick={() => navigate('/signup')} style={{
            padding: '0.65rem 1.5rem', borderRadius: 7, background: 'transparent',
            border: '0.5px solid #d4b800', fontSize: 15.4, color: '#5c4a00', cursor: 'pointer'
          }}>Create account</button>
        </div>
      </div>

      <div style={{ borderTop: '0.5px solid #e8d880', background: '#faf8ec' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 2.5rem'
        }}>
          <div style={{ fontSize: 12, color: '#9a8040', lineHeight: 1.5 }}>
            An AI assistant built for developers.<br />Free to start, no setup required.
          </div>
          <div style={{ display: 'flex' }}>
            {['Generate', 'Debug', 'Optimize', 'Document'].map((cap, i, arr) => (
              <div key={cap} style={{
                padding: '0.35rem 1rem', fontSize: 11, fontWeight: 500,
                color: '#7a5c00', letterSpacing: '0.02em',
                borderRight: i < arr.length - 1 ? '0.5px solid #e0cc80' : 'none'
              }}>{cap}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
