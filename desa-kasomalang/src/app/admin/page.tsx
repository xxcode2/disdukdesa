import { createClient } from '@/lib/supabase/server';
import { PengajuanRecord, StatusPengajuan } from '@/types';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DaftarPengajuan } from '@/components/admin/DaftarPengajuan';
import { TrenChart } from '@/components/admin/TrenChart';
import { FileText, CheckCircle, XCircle, Loader, CalendarCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;
const HARI_LABEL = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function toTanggalLokal(d: Date) {
  // Format YYYY-MM-DD berdasarkan tanggal lokal (bukan UTC) agar konsisten
  // dengan zona waktu Indonesia, supaya hari "hari ini" tidak salah hitung
  // saat mendekati tengah malam.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default async function HalamanAdmin({
  searchParams,
}: {
  searchParams: Promise<{ halaman?: string; status?: string; jenis?: string; dari?: string; sampai?: string; cari?: string }>;
}) {
  const params = await searchParams;
  const halaman = Math.max(1, Number(params.halaman ?? 1));
  const filterStatus = params.status ?? 'semua';
  const filterJenis = params.jenis ?? 'semua';
  const filterDari = params.dari ?? '';
  const filterSampai = params.sampai ?? '';
  const filterCari = params.cari ?? '';

  const supabase = await createClient();

  // Query untuk stat cards — hitung semua tanpa pagination
  const { data: semuaData } = await supabase
    .from('pengajuan')
    .select('status, created_at');

  const allStatus = (semuaData ?? []) as { status: StatusPengajuan; created_at: string }[];

  const hariIniStr = toTanggalLokal(new Date());
  const stats = {
    total: allStatus.length,
    baru: allStatus.filter((p) => p.status === 'baru').length,
    diproses: allStatus.filter((p) => p.status === 'diproses').length,
    selesai: allStatus.filter((p) => p.status === 'selesai').length,
    ditolak: allStatus.filter((p) => p.status === 'ditolak').length,
    hariIni: allStatus.filter((p) => toTanggalLokal(new Date(p.created_at)) === hariIniStr).length,
  };

  // Susun data tren 7 hari terakhir (termasuk hari ini)
  const trenData = Array.from({ length: 7 }, (_, i) => {
    const tgl = new Date();
    tgl.setDate(tgl.getDate() - (6 - i));
    const tanggalStr = toTanggalLokal(tgl);
    const jumlah = allStatus.filter((p) => toTanggalLokal(new Date(p.created_at)) === tanggalStr).length;
    return {
      tanggal: tanggalStr,
      labelHari: HARI_LABEL[tgl.getDay()],
      jumlah,
    };
  });

  // Query dengan filter server-side untuk pagination
  let query = supabase
    .from('pengajuan')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filterStatus !== 'semua') query = query.eq('status', filterStatus);
  if (filterJenis !== 'semua') query = query.eq('jenis_layanan', filterJenis);
  if (filterDari) query = query.gte('created_at', filterDari + 'T00:00:00');
  if (filterSampai) query = query.lte('created_at', filterSampai + 'T23:59:59');
  if (filterCari.trim()) {
    query = query.or(`nama_pemohon.ilike.%${filterCari}%,kode_tiket.ilike.%${filterCari}%,no_hp.ilike.%${filterCari}%`);
  }

  const from = (halaman - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  const pengajuanList = (data ?? []) as PengajuanRecord[];
  const totalHalaman = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <>
      <AdminHeader />
      <main className="flex-1 bg-kertas tekstur-kertas">
        <div className="mx-auto max-w-5xl px-5 py-8">
          <h1 className="font-display text-2xl font-bold text-tinta">Dashboard Admin</h1>
          <p className="text-sm text-tinta/60 mt-1 mb-6">
            Desa Kasomalang · {stats.total} total pengajuan · {stats.hariIni} masuk hari ini
          </p>

          {error && (
            <div className="rounded-xl bg-bata/10 border-2 border-bata px-4 py-3 text-sm font-semibold text-bata mb-4">
              Gagal memuat data: {error.message}
            </div>
          )}

          {/* STAT CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            <div className="rounded-2xl border-2 border-sawah-terang/50 bg-white p-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sawah-terang/15 text-sawah-gelap shrink-0">
                <CalendarCheck size={22} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-tinta leading-none">{stats.hariIni}</p>
                <p className="text-xs font-semibold text-tinta/60 mt-1">Hari Ini</p>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-garis bg-white p-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-tinta/5 text-tinta/70 shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-tinta leading-none">{stats.baru}</p>
                <p className="text-xs font-semibold text-tinta/60 mt-1">Baru</p>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-kuning-sawah/40 bg-white p-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-kuning-sawah/10 text-kuning-sawah shrink-0">
                <Loader size={22} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-tinta leading-none">{stats.diproses}</p>
                <p className="text-xs font-semibold text-tinta/60 mt-1">Diproses</p>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-sawah/40 bg-white p-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sawah/10 text-sawah-gelap shrink-0">
                <CheckCircle size={22} />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-tinta leading-none">{stats.selesai}</p>
                <p className="text-xs font-semibold text-tinta/60 mt-1">Selesai</p>
              </div>
            </div>
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

          {/* GRAFIK TREN */}
          <div className="mb-8">
            <TrenChart data={trenData} />
          </div>

          {/* DAFTAR PENGAJUAN */}
          <h2 className="font-display text-lg font-bold text-tinta mb-4">Daftar Pengajuan</h2>
          <DaftarPengajuan
            data={pengajuanList}
            totalCount={count ?? 0}
            halaman={halaman}
            totalHalaman={totalHalaman}
            pageSize={PAGE_SIZE}
            filterAktif={{ status: filterStatus, jenis: filterJenis, dari: filterDari, sampai: filterSampai, cari: filterCari }}
          />
        </div>
      </main>
    </>
  );
}
