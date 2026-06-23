import Link from 'next/link';
import { CheckCircle2, Home } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CopyKodeTiket } from '@/components/pengajuan/CopyKodeTiket';

export default async function HalamanSukses({
  searchParams,
}: {
  searchParams: Promise<{ kode?: string }>;
}) {
  const { kode } = await searchParams;

  return (
    <>
      <Header />
      <main className="flex-1 tekstur-kertas flex items-center">
        <div className="mx-auto max-w-md px-5 py-10 text-center anim-muncul">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sawah/10 text-sawah-gelap mb-5">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="font-display text-2xl font-bold text-tinta">Pengajuan terkirim</h1>
          <p className="mt-2 text-tinta/70 text-[15px] leading-relaxed">
            Simpan kode tiket di bawah ini. Petugas desa akan menghubungi nomor HP yang Anda
            daftarkan lewat WhatsApp jika ada berkas yang kurang, atau saat surat Anda sudah selesai.
          </p>

          {kode && <CopyKodeTiket kode={kode} />}

          <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sawah-gelap hover:underline">
            <Home size={16} />
            Kembali ke Halaman Utama
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
