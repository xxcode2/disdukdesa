import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getLayanan } from '@/lib/layanan';

// Konfigurasi Batasan Upload
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB dalam bytes
const ALLOWED_MIME_TYPE = 'image/jpeg';
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg'];

// Inisialisasi Supabase Client (Server Side dengan Service Role)
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(url.trim(), key.trim());
}

function buatKodeTiket() {
  const tanggal = new Date();
  const yy = String(tanggal.getFullYear()).slice(2);
  const mm = String(tanggal.getMonth() + 1).padStart(2, '0');
  const dd = String(tanggal.getDate()).padStart(2, '0');
  const acak = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KSM-${yy}${mm}${dd}-${acak}`;
}

// Fungsi Validasi File
function validateFile(file: File): { valid: boolean; error?: string } {
  // Cek tipe MIME
  if (file.type !== ALLOWED_MIME_TYPE) {
    // Fallback cek ekstensi jika tipe MIME tidak terdeteksi dengan benar oleh browser tertentu
    const fileNameLower = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some(ext => fileNameLower.endsWith(ext));
    
    if (!hasValidExt) {
      return { 
        valid: false, 
        error: `Format file harus JPEG. File terdeteksi sebagai: ${file.type || 'unknown'}` 
      };
    }
  }

  // Cek ukuran file
  if (file.size > MAX_FILE_SIZE) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    return { 
      valid: false, 
      error: `Ukuran file terlalu besar (${sizeInMB} MB). Maksimal 1 MB.` 
    };
  }

  return { valid: true };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const jenisLayanan = String(formData.get('jenis_layanan') ?? '');
    const layanan = getLayanan(jenisLayanan);
    
    if (!layanan) {
      return NextResponse.json({ error: 'Jenis layanan tidak dikenali.' }, { status: 400 });
    }

    const kategori = formData.get('kategori') ? String(formData.get('kategori')) : null;

    // Field umum
    const namaPemohon = String(formData.get('nama_pemohon') ?? '').trim();
    const noHp = String(formData.get('no_hp') ?? '').trim();

    if (!namaPemohon || !noHp) {
      return NextResponse.json(
        { error: 'Nama pemohon dan No. HP wajib diisi.' },
        { status: 400 }
      );
    }

    const fieldUmum = [
      'nik_pemohon',
      'no_kk',
      'alamat',
      'rt',
      'rw',
      'kelurahan',
      'kecamatan',
      'nik_pelapor',
      'nama_pelapor',
    ];

    // Field spesifik (selain umum) masuk ke kolom `detail` sebagai JSON
    const detail: Record<string, string> = {};
    for (const field of layanan.fields) {
      if (fieldUmum.includes(field.key) || field.key === 'nama_pemohon' || field.key === 'no_hp') {
        continue;
      }
      const val = formData.get(field.key);
      if (val !== null && String(val).trim() !== '') {
        detail[field.key] = String(val).trim();
      }
    }

    const supabase = getServiceClient();
    const kodeTiket = buatKodeTiket();

    // 1. Simpan Data Utama Pengajuan Terlebih Dahulu
    const { data: pengajuan, error: insertError } = await supabase
      .from('pengajuan')
      .insert({
        kode_tiket: kodeTiket,
        jenis_layanan: jenisLayanan,
        kategori,
        nama_pemohon: namaPemohon,
        nik_pemohon: formData.get('nik_pemohon') ? String(formData.get('nik_pemohon')) : null,
        no_kk: formData.get('no_kk') ? String(formData.get('no_kk')) : null,
        no_hp: noHp,
        alamat: formData.get('alamat') ? String(formData.get('alamat')) : null,
        rt: formData.get('rt') ? String(formData.get('rt')) : null,
        rw: formData.get('rw') ? String(formData.get('rw')) : null,
        kelurahan: formData.get('kelurahan') ? String(formData.get('kelurahan')) : null,
        kecamatan: formData.get('kecamatan') ? String(formData.get('kecamatan')) : null,
        nik_pelapor: formData.get('nik_pelapor') ? String(formData.get('nik_pelapor')) : null,
        nama_pelapor: formData.get('nama_pelapor') ? String(formData.get('nama_pelapor')) : null,
        detail,
        status: 'baru',
      })
      .select('id, kode_tiket')
      .single();

    if (insertError || !pengajuan) {
      console.error('Insert pengajuan gagal:', insertError);
      return NextResponse.json(
        { error: 'Gagal menyimpan data pengajuan awal. Silakan coba lagi.' },
        { status: 500 }
      );
    }

    // 2. Proses Upload Dokumen
    const dokumenEntries: { 
      label: string; 
      nama_file: string; 
      path_storage: string; 
      ukuran_bytes: number; 
      tipe_file: string; 
      pengajuan_id: number | string; // Sesuaikan tipe ID
    }[] = [];

    let uploadFailed = false;

    for (const docDef of layanan.dokumen) {
      const file = formData.get(`dokumen__${docDef.key}`);
      
      if (file && file instanceof File && file.size > 0) {
        // --- VALIDASI FILE DI SINI ---
        const validation = validateFile(file);
        if (!validation.valid) {
          // Jika gagal, hapus pengajuan yang tadi dibuat agar tidak ada data sampah (opsional tapi disarankan)
          await supabase.from('pengajuan').delete().eq('id', pengajuan.id);
          
          return NextResponse.json(
            { error: `File '${docDef.label}' tidak valid: ${validation.error}` },
            { status: 400 }
          );
        }
        // -----------------------------

        const ext = file.name.split('.').pop() || 'jpg';
        // Pastikan path unik per pengajuan
        const path = `${pengajuan.id}/${docDef.key}_${Date.now()}.${ext}`;
        
        // Konversi ke ArrayBuffer untuk upload yang lebih stabil
        const arrayBuffer = await file.arrayBuffer();

        const { error: uploadError } = await supabase.storage
          .from('dokumen-warga')
          .upload(path, arrayBuffer, {
            contentType: ALLOWED_MIME_TYPE, // Force content type ke jpeg
            upsert: false,
          });

        if (uploadError) {
          console.error(`Upload gagal untuk ${docDef.key}:`, uploadError);
          uploadFailed = true;
          // Opsional: Break loop atau lanjutkan? Di sini kita stop dan rollback.
          break; 
        }

        dokumenEntries.push({
          label: docDef.label,
          nama_file: file.name,
          path_storage: path,
          ukuran_bytes: file.size,
          tipe_file: file.type,
          pengajuan_id: pengajuan.id,
        });
      }
    }

    if (uploadFailed) {
      // Rollback: Hapus pengajuan jika upload gagal
      await supabase.from('pengajuan').delete().eq('id', pengajuan.id);
      return NextResponse.json(
        { error: 'Gagal mengunggah dokumen. Pastikan format JPEG dan ukuran < 1MB.' },
        { status: 500 }
      );
    }

    // 3. Simpan Referensi Dokumen ke Tabel 'dokumen' jika ada file yang diupload
    if (dokumenEntries.length > 0) {
      const { error: dokError } = await supabase.from('dokumen').insert(dokumenEntries);
      
      if (dokError) {
        console.error('Gagal menyimpan referensi dokumen ke DB:', dokError);
        // Rollback kompleks: Hapus file dari storage dan hapus pengajuan
        const pathsToDelete = dokumenEntries.map(d => d.path_storage);
        await supabase.storage.from('dokumen-warga').remove(pathsToDelete);
        await supabase.from('pengajuan').delete().eq('id', pengajuan.id);

        return NextResponse.json(
          { error: 'Gagal menyimpan metadata dokumen.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ 
      success: true,
      kodeTiket: pengajuan.kode_tiket,
      message: 'Pengajuan berhasil dikirim!'
    });

  } catch (err) {
    console.error('Error tak terduga saat submit pengajuan:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan di server. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}