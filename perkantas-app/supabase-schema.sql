-- ============================================================
-- PERKANTAS JABAR - Supabase Database Schema
-- Jalankan ini di Supabase SQL Editor
-- ============================================================

-- 1. Tabel profil staf (extend auth.users bawaan Supabase)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nama text not null,
  inisial text not null,
  warna text default '#2C3E2D',
  role text default 'staf',
  created_at timestamp with time zone default timezone('utc', now())
);

-- 2. Tabel jadwal baca
create table public.jadwal (
  id serial primary key,
  tanggal date not null,
  kitab text not null,
  pasal int not null,
  tema text,
  pemimpin_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc', now())
);

-- 3. Tabel sharing / renungan
create table public.sharings (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  kitab text not null,
  pasal int not null,
  ayat int,
  isi text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- 4. Tabel likes untuk sharing
create table public.likes (
  id serial primary key,
  sharing_id int references public.sharings(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  unique(sharing_id, user_id)
);

-- 5. Tabel sesi live
create table public.sesi_live (
  id serial primary key,
  kitab text not null,
  pasal int not null,
  ayat_aktif int default 1,
  pemimpin_id uuid references public.profiles(id),
  aktif boolean default true,
  created_at timestamp with time zone default timezone('utc', now())
);

-- 6. Tabel notifikasi
create table public.notifikasi (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  judul text not null,
  pesan text not null,
  dibaca boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);

-- ── Row Level Security ──────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.jadwal enable row level security;
alter table public.sharings enable row level security;
alter table public.likes enable row level security;
alter table public.sesi_live enable row level security;
alter table public.notifikasi enable row level security;

-- Semua staf bisa baca semua data
create policy "staf bisa baca profiles" on public.profiles for select using (auth.role() = 'authenticated');
create policy "staf bisa baca jadwal" on public.jadwal for select using (auth.role() = 'authenticated');
create policy "staf bisa baca sharings" on public.sharings for select using (auth.role() = 'authenticated');
create policy "staf bisa baca likes" on public.likes for select using (auth.role() = 'authenticated');
create policy "staf bisa baca sesi" on public.sesi_live for select using (auth.role() = 'authenticated');
create policy "staf bisa baca notifikasi sendiri" on public.notifikasi for select using (auth.uid() = user_id);

-- Hanya pemilik yang bisa insert/update/delete data sendiri
create policy "insert profile sendiri" on public.profiles for insert with check (auth.uid() = id);
create policy "update profile sendiri" on public.profiles for update using (auth.uid() = id);
create policy "insert sharing" on public.sharings for insert with check (auth.uid() = user_id);
create policy "delete sharing sendiri" on public.sharings for delete using (auth.uid() = user_id);
create policy "insert like" on public.likes for insert with check (auth.uid() = user_id);
create policy "delete like sendiri" on public.likes for delete using (auth.uid() = user_id);
create policy "insert sesi" on public.sesi_live for insert with check (auth.uid() = pemimpin_id);
create policy "update sesi" on public.sesi_live for update using (auth.uid() = pemimpin_id);

-- Realtime: aktifkan untuk tabel sharing dan sesi_live
-- Di Supabase Dashboard → Database → Replication → aktifkan sharings & sesi_live

-- ── Sample Data Jadwal ──────────────────────────────────────
-- (Isi pemimpin_id setelah ada user)
insert into public.jadwal (tanggal, kitab, pasal, tema) values
  ('2026-06-02', 'Yohanes', 3, 'Lahir Kembali'),
  ('2026-06-03', 'Mazmur', 23, 'Tuhan Gembala'),
  ('2026-06-04', 'Roma', 8, 'Hidup dalam Roh'),
  ('2026-06-05', 'Matius', 5, 'Ucapan Bahagia'),
  ('2026-06-06', 'Filipi', 4, 'Damai Sejahtera');
