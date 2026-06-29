import { useState, useRef } from 'react'
import { uploadFile } from '../../services/chat.service'

const ALLOWED_EXTS = ['py','js','ts','jsx','tsx','java','cpp','c','cs','go','rs','sql','html','css','pdf','txt','md']

export default function MessageInput({ onSend, disabled, sending, isAuth }) {
  const [text, setText] = useState('')
  const [attachedFile, setAttachedFile] = useState(null) // { filename, type, content, url, language }
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef(null)

  const submit = async () => {
    if (!text.trim() || disabled || sending || uploading) return
    const msg = text.trim()
    const file = attachedFile
    setText('')
    setAttachedFile(null)
    setUploadError('')
    await onSend(msg, file)
  }

  const onKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!ALLOWED_EXTS.includes(ext)) {
      setUploadError('File type not supported')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File must be under 5MB')
      return
    }
    setUploadError('')
    setUploading(true)
    try {
      const data = await uploadFile(file)
      setAttachedFile(data)
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div style={{ padding: '0.75rem 1rem 1rem' }}>
      <div style={{
        background: '#fff', border: '0.5px solid #e0d080',
        borderRadius: 14, overflow: 'hidden',
        boxShadow: '0 1px 8px rgba(200,168,0,0.07)'
      }}>
        {attachedFile && (
          <div style={{ padding: '0.5rem 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.25rem 0.6rem', background: '#fef9e0',
              border: '0.5px solid #e8d880', borderRadius: 6
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9a7a00" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span style={{ fontSize: 11, color: '#7a5c00', fontFamily: 'monospace' }}>{attachedFile.filename}</span>
              <button onClick={() => setAttachedFile(null)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#b8a060', fontSize: 13, lineHeight: 1, padding: 0
              }}>✕</button>
            </div>
          </div>
        )}

        {uploading && (
          <div style={{ padding: '0.5rem 1rem 0', fontSize: 11, color: '#9a8040', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: 10, height: 10, border: '1.5px solid #d4b800', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            Uploading...
          </div>
        )}

        {uploadError && (
          <div style={{ padding: '0.4rem 1rem 0', fontSize: 11, color: '#a03020' }}>{uploadError}</div>
        )}

        <div style={{ padding: '0.75rem 1rem 0.3rem' }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={onKey}
            disabled={disabled || sending}
            placeholder={disabled ? 'Limit reached — wait for reset' : attachedFile ? 'Ask about this file...' : 'Ask anything about code...'}
            rows={1}
            style={{
              width: '100%', background: 'transparent', border: 'none',
              outline: 'none', fontSize: 13, color: '#1a1400',
              resize: 'none', fontFamily: 'inherit', lineHeight: 1.55,
              minHeight: 24, maxHeight: 120,
              opacity: disabled ? 0.4 : 1
            }}
          />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.45rem 0.75rem 0.55rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {isAuth && (
              <>
                <input
                  ref={fileRef} type="file" style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept=".py,.js,.ts,.jsx,.tsx,.java,.cpp,.c,.cs,.go,.rs,.sql,.html,.css,.pdf,.txt,.md"
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading || sending}
                  title="Attach file"
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: 'transparent', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: uploading || sending ? 'not-allowed' : 'pointer',
                    color: attachedFile ? '#7a5c00' : '#b8a060',
                    opacity: uploading || sending ? 0.5 : 1
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontSize: 11, color: '#b8a060', padding: '0.2rem 0.5rem',
              borderRadius: 5, border: '0.5px solid #e8d880', background: '#fef9e0'
            }}>LLaMA 3.3 70B</span>
            <button
              onClick={submit}
              disabled={!text.trim() || disabled || sending || uploading}
              style={{
                width: 30, height: 30, borderRadius: 8,
                background: '#f0d840', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: (!text.trim() || disabled || sending || uploading) ? 'not-allowed' : 'pointer',
                opacity: (!text.trim() || disabled || sending || uploading) ? 0.35 : 1,
                flexShrink: 0
              }}
            >
              {sending ? (
                <div style={{
                  width: 12, height: 12, border: '2px solid #2c1a00',
                  borderTopColor: 'transparent', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite'
                }} />
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2c1a00" strokeWidth="2.5">
                  <line x1="12" y1="19" x2="12" y2="5"/>
                  <polyline points="5 12 12 5 19 12"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 10, color: '#c8b870', marginTop: '0.4rem' }}>
        CoderX can make mistakes. Verify important code before use.
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
