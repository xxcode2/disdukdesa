# Layanan Surat Desa Kasomalang

Aplikasi web untuk warga mengajukan pembuatan **Kartu Keluarga (KK)**, **Akte Kelahiran**, **Akte Kematian**, dan **Surat Pindah** secara online — lengkap dengan upload berkas persyaratan. Admin (petugas desa) memantau semua pengajuan dari satu dashboard.

- **Frontend & Backend:** Next.js (App Router) — dideploy ke **Vercel**
- **Database & Storage & Auth:** **Supabase**

---

## 1. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com) (gratis).
2. Buka **SQL Editor** di dashboard Supabase, lalu copy-paste seluruh isi file
   [`supabase/schema.sql`](./supabase/schema.sql) dan jalankan (klik **Run**).
   Ini akan membuat:
   - Tabel `pengajuan` (data warga)
   - Tabel `dokumen` (referensi file yang diupload)
   - Storage bucket `dokumen-warga` (tempat file KTP/KK/Akte dll disimpan)
   - Aturan keamanan (RLS): warga hanya bisa **mengirim** data, tidak bisa membaca
     data warga lain; hanya admin yang login yang bisa membaca semua data.
3. Buat akun admin Anda: buka **Authentication > Users > Add User**, isi email
   dan password yang akan Anda pakai untuk login ke `/admin`.
4. Ambil kredensial API: buka **Project Settings > API**, salin:
   - `Project URL`
   - `anon public` key
   - `service_role` key (klik "Reveal" — **JANGAN** disebar/commit ke Git)

## 2. Konfigurasi Environment Variable

Salin `.env.example` menjadi `.env.local`, lalu isi tiga nilai di atas:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...
```

## 3. Jalankan di Komputer (opsional, untuk coba-coba dulu)

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk halaman warga, dan
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) untuk login admin.

## 4. Deploy ke Vercel

1. Push folder project ini ke repository GitHub.
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → pilih repo tersebut.
3. Saat diminta **Environment Variables**, isi 3 variable yang sama seperti di `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Klik **Deploy**. Selesai — Vercel otomatis build & kasih Anda URL publik.

---

## Struktur Halaman

| Halaman                | Untuk siapa | Keterangan                                                                                            |
| ----------------------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| `/`                     | Warga       | Pilih jenis layanan                                                                                    |
| `/ajukan/kk`            | Warga       | Form KK (baru / perubahan data / hilang / rusak)                                                       |
| `/ajukan/akte_lahir`    | Warga       | Form Akte Kelahiran                                                                                    |
| `/ajukan/akte_mati`     | Warga       | Form Akte Kematian                                                                                     |
| `/ajukan/surat_pindah`  | Warga       | Form Surat Pindah                                                                                      |
| `/ajukan/.../sukses`    | Warga       | Halaman konfirmasi + kode tiket setelah submit                                                         |
| `/admin/login`          | Admin       | Login                                                                                                   |
| `/admin`                | Admin       | Daftar semua pengajuan + filter status/jenis + cari                                                    |
| `/admin/[id]`           | Admin       | Detail satu pengajuan: data lengkap, download berkas, ubah status, catatan, tombol langsung WhatsApp   |

## Cara Kerja Alur Data

1. Warga pilih jenis layanan → isi data → upload berkas sesuai daftar
   persyaratan yang sudah disesuaikan per jenis & kategori (lihat
   `src/lib/layanan.ts` jika ingin mengubah field/persyaratan).
2. Submit → data tersimpan ke tabel `pengajuan`, berkas terupload ke Storage
   privat (`dokumen-warga`), warga dapat **kode tiket** sebagai bukti.
3. Anda (admin) login → lihat daftar pengajuan terbaru di paling atas →
   klik untuk lihat detail & download berkas.
4. Klik tombol **Hubungi via WhatsApp** untuk langsung chat ke warga jika ada
   berkas yang kurang/salah, atau saat surat sudah selesai.
5. Ubah status pengajuan (Baru / Diproses / Selesai / Perlu Dilengkapi) dan
   tulis catatan internal sebagai pengingat untuk Anda sendiri.

## Mengubah Persyaratan Dokumen / Field

Semua definisi field form dan daftar dokumen per jenis layanan ada di satu
file: **`src/lib/layanan.ts`**. Jika suatu saat ada persyaratan yang berubah
(misalnya butuh dokumen tambahan), cukup edit array `fields` atau `dokumen` di
file tersebut — tidak perlu mengubah halaman lain.
