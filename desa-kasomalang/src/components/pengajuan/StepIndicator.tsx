interface StepIndicatorProps {
  langkah: number;
  totalLangkah: number;
  labelLangkah: string[];
}

export function StepIndicator({ langkah, totalLangkah, labelLangkah }: StepIndicatorProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalLangkah }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                i + 1 <= langkah ? 'bg-sawah text-kertas' : 'bg-kertas-2 text-tinta/40 border-2 border-garis'
              }`}
            >
              {i + 1}
            </div>
            {i < totalLangkah - 1 && (
              <div className={`h-0.5 flex-1 rounded ${i + 1 < langkah ? 'bg-sawah' : 'bg-garis'}`} />
            )}
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm font-semibold text-tinta/70">{labelLangkah[langkah - 1]}</p>
    </div>
  );
}
