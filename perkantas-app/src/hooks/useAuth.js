// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cek session yang sudah ada
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    // Dengarkan perubahan auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
    setLoading(false)
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signUp(email, password, nama, inisial, warna) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error }

    // Buat profil
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      nama,
      inisial: inisial.toUpperCase().slice(0, 2),
      warna: warna || '#2C3E2D',
    })
    return { error: profileError }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return { user, profile, loading, signIn, signUp, signOut }
}
