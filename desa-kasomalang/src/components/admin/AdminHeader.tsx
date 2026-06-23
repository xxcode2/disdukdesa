import Link from 'next/link';
import { LogoutButton } from './LogoutButton';

export function AdminHeader() {
  return (
    <header className="border-b-2 border-garis bg-kertas/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="mx-auto max-w-5xl px-5 py-4 flex items-center justify-between gap-3">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sawah text-kertas font-display font-bold text-sm shrink-0">
            DK
          </span>
          <span className="leading-tight">
            <span className="block font-display font-bold text-sm text-tinta">Admin Desa Kasomalang Kulon</span>
          </span>
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
