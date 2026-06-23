'use client';

interface DataHarian {
  tanggal: string; // YYYY-MM-DD
  labelHari: string; // "Sen", "Sel", dst
  jumlah: number;
}

interface TrenChartProps {
  data: DataHarian[];
}

export function TrenChart({ data }: TrenChartProps) {
  const maks = Math.max(1, ...data.map((d) => d.jumlah));
  const lebarBar = 32;
  const gap = 14;
  const tinggiChart = 120;
  const lebarSvg = data.length * (lebarBar + gap) - gap;

  return (
    <div className="rounded-2xl border-2 border-garis bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-tinta text-sm">Tren 7 Hari Terakhir</h3>
        <p className="text-xs text-tinta/50">Jumlah pengajuan masuk per hari</p>
      </div>

      <svg
        viewBox={`0 0 ${lebarSvg} ${tinggiChart + 28}`}
        className="w-full"
        style={{ maxHeight: 160 }}
        role="img"
        aria-label="Grafik tren pengajuan 7 hari terakhir"
      >
        {data.map((d, i) => {
          const x = i * (lebarBar + gap);
          const tinggiBar = d.jumlah === 0 ? 2 : Math.max(4, (d.jumlah / maks) * tinggiChart);
          const y = tinggiChart - tinggiBar;
          const isHariIni = i === data.length - 1;

          return (
            <g key={d.tanggal}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={lebarBar}
                height={tinggiBar}
                rx={6}
                className={isHariIni ? 'fill-sawah' : 'fill-sawah opacity-40'}
              />
              {/* Angka di atas bar */}
              <text
                x={x + lebarBar / 2}
                y={y - 6}
                textAnchor="middle"
                className="fill-tinta text-[11px] font-bold"
              >
                {d.jumlah}
              </text>
              {/* Label hari di bawah */}
              <text
                x={x + lebarBar / 2}
                y={tinggiChart + 18}
                textAnchor="middle"
                className={`text-[10px] font-semibold ${isHariIni ? 'fill-sawah-gelap' : 'fill-tinta opacity-50'}`}
              >
                {d.labelHari}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
