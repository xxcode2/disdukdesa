import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url.trim(), key.trim());
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ kode: string }> }
) {
  const { kode } = await params;

  if (!kode || kode.length < 5) {
    return NextResponse.json({ error: 'Kode tiket tidak valid.' }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from('pengajuan')
    .select('kode_tiket, jenis_layanan, kategori, nama_pemohon, status, catatan_admin, created_at, updated_at')
    .eq('kode_tiket', kode.toUpperCase())
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Kode tiket tidak ditemukan.' }, { status: 404 });
  }

  return NextResponse.json(data);
}
