// src/hooks/useBible.js
import { useState, useEffect } from 'react'

// API SABDA gratis — dokumentasi: https://alkitab.sabda.org/api/
// Format: https://alkitab.sabda.org/api/passage?passage=Yohanes+3

const BOOK_MAP = {
  'Kejadian': 'Kejadian', 'Keluaran': 'Keluaran', 'Mazmur': 'Mazmur',
  'Amsal': 'Amsal', 'Yesaya': 'Yesaya', 'Yeremia': 'Yeremia',
  'Matius': 'Matius', 'Markus': 'Markus', 'Lukas': 'Lukas',
  'Yohanes': 'Yohanes', 'Kisah Para Rasul': 'Kisah+Para+Rasul',
  'Roma': 'Roma', 'Filipi': 'Filipi', 'Kolose': 'Kolose',
  'Ibrani': 'Ibrani', 'Wahyu': 'Wahyu',
}

// Cache sederhana di memory supaya tidak bolak-balik request
const cache = {}

export function useBible(kitab, pasal) {
  const [verses, setVerses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!kitab || !pasal) return
    const key = `${kitab}-${pasal}`

    if (cache[key]) {
      setVerses(cache[key])
      return
    }

    setLoading(true)
    setError(null)

    const bookParam = BOOK_MAP[kitab] || kitab.replace(/ /g, '+')
    const url = `https://alkitab.sabda.org/api/passage?passage=${bookParam}+${pasal}&version=tb`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        // SABDA API mengembalikan array ayat
        const parsed = (data.verses || data || []).map(v => ({
          num: v.verse || v.ayat,
          text: v.text || v.isi || '',
        }))
        cache[key] = parsed
        setVerses(parsed)
      })
      .catch(() => {
        // Fallback: data lokal jika API gagal
        setError('Tidak bisa memuat Alkitab. Periksa koneksi internet.')
        setVerses(FALLBACK[key] || [])
      })
      .finally(() => setLoading(false))
  }, [kitab, pasal])

  return { verses, loading, error }
}

// Fallback data lokal jika API tidak tersedia (offline)
const FALLBACK = {
  'Mazmur-23': [
    { num: 1, text: 'TUHAN adalah gembalaku, takkan kekurangan aku.' },
    { num: 2, text: 'Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang;' },
    { num: 3, text: 'Ia menyegarkan jiwaku. Ia menuntun aku di jalan yang benar oleh karena nama-Nya.' },
    { num: 4, text: 'Sekalipun aku berjalan dalam lembah kekelaman, aku tidak takut bahaya, sebab Engkau besertaku; gada-Mu dan tongkat-Mu, itulah yang menghibur aku.' },
    { num: 5, text: 'Engkau menyediakan hidangan bagiku, di hadapan lawanku; Engkau mengurapi kepalaku dengan minyak; pialaku penuh melimpah.' },
    { num: 6, text: 'Kebajikan dan kemurahan belaka akan mengikuti aku, seumur hidupku; dan aku akan diam dalam rumah TUHAN sepanjang masa.' },
  ],
  'Yohanes-3': [
    { num: 16, text: 'Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.' },
    { num: 17, text: 'Sebab Allah mengutus Anak-Nya ke dalam dunia bukan untuk menghakimi dunia, melainkan untuk menyelamatkannya oleh Dia.' },
  ],
}
