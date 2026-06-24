import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  IdCard,
  Camera,
  Smartphone,
  Clock,
  MessageCircleMore,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// ──────────────────────────────────────────────
// DATA FAQ
// ──────────────────────────────────────────────
const FAQ_UMUM = [
  {
    q: 'Berapa lama proses pengajuan selesai?',
    a: 'Lama proses berbeda-beda tergantung jenis surat dan kelengkapan berkas. Setelah pengajuan dikirim, petugas akan memeriksa berkas terlebih dahulu. Anda bisa cek progresnya kapan saja lewat halaman "Cek Status Pengajuan" menggunakan kode tiket.',
  },
  {
    q: 'Bagaimana cara mengetahui pengajuan saya sudah diproses atau belum?',
    a: 'Buka halaman "Cek Status Pengajuan" di beranda, lalu masukkan kode tiket yang Anda dapat setelah mengirim pengajuan. Status akan menunjukkan salah satu dari: Diterima, Diproses, Selesai, atau Perlu Dilengkapi.',
  },
  {
    q: 'Saya kehilangan / lupa kode tiket saya, bagaimana?',
    a: 'Hubungi petugas Desa Kasomalang Kulon lewat WhatsApp dengan menyebutkan nama lengkap dan jenis surat yang Anda ajukan. Petugas akan membantu mencarikan kode tiket Anda.',
  },
  {
    q: 'Status saya tertulis "Perlu Dilengkapi", apa artinya?',
    a: 'Artinya ada data atau berkas yang kurang jelas, kurang lengkap, atau perlu diperbaiki. Biasanya petugas akan menghubungi Anda lewat WhatsApp untuk menjelaskan apa yang perlu diperbaiki. Anda juga bisa melihat catatan dari petugas di halaman Cek Status.',
  },
  {
    q: 'Apakah saya tetap perlu datang ke kantor desa?',
    a: 'Untuk pengajuan awal, tidak perlu — semua bisa dilakukan dari rumah. Namun beberapa jenis surat mungkin perlu Anda datang saat pengambilan dokumen jadi, atau jika ada tanda tangan/berkas asli yang perlu diserahkan langsung. Petugas akan memberi tahu jika itu diperlukan.',
  },
  {
    q: 'Berkas saya salah / mau diganti, apakah bisa edit pengajuan?',
    a: 'Pengajuan yang sudah terkirim belum bisa diedit sendiri oleh warga. Hubungi petugas lewat WhatsApp dan sebutkan kode tiket Anda, petugas akan membantu memperbaikinya dari sisi admin.',
  },
];

const PANDUAN_NIK = [
  {
    label: 'NIK (Nomor Induk Kependudukan)',
    contoh: '3213261207000001',
    tips: [
      'Tepat 16 digit angka, tanpa spasi atau tanda baca.',
      'Lihat di KTP, pada baris "NIK" di bagian atas kartu.',
      'Pastikan tidak tertukar dengan No. KK — keduanya sama-sama 16 digit tapi berbeda nomor.',
    ],
  },
  {
    label: 'No. KK (Nomor Kartu Keluarga)',
    contoh: '3213261207000001',
    tips: [
      'Juga 16 digit angka, tertulis di halaman depan Kartu Keluarga.',
      'Jika KK hilang atau rusak dan Anda tidak tahu nomornya, kosongkan saja kolom ini — tuliskan di catatan atau sampaikan ke petugas lewat WhatsApp.',
    ],
  },
  {
    label: 'No. HP / WhatsApp',
    contoh: '08123456789',
    tips: [
      'Gunakan nomor yang aktif dan punya WhatsApp — ini nomor yang akan dihubungi petugas.',
      'Tulis lengkap dari awalan 0, contoh: 08123456789 (bukan +62 atau 62 di awal).',
    ],
  },
];

const PANDUAN_FOTO = [
  {
    judul: 'Pastikan cahaya cukup',
    detail: 'Foto di tempat terang, sebaiknya dekat jendela atau di luar ruangan pada siang hari. Hindari memfoto di tempat gelap atau membelakangi lampu (silau).',
  },
  {
    judul: 'Seluruh dokumen masuk dalam foto',
    detail: 'Pastikan keempat sisi dokumen (KTP, KK, dll) terlihat utuh dalam foto, tidak terpotong di tepi.',
  },
  {
    judul: 'Foto tidak goyang / blur',
    detail: 'Tahan HP dengan stabil saat memotret. Jika hasil foto buram, ambil ulang sampai tulisan di dokumen terbaca jelas.',
  },
  {
    judul: 'Satu dokumen, satu foto',
    detail: 'Jangan menggabungkan beberapa dokumen dalam satu foto (misal KTP dan KK sekaligus). Foto satu per satu sesuai kolom yang diminta di form.',
  },
  {
    judul: 'Tidak perlu khawatir soal ukuran file',
    detail: 'Sistem akan otomatis mengecilkan ukuran foto Anda agar bisa diunggah, jadi ambil foto dengan kualitas normal dari kamera HP seperti biasa.',
  },
];

// ──────────────────────────────────────────────
// KOMPONEN
// ──────────────────────────────────────────────
function ItemFaq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border-2 border-garis bg-white overflow-hidden">
      <summary className="flex cursor-pointer items-start gap-3 p-4 list-none select-none">
        <HelpCircle size={18} className="text-sawah-gelap shrink-0 mt-0.5" />
        <span className="font-semibold text-tinta text-sm flex-1">{q}</span>
      </summary>
      <div className="px-4 pb-4 pl-[2.6rem]">
        <p className="text-sm text-tinta/70 leading-relaxed">{a}</p>
      </div>
    </details>
  );
}

export default function HalamanBantuan() {
  return (
    <>
      <Header />
      <main className="flex-1 tekstur-kertas">
        <div className="mx-auto max-w-3xl px-5 py-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-tinta/60 hover:text-sawah-gelap mb-6">
            <ArrowLeft size={15} /> Kembali ke Beranda
          </Link>

          {/* Hero */}
          <div className="anim-muncul">
            <span className="inline-block rounded-full bg-sawah/10 text-sawah-gelap text-xs font-bold uppercase tracking-wide px-3 py-1 mb-4">
              Bantuan
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-tinta leading-tight">
              Panduan & Pertanyaan yang Sering Ditanyakan
            </h1>
            <p className="mt-3 text-tinta/70 text-[15px] leading-relaxed">
              Bingung cara isi data atau foto berkas? Semua panduannya ada di halaman ini.
              Jika masih ada yang kurang jelas, jangan ragu hubungi petugas lewat WhatsApp.
            </p>
          </div>

          {/* Cara isi NIK / No KK / No HP */}
          <section className="mt-10 anim-muncul">
            <div className="flex items-center gap-2 mb-1">
              <IdCard size={20} className="text-sawah-gelap" />
              <h2 className="font-display text-xl font-bold text-tinta">Cara Mengisi NIK, No. KK, dan No. HP</h2>
            </div>
            <p className="text-sm text-tinta/60 mb-5">
              Tiga data ini paling sering salah ditulis warga. Berikut cara mengisinya yang benar.
            </p>

            <div className="flex flex-col gap-3">
              {PANDUAN_NIK.map((item) => (
                <div key={item.label} className="rounded-2xl border-2 border-garis bg-white p-5">
                  <p className="font-display font-bold text-tinta text-base">{item.label}</p>
                  <p className="text-xs text-tinta/50 mt-1">
                    Contoh format: <span className="font-mono font-semibold text-sawah-gelap">{item.contoh}</span>
                  </p>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {item.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-tinta/80">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sawah shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Cara foto dokumen yang benar */}
          <section className="mt-10 anim-muncul">
            <div className="flex items-center gap-2 mb-1">
              <Camera size={20} className="text-sawah-gelap" />
              <h2 className="font-display text-xl font-bold text-tinta">Cara Memfoto Dokumen yang Benar</h2>
            </div>
            <p className="text-sm text-tinta/60 mb-5">
              Foto yang jelas dan terbaca membuat proses verifikasi lebih cepat.
            </p>

            <div className="flex flex-col gap-3">
              {PANDUAN_FOTO.map((item, i) => (
                <div key={item.judul} className="flex items-start gap-4 rounded-2xl border-2 border-garis bg-white p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sawah/10 text-sawah-gelap font-display font-bold text-sm shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-tinta text-sm">{item.judul}</p>
                    <p className="text-sm text-tinta/60 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Unduh Formulir Desa */}
          <section className="mt-10 anim-muncul">
            <div className="flex items-center gap-2 mb-1">
              <IdCard size={20} className="text-sawah-gelap" />
              <h2 className="font-display text-xl font-bold text-tinta">Unduh Formulir Desa</h2>
            </div>
            <p className="text-sm text-tinta/60 mb-5">
              Formulir desa bisa diunduh, dicetak, dan dibawa saat mengurus pengajuan. Klik nama formulir untuk mengunduh.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'F-1.01 Form Biodata KK', href: '/forms/F-1.01_FORMULIR_BIODATA_KELUARGA.pdf' },
                { label: 'F-1.02 Form Permohonan Dafduk', href: '/forms/F-1.02_FORMULIR_PENDAFTARAN_PERISTIWA_KEPENDUDUKAN.pdf' },
                { label: 'F-1.03 Form Pindah Penduduk', href: '/forms/F-1.03_FORMULIR_PENDAFTARAN_PERPINDAHAN_PENDUDUK.pdf' },
                { label: 'F-1.04 Surat Pernyataan Tidak Punya Dokumen', href: '/forms/F-1.04_SURAT_PERNYATAAN_TIDAK_MEMILIKI_DOKUMEN_KEPENDUDUKAN.pdf' },
                { label: 'F-1.05 SPTJM Perkawinan Belum Tercatat', href: '/forms/F-1.05_SPTJM_PERKAWINAN_BELUM_TERCATAT.pdf' },
                { label: 'F-1.06 Form Perubahan Elemen Data', href: '/forms/F-1.06_SURAT_PERNYATAAN_PERUBAHAN_ELEMEN_DATA_KEPENDUDUKAN.pdf' },
                { label: 'F-2.01 Form Pelaporan Pencatatan Sipil', href: '/forms/F-2.01_FORMULIR_PELAPORAN_PENCATATAN_SIPIL.pdf' },
                { label: 'F-2.03 SPTJM Kelahiran', href: '/forms/F-2.03_SPTJM_KELAHIRAN.pdf' },
                { label: 'F-2.04 SPTJM Kebenaran Suami Istri', href: '/forms/F-2.04_SPTJM_KEBENARAN_SUAMI_ISTRI.pdf' },
                { label: 'Form Kelahiran Baru', href: '/forms/FORMULIR_KELAHIRAN_BARU.pdf' },
                { label: 'Form Kematian Baru', href: '/forms/FORMULIR_KEMATIAN_BARU.pdf' },
                { label: 'SPTJM Kematian', href: '/forms/SPTJM_KEMATIAN.pdf' },
              ].map((form) => (
                <a
                  key={form.href}
                  href={form.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border-2 border-garis bg-white p-4 text-sm font-semibold text-sawah-gelap transition hover:border-sawah hover:bg-sawah/5"
                >
                  {form.label}
                </a>
              ))}
            </div>
          </section>

          {/* FAQ umum */}
          <section className="mt-10 anim-muncul">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone size={20} className="text-sawah-gelap" />
              <h2 className="font-display text-xl font-bold text-tinta">Pertanyaan Umum</h2>
            </div>
            <p className="text-sm text-tinta/60 mb-5">
              Hal-hal yang paling sering ditanyakan warga seputar pengajuan surat online.
            </p>

            <div className="flex flex-col gap-3">
              {FAQ_UMUM.map((item) => (
                <ItemFaq key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </section>

          {/* CTA cek status + WA */}
          <div className="anim-muncul mt-10 flex flex-col gap-3">
            <Link
              href="/cek"
              className="flex items-center gap-4 rounded-2xl border-2 border-garis bg-kertas-2 p-5 hover:border-sawah transition-colors group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sawah/10 text-sawah-gelap shrink-0">
                <Clock size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-tinta text-base">Cek Status Pengajuan</p>
                <p className="text-sm text-tinta/60 mt-0.5">Sudah kirim pengajuan? Lihat progresnya di sini.</p>
              </div>
              <ArrowRight size={18} className="text-tinta/40 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>

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
                <p className="font-display font-bold text-tinta text-base">Masih Bingung?</p>
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
