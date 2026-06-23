import { LayananDefinition } from '@/types';

// =========================================================
// KARTU KELUARGA
// =========================================================
const kk: LayananDefinition = {
  jenis: 'kk',
  judul: 'Kartu Keluarga (KK)',
  deskripsiSingkat: 'Pembuatan KK baru atau perubahan data (hilang, rusak, ubah data)',
  kategori: [
    { value: 'baru', label: 'KK Baru', description: 'Untuk keluarga yang belum pernah punya KK (mis. pasangan baru menikah)' },
    { value: 'perubahan_data', label: 'Perubahan Data', description: 'Update data di KK karena ada perubahan (alamat, status, dll)' },
    { value: 'hilang', label: 'KK Hilang', description: 'KK lama hilang, perlu dibuatkan ulang' },
    { value: 'rusak', label: 'KK Rusak', description: 'KK lama rusak/tidak terbaca, perlu dibuatkan ulang' },
  ],
  fields: [
    { key: 'nik_pemohon', label: 'NIK Pemohon', type: 'text', required: true, placeholder: '16 digit NIK', group: 'pemohon' },
    { key: 'no_kk', label: 'No. KK (jika ada/KK lama)', type: 'text', required: false, placeholder: '16 digit No. KK', group: 'pemohon' },
    { key: 'nama_pemohon', label: 'Nama Pemohon', type: 'text', required: true, placeholder: 'Nama sesuai KTP', group: 'pemohon' },
    { key: 'alamat', label: 'Alamat', type: 'textarea', required: true, placeholder: 'Nama jalan / kampung, no. rumah', group: 'pemohon' },
    { key: 'rt', label: 'RT', type: 'text', required: true, placeholder: 'contoh: 02', group: 'pemohon' },
    { key: 'rw', label: 'RW', type: 'text', required: true, placeholder: 'contoh: 05', group: 'pemohon' },
    { key: 'kelurahan', label: 'Kelurahan/Desa', type: 'text', required: true, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'kecamatan', label: 'Kecamatan', type: 'text', required: true, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'no_hp', label: 'No. Telp/HP', type: 'tel', required: true, placeholder: '08xxxxxxxxxx', group: 'pemohon' },
    { key: 'nik_pelapor', label: 'NIK Pelapor', type: 'text', required: true, placeholder: '16 digit NIK', group: 'pelapor' },
    { key: 'nama_pelapor', label: 'Nama Pelapor', type: 'text', required: true, placeholder: 'Boleh sama dengan pemohon', group: 'pelapor' },
    {
      key: 'keterangan',
      label: 'Keterangan Tambahan',
      type: 'textarea',
      required: false,
      placeholder: 'Contoh: KK hilang sejak kapan, atau data apa yang ingin diubah',
      group: 'detail',
    },
  ],
  dokumen: [
    // ── KK BARU ──────────────────────────────────────────────
    { key: 'surat_nikah',          label: 'Surat Nikah / Cerai / SPTJM',              required: true,  showWhenKategori: ['baru'] },
    { key: 'ijazah',               label: 'Ijasah / Ket. Tidak Punya Ijasah',         required: false, showWhenKategori: ['baru'] },
    { key: 'akte_lahir',           label: 'Akta Kelahiran / Ket. Lahir',              required: true,  showWhenKategori: ['baru'] },
    { key: 'form_biodata_f101',    label: 'Form Biodata KK F-1.01 (dari Desa)',       required: true,  showWhenKategori: ['baru'] },
    { key: 'kk_lama_baru',        label: 'Kartu Keluarga',                           required: false, showWhenKategori: ['baru'] },
    { key: 'form_kk_baru_f115',   label: 'Form KK Baru F-1.15 (dari Desa)',          required: true,  showWhenKategori: ['baru'] },
    { key: 'fc_ktp_baru',         label: 'FC KTP',                                   required: true,  showWhenKategori: ['baru'] },
    { key: 'surat_ket_kependudukan_baru', label: 'Surat Ket. Peristiwa Kependudukan', required: false, showWhenKategori: ['baru'] },
    { key: 'form_dafduk_f102_baru', label: 'Form Permohonan Dafduk F-1.02 (dari Desa)', required: true, showWhenKategori: ['baru'] },

    // ── PERUBAHAN DATA ────────────────────────────────────────
    { key: 'kk_lama_perubahan',   label: 'Kartu Keluarga Lama / Rusak',              required: true,  showWhenKategori: ['perubahan_data'] },
    { key: 'surat_nikah_perubahan', label: 'Surat Nikah / Cerai / SPTJM',            required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'surat_pindah_perubahan', label: 'Surat Pindah',                          required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'ijazah_perubahan',    label: 'Ijasah / Ket. Tidak Punya Ijasah',         required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'akte_lahir_perubahan', label: 'Akta Kelahiran / Ket. Lahir',             required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'form_perubahan_f106', label: 'Form Perubahan KK F-1.06 (dari Desa)',     required: true,  showWhenKategori: ['perubahan_data'] },
    { key: 'form_biodata_f101_perubahan', label: 'Form Biodata KK F-1.01 (dari Desa)', required: true, showWhenKategori: ['perubahan_data'] },
    { key: 'fc_ktp_perubahan',    label: 'FC KTP',                                   required: true,  showWhenKategori: ['perubahan_data'] },
    { key: 'akte_kematian_perubahan', label: 'Akta Kematian',                        required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'surat_ket_kependudukan_perubahan', label: 'Surat Ket. Peristiwa Kependudukan', required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'form_dafduk_f102_perubahan', label: 'Form Permohonan Dafduk F-1.02 (dari Desa)', required: true, showWhenKategori: ['perubahan_data'] },

    // ── HILANG ───────────────────────────────────────────────
    { key: 'form_biodata_f101_hilang', label: 'Form Biodata KK F-1.01 (dari Desa)', required: true,  showWhenKategori: ['hilang'] },
    { key: 'kk_hilang',           label: 'Kartu Keluarga',                           required: false, showWhenKategori: ['hilang'] },
    { key: 'surat_kehilangan',    label: 'Surat Kehilangan Kepolisian',               required: true,  showWhenKategori: ['hilang'] },
    { key: 'form_kk_baru_f115_hilang', label: 'Form KK Baru F-1.15 (dari Desa)',    required: true,  showWhenKategori: ['hilang'] },
    { key: 'fc_ktp_hilang',       label: 'FC KTP',                                   required: true,  showWhenKategori: ['hilang'] },
    { key: 'form_dafduk_f102_hilang', label: 'Form Permohonan Dafduk F-1.02 (dari Desa)', required: true, showWhenKategori: ['hilang'] },

    // ── RUSAK ────────────────────────────────────────────────
    { key: 'kk_lama_rusak',       label: 'Kartu Keluarga Lama / Rusak',              required: true,  showWhenKategori: ['rusak'] },
    { key: 'surat_nikah_rusak',   label: 'Surat Nikah / Cerai / SPTJM',              required: false, showWhenKategori: ['rusak'] },
    { key: 'form_biodata_f101_rusak', label: 'Form Biodata KK F-1.01 (dari Desa)',  required: true,  showWhenKategori: ['rusak'] },
    { key: 'form_kk_baru_f115_rusak', label: 'Form KK Baru F-1.15 (dari Desa)',     required: true,  showWhenKategori: ['rusak'] },
    { key: 'fc_ktp_rusak',        label: 'FC KTP',                                   required: true,  showWhenKategori: ['rusak'] },
    { key: 'form_dafduk_f102_rusak', label: 'Form Permohonan Dafduk F-1.02 (dari Desa)', required: true, showWhenKategori: ['rusak'] },
  ],
};

// =========================================================
// AKTE KELAHIRAN
// =========================================================
const akteLahir: LayananDefinition = {
  jenis: 'akte_lahir',
  judul: 'Akte Kelahiran',
  deskripsiSingkat: 'Pembuatan akte kelahiran anak (lengkap dengan persyaratan)',
  fields: [
    { key: 'nik_pemohon', label: 'NIK Pemohon (Ayah/Ibu)', type: 'text', required: true, group: 'pemohon' },
    { key: 'no_kk', label: 'No. KK', type: 'text', required: true, group: 'pemohon' },
    { key: 'nama_pemohon', label: 'Nama Pemohon', type: 'text', required: true, group: 'pemohon' },
    { key: 'alamat', label: 'Alamat', type: 'textarea', required: true, group: 'pemohon' },
    { key: 'rt', label: 'RT', type: 'text', required: true, group: 'pemohon' },
    { key: 'rw', label: 'RW', type: 'text', required: true, group: 'pemohon' },
    { key: 'kelurahan', label: 'Kelurahan/Desa', type: 'text', required: true, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'kecamatan', label: 'Kecamatan', type: 'text', required: true, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'no_hp', label: 'No. Telp/HP', type: 'tel', required: true, placeholder: '08xxxxxxxxxx', group: 'pemohon' },
    { key: 'nama_anak', label: 'Nama Lengkap Anak', type: 'text', required: true, group: 'detail' },
    { key: 'jenis_kelamin_anak', label: 'Jenis Kelamin Anak', type: 'radio', required: true, options: [{ value: 'L', label: 'Laki-laki' }, { value: 'P', label: 'Perempuan' }], group: 'detail' },
    { key: 'tempat_lahir_anak', label: 'Tempat Lahir', type: 'text', required: true, group: 'detail' },
    { key: 'tanggal_lahir_anak', label: 'Tanggal Lahir', type: 'date', required: true, group: 'detail' },
    { key: 'nama_ayah', label: 'Nama Ayah', type: 'text', required: true, group: 'detail' },
    { key: 'nama_ibu', label: 'Nama Ibu', type: 'text', required: true, group: 'detail' },
    { key: 'nik_pelapor', label: 'NIK Pelapor', type: 'text', required: true, group: 'pelapor' },
    { key: 'nama_pelapor', label: 'Nama Pelapor', type: 'text', required: true, group: 'pelapor' },
    { key: 'nama_saksi_1', label: 'Nama Saksi 1', type: 'text', required: true, group: 'detail' },
    { key: 'nama_saksi_2', label: 'Nama Saksi 2', type: 'text', required: true, group: 'detail' },
  ],
  dokumen: [
    { key: 'surat_nikah', label: 'Foto Surat/Buku Nikah Orang Tua', required: true },
    { key: 'kk', label: 'Foto Kartu Keluarga (KK)', required: true },
    { key: 'ktp_ayah', label: 'Foto KTP Ayah', required: true },
    { key: 'ktp_ibu', label: 'Foto KTP Ibu', required: true },
    { key: 'ktp_orangtua_suami', label: 'Foto KTP Orang Tua dari Suami', required: true },
    { key: 'ktp_orangtua_istri', label: 'Foto KTP Orang Tua dari Istri', required: true },
    { key: 'ktp_saksi_1', label: 'Foto KTP Saksi 1', required: true },
    { key: 'ktp_saksi_2', label: 'Foto KTP Saksi 2', required: true },
    { key: 'ktp_pelapor_1', label: 'Foto KTP Pelapor 1', required: true },
    { key: 'ktp_pelapor_2', label: 'Foto KTP Pelapor 2', required: true },
    { key: 'surat_keterangan_lahir_bidan', label: 'Surat Keterangan Lahir dari Bidan/RS', required: true },
  ],
};

// =========================================================
// AKTE KEMATIAN
// =========================================================
const akteMati: LayananDefinition = {
  jenis: 'akte_mati',
  judul: 'Akte Kematian',
  deskripsiSingkat: 'Pembuatan akte kematian',
  fields: [
    { key: 'nik_pemohon', label: 'NIK Pemohon', type: 'text', required: true, group: 'pemohon' },
    { key: 'no_kk', label: 'No. KK', type: 'text', required: true, group: 'pemohon' },
    { key: 'nama_pemohon', label: 'Nama Pemohon', type: 'text', required: true, group: 'pemohon' },
    { key: 'alamat', label: 'Alamat', type: 'textarea', required: true, group: 'pemohon' },
    { key: 'rt', label: 'RT', type: 'text', required: true, group: 'pemohon' },
    { key: 'rw', label: 'RW', type: 'text', required: true, group: 'pemohon' },
    { key: 'kelurahan', label: 'Kelurahan/Desa', type: 'text', required: true, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'kecamatan', label: 'Kecamatan', type: 'text', required: true, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'no_hp', label: 'No. Telp/HP', type: 'tel', required: true, placeholder: '08xxxxxxxxxx', group: 'pemohon' },
    { key: 'nama_almarhum', label: 'Nama Almarhum/Almarhumah', type: 'text', required: true, group: 'detail' },
    { key: 'nik_almarhum', label: 'NIK Almarhum/Almarhumah', type: 'text', required: true, group: 'detail' },
    { key: 'tanggal_wafat', label: 'Tanggal Wafat', type: 'date', required: true, group: 'detail' },
    { key: 'tempat_wafat', label: 'Tempat Wafat', type: 'text', required: true, placeholder: 'Rumah / RS / lainnya', group: 'detail' },
    { key: 'nik_pelapor', label: 'NIK Pelapor', type: 'text', required: true, group: 'pelapor' },
    { key: 'nama_pelapor', label: 'Nama Pelapor', type: 'text', required: true, group: 'pelapor' },
    { key: 'nama_saksi_1', label: 'Nama Saksi 1', type: 'text', required: true, group: 'detail' },
    { key: 'nama_saksi_2', label: 'Nama Saksi 2', type: 'text', required: true, group: 'detail' },
  ],
  dokumen: [
    { key: 'kk', label: 'Foto Kartu Keluarga (KK)', required: true },
    { key: 'ktp_almarhum', label: 'Foto KTP Almarhum/Almarhumah', required: true },
    { key: 'ktp_saksi_1', label: 'Foto KTP Saksi 1', required: true },
    { key: 'ktp_saksi_2', label: 'Foto KTP Saksi 2', required: true },
    { key: 'ktp_pelapor', label: 'Foto KTP Pelapor', required: true },
    { key: 'formulir_kematian_desa', label: 'Formulir Kematian dari Desa', required: false },
    { key: 'surat_keterangan_kematian', label: 'Surat/Keterangan Kematian dari RS atau Desa', required: true },
  ],
};

// =========================================================
// SURAT PINDAH
// =========================================================
const suratPindah: LayananDefinition = {
  jenis: 'surat_pindah',
  judul: 'Surat Pindah',
  deskripsiSingkat: 'Pembuatan surat pindah domisili',
  fields: [
    { key: 'nik_pemohon', label: 'NIK Pemohon', type: 'text', required: true, group: 'pemohon' },
    { key: 'no_kk', label: 'No. KK', type: 'text', required: true, group: 'pemohon' },
    { key: 'nama_pemohon', label: 'Nama Pemohon', type: 'text', required: true, group: 'pemohon' },
    { key: 'alamat', label: 'Alamat Asal', type: 'textarea', required: true, group: 'pemohon' },
    { key: 'rt', label: 'RT', type: 'text', required: true, group: 'pemohon' },
    { key: 'rw', label: 'RW', type: 'text', required: true, group: 'pemohon' },
    { key: 'kelurahan', label: 'Kelurahan/Desa Asal', type: 'text', required: true, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'kecamatan', label: 'Kecamatan Asal', type: 'text', required: true, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'no_hp', label: 'No. Telp/HP', type: 'tel', required: true, placeholder: '08xxxxxxxxxx', group: 'pemohon' },
    { key: 'alamat_tujuan', label: 'Alamat Tujuan Pindah', type: 'textarea', required: true, group: 'detail' },
    { key: 'kelurahan_tujuan', label: 'Kelurahan/Desa Tujuan', type: 'text', required: true, group: 'detail' },
    { key: 'kecamatan_tujuan', label: 'Kecamatan Tujuan', type: 'text', required: true, group: 'detail' },
    { key: 'kabupaten_tujuan', label: 'Kabupaten/Kota Tujuan', type: 'text', required: true, group: 'detail' },
    { key: 'alasan_pindah', label: 'Alasan Pindah', type: 'select', required: true, options: [
      { value: 'pekerjaan', label: 'Pekerjaan' },
      { value: 'keluarga', label: 'Mengikuti Keluarga' },
      { value: 'pendidikan', label: 'Pendidikan' },
      { value: 'perumahan', label: 'Perumahan' },
      { value: 'lainnya', label: 'Lainnya' },
    ], group: 'detail' },
    { key: 'anggota_keluarga_pindah', label: 'Anggota Keluarga yang Ikut Pindah', type: 'textarea', required: false, placeholder: 'Tulis nama-nama yang ikut pindah, pisahkan dengan koma', group: 'detail' },
  ],
  dokumen: [
    { key: 'kk', label: 'Foto Kartu Keluarga (KK)', required: true },
    { key: 'fc_ktp', label: 'Foto Copy KTP', required: true },
    { key: 'form_perpindahan_desa', label: 'Form Perpindahan dari Desa', required: false },
  ],
};

export const LAYANAN: Record<string, LayananDefinition> = {
  kk,
  akte_lahir: akteLahir,
  akte_mati: akteMati,
  surat_pindah: suratPindah,
};

export function getLayanan(jenis: string): LayananDefinition | undefined {
  return LAYANAN[jenis];
}

export function getDokumenUntukKategori(layanan: LayananDefinition, kategori?: string) {
  return layanan.dokumen.filter((d) => !d.showWhenKategori || (kategori && d.showWhenKategori.includes(kategori)));
}

export function getFieldsUntukKategori(layanan: LayananDefinition, kategori?: string) {
  return layanan.fields.filter((f) => !f.showWhenKategori || (kategori && f.showWhenKategori.includes(kategori)));
}
