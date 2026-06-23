import { createClient } from '@/lib/supabase/server';
import { PengajuanRecord } from '@/types';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DaftarPengajuan } from '@/components/admin/DaftarPengajuan';

export const dynamic = 'force-dynamic';

export default async function HalamanAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pengajuan')
    .select('*')
    .order('created_at', { ascending: false });

  const pengajuanList = (data ?? []) as PengajuanRecord[];

  return (
    <>
      <AdminHeader />
      <main className="flex-1 bg-kertas tekstur-kertas">
        <div className="mx-auto max-w-5xl px-5 py-8">
          <h1 className="font-display text-2xl font-bold text-tinta">Daftar Pengajuan</h1>
          <p className="text-sm text-tinta/60 mt-1 mb-6">
            {pengajuanList.length} pengajuan tercatat
          </p>

          {error && (
            <div className="rounded-xl bg-bata/10 border-2 border-bata px-4 py-3 text-sm font-semibold text-bata mb-4">
              Gagal memuat data: {error.message}
            </div>
          )}

          <DaftarPengajuan data={pengajuanList} />
        </div>
      </main>
    </>
  );
}
