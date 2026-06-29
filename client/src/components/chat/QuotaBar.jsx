export default function QuotaBar({ remaining, countdown }) {
  // Only show when 3 or fewer messages remain (≤20% of 15)
  if (!countdown && remaining > 3) return null

  if (countdown) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
      padding: '0.32rem 1rem', background: '#fde8e0',
      borderBottom: '0.5px solid #f0b8a0', fontSize: 11, color: '#8a2020', fontWeight: 500
    }}>
      ⏱ Limit reached — resets in {countdown}
    </div>
  )

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
      padding: '0.32rem 1rem', background: '#fef3c0',
      borderBottom: '0.5px solid #e8d060', fontSize: 11, color: '#7a5c00', fontWeight: 500
    }}>
      ⚠ {remaining} message{remaining !== 1 ? 's' : ''} remaining · resets in {countdown || '—'}
    </div>
  )
}
