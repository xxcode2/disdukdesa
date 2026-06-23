export type JenisLayanan = 'kk' | 'akte_lahir' | 'akte_mati' | 'surat_pindah';

export type StatusPengajuan = 'baru' | 'diproses' | 'selesai' | 'ditolak';

export type FieldType = 'text' | 'tel' | 'textarea' | 'radio' | 'select' | 'date';

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  helpText?: string;
  // Jika field ini hanya tampil untuk kategori tertentu (mis. KK baru vs perubahan data)
  showWhenKategori?: string[];
  group?: 'pemohon' | 'pelapor' | 'detail';
}

export interface DocumentRequirement {
  key: string;
  label: string;
  helpText?: string;
  required: boolean;
  showWhenKategori?: string[];
}

export interface KategoriOption {
  value: string;
  label: string;
  description: string;
}

export interface LayananDefinition {
  jenis: JenisLayanan;
  judul: string;
  deskripsiSingkat: string;
  kategori?: KategoriOption[];
  fields: FieldDefinition[];
  dokumen: DocumentRequirement[];
}

export interface PengajuanRecord {
  id: string;
  kode_tiket: string;
  jenis_layanan: JenisLayanan;
  kategori: string | null;
  nama_pemohon: string;
  nik_pemohon: string | null;
  no_kk: string | null;
  no_hp: string;
  alamat: string | null;
  rt: string | null;
  rw: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  nik_pelapor: string | null;
  nama_pelapor: string | null;
  detail: Record<string, string>;
  catatan_admin: string | null;
  status: StatusPengajuan;
  created_at: string;
  updated_at: string;
}

export interface DokumenRecord {
  id: string;
  pengajuan_id: string;
  label: string;
  nama_file: string;
  path_storage: string;
  ukuran_bytes: number | null;
  tipe_file: string | null;
  created_at: string;
}
