import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getLayanan } from '@/lib/layanan';

// Pakai service role di server agar insert + upload pasti berhasil
// terlepas dari RLS, tapi tetap kita validasi jenis & field wajib di sini.
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function buatKodeTiket() {
  const tanggal = new Date();
  const yy = String(tanggal.getFullYear()).slice(2);
  const mm = String(tanggal.getMonth() + 1).padStart(2, '0');
  const dd = String(tanggal.getDate()).padStart(2, '0');
  const acak = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KSM-${yy}${mm}${dd}-${acak}`;
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
        { error: 'Gagal menyimpan pengajuan. Silakan coba lagi.' },
        { status: 500 }
      );
    }

    // Upload setiap dokumen yang terlampir
    const dokumenEntries: { label: string; nama_file: string; path_storage: string; ukuran_bytes: number; tipe_file: string }[] = [];

    for (const docDef of layanan.dokumen) {
      const file = formData.get(`dokumen__${docDef.key}`);
      if (file && file instanceof File && file.size > 0) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${pengajuan.id}/${docDef.key}.${ext}`;
        const arrayBuffer = await file.arrayBuffer();

        const { error: uploadError } = await supabase.storage
          .from('dokumen-warga')
          .upload(path, arrayBuffer, {
            contentType: file.type,
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload gagal untuk ${docDef.key}:`, uploadError);
          continue;
        }

        dokumenEntries.push({
          label: docDef.label,
          nama_file: file.name,
          path_storage: path,
          ukuran_bytes: file.size,
          tipe_file: file.type,
        });
      }
    }

    if (dokumenEntries.length > 0) {
      const { error: dokError } = await supabase.from('dokumen').insert(
        dokumenEntries.map((d) => ({ ...d, pengajuan_id: pengajuan.id }))
      );
      if (dokError) {
        console.error('Gagal menyimpan referensi dokumen:', dokError);
      }
    }

    return NextResponse.json({ kodeTiket: pengajuan.kode_tiket });
  } catch (err) {
    console.error('Error tak terduga saat submit pengajuan:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan di server. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
