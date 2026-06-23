'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft, CheckCircle, Clock, XCircle, Loader2, FileText, MessageCircleMore } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type StatusPengajuan = 'baru' | 'diproses' | 'selesai' | 'ditolak';

interface HasilCek {
  kode_tiket: string;
  jenis_layanan: string;
  kategori: string | null;
  nama_pemohon: string;
  status: StatusPengajuan;
  catatan_admin: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_INFO: Record<StatusPengajuan, { label: string; deskripsi: string; warna: string; icon: React.ElementType }> = {
  baru: {
    label: 'Pengajuan Diterima',
    deskripsi: 'Berkas Anda sudah diterima dan sedang menunggu antrian pemeriksaan oleh petugas.',
    warna: 'border-biru/30 bg-biru/5 text-biru',
    icon: FileText,
  },
  diproses: {
    label: 'Sedang Diproses',
    deskripsi: 'Petugas sedang memeriksa dan memproses berkas Anda. Mohon tunggu.',
    warna: 'border-emas/40 bg-emas/5 text-emas-gelap',
    icon: Clock,
  },
  selesai: {
    label: 'Selesai ✓',
    deskripsi: 'Surat Anda sudah selesai diproses! Silakan datang ke kantor desa atau tunggu informasi lebih lanjut dari petugas.',
    warna: 'border-sawah/40 bg-sawah/5 text-sawah-gelap',
    icon: CheckCircle,
  },
  ditolak: {
    label: 'Perlu Dilengkapi',
    deskripsi: 'Ada berkas atau data yang perlu dilengkapi. Petugas akan menghubungi Anda via WhatsApp.',
    warna: 'border-bata/30 bg-bata/5 text-bata',
    icon: XCircle,
  },
};

const JENIS_LABEL: Record<string, string> = {
  kk: 'Kartu Keluarga (KK)',
  akte_lahir: 'Akte Kelahiran',
  akte_mati: 'Akte Kematian',
  surat_pindah: 'Surat Pindah',
};

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// Stepper status
const STEPS: StatusPengajuan[] = ['baru', 'diproses', 'selesai'];
const STEP_LABEL: Record<string, string> = { baru: 'Diterima', diproses: 'Diproses', selesai: 'Selesai' };

function StepperStatus({ status }: { status: StatusPengajuan }) {
  if (status === 'ditolak') return null;
  const activeIdx = STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-0 mt-4">
      {STEPS.map((step, i) => {
        const done = i <= activeIdx;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${done ? 'bg-sawah border-sawah text-kertas' : 'border-garis text-tinta/30 bg-white'}`}>
                {i + 1}
              </div>
              <span className={`text-[10px] font-semibold mt-1 ${done ? 'text-sawah-gelap' : 'text-tinta/30'}`}>{STEP_LABEL[step]}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 mb-4 rounded-full transition-colors ${i < activeIdx ? 'bg-sawah' : 'bg-garis'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function HalamanCekStatus() {
  const [kode, setKode] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<HasilCek | null>(null);
  const [error, setError] = useState('');

  async function handleCek(e: React.FormEvent) {
    e.preventDefault();
    const kodeBersih = kode.trim().toUpperCase();
    if (!kodeBersih) return;

    setLoading(true);
    setError('');
    setHasil(null);

    try {
      const res = await fetch(`/api/cek/${encodeURIComponent(kodeBersih)}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Kode tiket tidak ditemukan.');
      } else {
        setHasil(json);
      }
    } catch {
      setError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  }

  const statusInfo = hasil ? STATUS_INFO[hasil.status] : null;

  return (
    <>
      <Header />
      <main className="flex-1 tekstur-kertas">
        <div className="mx-auto max-w-xl px-5 py-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-tinta/60 hover:text-sawah-gelap mb-6">
            <ArrowLeft size={15} /> Kembali ke Beranda
          </Link>

          <h1 className="font-display text-2xl font-bold text-tinta">Cek Status Pengajuan</h1>
          <p className="text-sm text-tinta/60 mt-1 mb-6">
            Masukkan kode tiket yang Anda terima setelah mengirimkan pengajuan.
          </p>

          {/* Form input */}
          <form onSubmit={handleCek} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta/40" />
              <input
                value={kode}
                onChange={(e) => setKode(e.target.value.toUpperCase())}
                placeholder="Contoh: KSM-260623-AB12"
                className="w-full rounded-xl border-2 border-garis bg-white pl-10 pr-4 py-3 text-sm font-mono font-semibold focus:border-sawah transition-colors uppercase tracking-widest"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !kode.trim()}
              className="rounded-xl bg-sawah text-kertas font-semibold px-4 py-3 text-sm hover:bg-sawah-gelap transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Cek
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-xl border-2 border-bata/30 bg-bata/5 px-4 py-3 text-sm font-semibold text-bata">
              {error}
            </div>
          )}

          {/* Hasil */}
          {hasil && statusInfo && (
            <div className="mt-6 anim-muncul">
              <div className={`rounded-2xl border-2 p-5 ${statusInfo.warna}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${statusInfo.warna}`}>
                    <statusInfo.icon size={26} />
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg">{statusInfo.label}</p>
                    <p className="text-sm opacity-80 mt-0.5">{statusInfo.deskripsi}</p>
                  </div>
                </div>

                {/* Stepper */}
                <StepperStatus status={hasil.status} />
              </div>

              {/* Detail */}
              <div className="mt-4 rounded-2xl border-2 border-garis bg-white p-5 flex flex-col gap-3">
                <dl className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-[10px] font-semibold text-tinta/40 uppercase tracking-wide">Kode Tiket</dt>
                    <dd className="font-mono font-bold text-tinta text-sm">{hasil.kode_tiket}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold text-tinta/40 uppercase tracking-wide">Nama Pemohon</dt>
                    <dd className="font-semibold text-tinta text-sm">{hasil.nama_pemohon}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold text-tinta/40 uppercase tracking-wide">Jenis Layanan</dt>
                    <dd className="text-tinta text-sm">{JENIS_LABEL[hasil.jenis_layanan] ?? hasil.jenis_layanan}</dd>
                  </div>
                  {hasil.kategori && (
                    <div>
                      <dt className="text-[10px] font-semibold text-tinta/40 uppercase tracking-wide">Kategori</dt>
                      <dd className="text-tinta text-sm capitalize">{hasil.kategori.replace('_', ' ')}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-[10px] font-semibold text-tinta/40 uppercase tracking-wide">Tanggal Pengajuan</dt>
                    <dd className="text-tinta text-sm">{formatTanggal(hasil.created_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold text-tinta/40 uppercase tracking-wide">Terakhir Diperbarui</dt>
                    <dd className="text-tinta text-sm">{formatTanggal(hasil.updated_at)}</dd>
                  </div>
                </dl>

                {/* Catatan admin */}
                {hasil.catatan_admin && (
                  <div className="rounded-xl border-2 border-emas/30 bg-emas/5 px-4 py-3">
                    <p className="text-[10px] font-bold text-emas-gelap uppercase tracking-wide mb-1">Pesan dari Petugas</p>
                    <p className="text-sm text-tinta">{hasil.catatan_admin}</p>
                  </div>
                )}
              </div>

              {/* Kontak desa */}
              <a
                href="https://wa.me/6285196553835?text=Halo%20Desa%20Kasomalang%2C%20saya%20ingin%20menanyakan%20status%20pengajuan%20saya."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-sawah/30 bg-sawah/5 p-4 hover:bg-sawah/10 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sawah text-kertas shrink-0">
                  <MessageCircleMore size={20} />
                </div>
                <div>
                  <p className="font-semibold text-tinta text-sm">Ada pertanyaan?</p>
                  <p className="text-xs text-tinta/60">Hubungi Desa Kasomalang Kulon: <strong>0851-9655-3835</strong></p>
                </div>
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
