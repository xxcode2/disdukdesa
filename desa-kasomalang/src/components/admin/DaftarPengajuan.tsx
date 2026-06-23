'use client';

import { useCallback, useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, MessageCircle, Download, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { PengajuanRecord, StatusPengajuan } from '@/types';
import { LAYANAN } from '@/lib/layanan';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface FilterAktif {
  status: string;
  jenis: string;
  dari: string;
  sampai: string;
  cari: string;
}

interface Props {
  data: PengajuanRecord[];
  totalCount: number;
  halaman: number;
  totalHalaman: number;
  pageSize: number;
  filterAktif: FilterAktif;
}

const STATUS_FILTER: { value: StatusPengajuan | 'semua'; label: string }[] = [
  { value: 'semua', label: 'Semua' },
  { value: 'baru', label: 'Baru' },
  { value: 'diproses', label: 'Diproses' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'ditolak', label: 'Perlu Dilengkapi' },
];

const KOLOM_CSV = [
  { header: 'No',                key: (p: PengajuanRecord, i: number) => String(i + 1) },
  { header: 'Kode Tiket',        key: (p: PengajuanRecord) => p.kode_tiket },
  { header: 'Jenis Layanan',     key: (p: PengajuanRecord) => LAYANAN[p.jenis_layanan]?.judul ?? p.jenis_layanan },
  { header: 'Kategori',          key: (p: PengajuanRecord) => p.kategori ?? '-' },
  { header: 'Nama Pemohon',      key: (p: PengajuanRecord) => p.nama_pemohon },
  { header: 'NIK Pemohon',       key: (p: PengajuanRecord) => p.nik_pemohon ?? '-' },
  { header: 'No. KK',            key: (p: PengajuanRecord) => p.no_kk ?? '-' },
  { header: 'No. HP',            key: (p: PengajuanRecord) => p.no_hp },
  { header: 'Alamat',            key: (p: PengajuanRecord) => p.alamat ?? '-' },
  { header: 'RT',                key: (p: PengajuanRecord) => p.rt ?? '-' },
  { header: 'RW',                key: (p: PengajuanRecord) => p.rw ?? '-' },
  { header: 'Kelurahan',         key: (p: PengajuanRecord) => p.kelurahan ?? '-' },
  { header: 'Kecamatan',         key: (p: PengajuanRecord) => p.kecamatan ?? '-' },
  { header: 'Status',            key: (p: PengajuanRecord) => p.status },
  { header: 'Tanggal Pengajuan', key: (p: PengajuanRecord) => formatTanggal(p.created_at) },
];

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatTanggalPendek(t: string) {
  const [y, m, d] = t.split('-');
  return `${d}/${m}/${y}`;
}

function waLink(noHp: string, namaPemohon: string, kodeTiket: string) {
  const nomor = noHp.replace(/^0/, '62').replace(/[^0-9]/g, '');
  const teks = encodeURIComponent(`Halo ${namaPemohon}, ini dari Kantor Desa Kasomalang terkait pengajuan Anda (kode: ${kodeTiket}).`);
  return `https://wa.me/${nomor}?text=${teks}`;
}

function exportKeCSV(data: PengajuanRecord[], labelTanggal: string) {
  // Pakai delimiter titik-koma (;) karena Excel berlocale Indonesia/Eropa
  // membaca koma (,) sebagai pemisah desimal, bukan pemisah kolom — jika
  // dibiarkan koma, kolom akan kelihatan "geser/acak" saat file dibuka
  // langsung (double-click) di Excel.
  const DELIMITER = ';';

  // Bersihkan newline di dalam teks (mis. dari field alamat yang multi-baris)
  // supaya satu baris data CSV selalu = satu baris fisik di file, dan tidak
  // membuat baris terlihat "pecah" saat dibuka di Excel/Notepad.
  const bersihkan = (s: string) => String(s).replace(/\r\n|\r|\n/g, ' ').trim();
  const kutip = (s: string) => `"${bersihkan(s).replace(/"/g, '""')}"`;

  const header = KOLOM_CSV.map((k) => kutip(k.header)).join(DELIMITER);
  const rows = data.map((p, i) => KOLOM_CSV.map((k) => kutip(k.key(p, i))).join(DELIMITER));
  const csv = '\uFEFF' + [header, ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pengajuan_${labelTanggal}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DaftarPengajuan({ data, totalCount, halaman, totalHalaman, pageSize, filterAktif }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // State lokal untuk input — di-commit ke URL saat user tekan filter/enter
  const [cari, setCari] = useState(filterAktif.cari);
  const [statusAktif, setStatusAktif] = useState(filterAktif.status);
  const [jenisAktif, setJenisAktif] = useState(filterAktif.jenis);
  const [filterDari, setFilterDari] = useState(filterAktif.dari);
  const [filterSampai, setFilterSampai] = useState(filterAktif.sampai);

  const buildUrl = useCallback((overrides: Partial<FilterAktif & { halaman: number }>) => {
    const params = new URLSearchParams();
    const merged = {
      status: statusAktif,
      jenis: jenisAktif,
      dari: filterDari,
      sampai: filterSampai,
      cari,
      halaman: 1,
      ...overrides,
    };
    if (merged.status && merged.status !== 'semua') params.set('status', merged.status);
    if (merged.jenis && merged.jenis !== 'semua') params.set('jenis', merged.jenis);
    if (merged.dari) params.set('dari', merged.dari);
    if (merged.sampai) params.set('sampai', merged.sampai);
    if (merged.cari?.trim()) params.set('cari', merged.cari.trim());
    if (merged.halaman > 1) params.set('halaman', String(merged.halaman));
    const q = params.toString();
    return q ? `${pathname}?${q}` : pathname;
  }, [pathname, statusAktif, jenisAktif, filterDari, filterSampai, cari]);

  function navigate(overrides: Partial<FilterAktif & { halaman: number }>) {
    startTransition(() => router.push(buildUrl(overrides)));
  }

  function setHariIni() {
    const hari = new Date().toISOString().slice(0, 10);
    setFilterDari(hari);
    setFilterSampai(hari);
    navigate({ dari: hari, sampai: hari });
  }

  function resetTanggal() {
    setFilterDari('');
    setFilterSampai('');
    navigate({ dari: '', sampai: '' });
  }

  const adaFilterTanggal = filterAktif.dari || filterAktif.sampai;
  const mulaiNo = (halaman - 1) * pageSize + 1;

  return (
    <div className={isPending ? 'opacity-60 pointer-events-none transition-opacity' : ''}>
      <div className="flex flex-col gap-3 mb-5">

        {/* Search */}
        <form onSubmit={(e) => { e.preventDefault(); navigate({ cari }); }} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta/40" />
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari nama, kode tiket, atau No. HP..."
              className="w-full rounded-xl border-2 border-garis bg-white pl-10 pr-4 py-2.5 text-sm focus:border-sawah transition-colors"
            />
          </div>
          <button type="submit" className="rounded-xl border-2 border-sawah bg-sawah text-kertas px-4 py-2 text-sm font-semibold hover:bg-sawah-gelap transition-colors shrink-0">
            Cari
          </button>
        </form>

        {/* Filter tanggal */}
        <div className="rounded-xl border-2 border-garis bg-white p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-semibold text-tinta/70">
              <Calendar size={14} /> Filter Tanggal
            </div>
            <div className="flex gap-2">
              <button onClick={setHariIni} className="text-xs font-semibold text-sawah-gelap border-2 border-sawah/30 rounded-full px-3 py-1 hover:bg-sawah/10 transition-colors">Hari Ini</button>
              {(filterDari || filterSampai) && (
                <button onClick={resetTanggal} className="text-xs font-semibold text-bata border-2 border-bata/30 rounded-full px-3 py-1 hover:bg-bata/10 transition-colors">Reset</button>
              )}
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex flex-col gap-0.5 flex-1 min-w-[130px]">
              <label className="text-[10px] font-semibold text-tinta/50 uppercase tracking-wide">Dari</label>
              <input type="date" value={filterDari}
                onChange={(e) => { setFilterDari(e.target.value); navigate({ dari: e.target.value }); }}
                className="rounded-lg border-2 border-garis px-2 py-1.5 text-sm focus:border-sawah transition-colors"
              />
            </div>
            <span className="text-tinta/40 text-sm mt-4">—</span>
            <div className="flex flex-col gap-0.5 flex-1 min-w-[130px]">
              <label className="text-[10px] font-semibold text-tinta/50 uppercase tracking-wide">Sampai</label>
              <input type="date" value={filterSampai}
                onChange={(e) => { setFilterSampai(e.target.value); navigate({ sampai: e.target.value }); }}
                className="rounded-lg border-2 border-garis px-2 py-1.5 text-sm focus:border-sawah transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Filter status */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTER.map((s) => (
            <button key={s.value}
              onClick={() => { setStatusAktif(s.value); navigate({ status: s.value }); }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border-2 transition-colors ${statusAktif === s.value ? 'bg-sawah text-kertas border-sawah' : 'bg-white text-tinta/70 border-garis hover:border-sawah-terang'}`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Filter jenis */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setJenisAktif('semua'); navigate({ jenis: 'semua' }); }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border-2 transition-colors ${jenisAktif === 'semua' ? 'bg-tinta text-kertas border-tinta' : 'bg-white text-tinta/70 border-garis hover:border-tinta/40'}`}>
            Semua Jenis
          </button>
          {Object.values(LAYANAN).map((l) => (
            <button key={l.jenis} onClick={() => { setJenisAktif(l.jenis); navigate({ jenis: l.jenis }); }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border-2 transition-colors ${jenisAktif === l.jenis ? 'bg-tinta text-kertas border-tinta' : 'bg-white text-tinta/70 border-garis hover:border-tinta/40'}`}>
              {l.judul}
            </button>
          ))}
        </div>

        {/* Info + Export */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-tinta/50">
            <span className="font-bold text-tinta">{totalCount}</span> hasil
            {adaFilterTanggal && (
              <span className="ml-1 text-tinta/40">
                {filterAktif.dari && filterAktif.sampai
                  ? `(${formatTanggalPendek(filterAktif.dari)} – ${formatTanggalPendek(filterAktif.sampai)})`
                  : filterAktif.dari ? `(dari ${formatTanggalPendek(filterAktif.dari)})` : `(sampai ${formatTanggalPendek(filterAktif.sampai)})`}
              </span>
            )}
            {totalHalaman > 1 && <span className="ml-1">· hal. {halaman}/{totalHalaman}</span>}
          </p>
          <button onClick={() => exportKeCSV(data, filterAktif.dari && filterAktif.sampai ? `${filterAktif.dari}_sd_${filterAktif.sampai}` : 'halaman')}
            disabled={data.length === 0}
            className="flex items-center gap-1.5 text-xs font-semibold bg-sawah text-kertas rounded-full px-3.5 py-1.5 hover:bg-sawah-gelap transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Daftar */}
      {data.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-garis py-12 text-center">
          <p className="text-tinta/50 text-sm">Belum ada pengajuan yang cocok.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((p, idx) => (
            <div key={p.id} className="block rounded-2xl border-2 border-garis bg-white p-4 hover:border-sawah transition-colors">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/admin/${p.id}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-tinta/30 w-6 shrink-0">{mulaiNo + idx}</span>
                    <span className="font-mono text-xs font-bold text-tinta/50">{p.kode_tiket}</span>
                    <span className="text-xs font-semibold text-sawah-gelap bg-sawah/10 rounded-full px-2 py-0.5">
                      {LAYANAN[p.jenis_layanan]?.judul ?? p.jenis_layanan}
                    </span>
                    {p.kategori && (
                      <span className="text-xs font-semibold text-emas-gelap bg-emas/10 rounded-full px-2 py-0.5 capitalize">
                        {p.kategori.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <p className="font-display font-bold text-tinta mt-1 truncate">{p.nama_pemohon}</p>
                  <p className="text-xs text-tinta/50 mt-0.5">{formatTanggal(p.created_at)}</p>
                </Link>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <StatusBadge status={p.status} />
                  <a href={waLink(p.no_hp, p.nama_pemohon, p.kode_tiket)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-sawah-gelap hover:underline">
                    <MessageCircle size={14} /> WA
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalHalaman > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => navigate({ halaman: halaman - 1 })}
            disabled={halaman <= 1}
            className="flex items-center gap-1 rounded-xl border-2 border-garis px-3 py-2 text-sm font-semibold text-tinta hover:border-sawah transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Sebelumnya
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalHalaman }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalHalaman || Math.abs(n - halaman) <= 1)
              .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(n);
                return acc;
              }, [])
              .map((n, i) =>
                n === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 py-2 text-sm text-tinta/40">…</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => navigate({ halaman: n as number })}
                    className={`h-9 w-9 rounded-xl text-sm font-bold border-2 transition-colors ${halaman === n ? 'bg-sawah text-kertas border-sawah' : 'border-garis text-tinta hover:border-sawah'}`}
                  >
                    {n}
                  </button>
                )
              )}
          </div>

          <button
            onClick={() => navigate({ halaman: halaman + 1 })}
            disabled={halaman >= totalHalaman}
            className="flex items-center gap-1 rounded-xl border-2 border-garis px-3 py-2 text-sm font-semibold text-tinta hover:border-sawah transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Berikutnya <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
