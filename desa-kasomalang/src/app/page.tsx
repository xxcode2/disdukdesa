import Link from 'next/link';
import { Users, Baby, HeartCrack, Truck, ArrowRight, MessageCircleMore, ChevronDown, TicketCheck } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// ──────────────────────────────────────────────
// DATA PERSYARATAN PER LAYANAN
// ──────────────────────────────────────────────
const persyaratan = [
  {
    href: '/ajukan/kk',
    icon: Users,
    judul: 'Kartu Keluarga (KK)',
    warna: 'bg-sawah/10 text-sawah-gelap',
    border: 'border-sawah/30',
    kategori: [
      {
        label: 'KK Baru',
        dokumen: [
          'Surat Nikah / Cerai / SPTJM (jika sudah menikah)',
          'Ijasah / Ket. Tidak Punya Ijasah (opsional)',
          'Akta Kelahiran / Ket. Lahir (opsional)',
          'Form Biodata KK F-1.01 (dari Desa) (opsional)',
          'Kartu Keluarga (wajib jika sudah menikah; jika belum, ikut KK orang tua)',
          'Form KK Baru F-1.15 (dari Desa)',
          'KTP Asli / Foto KTP (suami/istri jika sudah menikah; satu saja jika belum)',
          'Surat Keterangan Peristiwa Kependudukan (opsional)',
          'Form Permohonan Dafduk F-1.02 (dari Desa)',
        ],
      },
      {
        label: 'Perubahan Data',
        dokumen: [
          'Kartu Keluarga Lama / Rusak',
          'Surat Nikah / Cerai / SPTJM (opsional)',
          'Surat Pindah (opsional)',
          'Ijasah / Ket. Tidak Punya Ijasah (opsional)',
          'Akta Kelahiran / Ket. Lahir (opsional)',
          'Form Perubahan KK F-1.06 (dari Desa) (opsional)',
          'Form Biodata KK F-1.01 (opsional)',
          'KTP Asli / Foto KTP (suami/istri jika sudah menikah; satu saja jika belum)',
          'Akta Kematian (opsional)',
          'Surat Keterangan Peristiwa Kependudukan (opsional)',
          'Form Permohonan Dafduk F-1.02 (dari Desa)',
        ],
      },
      {
        label: 'KK Hilang',
        dokumen: [
          'Form Biodata KK F-1.01 (opsional)',
          'Kartu Keluarga (opsional jika hilang, lampirkan fotokopi jika ada)',
          'Surat Kehilangan dari Kepolisian',
          'Form KK Baru F-1.15 (opsional)',
          'KTP Asli / Foto KTP',
          'Form Permohonan Dafduk F-1.02 (dari Desa)',
        ],
      },
      {
        label: 'KK Rusak',
        dokumen: [
          'Kartu Keluarga Lama / Rusak',
          'Surat Nikah / Cerai / SPTJM',
          'Form Biodata KK F-1.01',
          'Form KK Baru F-1.15',
          'KTP Asli / Foto KTP',
          'Form Permohonan Dafduk F-1.02 (dari Desa)',
        ],
      },
    ],
  },
  {
    href: '/ajukan/akte_lahir',
    icon: Baby,
    judul: 'Akte Kelahiran',
    warna: 'bg-biru/10 text-biru-gelap',
    border: 'border-biru/30',
    kategori: [
      {
        label: 'Akte Baru',
        dokumen: [
          'Surat Nikah / Cerai / SPTJM',
          'Kartu Keluarga',
          'KTP Orang Tua',
          'KTP Saksi',
          'KTP Pelapor',
          'Ket. Lahir Bidan / SPTJM Kelahiran',
          'Form Kelahiran Capil F-2.01',
        ],
      },
      {
        label: 'Perubahan Data',
        dokumen: [
          'Kartu Keluarga Lama / Rusak',
          'Surat Nikah / Cerai / SPTJM',
          'Surat Pindah (opsional)',
          'Akta Kelahiran / Ket. Lahir (opsional)',
          'Surat Kehilangan (opsional)',
          'KTP Orang Tua',
          'KTP Saksi',
          'KTP Pelapor',
          'Ket. Lahir Bidan / SPTJM Kelahiran',
          'Form Kelahiran Capil F-2.01',
          'KTP Asli / Foto KTP',
        ],
      },
      {
        label: 'Akte Hilang',
        dokumen: [
          'Akta Kelahiran / Ket. Lahir',
          'Kartu Keluarga',
          'Surat Kehilangan dari Kepolisian',
          'KTP Asli / Foto KTP',
        ],
      },
      {
        label: 'Akte Rusak',
        dokumen: [
          'Akta Kelahiran / Ket. Lahir',
          'Kartu Keluarga',
          'KTP Pelapor',
          'KTP Asli / Foto KTP',
        ],
      },
    ],
  },
  {
    href: '/ajukan/akte_mati',
    icon: HeartCrack,
    judul: 'Akte Kematian',
    warna: 'bg-bata/10 text-bata',
    border: 'border-bata/30',
    kategori: [
      {
        label: 'Persyaratan',
        dokumen: [
          'Kartu Keluarga (KK)',
          'KTP Almarhum/Almarhumah',
          'KTP Saksi 1',
          'KTP Saksi 2',
          'KTP Pelapor',
          'Formulir Kematian dari Desa',
          'Surat / Ket. Kematian dari RS atau Desa',
        ],
      },
    ],
  },
  {
    href: '/ajukan/surat_pindah',
    icon: Truck,
    judul: 'Surat Pindah',
    warna: 'bg-emas/10 text-emas-gelap',
    border: 'border-emas/30',
    kategori: [
      {
        label: 'Persyaratan',
        dokumen: [
          'Kartu Keluarga (KK)',
          'Foto Copy KTP',
          'Form Perpindahan dari Desa (jika ada)',
        ],
      },
    ],
  },
];

// ──────────────────────────────────────────────
// KOMPONEN ACCORDION PERSYARATAN
// ──────────────────────────────────────────────
function KartuPersyaratan({
  href,
  icon: Icon,
  judul,
  warna,
  border,
  kategori,
}: (typeof persyaratan)[0]) {
  return (
    <details className={`group rounded-2xl border-2 ${border} bg-white overflow-hidden`}>
      <summary className="flex cursor-pointer items-center gap-4 p-5 list-none select-none">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${warna} shrink-0`}>
          <Icon size={22} />
        </div>
        <span className="font-display font-bold text-tinta text-base flex-1">{judul}</span>
        <ChevronDown
          size={18}
          className="text-tinta/40 shrink-0 transition-transform duration-200 group-open:rotate-180"
        />
      </summary>

      <div className="px-5 pb-5 flex flex-col gap-4 border-t-2 border-garis pt-4">
        {kategori.map((kat) => (
          <div key={kat.label}>
            {kategori.length > 1 && (
              <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${warna.split(' ')[1]}`}>
                {kat.label}
              </p>
            )}
            <ul className="flex flex-col gap-1.5">
              {kat.dokumen.map((dok, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-tinta/80">
                  <span className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${warna}`}>
                    {i + 1}
                  </span>
                  {dok}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <Link
          href={href}
          className={`mt-1 inline-flex items-center gap-1.5 text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors ${warna} hover:opacity-80`}
        >
          Ajukan Sekarang
          <ArrowRight size={15} />
        </Link>
      </div>
    </details>
  );
}

// ──────────────────────────────────────────────
// HALAMAN UTAMA
// ──────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 tekstur-kertas">
        <div className="mx-auto max-w-3xl px-5 py-10">

          {/* Hero */}
          <div className="anim-muncul">
            <span className="inline-block rounded-full bg-sawah/10 text-sawah-gelap text-xs font-bold uppercase tracking-wide px-3 py-1 mb-4">
              Pelayanan Mandiri
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-tinta leading-tight">
              Ajukan surat tanpa harus bolak-balik ke kantor desa
            </h1>
            <p className="mt-3 text-tinta/70 text-[15px] leading-relaxed max-w-xl">
              Pilih jenis surat yang ingin dibuat, isi data dan unggah berkas dari rumah.
              Petugas desa akan menghubungi Anda lewat WhatsApp jika ada berkas yang kurang
              atau saat surat sudah selesai.
            </p>
            <Link
              href="/cek"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-sawah bg-sawah text-kertas font-semibold px-5 py-2.5 text-sm hover:bg-sawah-gelap transition-colors"
            >
              <TicketCheck size={16} />
              Cek Status Pengajuan
            </Link>
          </div>

          {/* Pilihan layanan cepat */}
          <div className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-4">
            {persyaratan.map(({ href, icon: Icon, judul, warna }, i) => (
              <Link
                key={href}
                href={href}
                style={{ animationDelay: `${i * 60}ms` }}
                className="anim-muncul group flex flex-col items-center gap-2 rounded-2xl border-2 border-garis bg-white p-4 transition-all hover:border-sawah hover:shadow-[3px_3px_0_0_var(--sawah)] text-center"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${warna}`}>
                  <Icon size={22} />
                </div>
                <span className="text-sm font-semibold text-tinta leading-snug">{judul}</span>
                <span className="text-xs text-sawah-gelap font-semibold flex items-center gap-0.5">
                  Ajukan <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          {/* Persyaratan */}
          <div className="mt-10 anim-muncul">
            <h2 className="font-display text-xl font-bold text-tinta mb-1">Persyaratan Dokumen</h2>
            <p className="text-sm text-tinta/60 mb-5">
              Klik layanan di bawah untuk melihat berkas apa saja yang perlu disiapkan sebelum mengajukan.
            </p>
            <div className="flex flex-col gap-3">
              {persyaratan.map((item) => (
                <KartuPersyaratan key={item.href} {...item} />
              ))}
            </div>
          </div>

          {/* Info tiket + kontak WA desa */}
          <div className="anim-muncul mt-8 flex flex-col gap-3">
            <div className="flex items-start gap-3 rounded-2xl border-2 border-garis bg-kertas-2 p-5">
              <MessageCircleMore size={22} className="text-sawah-gelap shrink-0 mt-0.5" />
              <p className="text-sm text-tinta/70 leading-relaxed">
                Setelah pengajuan dikirim, simpan <strong className="text-tinta">kode tiket</strong>{' '}
                yang muncul di layar. Petugas akan menghubungi nomor HP yang Anda daftarkan untuk
                kabar selanjutnya.
              </p>
            </div>

            <a
              href="https://wa.me/6285196553835?text=Halo%20Desa%20Kasomalang%2C%20saya%20ingin%20bertanya%20mengenai%20layanan%20surat."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border-2 border-sawah/40 bg-sawah/5 p-5 hover:bg-sawah/10 transition-colors group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sawah text-kertas shrink-0">
                <MessageCircleMore size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-tinta text-base">Butuh Bantuan?</p>
                <p className="text-sm text-tinta/60 mt-0.5">
                  Hubungi petugas Desa Kasomalang Kulon langsung via WhatsApp
                </p>
                <p className="text-sm font-bold text-sawah-gelap mt-1">0851-9655-3835</p>
              </div>
              <ArrowRight size={18} className="text-sawah-gelap shrink-0 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
