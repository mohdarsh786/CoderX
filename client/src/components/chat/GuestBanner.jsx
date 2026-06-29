export default function GuestBanner({ remaining }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
      padding: '0.32rem 1rem', background: '#fef9e0',
      borderBottom: '0.5px solid #ede8c0', fontSize: 11, color: '#9a7a00'
    }}>
      {remaining} free message{remaining !== 1 ? 's' : ''} remaining — sign in to continue
    </div>
  )
}
