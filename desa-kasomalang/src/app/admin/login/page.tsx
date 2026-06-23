import { LoginForm } from '@/components/admin/LoginForm';

export default function HalamanLoginAdmin() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-kertas tekstur-kertas px-5">
      <div className="w-full max-w-sm anim-muncul">
        <div className="text-center mb-8">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sawah text-kertas font-display font-bold text-base mb-3">
            DK
          </span>
          <h1 className="font-display text-xl font-bold text-tinta">Masuk Admin</h1>
          <p className="text-sm text-tinta/60 mt-1">Kantor Desa Kasomalang</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
