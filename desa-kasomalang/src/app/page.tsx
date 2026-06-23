import Link from 'next/link';
import { Users, Baby, HeartCrack, Truck, ArrowRight, MessageCircleMore } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const layananList = [
  {
    href: '/ajukan/kk',
    icon: Users,
    judul: 'Kartu Keluarga',
    deskripsi: 'Buat KK baru, atau perubahan data karena hilang/rusak',
  },
  {
    href: '/ajukan/akte_lahir',
    icon: Baby,
    judul: 'Akte Kelahiran',
    deskripsi: 'Pembuatan akte kelahiran anak',
  },
  {
    href: '/ajukan/akte_mati',
    icon: HeartCrack,
    judul: 'Akte Kematian',
    deskripsi: 'Pembuatan akte kematian',
  },
  {
    href: '/ajukan/surat_pindah',
    icon: Truck,
    judul: 'Surat Pindah',
    deskripsi: 'Pembuatan surat pindah domisili',
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 tekstur-kertas">
        <div className="mx-auto max-w-3xl px-5 py-10">
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
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {layananList.map(({ href, icon: Icon, judul, deskripsi }, i) => (
              <Link
                key={href}
                href={href}
                style={{ animationDelay: `${i * 60}ms` }}
                className="anim-muncul group flex flex-col gap-3 rounded-2xl border-2 border-garis bg-white p-5 transition-all hover:border-sawah hover:shadow-[4px_4px_0_0_var(--sawah)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sawah/10 text-sawah-gelap">
                  <Icon size={24} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-tinta">{judul}</h2>
                  <p className="text-sm text-tinta/60 mt-1 leading-snug">{deskripsi}</p>
                </div>
                <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-sawah-gelap">
                  Ajukan sekarang
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>

          <div className="anim-muncul mt-8 flex items-start gap-3 rounded-2xl border-2 border-garis bg-kertas-2 p-5">
            <MessageCircleMore size={22} className="text-sawah-gelap shrink-0 mt-0.5" />
            <p className="text-sm text-tinta/70 leading-relaxed">
              Setelah pengajuan dikirim, simpan <strong className="text-tinta">kode tiket</strong>{' '}
              yang muncul di layar. Petugas akan menghubungi nomor HP yang Anda daftarkan untuk
              kabar selanjutnya.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
