import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DokumenRecord, PengajuanRecord } from '@/types';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DetailPengajuan } from '@/components/admin/DetailPengajuan';

export const dynamic = 'force-dynamic';

export default async function HalamanDetailPengajuan({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pengajuan } = await supabase
    .from('pengajuan')
    .select('*')
    .eq('id', id)
    .single();

  if (!pengajuan) {
    notFound();
  }

  const { data: dokumenList } = await supabase
    .from('dokumen')
    .select('*')
    .eq('pengajuan_id', id)
    .order('created_at', { ascending: true });

  // Buat signed URL untuk tiap dokumen (berlaku 1 jam) agar admin bisa lihat/download
  const dokumenDenganUrl = await Promise.all(
    ((dokumenList ?? []) as DokumenRecord[]).map(async (d) => {
      const { data: signed } = await supabase.storage
        .from('dokumen-warga')
        .createSignedUrl(d.path_storage, 3600);
      return { ...d, url: signed?.signedUrl ?? null };
    })
  );

  return (
    <>
      <AdminHeader />
      <main className="flex-1 bg-kertas tekstur-kertas">
        <div className="mx-auto max-w-3xl px-5 py-8">
          <DetailPengajuan
            pengajuan={pengajuan as PengajuanRecord}
            dokumen={dokumenDenganUrl}
          />
        </div>
      </main>
    </>
  );
}
