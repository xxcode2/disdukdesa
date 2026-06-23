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
    // Berlaku semua kategori
    { key: 'foto_ktp_suami', label: 'Foto KTP Suami (Asli)', required: true },
    { key: 'foto_ktp_istri', label: 'Foto KTP Istri (Asli)', required: true },
    { key: 'foto_ijazah_suami', label: 'Foto Ijazah Suami', required: false, helpText: 'Jika ada, untuk kelengkapan data pendidikan' },
    { key: 'foto_ijazah_istri', label: 'Foto Ijazah Istri', required: false },

    // Khusus perubahan data / hilang / rusak — perlu KK lama
    { key: 'foto_kk_lama', label: 'Foto KK Asli (Lama)', required: true, showWhenKategori: ['perubahan_data', 'hilang', 'rusak'] },

    // Khusus KK baru — perlu dokumen lengkap suami istri
    { key: 'foto_kk_orangtua_suami', label: 'Foto KK Orang Tua Suami (Sebelumnya)', required: true, showWhenKategori: ['baru'] },
    { key: 'foto_kk_orangtua_istri', label: 'Foto KK Orang Tua Istri (Sebelumnya)', required: true, showWhenKategori: ['baru'] },
    { key: 'foto_akte_lahir_suami', label: 'Foto Akte Kelahiran Suami', required: true, showWhenKategori: ['baru'] },
    { key: 'foto_akte_lahir_istri', label: 'Foto Akte Kelahiran Istri', required: true, showWhenKategori: ['baru'] },
    { key: 'foto_surat_nikah', label: 'Foto Surat/Buku Nikah', required: true, showWhenKategori: ['baru'] },
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
    { key: 'formulir_kematian_desa', label: 'Formulir Kematian dari Desa', required: false, helpText: 'Jika belum punya, bisa diisi/diambil setelah pengajuan diproses' },
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
    { key: 'form_perpindahan_desa', label: 'Form Perpindahan dari Desa', required: false, helpText: 'Jika belum punya, bisa diisi/diambil setelah pengajuan diproses' },
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
