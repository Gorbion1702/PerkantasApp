// src/hooks/useSharings.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useSharings(kitab, pasal) {
  const [sharings, setSharings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!kitab || !pasal) return
    fetchSharings()

    // Realtime: dengarkan sharing baru
    const channel = supabase
      .channel(`sharings-${kitab}-${pasal}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'sharings',
        filter: `kitab=eq.${kitab}&pasal=eq.${pasal}`,
      }, payload => {
        // Ambil data lengkap termasuk profil
        fetchOneSharing(payload.new.id)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [kitab, pasal])

  async function fetchSharings() {
    setLoading(true)
    const { data } = await supabase
      .from('sharings')
      .select(`*, profiles(nama, inisial, warna), likes(user_id)`)
      .eq('kitab', kitab)
      .eq('pasal', pasal)
      .order('created_at', { ascending: false })

    setSharings(data || [])
    setLoading(false)
  }

  async function fetchOneSharing(id) {
    const { data } = await supabase
      .from('sharings')
      .select(`*, profiles(nama, inisial, warna), likes(user_id)`)
      .eq('id', id)
      .single()
    if (data) setSharings(prev => [data, ...prev])
  }

  async function addSharing(userId, ayat, isi) {
    const { error } = await supabase.from('sharings').insert({
      user_id: userId,
      kitab,
      pasal,
      ayat,
      isi,
    })
    return { error }
  }

  async function toggleLike(sharingId, userId) {
    const sharing = sharings.find(s => s.id === sharingId)
    const alreadyLiked = sharing?.likes?.some(l => l.user_id === userId)

    if (alreadyLiked) {
      await supabase.from('likes').delete()
        .eq('sharing_id', sharingId).eq('user_id', userId)
    } else {
      await supabase.from('likes').insert({ sharing_id: sharingId, user_id: userId })
    }
    // Refresh
    fetchSharings()
  }

  return { sharings, loading, addSharing, toggleLike }
}
