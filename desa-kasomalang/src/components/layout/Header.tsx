import Link from 'next/link';
import { Home, HelpCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b-2 border-garis bg-kertas/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="mx-auto max-w-3xl px-5 py-4 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sawah text-kertas font-display font-bold text-base shrink-0">
            DK
          </span>
          <span className="leading-tight">
            <span className="block font-display font-bold text-[15px] text-tinta">
              Desa Kasomalang Kulon
            </span>
            <span className="block text-xs text-tinta/60 -mt-0.5">Layanan Surat Online</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/bantuan"
            className="flex items-center gap-1.5 text-xs font-semibold text-tinta/60 border-2 border-garis rounded-full px-3 py-1.5 hover:border-sawah hover:text-sawah-gelap transition-colors"
          >
            <HelpCircle size={13} />
            <span className="hidden sm:inline">Bantuan</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-tinta/60 border-2 border-garis rounded-full px-3 py-1.5 hover:border-sawah hover:text-sawah-gelap transition-colors"
          >
            <Home size={13} />
            <span className="hidden sm:inline">Beranda</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
