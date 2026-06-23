'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, MessageCircle, Download, Calendar } from 'lucide-react';
import { PengajuanRecord, StatusPengajuan } from '@/types';
import { LAYANAN } from '@/lib/layanan';
import { StatusBadge } from '@/components/ui/StatusBadge';

const STATUS_FILTER: { value: StatusPengajuan | 'semua'; label: string }[] = [
  { value: 'semua', label: 'Semua' },
  { value: 'baru', label: 'Baru' },
  { value: 'diproses', label: 'Diproses' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'ditolak', label: 'Perlu Dilengkapi' },
];

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatTanggalPendek(tanggal: string) {
  // tanggal = "2026-06-23"
  const [y, m, d] = tanggal.split('-');
  return `${d}/${m}/${y}`;
}

function toTanggalInput(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

function waLink(noHp: string, namaPemohon: string, kodeTiket: string) {
  const nomor = noHp.replace(/^0/, '62').replace(/[^0-9]/g, '');
  const teks = encodeURIComponent(
    `Halo ${namaPemohon}, ini dari Kantor Desa Kasomalang terkait pengajuan Anda (kode: ${kodeTiket}).`
  );
  return `https://wa.me/${nomor}?text=${teks}`;
}

function exportKeExcel(data: PengajuanRecord[], labelTanggal: string) {
  const header = [
    'No', 'Kode Tiket', 'Jenis Layanan', 'Kategori',
    'Nama Pemohon', 'NIK Pemohon', 'No. KK', 'No. HP',
    'Alamat', 'RT', 'RW', 'Kelurahan', 'Kecamatan',
    'Status', 'Tanggal Pengajuan',
  ];

  const rows = data.map((p, i) => [
    String(i + 1),
    p.kode_tiket,
    LAYANAN[p.jenis_layanan]?.judul ?? p.jenis_layanan,
    p.kategori ?? '-',
    p.nama_pemohon,
    p.nik_pemohon ?? '-',
    // Tambah apostrof di depan angka panjang agar Excel tidak ubah jadi scientific notation
    p.no_kk ? `'${p.no_kk}` : '-',
    p.no_hp ? `'${p.no_hp}` : '-',
    p.alamat ?? '-',
    p.rt ?? '-',
    p.rw ?? '-',
    p.kelurahan ?? '-',
    p.kecamatan ?? '-',
    p.status,
    formatTanggal(p.created_at),
  ]);

  // Gunakan TAB sebagai separator → Excel otomatis deteksi kolom
  // Ekstensi .xls trick: Excel buka file .xls berisi TSV dan parsing otomatis per kolom
  const tsvContent = [header, ...rows]
    .map((row) => row.join('\t'))
    .join('\r\n');

  // BOM UTF-8 agar Excel baca huruf Indonesia dengan benar
  const blob = new Blob(['\uFEFF' + tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pengajuan_${labelTanggal}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DaftarPengajuan({ data }: { data: PengajuanRecord[] }) {
  const [statusAktif, setStatusAktif] = useState<StatusPengajuan | 'semua'>('semua');
  const [jenisAktif, setJenisAktif] = useState<string>('semua');
  const [cari, setCari] = useState('');
  const [filterTanggalDari, setFilterTanggalDari] = useState('');
  const [filterTanggalSampai, setFilterTanggalSampai] = useState('');

  const hasilFilter = useMemo(() => {
    return data.filter((p) => {
      if (statusAktif !== 'semua' && p.status !== statusAktif) return false;
      if (jenisAktif !== 'semua' && p.jenis_layanan !== jenisAktif) return false;
      if (filterTanggalDari) {
        if (toTanggalInput(p.created_at) < filterTanggalDari) return false;
      }
      if (filterTanggalSampai) {
        if (toTanggalInput(p.created_at) > filterTanggalSampai) return false;
      }
      if (cari.trim()) {
        const q = cari.toLowerCase();
        return (
          p.nama_pemohon.toLowerCase().includes(q) ||
          p.kode_tiket.toLowerCase().includes(q) ||
          p.no_hp.includes(q)
        );
      }
      return true;
    });
  }, [data, statusAktif, jenisAktif, cari, filterTanggalDari, filterTanggalSampai]);

  function handleExport() {
    let labelTanggal = 'semua';
    if (filterTanggalDari && filterTanggalSampai) {
      labelTanggal = `${filterTanggalDari}_sd_${filterTanggalSampai}`;
    } else if (filterTanggalDari) {
      labelTanggal = `dari_${filterTanggalDari}`;
    } else if (filterTanggalSampai) {
      labelTanggal = `sampai_${filterTanggalSampai}`;
    }
    exportKeExcel(hasilFilter, labelTanggal);
  }

  function setHariIni() {
    const hari = new Date().toISOString().slice(0, 10);
    setFilterTanggalDari(hari);
    setFilterTanggalSampai(hari);
  }

  function resetTanggal() {
    setFilterTanggalDari('');
    setFilterTanggalSampai('');
  }

  const adaFilterTanggal = filterTanggalDari || filterTanggalSampai;

  return (
    <div>
      {/* SEARCH */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta/40" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama, kode tiket, atau No. HP..."
            className="w-full rounded-xl border-2 border-garis bg-white pl-10 pr-4 py-2.5 text-sm focus:border-sawah transition-colors"
          />
        </div>

        {/* FILTER TANGGAL */}
        <div className="rounded-xl border-2 border-garis bg-white p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-semibold text-tinta/70">
              <Calendar size={14} />
              Filter Tanggal
            </div>
            <div className="flex gap-2">
              <button
                onClick={setHariIni}
                className="text-xs font-semibold text-sawah-gelap border-2 border-sawah/30 rounded-full px-3 py-1 hover:bg-sawah/10 transition-colors"
              >
                Hari Ini
              </button>
              {adaFilterTanggal && (
                <button
                  onClick={resetTanggal}
                  className="text-xs font-semibold text-bata border-2 border-bata/30 rounded-full px-3 py-1 hover:bg-bata/10 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex flex-col gap-0.5 flex-1 min-w-[120px]">
              <label className="text-[10px] font-semibold text-tinta/50 uppercase tracking-wide">Dari</label>
              <input
                type="date"
                value={filterTanggalDari}
                onChange={(e) => setFilterTanggalDari(e.target.value)}
                className="rounded-lg border-2 border-garis px-2 py-1.5 text-sm focus:border-sawah transition-colors"
              />
            </div>
            <span className="text-tinta/40 text-sm mt-4">—</span>
            <div className="flex flex-col gap-0.5 flex-1 min-w-[120px]">
              <label className="text-[10px] font-semibold text-tinta/50 uppercase tracking-wide">Sampai</label>
              <input
                type="date"
                value={filterTanggalSampai}
                onChange={(e) => setFilterTanggalSampai(e.target.value)}
                className="rounded-lg border-2 border-garis px-2 py-1.5 text-sm focus:border-sawah transition-colors"
              />
            </div>
          </div>
        </div>

        {/* FILTER STATUS */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTER.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusAktif(s.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border-2 transition-colors ${
                statusAktif === s.value
                  ? 'bg-sawah text-kertas border-sawah'
                  : 'bg-white text-tinta/70 border-garis hover:border-sawah-terang'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* FILTER JENIS */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setJenisAktif('semua')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border-2 transition-colors ${
              jenisAktif === 'semua'
                ? 'bg-tinta text-kertas border-tinta'
                : 'bg-white text-tinta/70 border-garis hover:border-tinta/40'
            }`}
          >
            Semua Jenis
          </button>
          {Object.values(LAYANAN).map((l) => (
            <button
              key={l.jenis}
              onClick={() => setJenisAktif(l.jenis)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border-2 transition-colors ${
                jenisAktif === l.jenis
                  ? 'bg-tinta text-kertas border-tinta'
                  : 'bg-white text-tinta/70 border-garis hover:border-tinta/40'
              }`}
            >
              {l.judul}
            </button>
          ))}
        </div>

        {/* INFO + EXPORT */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-tinta/50">
            Menampilkan <span className="font-bold text-tinta">{hasilFilter.length}</span> pengajuan
            {adaFilterTanggal && (
              <span className="ml-1 text-tinta/40">
                {filterTanggalDari && filterTanggalSampai
                  ? `(${formatTanggalPendek(filterTanggalDari)} – ${formatTanggalPendek(filterTanggalSampai)})`
                  : filterTanggalDari
                  ? `(dari ${formatTanggalPendek(filterTanggalDari)})`
                  : `(sampai ${formatTanggalPendek(filterTanggalSampai)})`}
              </span>
            )}
          </p>
          <button
            onClick={handleExport}
            disabled={hasilFilter.length === 0}
            className="flex items-center gap-1.5 text-xs font-semibold bg-sawah text-kertas rounded-full px-3.5 py-1.5 hover:bg-sawah-gelap transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={13} />
            Export Excel
          </button>
        </div>
      </div>

      {/* DAFTAR */}
      {hasilFilter.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-garis py-12 text-center">
          <p className="text-tinta/50 text-sm">Belum ada pengajuan yang cocok.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {hasilFilter.map((p) => (
            <div key={p.id} className="block rounded-2xl border-2 border-garis bg-white p-4 hover:border-sawah transition-colors">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/admin/${p.id}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
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
                  <a
                    href={waLink(p.no_hp, p.nama_pemohon, p.kode_tiket)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-sawah-gelap hover:underline"
                  >
                    <MessageCircle size={14} />
                    WA
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
