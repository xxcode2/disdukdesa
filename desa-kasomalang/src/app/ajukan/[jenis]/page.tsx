import { notFound } from 'next/navigation';
import { getLayanan } from '@/lib/layanan';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FormPengajuan } from '@/components/pengajuan/FormPengajuan';

export default async function HalamanAjukan({
  params,
}: {
  params: Promise<{ jenis: string }>;
}) {
  const { jenis } = await params;
  const layanan = getLayanan(jenis);

  if (!layanan) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 tekstur-kertas">
        <div className="mx-auto max-w-2xl px-5 py-8">
          <FormPengajuan layanan={layanan} />
        </div>
      </main>
      <Footer />
    </>
  );
}
