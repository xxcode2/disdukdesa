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
    { key: 'nik_pemohon', label: 'NIK Pemohon', type: 'text', required: false, placeholder: '16 digit NIK', group: 'pemohon' },
    { key: 'no_kk', label: 'No. KK (jika ada/KK lama)', type: 'text', required: false, placeholder: '16 digit No. KK', group: 'pemohon' },
    { key: 'nama_pemohon', label: 'Nama Pemohon', type: 'text', required: true, placeholder: 'Nama sesuai KTP', group: 'pemohon' },
    { key: 'alamat', label: 'Alamat', type: 'textarea', required: false, placeholder: 'Nama jalan / kampung, no. rumah', group: 'pemohon' },
    { key: 'rt', label: 'RT', type: 'text', required: false, placeholder: 'contoh: 02', group: 'pemohon' },
    { key: 'rw', label: 'RW', type: 'text', required: false, placeholder: 'contoh: 05', group: 'pemohon' },
    { key: 'kelurahan', label: 'Kelurahan/Desa', type: 'text', required: false, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'kecamatan', label: 'Kecamatan', type: 'text', required: false, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'no_hp', label: 'No. Telp/HP', type: 'tel', required: true, placeholder: '08xxxxxxxxxx', group: 'pemohon' },
    { key: 'nik_pelapor', label: 'NIK Pelapor', type: 'text', required: false, placeholder: '16 digit NIK', group: 'pelapor' },
    { key: 'nama_pelapor', label: 'Nama Pelapor', type: 'text', required: false, placeholder: 'Boleh sama dengan pemohon', group: 'pelapor' },
    { key: 'keterangan', label: 'Keterangan Tambahan', type: 'textarea', required: false, placeholder: 'Contoh: KK hilang sejak kapan, atau data apa yang ingin diubah', group: 'detail' },
  ],
  dokumen: [
    // KK BARU
    { key: 'surat_nikah_baru',          label: 'Surat Nikah (jika sudah menikah)',                required: false, showWhenKategori: ['baru'] },
    { key: 'ijazah_baru',               label: 'Ijazah / Keterangan Tidak Punya Ijazah',          required: false, showWhenKategori: ['baru'] },
    { key: 'akte_lahir_baru',           label: 'Akta Kelahiran / Ket. Lahir',                     required: false, showWhenKategori: ['baru'] },
    { key: 'form_biodata_f101_baru',    label: 'Form Biodata KK F-1.01 (dari Desa)',              required: false, showWhenKategori: ['baru'], formUrl: '/forms/F-1.01_FORMULIR_BIODATA_KELUARGA.pdf' },
    { key: 'kk_lama_baru',              label: 'Kartu Keluarga (jika sudah menikah: KK istri & suami; jika belum: ikut KK orang tua)', required: true, showWhenKategori: ['baru'] },
    { key: 'form_kk_baru_f115',         label: 'Form KK Baru F-1.15 (dari Desa)',                 required: false, showWhenKategori: ['baru'] },
    { key: 'ktp_baru',                  label: 'KTP Asli (suami & istri jika sudah menikah; satu saja jika belum)', required: true, showWhenKategori: ['baru'] },
    { key: 'surat_ket_kependudukan_baru', label: 'Surat Ket. Peristiwa Kependudukan',             required: false, showWhenKategori: ['baru'], formUrl: '/forms/F-1.02_FORMULIR_PENDAFTARAN_PERISTIWA_KEPENDUDUKAN.pdf' },
    { key: 'form_dafduk_f102_baru',     label: 'Form Permohonan Dafduk F-1.02 (dari Desa)',       required: false, showWhenKategori: ['baru'], formUrl: '/forms/F-1.02_FORMULIR_PENDAFTARAN_PERISTIWA_KEPENDUDUKAN.pdf' },

    // PERUBAHAN DATA
    { key: 'kk_lama_perubahan',         label: 'Kartu Keluarga Lama / Rusak',                     required: true,  showWhenKategori: ['perubahan_data'] },
    { key: 'surat_nikah_perubahan',     label: 'Surat Nikah / Cerai / SPTJM',                     required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'surat_pindah_perubahan',    label: 'Surat Pindah',                                    required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'ijazah_perubahan',          label: 'Ijazah / Keterangan Tidak Punya Ijazah',          required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'akte_lahir_perubahan',      label: 'Akta Kelahiran / Ket. Lahir',                     required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'form_perubahan_f106',       label: 'Form Perubahan KK F-1.06 (dari Desa)',            required: false, showWhenKategori: ['perubahan_data'], helpText: 'Idealnya wajib, tapi dibuat opsional karena warga umumnya belum punya form ini', formUrl: '/forms/F-1.06_SURAT_PERNYATAAN_PERUBAHAN_ELEMEN_DATA_KEPENDUDUKAN.pdf' },
    { key: 'form_biodata_f101_perubahan', label: 'Form Biodata KK F-1.01',                        required: false, showWhenKategori: ['perubahan_data'], formUrl: '/forms/F-1.01_FORMULIR_BIODATA_KELUARGA.pdf' },
    { key: 'ktp_perubahan',             label: 'KTP Asli (suami & istri jika sudah menikah; sendiri jika belum)', required: true, showWhenKategori: ['perubahan_data'] },
    { key: 'akte_kematian_perubahan',   label: 'Akta Kematian',                                   required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'surat_ket_kependudukan_perubahan', label: 'Surat Ket. Peristiwa Kependudukan',        required: false, showWhenKategori: ['perubahan_data'], formUrl: '/forms/F-1.02_FORMULIR_PENDAFTARAN_PERISTIWA_KEPENDUDUKAN.pdf' },
    { key: 'form_dafduk_f102_perubahan', label: 'Form Permohonan Dafduk F-1.02',                  required: false, showWhenKategori: ['perubahan_data'], formUrl: '/forms/F-1.02_FORMULIR_PENDAFTARAN_PERISTIWA_KEPENDUDUKAN.pdf' },

    // KK HILANG
    { key: 'form_biodata_f101_hilang',  label: 'Form Biodata KK F-1.01',                          required: false, showWhenKategori: ['hilang'], formUrl: '/forms/F-1.01_FORMULIR_BIODATA_KELUARGA.pdf' },
    { key: 'kk_hilang',                 label: 'Kartu Keluarga (opsional, lampirkan fotokopi jika ada)', required: false, showWhenKategori: ['hilang'] },
    { key: 'surat_kehilangan_hilang',   label: 'Surat Kehilangan dari Kepolisian',                required: true,  showWhenKategori: ['hilang'] },
    { key: 'form_kk_baru_f115_hilang',  label: 'Form KK Baru F-1.15 (dari Desa)',                 required: false, showWhenKategori: ['hilang'] },
    { key: 'ktp_hilang',                label: 'KTP',                                              required: true,  showWhenKategori: ['hilang'] },
    { key: 'form_dafduk_f102_hilang',   label: 'Form Permohonan Dafduk F-1.02',                   required: false, showWhenKategori: ['hilang'], formUrl: '/forms/F-1.02_FORMULIR_PENDAFTARAN_PERISTIWA_KEPENDUDUKAN.pdf' },

    // KK RUSAK
    { key: 'kk_lama_rusak',             label: 'Kartu Keluarga',                                  required: true,  showWhenKategori: ['rusak'] },
    { key: 'surat_nikah_rusak',         label: 'Surat Nikah / Cerai / SPTJM',                     required: false, showWhenKategori: ['rusak'] },
    { key: 'form_biodata_f101_rusak',   label: 'Form Biodata KK F-1.01',                          required: false, showWhenKategori: ['rusak'], formUrl: '/forms/F-1.01_FORMULIR_BIODATA_KELUARGA.pdf' },
    { key: 'form_kk_baru_f115_rusak',   label: 'Form KK Baru F-1.15 (dari Desa)',                 required: false, showWhenKategori: ['rusak'] },
    { key: 'ktp_rusak',                 label: 'KTP',                                              required: true,  showWhenKategori: ['rusak'] },
    { key: 'form_dafduk_f102_rusak',    label: 'Form Permohonan Dafduk F-1.02',                   required: false, showWhenKategori: ['rusak'], formUrl: '/forms/F-1.02_FORMULIR_PENDAFTARAN_PERISTIWA_KEPENDUDUKAN.pdf' },
  ],
};

const akteLahir: LayananDefinition = {
  jenis: 'akte_lahir',
  judul: 'Akte Kelahiran',
  deskripsiSingkat: 'Pembuatan atau perubahan data akte kelahiran',
  kategori: [
    { value: 'baru', label: 'Akte Baru', description: 'Pembuatan akte kelahiran anak baru' },
    { value: 'perubahan_data', label: 'Perubahan Data', description: 'Perubahan data pada akte kelahiran yang sudah ada' },
    { value: 'hilang', label: 'Akte Hilang', description: 'Pengajuan akte kelahiran yang hilang' },
    { value: 'rusak', label: 'Akte Rusak', description: 'Pengajuan akte kelahiran yang rusak atau tidak terbaca' },
  ],
  fields: [
    { key: 'nik_pemohon', label: 'NIK Pemohon (Ayah/Ibu)', type: 'text', required: false, group: 'pemohon' },
    { key: 'no_kk', label: 'No. KK', type: 'text', required: false, group: 'pemohon' },
    { key: 'nama_pemohon', label: 'Nama Pemohon', type: 'text', required: true, group: 'pemohon' },
    { key: 'alamat', label: 'Alamat', type: 'textarea', required: false, group: 'pemohon' },
    { key: 'rt', label: 'RT', type: 'text', required: false, group: 'pemohon' },
    { key: 'rw', label: 'RW', type: 'text', required: false, group: 'pemohon' },
    { key: 'kelurahan', label: 'Kelurahan/Desa', type: 'text', required: false, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'kecamatan', label: 'Kecamatan', type: 'text', required: false, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'no_hp', label: 'No. Telp/HP', type: 'tel', required: true, placeholder: '08xxxxxxxxxx', group: 'pemohon' },
    { key: 'nama_anak', label: 'Nama Lengkap Anak', type: 'text', required: false, group: 'detail' },
    { key: 'jenis_kelamin_anak', label: 'Jenis Kelamin Anak', type: 'radio', required: false, options: [{ value: 'L', label: 'Laki-laki' }, { value: 'P', label: 'Perempuan' }], group: 'detail' },
    { key: 'tempat_lahir_anak', label: 'Tempat Lahir', type: 'text', required: false, group: 'detail' },
    { key: 'tanggal_lahir_anak', label: 'Tanggal Lahir', type: 'date', required: false, group: 'detail' },
    { key: 'nama_ayah', label: 'Nama Ayah', type: 'text', required: false, group: 'detail' },
    { key: 'nama_ibu', label: 'Nama Ibu', type: 'text', required: false, group: 'detail' },
    { key: 'nik_pelapor', label: 'NIK Pelapor', type: 'text', required: false, group: 'pelapor' },
    { key: 'nama_pelapor', label: 'Nama Pelapor', type: 'text', required: false, group: 'pelapor' },
    { key: 'nama_saksi_1', label: 'Nama Saksi 1', type: 'text', required: false, group: 'detail' },
    { key: 'nama_saksi_2', label: 'Nama Saksi 2', type: 'text', required: false, group: 'detail' },
  ],
  dokumen: [
    // AKTE BARU
    { key: 'surat_nikah_baru',         label: 'Surat Nikah / Cerai / SPTJM',                    required: true,  showWhenKategori: ['baru'] },
    { key: 'kk_baru',                  label: 'Kartu Keluarga',                                  required: true,  showWhenKategori: ['baru'] },
    { key: 'ktp_ortu_baru',           label: 'KTP Orang Tua',                                   required: true,  showWhenKategori: ['baru'] },
    { key: 'ktp_saksi_baru',          label: 'KTP Saksi',                                       required: true,  showWhenKategori: ['baru'] },
    { key: 'ktp_pelapor_baru',        label: 'KTP Pelapor',                                     required: true,  showWhenKategori: ['baru'] },
    { key: 'ket_lahir_bidan_baru',    label: 'Ket. Lahir Bidan / SPTJM Kelahiran',             required: true,  showWhenKategori: ['baru'] },
    { key: 'form_kelahiran_f201_baru', label: 'Form Kelahiran Capil F-2.01',                    required: false, showWhenKategori: ['baru'], formUrl: '/forms/F-2.01_FORMULIR_PELAPORAN_PENCATATAN_SIPIL.pdf' },

    // PERUBAHAN DATA
    { key: 'kk_perubahan',            label: 'Kartu Keluarga',                                  required: true,  showWhenKategori: ['perubahan_data'] },
    { key: 'surat_nikah_perubahan',   label: 'Surat Nikah / Cerai / SPTJM',                    required: true,  showWhenKategori: ['perubahan_data'] },
    { key: 'surat_pindah_perubahan',  label: 'Surat Pindah',                                    required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'akte_lahir_perubahan',    label: 'Akta Kelahiran / Ket. Lahir',                     required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'surat_kehilangan_perubahan', label: 'Surat Kehilangan',                             required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'ktp_ortu_perubahan',      label: 'KTP Orang Tua',                                   required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'ktp_saksi_perubahan',     label: 'KTP Saksi',                                       required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'ktp_pelapor_perubahan',   label: 'KTP Pelapor',                                     required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'ket_lahir_bidan_perubahan', label: 'Ket. Lahir Bidan / SPTJM Kelahiran',           required: false, showWhenKategori: ['perubahan_data'] },
    { key: 'form_kelahiran_f201_perubahan', label: 'Form Kelahiran Capil F-2.01',               required: false, showWhenKategori: ['perubahan_data'], formUrl: '/forms/F-2.01_FORMULIR_PELAPORAN_PENCATATAN_SIPIL.pdf' },
    { key: 'ktp_perubahan',           label: 'KTP',                                             required: false, showWhenKategori: ['perubahan_data'] },

    // AKTE HILANG
    { key: 'akta_lahir_hilang',       label: 'Akta Kelahiran / Ket. Lahir',                    required: true,  showWhenKategori: ['hilang'] },
    { key: 'kk_hilang_akte',          label: 'Kartu Keluarga',                                  required: true,  showWhenKategori: ['hilang'] },
    { key: 'surat_kehilangan_akte',   label: 'Surat Kehilangan dari Kepolisian',                required: true,  showWhenKategori: ['hilang'] },
    { key: 'ktp_hilang',              label: 'KTP',                                             required: true,  showWhenKategori: ['hilang'] },

    // AKTE RUSAK
    { key: 'akta_lahir_rusak',        label: 'Akta Kelahiran / Ket. Lahir',                    required: true,  showWhenKategori: ['rusak'] },
    { key: 'kk_rusak',                label: 'Kartu Keluarga',                                  required: true,  showWhenKategori: ['rusak'] },
    { key: 'ktp_pelapor_rusak',       label: 'KTP Pelapor',                                     required: true,  showWhenKategori: ['rusak'] },
    { key: 'ktp_rusak',               label: 'KTP',                                             required: true,  showWhenKategori: ['rusak'] },
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
    { key: 'nik_pemohon', label: 'NIK Pemohon', type: 'text', required: false, group: 'pemohon' },
    { key: 'no_kk', label: 'No. KK', type: 'text', required: false, group: 'pemohon' },
    { key: 'nama_pemohon', label: 'Nama Pemohon', type: 'text', required: true, group: 'pemohon' },
    { key: 'alamat', label: 'Alamat', type: 'textarea', required: false, group: 'pemohon' },
    { key: 'rt', label: 'RT', type: 'text', required: false, group: 'pemohon' },
    { key: 'rw', label: 'RW', type: 'text', required: false, group: 'pemohon' },
    { key: 'kelurahan', label: 'Kelurahan/Desa', type: 'text', required: false, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'kecamatan', label: 'Kecamatan', type: 'text', required: false, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'no_hp', label: 'No. Telp/HP', type: 'tel', required: true, placeholder: '08xxxxxxxxxx', group: 'pemohon' },
    { key: 'nama_almarhum', label: 'Nama Almarhum/Almarhumah', type: 'text', required: false, group: 'detail' },
    { key: 'nik_almarhum', label: 'NIK Almarhum/Almarhumah', type: 'text', required: false, group: 'detail' },
    { key: 'tanggal_wafat', label: 'Tanggal Wafat', type: 'date', required: false, group: 'detail' },
    { key: 'tempat_wafat', label: 'Tempat Wafat', type: 'text', required: false, placeholder: 'Rumah / RS / lainnya', group: 'detail' },
    { key: 'nik_pelapor', label: 'NIK Pelapor', type: 'text', required: false, group: 'pelapor' },
    { key: 'nama_pelapor', label: 'Nama Pelapor', type: 'text', required: false, group: 'pelapor' },
    { key: 'nama_saksi_1', label: 'Nama Saksi 1', type: 'text', required: false, group: 'detail' },
    { key: 'nama_saksi_2', label: 'Nama Saksi 2', type: 'text', required: false, group: 'detail' },
  ],
  dokumen: [
    { key: 'kk', label: 'Foto Kartu Keluarga (KK)', required: true },
    { key: 'ktp_almarhum', label: 'Foto KTP Almarhum/Almarhumah', required: true },
    { key: 'ktp_saksi_1', label: 'Foto KTP Saksi 1', required: true },
    { key: 'ktp_saksi_2', label: 'Foto KTP Saksi 2', required: false },
    { key: 'ktp_pelapor', label: 'Foto KTP Pelapor', required: true },
    { key: 'formulir_kematian_desa', label: 'Form Kematian F-2.01 (dari Desa, opsional)', required: false, formUrl: '/forms/FORMULIR_KEMATIAN_BARU.pdf' },
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
    { key: 'nik_pemohon', label: 'NIK Pemohon', type: 'text', required: false, group: 'pemohon' },
    { key: 'no_kk', label: 'No. KK', type: 'text', required: false, group: 'pemohon' },
    { key: 'nama_pemohon', label: 'Nama Pemohon', type: 'text', required: true, group: 'pemohon' },
    { key: 'alamat', label: 'Alamat Asal', type: 'textarea', required: false, group: 'pemohon' },
    { key: 'rt', label: 'RT', type: 'text', required: false, group: 'pemohon' },
    { key: 'rw', label: 'RW', type: 'text', required: false, group: 'pemohon' },
    { key: 'kelurahan', label: 'Kelurahan/Desa Asal', type: 'text', required: false, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'kecamatan', label: 'Kecamatan Asal', type: 'text', required: false, placeholder: 'Kasomalang', group: 'pemohon' },
    { key: 'no_hp', label: 'No. Telp/HP', type: 'tel', required: true, placeholder: '08xxxxxxxxxx', group: 'pemohon' },
    { key: 'alamat_tujuan', label: 'Alamat Tujuan Pindah', type: 'textarea', required: false, group: 'detail' },
    { key: 'kelurahan_tujuan', label: 'Kelurahan/Desa Tujuan', type: 'text', required: false, group: 'detail' },
    { key: 'kecamatan_tujuan', label: 'Kecamatan Tujuan', type: 'text', required: false, group: 'detail' },
    { key: 'kabupaten_tujuan', label: 'Kabupaten/Kota Tujuan', type: 'text', required: false, group: 'detail' },
    { key: 'alasan_pindah', label: 'Alasan Pindah', type: 'select', required: false, options: [
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
    { key: 'form_perpindahan_desa', label: 'Form Perpindahan dari Desa (F-1.03)', required: true, formUrl: '/forms/F-1.03_FORMULIR_PENDAFTARAN_PERPINDAHAN_PENDUDUK.pdf' },
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
