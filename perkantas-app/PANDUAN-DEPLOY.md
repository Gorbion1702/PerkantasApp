# 🚀 Panduan Deploy Perkantas Jabar — Firman Bersama
## Gratis 100% menggunakan GitHub + Supabase + Vercel

---

## LANGKAH 1 — Setup Supabase (Database & Auth)

1. Buka https://supabase.com → klik **Start for free**
2. Daftar/login dengan GitHub atau email
3. Klik **New Project** → isi nama: `perkantas-jabar`
4. Pilih region: **Southeast Asia (Singapore)**
5. Buat password database (simpan baik-baik)
6. Tunggu ~2 menit sampai project siap

### Jalankan SQL Schema:
1. Di sidebar kiri → klik **SQL Editor**
2. Copy-paste seluruh isi file `supabase-schema.sql`
3. Klik **Run**

### Ambil API Keys:
1. Klik **Project Settings** → **API**
2. Copy **Project URL** → simpan
3. Copy **anon public key** → simpan

---

## LANGKAH 2 — Upload Kode ke GitHub

1. Buka https://github.com → klik **New repository**
2. Nama: `perkantas-jabar-app` → klik **Create**
3. Upload semua file dari folder ini:
   - Klik **uploading an existing file**
   - Drag & drop semua file
   - Klik **Commit changes**

---

## LANGKAH 3 — Deploy ke Vercel

1. Buka https://vercel.com → klik **Sign Up with GitHub**
2. Klik **New Project** → pilih repo `perkantas-jabar-app`
3. Di bagian **Environment Variables**, tambahkan:
   ```
   REACT_APP_SUPABASE_URL    = (URL dari Langkah 1)
   REACT_APP_SUPABASE_ANON_KEY = (Key dari Langkah 1)
   ```
4. Klik **Deploy**
5. Tunggu ~2 menit → **selesai!**

🎉 App Anda live di: `https://perkantas-jabar-app.vercel.app`

---

## LANGKAH 4 — Setup Auth di Supabase

1. Di Supabase → **Authentication** → **Settings**
2. Matikan **Enable email confirmations** (untuk internal, lebih praktis)
3. Di **URL Configuration** → tambahkan:
   - Site URL: `https://perkantas-jabar-app.vercel.app`

---

## LANGKAH 5 — Daftarkan Akun Staf

1. Buka URL app Anda
2. Klik tab **Daftar**
3. Daftarkan masing-masing staf (atau minta mereka daftar sendiri)

---

## Cara Update App

Setiap kali edit kode di GitHub → Vercel otomatis **redeploy** dalam 1-2 menit.

---

## Fitur yang Sudah Ada

| Fitur | Status |
|---|---|
| Login & Register | ✅ |
| Teks Alkitab (API SABDA) | ✅ |
| Sharing & Komentar per ayat | ✅ |
| Like sharing | ✅ |
| Realtime (sharing langsung muncul) | ✅ |
| Sesi LIVE baca bersama | ✅ |
| Jadwal mingguan | ✅ |
| Notifikasi browser | ✅ |
| Profil staf | ✅ |

---

## Butuh Bantuan?

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
