import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh', background: '#fdfcf5',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem'
    }}>
      <div style={{ fontSize: '3rem', fontWeight: 400, color: '#e0d080', marginBottom: '1rem' }}>404</div>
      <p style={{ fontSize: 14, color: '#9a8040', marginBottom: '1.5rem' }}>This page doesn't exist.</p>
      <button onClick={() => navigate('/')} style={{
        padding: '0.6rem 1.25rem', borderRadius: 7,
        background: '#f0d840', border: 'none',
        fontSize: 13, fontWeight: 500, color: '#2c1a00', cursor: 'pointer'
      }}>Go home</button>
    </div>
  )
}
