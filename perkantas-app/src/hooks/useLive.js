// src/hooks/useLive.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useLive(kitab, pasal) {
  const [sesi, setSesi] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!kitab || !pasal) return
    fetchSesi()

    // Realtime: pantau perubahan ayat aktif
    const channel = supabase
      .channel(`live-${kitab}-${pasal}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'sesi_live',
      }, payload => {
        setSesi(payload.new)
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'sesi_live',
      }, payload => {
        if (payload.new.kitab === kitab && payload.new.pasal === pasal) {
          setSesi(payload.new)
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [kitab, pasal])

  async function fetchSesi() {
    setLoading(true)
    const { data } = await supabase
      .from('sesi_live')
      .select('*')
      .eq('kitab', kitab)
      .eq('pasal', pasal)
      .eq('aktif', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    setSesi(data || null)
    setLoading(false)
  }

  async function mulaiSesi(userId) {
    // Tutup sesi aktif yang ada dulu
    await supabase.from('sesi_live')
      .update({ aktif: false })
      .eq('kitab', kitab).eq('pasal', pasal).eq('aktif', true)

    const { data, error } = await supabase.from('sesi_live').insert({
      kitab, pasal, ayat_aktif: 1, pemimpin_id: userId, aktif: true
    }).select().single()

    if (!error) setSesi(data)
    return { error }
  }

  async function pindahAyat(sesiId, ayat) {
    await supabase.from('sesi_live')
      .update({ ayat_aktif: ayat })
      .eq('id', sesiId)
  }

  async function akhiriSesi(sesiId) {
    await supabase.from('sesi_live')
      .update({ aktif: false })
      .eq('id', sesiId)
    setSesi(null)
  }

  return { sesi, loading, mulaiSesi, pindahAyat, akhiriSesi }
}
