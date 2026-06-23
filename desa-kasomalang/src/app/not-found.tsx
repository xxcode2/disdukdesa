import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 tekstur-kertas flex items-center">
        <div className="mx-auto max-w-md px-5 py-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-bata/10 text-bata mb-5">
            <FileQuestion size={32} />
          </div>
          <h1 className="font-display text-2xl font-bold text-tinta">Halaman tidak ditemukan</h1>
          <p className="mt-2 text-tinta/70 text-[15px]">
            Jenis layanan yang Anda cari tidak tersedia. Silakan pilih dari daftar layanan yang ada.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-sawah text-kertas font-semibold px-5 py-3 hover:bg-sawah-gelap transition-colors"
          >
            Kembali ke Halaman Utama
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
