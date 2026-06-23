-- =========================================================
-- SKEMA DATABASE: Pelayanan Administrasi Desa Kasomalang
-- =========================================================
-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- =========================================================

-- 1. TABEL PENGAJUAN
-- Menyimpan semua jenis pengajuan (KK, Akte Lahir, Akte Mati, Surat Pindah)
-- Field yang sama untuk semua jenis disimpan sebagai kolom asli.
-- Field yang berbeda-beda per jenis disimpan di kolom `detail` (JSONB).
create table if not exists public.pengajuan (
  id uuid primary key default gen_random_uuid(),
  kode_tiket text unique not null,              -- contoh: KSM-240601-AB12, dipakai warga utk referensi saat WA
  jenis_layanan text not null check (jenis_layanan in ('kk', 'akte_lahir', 'akte_mati', 'surat_pindah')),
  kategori text,                                 -- contoh: 'baru' | 'perubahan_data' | 'hilang' | 'rusak' (khusus KK)

  -- Data pemohon (umum dipakai di semua jenis)
  nama_pemohon text not null,
  nik_pemohon text,
  no_kk text,
  no_hp text not null,                           -- wajib, ini kontak utama utk WA follow-up
  alamat text,
  rt text,
  rw text,
  kelurahan text,
  kecamatan text,

  -- Data pelapor (khusus akte lahir/mati biasanya beda dgn pemohon)
  nik_pelapor text,
  nama_pelapor text,

  -- Semua field tambahan spesifik per jenis layanan disimpan di sini
  -- contoh utk akte_lahir: { nama_anak, tempat_lahir, tanggal_lahir, nama_ayah, nama_ibu, no_surat_nikah, saksi: [...] }
  detail jsonb default '{}'::jsonb,

  catatan_admin text,                            -- catatan internal, misal "KTP istri kurang jelas, sudah di-WA"
  status text not null default 'baru' check (status in ('baru', 'diproses', 'selesai', 'ditolak')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_pengajuan_status on public.pengajuan (status);
create index if not exists idx_pengajuan_jenis on public.pengajuan (jenis_layanan);
create index if not exists idx_pengajuan_created on public.pengajuan (created_at desc);

-- 2. TABEL DOKUMEN
-- Setiap file yang diupload warga, terhubung ke satu pengajuan.
-- `label` menjelaskan dokumen apa ini (mis. "KTP Suami", "Ijazah Istri")
create table if not exists public.dokumen (
  id uuid primary key default gen_random_uuid(),
  pengajuan_id uuid not null references public.pengajuan(id) on delete cascade,
  label text not null,                           -- contoh: "KTP Suami (Asli)"
  nama_file text not null,
  path_storage text not null,                    -- path di Supabase Storage
  ukuran_bytes bigint,
  tipe_file text,
  created_at timestamptz not null default now()
);

create index if not exists idx_dokumen_pengajuan on public.dokumen (pengajuan_id);

-- 3. TRIGGER: auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_pengajuan_updated_at on public.pengajuan;
create trigger trg_pengajuan_updated_at
  before update on public.pengajuan
  for each row execute function public.set_updated_at();

-- 4. FUNGSI: generate kode tiket otomatis (format: KSM-YYMMDD-XXXX)
create or replace function public.generate_kode_tiket()
returns text as $$
declare
  kode text;
  sudah_ada boolean;
begin
  loop
    kode := 'KSM-' || to_char(now(), 'YYMMDD') || '-' ||
            upper(substring(md5(random()::text) from 1 for 4));
    select exists(select 1 from public.pengajuan where kode_tiket = kode) into sudah_ada;
    if not sudah_ada then
      exit;
    end if;
  end loop;
  return kode;
end;
$$ language plpgsql;

-- =========================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =========================================================
-- Prinsip: warga (anon/public) HANYA BISA INSERT (kirim pengajuan baru),
-- tidak bisa membaca data pengajuan orang lain.
-- Admin (authenticated user via Supabase Auth) bisa baca & ubah semuanya.

alter table public.pengajuan enable row level security;
alter table public.dokumen enable row level security;

-- Warga (siapa saja) boleh membuat pengajuan baru
drop policy if exists "Warga bisa kirim pengajuan" on public.pengajuan;
create policy "Warga bisa kirim pengajuan"
  on public.pengajuan for insert
  to anon
  with check (true);

drop policy if exists "Warga bisa lampirkan dokumen" on public.dokumen;
create policy "Warga bisa lampirkan dokumen"
  on public.dokumen for insert
  to anon
  with check (true);

-- Admin (login) boleh baca, ubah, hapus semua data
drop policy if exists "Admin bisa baca semua pengajuan" on public.pengajuan;
create policy "Admin bisa baca semua pengajuan"
  on public.pengajuan for select
  to authenticated
  using (true);

drop policy if exists "Admin bisa ubah pengajuan" on public.pengajuan;
create policy "Admin bisa ubah pengajuan"
  on public.pengajuan for update
  to authenticated
  using (true);

drop policy if exists "Admin bisa hapus pengajuan" on public.pengajuan;
create policy "Admin bisa hapus pengajuan"
  on public.pengajuan for delete
  to authenticated
  using (true);

drop policy if exists "Admin bisa baca semua dokumen" on public.dokumen;
create policy "Admin bisa baca semua dokumen"
  on public.dokumen for select
  to authenticated
  using (true);

drop policy if exists "Admin bisa hapus dokumen" on public.dokumen;
create policy "Admin bisa hapus dokumen"
  on public.dokumen for delete
  to authenticated
  using (true);

-- =========================================================
-- 6. STORAGE BUCKET untuk file upload (KTP, KK, Akte, dll)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('dokumen-warga', 'dokumen-warga', false)
on conflict (id) do nothing;

-- Warga (siapa saja) boleh upload file ke bucket ini
drop policy if exists "Warga bisa upload dokumen" on storage.objects;
create policy "Warga bisa upload dokumen"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'dokumen-warga');

-- Hanya admin (login) yang boleh melihat/download file
drop policy if exists "Admin bisa lihat dokumen" on storage.objects;
create policy "Admin bisa lihat dokumen"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'dokumen-warga');

drop policy if exists "Admin bisa hapus dokumen storage" on storage.objects;
create policy "Admin bisa hapus dokumen storage"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'dokumen-warga');

-- =========================================================
-- SELESAI. Langkah selanjutnya:
-- 1. Buat 1 user admin di Supabase Dashboard > Authentication > Users > Add User
-- 2. Salin Project URL & anon key ke file .env.local
-- =========================================================
