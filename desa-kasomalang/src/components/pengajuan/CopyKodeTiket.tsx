'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyKodeTiket({ kode }: { kode: string }) {
  const [disalin, setDisalin] = useState(false);

  async function salin() {
    try {
      await navigator.clipboard.writeText(kode);
      setDisalin(true);
      setTimeout(() => setDisalin(false), 2000);
    } catch {
      // Abaikan jika clipboard tidak didukung; kode tetap terlihat di layar
    }
  }

  return (
    <div className="mt-6 rounded-2xl border-2 border-sawah bg-sawah/5 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-sawah-gelap">Kode Tiket Anda</p>
      <p className="font-display text-2xl font-bold text-tinta mt-1 tracking-wide">{kode}</p>
      <button
        type="button"
        onClick={salin}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-sawah-gelap hover:underline"
      >
        {disalin ? <Check size={16} /> : <Copy size={16} />}
        {disalin ? 'Tersalin' : 'Salin kode'}
      </button>
    </div>
  );
}
