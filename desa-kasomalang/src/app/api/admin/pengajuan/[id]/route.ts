import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Pastikan request berasal dari admin yang sudah login
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
