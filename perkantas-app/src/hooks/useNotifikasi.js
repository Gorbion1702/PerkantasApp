// src/hooks/useNotifikasi.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useNotifikasi(userId) {
  const [notifikasi, setNotifikasi] = useState([])
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (!userId) return
    fetchNotifikasi()

    // Realtime notifikasi baru
    const channel = supabase
      .channel(`notif-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifikasi',
        filter: `user_id=eq.${userId}`,
      }, payload => {
        setNotifikasi(prev => [payload.new, ...prev])
        setUnread(prev => prev + 1)
        // Browser notification jika diizinkan
        showBrowserNotif(payload.new.judul, payload.new.pesan)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId])

  async function fetchNotifikasi() {
    const { data } = await supabase
      .from('notifikasi')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    setNotifikasi(data || [])
    setUnread((data || []).filter(n => !n.dibaca).length)
  }

  async function tandaiDibaca() {
    await supabase.from('notifikasi')
      .update({ dibaca: true })
      .eq('user_id', userId)
      .eq('dibaca', false)
    setUnread(0)
    setNotifikasi(prev => prev.map(n => ({ ...n, dibaca: true })))
  }

  function showBrowserNotif(judul, pesan) {
    if (!('Notification' in window)) return
    if (Notification.permission === 'granted') {
      new Notification(`Perkantas Jabar: ${judul}`, { body: pesan, icon: '/logo.png' })
    }
  }

  async function mintaIzinNotifikasi() {
    if (!('Notification' in window)) return false
    const result = await Notification.requestPermission()
    return result === 'granted'
  }

  return { notifikasi, unread, tandaiDibaca, mintaIzinNotifikasi }
}
