// src/App.jsx
import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useBible } from './hooks/useBible'
import { useSharings } from './hooks/useSharings'
import { useNotifikasi } from './hooks/useNotifikasi'
import { useLive } from './hooks/useLive'
import LoginPage from './pages/LoginPage'

// ── Icons ──────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    book: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    message: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    heartOutline: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    play: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    chevLeft: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
    chevRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  }
  return icons[name] || null
}

// ── Konstanta ──────────────────────────────────────────────────────────────────
const JADWAL_MINGGU = [
  { tanggal: '2026-06-02', kitab: 'Yohanes', pasal: 3, tema: 'Lahir Kembali', pemimpin: 'Kak Rini' },
  { tanggal: '2026-06-03', kitab: 'Mazmur', pasal: 23, tema: 'Tuhan Gembala', pemimpin: 'Kak Budi' },
  { tanggal: '2026-06-04', kitab: 'Roma', pasal: 8, tema: 'Hidup dalam Roh', pemimpin: 'Kak Sari' },
  { tanggal: '2026-06-05', kitab: 'Matius', pasal: 5, tema: 'Ucapan Bahagia', pemimpin: 'Kak Doni' },
  { tanggal: '2026-06-06', kitab: 'Filipi', pasal: 4, tema: 'Damai Sejahtera', pemimpin: 'Kak Tari' },
]

const HARI_INI = new Date().toISOString().slice(0, 10)

// ── Komponen Avatar ────────────────────────────────────────────────────────────
function Avatar({ profile, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: profile?.warna || '#2C3E2D',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 'bold',
      fontSize: size * 0.35, flexShrink: 0, fontFamily: 'sans-serif',
    }}>
      {profile?.inisial || '?'}
    </div>
  )
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const { user, profile, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const [tab, setTab] = useState('baca')
  const [kitab, setKitab] = useState('Mazmur')
  const [pasal, setPasal] = useState(23)
  const [selectedVerse, setSelectedVerse] = useState(null)
  const [newSharing, setNewSharing] = useState('')
  const [showNotif, setShowNotif] = useState(false)

  const { verses, loading: bibleLoading, error: bibleError } = useBible(kitab, pasal)
  const { sharings, loading: sharingLoading, addSharing, toggleLike } = useSharings(kitab, pasal)
  const { notifikasi, unread, tandaiDibaca, mintaIzinNotifikasi } = useNotifikasi(user?.id)
  const { sesi, mulaiSesi, pindahAyat, akhiriSesi } = useLive(kitab, pasal)

  // Loading auth
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#1A2B1C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✝</div>
          <div style={{ color: '#C8A96E', fontFamily: 'Georgia, serif' }}>Memuat...</div>
        </div>
      </div>
    )
  }

  // Belum login
  if (!user) {
    return <LoginPage onLogin={async (action, ...args) => {
      if (action === 'signIn') return signIn(args[0], args[1])
      return signUp(args[0], args[1], args[2], args[3], args[4])
    }} />
  }

  async function handleSubmitSharing() {
    if (!newSharing.trim() || !profile) return
    await addSharing(user.id, selectedVerse, newSharing)
    setNewSharing('')
    setSelectedVerse(null)
  }

  function pilihJadwal(item) {
    setKitab(item.kitab)
    setPasal(item.pasal)
    setTab('baca')
  }

  const tabs = [
    { id: 'baca', label: 'Alkitab', icon: 'book' },
    { id: 'sharing', label: 'Sharing', icon: 'message' },
    { id: 'jadwal', label: 'Jadwal', icon: 'calendar' },
    { id: 'profil', label: 'Profil', icon: 'users' },
  ]

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: '#F5F0E8', minHeight: '100vh', maxWidth: 480, margin: '0 auto', position: 'relative' }}>

      {/* Header */}
      <div style={{ background: '#2C3E2D', padding: '14px 20px 12px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, background: '#C8A96E', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✝</div>
              <span style={{ color: '#C8A96E', fontSize: 15, fontWeight: 'bold' }}>Perkantas Jabar</span>
            </div>
            <div style={{ color: '#5a8a5e', fontSize: 10, marginTop: 1, letterSpacing: 1.5, fontFamily: 'sans-serif' }}>FIRMAN BERSAMA</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {sesi?.aktif && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#c0392b', borderRadius: 20, padding: '3px 10px' }}>
                <div style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                <span style={{ color: '#fff', fontSize: 10, fontFamily: 'sans-serif', fontWeight: 'bold' }}>LIVE</span>
              </div>
            )}
            <button onClick={() => { setShowNotif(!showNotif); if (!showNotif) { tandaiDibaca(); mintaIzinNotifikasi() } }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8A96E', position: 'relative', padding: 4 }}>
              <Icon name="bell" size={22} />
              {unread > 0 && (
                <span style={{ position: 'absolute', top: 0, right: 0, background: '#c0392b', color: '#fff', fontSize: 9, width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>{unread}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Notifikasi */}
      {showNotif && (
        <div style={{ position: 'fixed', top: 66, right: 'calc(50% - 230px)', width: 290, background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', zIndex: 200, overflow: 'hidden', maxHeight: 320, overflowY: 'auto' }}>
          <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: 14, fontFamily: 'sans-serif' }}>Notifikasi</span>
            <button onClick={() => setShowNotif(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#999' }}>×</button>
          </div>
          {notifikasi.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#aaa', fontFamily: 'sans-serif', fontSize: 13 }}>Belum ada notifikasi</div>
          ) : notifikasi.map(n => (
            <div key={n.id} style={{ padding: '11px 16px', borderBottom: '1px solid #f5f5f5', background: n.dibaca ? '#fff' : '#f0f7f0' }}>
              <div style={{ fontSize: 13, color: '#333', fontFamily: 'sans-serif', fontWeight: n.dibaca ? 'normal' : 'bold' }}>{n.judul}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2, fontFamily: 'sans-serif' }}>{n.pesan}</div>
              <div style={{ fontSize: 11, color: '#bbb', marginTop: 4, fontFamily: 'sans-serif' }}>
                {new Date(n.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '0 0 80px' }}>

        {/* ── TAB: BACA ─────────────────────────────────────────── */}
        {tab === 'baca' && (
          <div>
            {/* Navigasi kitab & pasal */}
            <div style={{ padding: '16px 20px 0' }}>
              <div style={{ fontSize: 11, color: '#999', fontFamily: 'sans-serif', letterSpacing: 1, marginBottom: 8 }}>BACAAN</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input value={kitab} onChange={e => setKitab(e.target.value)}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, fontFamily: 'Georgia, serif', background: '#fff' }}
                  placeholder="Nama kitab..." />
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button onClick={() => setPasal(p => Math.max(1, p - 1))} style={btnSmall}><Icon name="chevLeft" size={14} /></button>
                  <span style={{ fontSize: 16, fontWeight: 'bold', minWidth: 28, textAlign: 'center', color: '#2C3E2D' }}>{pasal}</span>
                  <button onClick={() => setPasal(p => p + 1)} style={btnSmall}><Icon name="chevRight" size={14} /></button>
                </div>
              </div>
            </div>

            {/* Live Banner */}
            <div style={{ margin: '14px 20px 0', background: sesi ? '#2C3E2D' : '#EAE5D8', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 'bold', color: sesi ? '#C8A96E' : '#555', fontFamily: 'sans-serif' }}>
                  {sesi ? 'Sesi LIVE aktif' : 'Baca Bersama'}
                </div>
                <div style={{ fontSize: 11, color: sesi ? '#8aaa8e' : '#999', fontFamily: 'sans-serif', marginTop: 1 }}>
                  {sesi ? `Ayat ${sesi.ayat_aktif} — semua tersinkronisasi` : 'Mulai sesi live untuk baca bersama'}
                </div>
              </div>
              <button onClick={() => sesi ? akhiriSesi(sesi.id) : mulaiSesi(user.id)}
                style={{ padding: '7px 12px', borderRadius: 8, border: 'none', background: sesi ? '#c0392b' : '#C8A96E', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4 }}>
                {sesi ? 'Stop' : <><Icon name="play" size={10} />Live</>}
              </button>
            </div>

            {/* Header pasal */}
            <div style={{ margin: '14px 20px 0', padding: '18px', background: 'linear-gradient(135deg, #2C3E2D, #3d5e3e)', borderRadius: 14 }}>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#C8A96E' }}>{kitab} {pasal}</div>
              <div style={{ fontSize: 12, color: '#8aaa8e', marginTop: 3, fontFamily: 'sans-serif' }}>
                {bibleLoading ? 'Memuat...' : `${verses.length} ayat • ${sharings.length} sharing`}
              </div>
            </div>

            {/* Error API */}
            {bibleError && (
              <div style={{ margin: '10px 20px 0', padding: '10px 14px', background: '#fff8e8', borderRadius: 8, border: '1px solid #f0d898', fontSize: 13, color: '#8a6a00', fontFamily: 'sans-serif' }}>
                ⚠️ {bibleError}
              </div>
            )}

            {/* Ayat-ayat */}
            <div style={{ padding: '12px 20px 0' }}>
              {bibleLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ marginBottom: 12, padding: 16, borderRadius: 10, background: '#e8e4dc', height: 60, animation: 'pulse 1.5s infinite' }} />
                ))
              ) : verses.map(v => (
                <div key={v.num}
                  onClick={() => setSelectedVerse(selectedVerse === v.num ? null : v.num)}
                  style={{
                    marginBottom: 10, padding: '14px 16px', borderRadius: 10,
                    background: sesi?.ayat_aktif === v.num ? '#fff8e8' : selectedVerse === v.num ? '#2C3E2D' : '#fff',
                    cursor: 'pointer', transition: 'all 0.2s',
                    border: '1px solid', borderColor: sesi?.ayat_aktif === v.num ? '#C8A96E' : selectedVerse === v.num ? '#2C3E2D' : '#E8E0D0',
                    boxShadow: sesi?.ayat_aktif === v.num ? '0 0 0 2px #C8A96E40' : 'none',
                  }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 12, fontWeight: 'bold', color: '#C8A96E', minWidth: 22, paddingTop: 3, fontFamily: 'sans-serif' }}>{v.num}</span>
                    <span style={{ fontSize: 15, lineHeight: 1.75, color: selectedVerse === v.num ? '#F5F0E8' : '#333' }}>{v.text}</span>
                  </div>
                  {selectedVerse === v.num && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(200,169,110,0.3)', display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button onClick={e => { e.stopPropagation(); setTab('sharing') }}
                        style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #C8A96E', background: 'transparent', color: '#C8A96E', fontSize: 12, cursor: 'pointer', fontFamily: 'sans-serif' }}>
                        💬 Sharing
                      </button>
                      {sesi && sesi.pemimpin_id === user.id && (
                        <button onClick={e => { e.stopPropagation(); pindahAyat(sesi.id, v.num) }}
                          style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #8aaa8e', background: 'transparent', color: '#8aaa8e', fontSize: 12, cursor: 'pointer', fontFamily: 'sans-serif' }}>
                          📍 Tandai Ayat Ini
                        </button>
                      )}
                      <span style={{ color: '#8aaa8e', fontSize: 11, fontFamily: 'sans-serif' }}>
                        {sharings.filter(s => s.ayat === v.num).length} sharing
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: SHARING ──────────────────────────────────────── */}
        {tab === 'sharing' && (
          <div style={{ padding: '16px 20px 0' }}>
            <div style={{ fontSize: 11, color: '#999', fontFamily: 'sans-serif', letterSpacing: 1, marginBottom: 12 }}>SHARING FIRMAN</div>

            {/* Info bacaan */}
            <div style={{ marginBottom: 14, padding: '10px 14px', background: '#2C3E2D', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#C8A96E', fontSize: 14, fontWeight: 'bold' }}>{kitab} {pasal}</span>
              <button onClick={() => setTab('baca')} style={{ background: 'none', border: '1px solid #5a8a5e', borderRadius: 6, color: '#8aaa8e', fontSize: 11, padding: '4px 10px', cursor: 'pointer', fontFamily: 'sans-serif' }}>Ganti</button>
            </div>

            {/* Form sharing */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #E8E0D0', marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                {profile && <Avatar profile={profile} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 14, color: '#2C3E2D' }}>{profile?.nama || 'Saya'}</div>
                  <select value={selectedVerse || ''} onChange={e => setSelectedVerse(e.target.value ? Number(e.target.value) : null)}
                    style={{ fontSize: 12, border: 'none', color: '#C8A96E', background: 'transparent', cursor: 'pointer', fontFamily: 'sans-serif', padding: 0, marginTop: 2 }}>
                    <option value="">Pilih ayat (opsional)</option>
                    {verses.map(v => <option key={v.num} value={v.num}>Ayat {v.num}</option>)}
                  </select>
                </div>
              </div>
              <textarea value={newSharing} onChange={e => setNewSharing(e.target.value)}
                placeholder="Apa yang Tuhan taruh di hati Anda dari firman ini?"
                style={{ width: '100%', minHeight: 90, border: 'none', outline: 'none', fontSize: 14, lineHeight: 1.65, color: '#333', resize: 'none', fontFamily: 'Georgia, serif', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button onClick={handleSubmitSharing}
                  style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: newSharing.trim() ? '#2C3E2D' : '#ddd', color: newSharing.trim() ? '#C8A96E' : '#aaa', fontSize: 13, cursor: newSharing.trim() ? 'pointer' : 'default', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="send" size={13} /> Bagikan
                </button>
              </div>
            </div>

            {/* Daftar sharing */}
            {sharingLoading ? (
              <div style={{ textAlign: 'center', padding: 30, color: '#aaa', fontFamily: 'sans-serif' }}>Memuat sharing...</div>
            ) : sharings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#aaa' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✦</div>
                <div style={{ fontFamily: 'sans-serif', fontSize: 14 }}>Belum ada sharing.<br />Jadilah yang pertama!</div>
              </div>
            ) : sharings.map(s => {
              const liked = s.likes?.some(l => l.user_id === user.id)
              return (
                <div key={s.id} style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, border: '1px solid #E8E0D0' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Avatar profile={s.profiles} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: 14, color: '#2C3E2D', fontFamily: 'sans-serif' }}>{s.profiles?.nama || 'Staf'}</span>
                        <span style={{ fontSize: 11, color: '#bbb', fontFamily: 'sans-serif' }}>
                          {new Date(s.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {s.ayat && <div style={{ fontSize: 11, color: '#C8A96E', marginTop: 2, fontFamily: 'sans-serif' }}>📖 Ayat {s.ayat}</div>}
                      <div style={{ fontSize: 14, lineHeight: 1.65, color: '#444', marginTop: 8 }}>{s.isi}</div>
                      <button onClick={() => toggleLike(s.id, user.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, marginTop: 10, color: liked ? '#c0392b' : '#bbb', fontSize: 13, fontFamily: 'sans-serif', padding: 0 }}>
                        <Icon name={liked ? 'heart' : 'heartOutline'} size={15} />
                        <span>{s.likes?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── TAB: JADWAL ───────────────────────────────────────── */}
        {tab === 'jadwal' && (
          <div style={{ padding: '16px 20px 0' }}>
            <div style={{ fontSize: 11, color: '#999', fontFamily: 'sans-serif', letterSpacing: 1, marginBottom: 14 }}>JADWAL BACA MINGGU INI</div>
            {JADWAL_MINGGU.map((item, i) => {
              const isHariIni = item.tanggal === HARI_INI
              const isLewat = item.tanggal < HARI_INI
              return (
                <div key={i} style={{ background: isHariIni ? '#2C3E2D' : '#fff', borderRadius: 12, padding: '14px 16px', marginBottom: 10, border: '2px solid', borderColor: isHariIni ? '#2C3E2D' : '#E8E0D0', opacity: isLewat ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 11, color: isHariIni ? '#5a8a5e' : '#aaa', fontFamily: 'sans-serif', marginBottom: 4 }}>
                        {new Date(item.tanggal + 'T00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 'bold', color: isHariIni ? '#C8A96E' : '#2C3E2D' }}>{item.kitab} {item.pasal}</div>
                      <div style={{ fontSize: 13, color: isHariIni ? '#a0c0a4' : '#666', marginTop: 2 }}>{item.tema}</div>
                      <div style={{ fontSize: 11, color: isHariIni ? '#5a8a5e' : '#aaa', marginTop: 5, fontFamily: 'sans-serif' }}>Pemimpin: {item.pemimpin}</div>
                    </div>
                    <div>
                      {isLewat && <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e0f0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a904a' }}><Icon name="check" size={14} /></div>}
                      {isHariIni && <div style={{ padding: '3px 10px', background: '#C8A96E', borderRadius: 20, fontSize: 11, color: '#2C3E2D', fontFamily: 'sans-serif', fontWeight: 'bold' }}>HARI INI</div>}
                    </div>
                  </div>
                  {isHariIni && (
                    <button onClick={() => pilihJadwal(item)}
                      style={{ marginTop: 12, width: '100%', padding: 10, borderRadius: 8, border: '1px solid #C8A96E', background: 'transparent', color: '#C8A96E', fontSize: 13, cursor: 'pointer', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Icon name="book" size={14} /> Buka {item.kitab} {item.pasal}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── TAB: PROFIL ───────────────────────────────────────── */}
        {tab === 'profil' && (
          <div style={{ padding: '16px 20px 0' }}>
            <div style={{ fontSize: 11, color: '#999', fontFamily: 'sans-serif', letterSpacing: 1, marginBottom: 14 }}>PROFIL SAYA</div>

            {/* Kartu profil */}
            <div style={{ background: '#2C3E2D', borderRadius: 16, padding: 20, marginBottom: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
              <Avatar profile={profile} size={56} />
              <div style={{ flex: 1 }}>
                <div style={{ color: '#C8A96E', fontWeight: 'bold', fontSize: 18 }}>{profile?.nama || 'Staf'}</div>
                <div style={{ color: '#5a8a5e', fontSize: 12, fontFamily: 'sans-serif', marginTop: 2 }}>{user.email}</div>
                <div style={{ color: '#8aaa8e', fontSize: 11, fontFamily: 'sans-serif', marginTop: 4 }}>Staf Perkantas Jawa Barat</div>
              </div>
            </div>

            {/* Statistik */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Sharing dibuat', value: sharings.filter(s => s.user_id === user.id).length },
                { label: 'Bacaan selesai', value: JADWAL_MINGGU.filter(j => j.tanggal <= HARI_INI).length },
              ].map((stat, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #E8E0D0', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 'bold', color: '#2C3E2D' }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: '#999', fontFamily: 'sans-serif', marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Notifikasi browser */}
            <button onClick={mintaIzinNotifikasi}
              style={{ width: '100%', padding: '13px', borderRadius: 10, border: '1px solid #E8E0D0', background: '#fff', color: '#2C3E2D', fontSize: 14, cursor: 'pointer', fontFamily: 'sans-serif', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Icon name="bell" size={16} /> Aktifkan Notifikasi Browser
            </button>

            {/* Logout */}
            <button onClick={signOut}
              style={{ width: '100%', padding: '13px', borderRadius: 10, border: '1px solid #ffcccc', background: '#fff8f8', color: '#c0392b', fontSize: 14, cursor: 'pointer', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Icon name="logout" size={16} /> Keluar
            </button>
          </div>
        )}

      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: '#fff', borderTop: '1px solid #E8E0D0', display: 'flex', zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: '10px 0 12px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: tab === t.id ? '#2C3E2D' : '#ccc', transition: 'color 0.2s' }}>
            <Icon name={t.icon} size={22} />
            <span style={{ fontSize: 10, fontFamily: 'sans-serif', fontWeight: tab === t.id ? 'bold' : 'normal' }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#C8A96E' }} />}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; }
        textarea:focus, input:focus { outline: 2px solid #C8A96E; }
      `}</style>
    </div>
  )
}

const btnSmall = {
  width: 32, height: 32, borderRadius: 8, border: '1px solid #ddd',
  background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555',
}
