import { StatusPengajuan } from '@/types';

const config: Record<StatusPengajuan, { label: string; className: string }> = {
  baru: { label: 'Baru', className: 'bg-sawah-terang/25 text-sawah-gelap border-sawah-terang' },
  diproses: { label: 'Diproses', className: 'bg-kuning-sawah/20 text-kuning-sawah border-kuning-sawah' },
  selesai: { label: 'Selesai', className: 'bg-sawah/15 text-sawah-gelap border-sawah' },
  ditolak: { label: 'Ditolak / Perlu Dilengkapi', className: 'bg-bata/15 text-bata border-bata' },
};

export function StatusBadge({ status }: { status: StatusPengajuan }) {
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${c.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {c.label}
    </span>
  );
}
