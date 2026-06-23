import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createServiceClient(url.trim(), key.trim());
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 });
  }

  const body = await req.json();
  const update: Record<string, string> = {};

  if (typeof body.status === 'string') update.status = body.status;
  if (typeof body.catatan_admin === 'string') update.catatan_admin = body.catatan_admin;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Tidak ada data untuk diperbarui.' }, { status: 400 });
  }

  const { error } = await supabase.from('pengajuan').update(update).eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Cek login admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 });
  }

  // Gunakan service role untuk hapus storage + data
  const service = getServiceClient();

  // 1. Ambil semua path dokumen milik pengajuan ini
  const { data: dokumenList } = await service
    .from('dokumen')
    .select('path_storage')
    .eq('pengajuan_id', id);

  // 2. Hapus file dari storage (jika ada)
  if (dokumenList && dokumenList.length > 0) {
    const paths = dokumenList.map((d: { path_storage: string }) => d.path_storage);
    await service.storage.from('dokumen-warga').remove(paths);
  }

  // 3. Hapus pengajuan (cascade akan hapus baris di tabel dokumen juga)
  const { error } = await service.from('pengajuan').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
