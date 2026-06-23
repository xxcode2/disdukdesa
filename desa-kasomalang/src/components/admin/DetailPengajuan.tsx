'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, MessageCircle, Loader2, Check, Download, X, Trash2, AlertTriangle } from 'lucide-react';
import { PengajuanRecord, StatusPengajuan } from '@/types';
import { LAYANAN } from '@/lib/layanan';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';

interface DokumenDenganUrl {
  id: string;
  label: string;
  nama_file: string;
  url: string | null;
  tipe_file: string | null;
  ukuran_bytes: number | null;
}

interface DetailPengajuanProps {
  pengajuan: PengajuanRecord;
  dokumen: DokumenDenganUrl[];
}

const STATUS_OPTIONS: { value: StatusPengajuan; label: string }[] = [
  { value: 'baru', label: 'Baru' },
  { value: 'diproses', label: 'Diproses' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'ditolak', label: 'Perlu Dilengkapi' },
];

const LABEL_FIELD: Record<string, string> = {
  nik_pemohon: 'NIK Pemohon',
  no_kk: 'No. KK',
  alamat: 'Alamat',
  rt: 'RT',
  rw: 'RW',
  kelurahan: 'Kelurahan/Desa',
  kecamatan: 'Kecamatan',
  nik_pelapor: 'NIK Pelapor',
  nama_pelapor: 'Nama Pelapor',
};

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function waLink(noHp: string, namaPemohon: string, kodeTiket: string) {
  const nomor = noHp.replace(/^0/, '62').replace(/[^0-9]/g, '');
  const teks = encodeURIComponent(
    `Halo ${namaPemohon}, ini dari Kantor Desa Kasomalang terkait pengajuan Anda (kode: ${kodeTiket}).`
  );
  return `https://wa.me/${nomor}?text=${teks}`;
}

function formatUkuran(bytes: number | null) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── MODAL FOTO ──────────────────────────────────────────────────────────────
function ModalFoto({
  url,
  label,
  namaFile,
  namaPemohon,
  onClose,
}: {
  url: string;
  label: string;
  namaFile: string;
  namaPemohon: string;
  onClose: () => void;
}) {
  // Nama file download: "KTP Pemohon - Budi Santoso.jpg"
  const ext = namaFile.split('.').pop() ?? 'jpg';
  const namaDownload = `${label} - ${namaPemohon}.${ext}`;

  async function handleDownload() {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = namaDownload;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(url, '_blank');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header modal */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b-2 border-garis shrink-0">
          <div className="min-w-0">
            <p className="font-display font-bold text-tinta truncate">{label}</p>
            <p className="text-xs text-tinta/50">{namaFile}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs font-semibold bg-sawah text-kertas rounded-full px-3 py-1.5 hover:bg-sawah-gelap transition-colors"
            >
              <Download size={13} />
              Download
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-garis transition-colors"
            >
              <X size={18} className="text-tinta/60" />
            </button>
          </div>
        </div>
        {/* Gambar */}
        <div className="overflow-auto flex-1 flex items-center justify-center bg-kertas p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={label}
            className="max-w-full max-h-[70vh] object-contain rounded-xl shadow"
          />
        </div>
      </div>
    </div>
  );
}

// ── MODAL KONFIRMASI HAPUS ──────────────────────────────────────────────────
function ModalHapus({
  namaPemohon,
  onConfirm,
  onCancel,
  loading,
}: {
  namaPemohon: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bata/10 shrink-0">
            <AlertTriangle size={24} className="text-bata" />
          </div>
          <div>
            <p className="font-display font-bold text-tinta">Hapus Pengajuan?</p>
            <p className="text-sm text-tinta/60 mt-0.5">
              Pengajuan atas nama <strong>{namaPemohon}</strong> akan dihapus permanen beserta semua dokumennya.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border-2 border-garis px-4 py-2 text-sm font-semibold text-tinta hover:bg-garis transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-bata text-kertas px-4 py-2 text-sm font-semibold hover:bg-bata/80 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ── KOMPONEN UTAMA ──────────────────────────────────────────────────────────
export function DetailPengajuan({ pengajuan, dokumen }: DetailPengajuanProps) {
  const router = useRouter();
  const [status, setStatus] = useState<StatusPengajuan>(pengajuan.status);
  const [catatan, setCatatan] = useState(pengajuan.catatan_admin ?? '');
  const [menyimpan, setMenyimpan] = useState(false);
  const [tersimpan, setTersimpan] = useState(false);
  const [fotoModal, setFotoModal] = useState<DokumenDenganUrl | null>(null);
  const [showHapus, setShowHapus] = useState(false);
  const [menghapus, setMenghapus] = useState(false);

  const layanan = LAYANAN[pengajuan.jenis_layanan];

  const fieldUmumTerisi = Object.entries(LABEL_FIELD).filter(
    ([key]) => pengajuan[key as keyof PengajuanRecord]
  );

  const fieldDetailLabel: Record<string, string> = {};
  if (layanan) {
    for (const f of layanan.fields) {
      fieldDetailLabel[f.key] = f.label;
    }
  }

  async function simpanPerubahan() {
    setMenyimpan(true);
    setTersimpan(false);
    try {
      const res = await fetch(`/api/admin/pengajuan/${pengajuan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, catatan_admin: catatan }),
      });
      if (res.ok) {
        setTersimpan(true);
        setTimeout(() => setTersimpan(false), 2500);
      }
    } finally {
      setMenyimpan(false);
    }
  }

  async function hapusPengajuan() {
    setMenghapus(true);
    try {
      const res = await fetch(`/api/admin/pengajuan/${pengajuan.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      }
    } finally {
      setMenghapus(false);
      setShowHapus(false);
    }
  }

  return (
    <div className="anim-muncul">
      {/* Modal foto */}
      {fotoModal && fotoModal.url && (
        <ModalFoto
          url={fotoModal.url}
          label={fotoModal.label}
          namaFile={fotoModal.nama_file}
          namaPemohon={pengajuan.nama_pemohon}
          onClose={() => setFotoModal(null)}
        />
      )}

      {/* Modal hapus */}
      {showHapus && (
        <ModalHapus
          namaPemohon={pengajuan.nama_pemohon}
          onConfirm={hapusPengajuan}
          onCancel={() => setShowHapus(false)}
          loading={menghapus}
        />
      )}

      <div className="flex items-center justify-between gap-3 mb-4">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-tinta/60 hover:text-sawah-gelap">
          <ArrowLeft size={16} />
          Kembali ke daftar
        </Link>
        <button
          onClick={() => setShowHapus(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-bata border-2 border-bata/30 rounded-full px-3 py-1.5 hover:bg-bata/10 transition-colors"
        >
          <Trash2 size={13} />
          Hapus Pengajuan
        </button>
      </div>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <span className="font-mono text-xs font-bold text-tinta/50">{pengajuan.kode_tiket}</span>
          <h1 className="font-display text-2xl font-bold text-tinta mt-1">{pengajuan.nama_pemohon}</h1>
          <p className="text-sm text-tinta/60 mt-1">
            {layanan?.judul ?? pengajuan.jenis_layanan}
            {pengajuan.kategori && (
              <span className="ml-1.5">
                &middot; {layanan?.kategori?.find((k) => k.value === pengajuan.kategori)?.label ?? pengajuan.kategori}
              </span>
            )}
          </p>
          <p className="text-xs text-tinta/40 mt-1">Diajukan {formatTanggal(pengajuan.created_at)}</p>
        </div>
        <StatusBadge status={pengajuan.status} />
      </div>

      <a
        href={waLink(pengajuan.no_hp, pengajuan.nama_pemohon, pengajuan.kode_tiket)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-sawah text-kertas font-semibold px-4 py-2.5 text-sm hover:bg-sawah-gelap transition-colors"
      >
        <MessageCircle size={18} />
        Hubungi {pengajuan.no_hp} via WhatsApp
      </a>

      {/* Data pemohon */}
      <section className="mt-6 rounded-2xl border-2 border-garis bg-white p-5">
        <h2 className="font-display font-bold text-tinta text-base border-b-2 border-garis pb-2 mb-3">
          Data Pemohon &amp; Pelapor
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fieldUmumTerisi.map(([key, label]) => (
            <div key={key}>
              <dt className="text-xs font-semibold text-tinta/50 uppercase tracking-wide">{label}</dt>
              <dd className="text-sm text-tinta mt-0.5">{String(pengajuan[key as keyof PengajuanRecord])}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Detail spesifik */}
      {Object.keys(pengajuan.detail ?? {}).length > 0 && (
        <section className="mt-4 rounded-2xl border-2 border-garis bg-white p-5">
          <h2 className="font-display font-bold text-tinta text-base border-b-2 border-garis pb-2 mb-3">
            Detail Pengajuan
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(pengajuan.detail ?? {}).map(([key, val]) => (
              <div key={key}>
                <dt className="text-xs font-semibold text-tinta/50 uppercase tracking-wide">
                  {fieldDetailLabel[key] ?? key}
                </dt>
                <dd className="text-sm text-tinta mt-0.5 whitespace-pre-wrap">{String(val)}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Dokumen — klik buka modal, bukan tab baru */}
      <section className="mt-4 rounded-2xl border-2 border-garis bg-white p-5">
        <h2 className="font-display font-bold text-tinta text-base border-b-2 border-garis pb-2 mb-3">
          Berkas Terlampir ({dokumen.length})
        </h2>
        {dokumen.length === 0 ? (
          <p className="text-sm text-tinta/50">Belum ada berkas yang terunggah.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {dokumen.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => d.url && setFotoModal(d)}
                disabled={!d.url}
                className="flex items-center justify-between gap-3 rounded-xl border-2 border-garis px-4 py-3 hover:border-sawah hover:bg-sawah/5 transition-colors text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={18} className="text-sawah-gelap shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-tinta truncate">{d.label}</p>
                    <p className="text-xs text-tinta/50">{formatUkuran(d.ukuran_bytes)}</p>
                  </div>
                </div>
                <span className="text-xs text-sawah-gelap font-semibold shrink-0">Lihat</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Status & catatan */}
      <section className="mt-4 rounded-2xl border-2 border-garis bg-white p-5">
        <h2 className="font-display font-bold text-tinta text-base border-b-2 border-garis pb-2 mb-3">
          Status &amp; Catatan Internal
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-tinta block mb-2">Status Pengajuan</label>
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border-2 transition-colors ${
                    status === s.value
                      ? 'bg-sawah text-kertas border-sawah'
                      : 'bg-white text-tinta/70 border-garis hover:border-sawah-terang'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="catatan" className="text-sm font-semibold text-tinta block mb-2">
              Catatan (hanya terlihat oleh admin)
            </label>
            <textarea
              id="catatan"
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: KTP istri kurang jelas, sudah di-WA tanggal 23 Juni"
              className="w-full rounded-xl border-2 border-garis px-4 py-3 text-sm focus:border-sawah transition-colors resize-none"
            />
          </div>
          <Button onClick={simpanPerubahan} disabled={menyimpan} className="self-start">
            {menyimpan ? <Loader2 size={18} className="animate-spin" /> : tersimpan ? <Check size={18} /> : null}
            {tersimpan ? 'Tersimpan' : 'Simpan Perubahan'}
          </Button>
        </div>
      </section>
    </div>
  );
}
