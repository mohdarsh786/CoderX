import { useState, useRef, useEffect } from 'react'

export default function OtpInput({ length = 6, onChange }) {
  const [values, setValues] = useState(Array(length).fill(''))
  const inputs = useRef([])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  const handle = (i, e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...values]
    next[i] = val
    setValues(next)
    onChange(next.join(''))
    if (val && i < length - 1) inputs.current[i + 1]?.focus()
  }

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    const next = [...values]
    pasted.split('').forEach((c, i) => { next[i] = c })
    setValues(next)
    onChange(next.join(''))
    inputs.current[Math.min(pasted.length, length - 1)]?.focus()
    e.preventDefault()
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
      {values.map((v, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={e => handle(i, e)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          style={{
            width: 44, height: 52, textAlign: 'center',
            fontSize: '1.2rem', fontWeight: 500, color: '#1a1400',
            background: '#fff', border: `1.5px solid ${v ? '#d4b800' : '#e0d080'}`,
            borderRadius: 8, outline: 'none', fontFamily: 'inherit',
            transition: 'border-color .15s'
          }}
        />
      ))}
    </div>
  )
}
