import { createClient } from '@/lib/supabase/server';
import { PengajuanRecord } from '@/types';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DaftarPengajuan } from '@/components/admin/DaftarPengajuan';
import { FileText, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';

export const dynamic = 'force-dynamic';

function StatCard({
  label,
  nilai,
  warna,
  icon: Icon,
}: {
  label: string;
  nilai: number;
  warna: string;
  icon: React.ElementType;
}) {
  return (
    <div className={`rounded-2xl border-2 bg-white p-4 flex items-center gap-4 ${warna}`}>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl shrink-0 icon-bg`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-tinta leading-none">{nilai}</p>
        <p className="text-xs font-semibold text-tinta/60 mt-1">{label}</p>
      </div>
    </div>
  );
}

export default async function HalamanAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pengajuan')
    .select('*')
    .order('created_at', { ascending: false });

  const pengajuanList = (data ?? []) as PengajuanRecord[];

  // Hitung statistik
  const stats = {
    total: pengajuanList.length,
    baru: pengajuanList.filter((p) => p.status === 'baru').length,
    diproses: pengajuanList.filter((p) => p.status === 'diproses').length,
    selesai: pengajuanList.filter((p) => p.status === 'selesai').length,
    ditolak: pengajuanList.filter((p) => p.status === 'ditolak').length,
  };

  return (
    <>
      <AdminHeader />
      <main className="flex-1 bg-kertas tekstur-kertas">
        <div className="mx-auto max-w-5xl px-5 py-8">
          <h1 className="font-display text-2xl font-bold text-tinta">Dashboard Admin</h1>
          <p className="text-sm text-tinta/60 mt-1 mb-6">
            Desa Kasomalang · {pengajuanList.length} total pengajuan
          </p>

          {error && (
            <div className="rounded-xl bg-bata/10 border-2 border-bata px-4 py-3 text-sm font-semibold text-bata mb-4">
              Gagal memuat data: {error.message}
            </div>
          )}

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {/* Baru */}
            <div className="rounded-2xl border-2 border-biru/30 bg-white p-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-biru/10 text-biru shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-tinta leading-none">{stats.baru}</p>
                <p className="text-xs font-semibold text-tinta/60 mt-1">Baru</p>
              </div>
            </div>

            {/* Diproses */}
            <div className="rounded-2xl border-2 border-emas/40 bg-white p-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emas/10 text-emas-gelap shrink-0">
                <Loader size={22} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-tinta leading-none">{stats.diproses}</p>
                <p className="text-xs font-semibold text-tinta/60 mt-1">Diproses</p>
              </div>
            </div>

            {/* Selesai */}
            <div className="rounded-2xl border-2 border-sawah/40 bg-white p-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sawah/10 text-sawah-gelap shrink-0">
                <CheckCircle size={22} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-tinta leading-none">{stats.selesai}</p>
                <p className="text-xs font-semibold text-tinta/60 mt-1">Selesai</p>
              </div>
            </div>

            {/* Perlu Dilengkapi */}
            <div className="rounded-2xl border-2 border-bata/30 bg-white p-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bata/10 text-bata shrink-0">
                <XCircle size={22} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-tinta leading-none">{stats.ditolak}</p>
                <p className="text-xs font-semibold text-tinta/60 mt-1">Perlu Dilengkapi</p>
              </div>
            </div>
          </div>

          {/* ── DAFTAR PENGAJUAN ── */}
          <h2 className="font-display text-lg font-bold text-tinta mb-4">Daftar Pengajuan</h2>
          <DaftarPengajuan data={pengajuanList} />
        </div>
      </main>
    </>
  );
}
