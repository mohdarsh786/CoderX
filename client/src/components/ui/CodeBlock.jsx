import { useEffect, useRef, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-bash'

export default function CodeBlock({ content }) {
  const ref = useRef(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (ref.current) Prism.highlightAllUnder(ref.current)
  }, [content])

  const copy = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (typeof content === 'string') {
    return <span style={{ whiteSpace: 'pre-wrap' }}>{content}</span>
  }

  return (
    <div ref={ref}>
      {content.explanation && (
        <p style={{ marginBottom: content.code ? '0.6rem' : 0, lineHeight: 1.6 }}>{content.explanation}</p>
      )}
      {content.code && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.35rem 0.75rem',
            background: '#faf8ec', borderRadius: '6px 6px 0 0',
            border: '0.5px solid #ede8c0', borderBottom: 'none'
          }}>
            <span style={{ fontSize: 11, color: '#b8a060', fontFamily: 'monospace' }}>{content.language || 'code'}</span>
            <button onClick={() => copy(content.code)} style={{
              fontSize: 11, color: copied ? '#5c7a00' : '#b8a060',
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit'
            }}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <pre style={{
            margin: 0, background: '#fafaf0',
            border: '0.5px solid #ede8c0', borderTop: 'none',
            borderRadius: '0 0 6px 6px',
            padding: '0.6rem 0.75rem', overflowX: 'auto'
          }}>
            <code className={`language-${content.language || 'javascript'}`} style={{ fontSize: 12, lineHeight: 1.6 }}>
              {content.code}
            </code>
          </pre>
        </div>
      )}
      {content.complexity && (
        <p style={{ fontSize: 11, color: '#9a8040', marginTop: '0.4rem' }}>Complexity: {content.complexity}</p>
      )}
      {content.suggestions?.length > 0 && (
        <ul style={{ fontSize: 12, color: '#7a6830', marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
          {content.suggestions.map((s, i) => <li key={i} style={{ marginBottom: '0.2rem' }}>{s}</li>)}
        </ul>
      )}
      {content.disclaimer && (
        <p style={{
          fontSize: 11, color: '#8a6a00', background: '#fef3c0',
          padding: '0.35rem 0.6rem', borderRadius: 5, marginTop: '0.5rem'
        }}>{content.disclaimer}</p>
      )}
    </div>
  )
}
