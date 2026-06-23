'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { LayananDefinition } from '@/types';
import { getDokumenUntukKategori, getFieldsUntukKategori } from '@/lib/layanan';
import { Field } from '@/components/ui/Field';
import { DocumentUpload } from '@/components/ui/DocumentUpload';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from './StepIndicator';

interface FormPengajuanProps {
  layanan: LayananDefinition;
}

export function FormPengajuan({ layanan }: FormPengajuanProps) {
  const router = useRouter();
  const punyaKategori = !!layanan.kategori && layanan.kategori.length > 0;

  const [langkah, setLangkah] = useState(1);
  const [kategori, setKategori] = useState<string>('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mengirim, setMengirim] = useState(false);
  const [errorUmum, setErrorUmum] = useState('');

  const totalLangkah = punyaKategori ? 3 : 2;
  const labelLangkah = punyaKategori
    ? ['Pilih jenis pengajuan', 'Isi data', 'Lengkapi berkas']
    : ['Isi data', 'Lengkapi berkas'];

  const fields = useMemo(
    () => getFieldsUntukKategori(layanan, kategori || undefined),
    [layanan, kategori]
  );
  const dokumenList = useMemo(
    () => getDokumenUntukKategori(layanan, kategori || undefined),
    [layanan, kategori]
  );

  const langkahDataIdx = punyaKategori ? 2 : 1;
  const langkahDokumenIdx = punyaKategori ? 3 : 2;

  function updateValue(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  function updateFile(key: string, file: File | null) {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  function validasiLangkahData(): boolean {
    const errs: Record<string, string> = {};
    for (const f of fields) {
      if (f.required && !values[f.key]?.trim()) {
        errs[f.key] = 'Wajib diisi';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validasiLangkahDokumen(): boolean {
    const errs: Record<string, string> = {};
    for (const d of dokumenList) {
      if (d.required && !files[d.key]) {
        errs[d.key] = 'Berkas ini wajib dilampirkan';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function lanjut() {
    if (langkah === langkahDataIdx && !validasiLangkahData()) return;
    setLangkah((l) => Math.min(l + 1, totalLangkah));
  }

  function kembali() {
    setLangkah((l) => Math.max(l - 1, 1));
  }

  async function handleSubmit() {
    if (!validasiLangkahDokumen()) return;

    setMengirim(true);
    setErrorUmum('');

    try {
      const fd = new FormData();
      fd.set('jenis_layanan', layanan.jenis);
      if (kategori) fd.set('kategori', kategori);
      for (const [key, val] of Object.entries(values)) {
        fd.set(key, val);
      }
      for (const [key, file] of Object.entries(files)) {
        if (file) fd.set(`dokumen__${key}`, file);
      }

      const res = await fetch('/api/pengajuan', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) {
        setErrorUmum(data.error || 'Gagal mengirim pengajuan. Silakan coba lagi.');
        setMengirim(false);
        return;
      }

      router.push(`/ajukan/${layanan.jenis}/sukses?kode=${data.kodeTiket}`);
    } catch {
      setErrorUmum('Tidak bisa terhubung ke server. Periksa koneksi internet Anda.');
      setMengirim(false);
    }
  }

  const groupedFields = {
    pemohon: fields.filter((f) => f.group === 'pemohon'),
    pelapor: fields.filter((f) => f.group === 'pelapor'),
    detail: fields.filter((f) => f.group === 'detail' || !f.group),
  };

  return (
    <div className="anim-muncul">
      <h1 className="font-display text-2xl font-bold text-tinta">{layanan.judul}</h1>
      <p className="text-sm text-tinta/60 mt-1 mb-6">{layanan.deskripsiSingkat}</p>

      <StepIndicator langkah={langkah} totalLangkah={totalLangkah} labelLangkah={labelLangkah} />

      {/* LANGKAH: Pilih kategori */}
      {punyaKategori && langkah === 1 && (
        <div className="flex flex-col gap-3">
          {layanan.kategori!.map((k) => (
            <button
              key={k.value}
              type="button"
              onClick={() => {
                setKategori(k.value);
                setLangkah(2);
              }}
              className={`text-left rounded-xl border-2 p-4 transition-colors ${
                kategori === k.value ? 'border-sawah bg-sawah/5' : 'border-garis bg-white hover:border-sawah-terang'
              }`}
            >
              <p className="font-semibold text-tinta">{k.label}</p>
              <p className="text-sm text-tinta/60 mt-0.5">{k.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* LANGKAH: Isi data */}
      {langkah === langkahDataIdx && (
        <div className="flex flex-col gap-6">
          {groupedFields.pemohon.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="font-display font-bold text-tinta text-base border-b-2 border-garis pb-2">
                Data Pemohon
              </h2>
              {groupedFields.pemohon.map((f) => (
                <Field key={f.key} field={f} value={values[f.key] ?? ''} onChange={(v) => updateValue(f.key, v)} error={errors[f.key]} />
              ))}
            </section>
          )}

          {groupedFields.detail.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="font-display font-bold text-tinta text-base border-b-2 border-garis pb-2">
                Detail Pengajuan
              </h2>
              {groupedFields.detail.map((f) => (
                <Field key={f.key} field={f} value={values[f.key] ?? ''} onChange={(v) => updateValue(f.key, v)} error={errors[f.key]} />
              ))}
            </section>
          )}

          {groupedFields.pelapor.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="font-display font-bold text-tinta text-base border-b-2 border-garis pb-2">
                Data Pelapor
              </h2>
              {groupedFields.pelapor.map((f) => (
                <Field key={f.key} field={f} value={values[f.key] ?? ''} onChange={(v) => updateValue(f.key, v)} error={errors[f.key]} />
              ))}
            </section>
          )}

          <div className="flex gap-3 mt-2">
            {punyaKategori && (
              <Button variant="hantu" onClick={kembali} type="button">
                <ArrowLeft size={18} />
                Kembali
              </Button>
            )}
            <Button onClick={lanjut} type="button" className="flex-1">
              Lanjut ke Berkas
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* LANGKAH: Upload dokumen */}
      {langkah === langkahDokumenIdx && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-tinta/70 -mt-2 mb-1">
            Foto harus jelas dan terbaca. Anda bisa memotret langsung atau memilih dari galeri.
          </p>
          {dokumenList.map((d) => (
            <DocumentUpload
              key={d.key}
              doc={d}
              file={files[d.key] ?? null}
              onChange={(f) => updateFile(d.key, f)}
              error={errors[d.key]}
            />
          ))}

          {errorUmum && (
            <div className="rounded-xl bg-bata/10 border-2 border-bata px-4 py-3 text-sm font-semibold text-bata">
              {errorUmum}
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <Button variant="hantu" onClick={kembali} type="button" disabled={mengirim}>
              <ArrowLeft size={18} />
              Kembali
            </Button>
            <Button onClick={handleSubmit} type="button" className="flex-1" disabled={mengirim}>
              {mengirim ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Mengirim...
                </>
              ) : (
                'Kirim Pengajuan'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
