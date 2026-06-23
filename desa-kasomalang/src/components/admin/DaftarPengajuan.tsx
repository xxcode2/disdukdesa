'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, MessageCircle } from 'lucide-react';
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
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function waLink(noHp: string, namaPemohon: string, kodeTiket: string) {
  const nomor = noHp.replace(/^0/, '62').replace(/[^0-9]/g, '');
  const teks = encodeURIComponent(
    `Halo ${namaPemohon}, ini dari Kantor Desa Kasomalang terkait pengajuan Anda (kode: ${kodeTiket}).`
  );
  return `https://wa.me/${nomor}?text=${teks}`;
}

export function DaftarPengajuan({ data }: { data: PengajuanRecord[] }) {
  const [statusAktif, setStatusAktif] = useState<StatusPengajuan | 'semua'>('semua');
  const [jenisAktif, setJenisAktif] = useState<string>('semua');
  const [cari, setCari] = useState('');

  const hasilFilter = useMemo(() => {
    return data.filter((p) => {
      if (statusAktif !== 'semua' && p.status !== statusAktif) return false;
      if (jenisAktif !== 'semua' && p.jenis_layanan !== jenisAktif) return false;
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
  }, [data, statusAktif, jenisAktif, cari]);

  return (
    <div>
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
      </div>

      {hasilFilter.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-garis py-12 text-center">
          <p className="text-tinta/50 text-sm">Belum ada pengajuan yang cocok.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {hasilFilter.map((p) => (
            <div
              key={p.id}
              className="block rounded-2xl border-2 border-garis bg-white p-4 hover:border-sawah transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <Link href={`/admin/${p.id}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-tinta/50">{p.kode_tiket}</span>
                    <span className="text-xs font-semibold text-sawah-gelap bg-sawah/10 rounded-full px-2 py-0.5">
                      {LAYANAN[p.jenis_layanan]?.judul ?? p.jenis_layanan}
                    </span>
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
