import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b-2 border-garis bg-kertas/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="mx-auto max-w-3xl px-5 py-4 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sawah text-kertas font-display font-bold text-base shrink-0">
            DK
          </span>
          <span className="leading-tight">
            <span className="block font-display font-bold text-[15px] text-tinta">
              Desa Kasomalang
            </span>
            <span className="block text-xs text-tinta/60 -mt-0.5">Layanan Surat Online</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
