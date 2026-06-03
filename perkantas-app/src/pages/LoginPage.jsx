// src/pages/LoginPage.jsx
import { useState } from 'react'

const WARNA_PILIHAN = ['#2C6B4A', '#3E6B2C', '#6B4A2C', '#2C3E6B', '#6B2C4A', '#4A2C6B', '#2C6B6B']

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nama, setNama] = useState('')
  const [inisial, setInisial] = useState('')
  const [warna, setWarna] = useState(WARNA_PILIHAN[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sukses, setSukses] = useState('')

  async function handleSubmit() {
    setError('')
    setSukses('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await onLogin('signIn', email, password)
        if (error) setError(error.message)
      } else {
        if (!nama.trim() || !inisial.trim()) {
          setError('Nama dan inisial wajib diisi.')
          return
        }
        const { error } = await onLogin('signUp', email, password, nama, inisial, warna)
        if (error) setError(error.message)
        else setSukses('Akun dibuat! Silakan cek email untuk konfirmasi, lalu login.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#1A2B1C',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Georgia', serif",
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{
          width: 64, height: 64, background: '#C8A96E', borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, margin: '0 auto 12px', boxShadow: '0 8px 32px rgba(200,169,110,0.3)'
        }}>✝</div>
        <div style={{ color: '#C8A96E', fontSize: 22, fontWeight: 'bold', letterSpacing: 0.5 }}>Perkantas Jabar</div>
        <div style={{ color: '#5a8a5e', fontSize: 12, marginTop: 4, letterSpacing: 2, fontFamily: 'sans-serif' }}>FIRMAN BERSAMA</div>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 380, background: '#fff',
        borderRadius: 20, padding: '28px 24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
      }}>
        {/* Tab */}
        <div style={{ display: 'flex', marginBottom: 24, background: '#f5f0e8', borderRadius: 10, padding: 4 }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSukses('') }}
              style={{
                flex: 1, padding: '8px', border: 'none', borderRadius: 8, cursor: 'pointer',
                background: mode === m ? '#2C3E2D' : 'transparent',
                color: mode === m ? '#C8A96E' : '#888',
                fontSize: 13, fontFamily: 'sans-serif', fontWeight: mode === m ? 'bold' : 'normal',
                transition: 'all 0.2s',
              }}>
              {m === 'login' ? 'Masuk' : 'Daftar'}
            </button>
          ))}
        </div>

        {/* Form Register tambahan */}
        {mode === 'register' && (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#888', fontFamily: 'sans-serif', display: 'block', marginBottom: 6 }}>NAMA LENGKAP</label>
              <input value={nama} onChange={e => {
                setNama(e.target.value)
                setInisial(e.target.value.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2))
              }}
                placeholder="Contoh: Budi Santoso"
                style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#888', fontFamily: 'sans-serif', display: 'block', marginBottom: 6 }}>INISIAL (2 huruf)</label>
              <input value={inisial} onChange={e => setInisial(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="BS"
                style={{ ...inputStyle, width: 60 }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#888', fontFamily: 'sans-serif', display: 'block', marginBottom: 8 }}>WARNA AVATAR</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {WARNA_PILIHAN.map(w => (
                  <button key={w} onClick={() => setWarna(w)}
                    style={{
                      width: 32, height: 32, borderRadius: '50%', background: w, border: 'none', cursor: 'pointer',
                      outline: warna === w ? '3px solid #C8A96E' : 'none', outlineOffset: 2,
                    }} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Email & Password */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: '#888', fontFamily: 'sans-serif', display: 'block', marginBottom: 6 }}>EMAIL</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email"
            placeholder="email@perkantas.id"
            style={inputStyle} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: '#888', fontFamily: 'sans-serif', display: 'block', marginBottom: 6 }}>PASSWORD</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password"
            placeholder="••••••••"
            style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        {/* Error / Sukses */}
        {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#c0392b', marginBottom: 14, fontFamily: 'sans-serif' }}>{error}</div>}
        {sukses && <div style={{ background: '#f0fff4', border: '1px solid #a0d4aa', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#2C6B4A', marginBottom: 14, fontFamily: 'sans-serif' }}>{sukses}</div>}

        {/* Tombol submit */}
        <button onClick={handleSubmit} disabled={loading}
          style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: loading ? '#ccc' : '#2C3E2D', color: loading ? '#fff' : '#C8A96E',
            fontSize: 15, cursor: loading ? 'default' : 'pointer',
            fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: 0.5,
          }}>
          {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Buat Akun'}
        </button>

        {/* Preview avatar */}
        {mode === 'register' && nama && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#aaa', fontFamily: 'sans-serif', marginBottom: 8 }}>Preview avatar Anda:</div>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: warna,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 'bold', fontSize: 16, margin: '0 auto',
              fontFamily: 'sans-serif'
            }}>{inisial || '?'}</div>
            <div style={{ fontSize: 13, color: '#555', marginTop: 6 }}>{nama}</div>
          </div>
        )}
      </div>

      <div style={{ color: '#3a5a3e', fontSize: 12, marginTop: 24, fontFamily: 'sans-serif', textAlign: 'center' }}>
        Khusus staf internal Perkantas Jawa Barat
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 8,
  border: '1px solid #e0d8cc', fontSize: 14, fontFamily: 'sans-serif',
  outline: 'none', boxSizing: 'border-box', color: '#333', background: '#fafaf8',
}
