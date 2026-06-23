'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [memuat, setMemuat] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMemuat(true);
    setError('');

    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError('Email atau kata sandi salah.');
      setMemuat(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border-2 border-garis bg-white p-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold text-tinta">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border-2 border-garis px-4 py-3 text-[16px] focus:border-sawah transition-colors"
          placeholder="admin@email.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold text-tinta">
          Kata Sandi
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border-2 border-garis px-4 py-3 text-[16px] focus:border-sawah transition-colors"
          placeholder="••••••••"
        />
      </div>

      {error && <p className="text-sm font-semibold text-bata">{error}</p>}

      <Button type="submit" disabled={memuat} className="mt-2">
        {memuat ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
        Masuk
      </Button>
    </form>
  );
}
