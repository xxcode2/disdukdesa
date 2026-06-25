'use client';

import { useRef, useState } from 'react';
import { Camera, Download, FileCheck2, Loader2, X } from 'lucide-react';
import { DocumentRequirement } from '@/types';
import { compressImage } from '@/lib/compressImage';

interface DocumentUploadProps {
  doc: DocumentRequirement;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg'];

export function DocumentUpload({ doc, file, onChange, error }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string>('');
  const [memproses, setMemproses] = useState(false);

  function validateFile(selectedFile: File): boolean {
    // Reset error
    setValidationError('');

    // Cek tipe file
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setValidationError('File harus berformat JPEG/JPG.');
      return false;
    }

    // Cek ukuran file
    if (selectedFile.size > MAX_FILE_SIZE) {
      setValidationError('Ukuran file masih terlalu besar setelah dikompres. Coba foto ulang dengan jarak lebih jauh atau pilih file lain.');
      return false;
    }

    return true;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;

    if (selectedFile) {
      // Validasi tipe dulu sebelum kompresi (tidak ada gunanya kompres file yang bukan JPEG)
      if (!ALLOWED_TYPES.includes(selectedFile.type)) {
        setValidationError('File harus berformat JPEG/JPG.');
        if (inputRef.current) inputRef.current.value = '';
        onChange(null);
        return;
      }

      setMemproses(true);
      setValidationError('');

      const hasilKompresi = await compressImage(selectedFile);

      setMemproses(false);

      if (validateFile(hasilKompresi)) {
        onChange(hasilKompresi);
      } else {
        if (inputRef.current) {
          inputRef.current.value = '';
        }
        onChange(null);
      }
    } else {
      onChange(null);
    }
  }

  return (
    <div
      className={`rounded-xl border-2 p-4 transition-colors ${
        error || validationError ? 'border-bata bg-bata/5' : file ? 'border-sawah bg-sawah/5' : 'border-garis bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-semibold text-tinta text-[15px]">
            {doc.label}
            {doc.required && <span className="text-bata ml-1">*</span>}
            {!doc.required && <span className="text-tinta/50 font-normal ml-1.5 text-xs">(opsional)</span>}
          </p>
          <p className="text-xs text-tinta/60 mt-0.5">
            {doc.helpText || 'Format: JPEG, foto langsung dari HP juga bisa — ukuran otomatis disesuaikan'}
          </p>
          {doc.formUrl && (
            <a
              href={doc.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-sawah-gelap mt-1.5 hover:underline"
            >
              <Download size={12} />
              {doc.formLabel || 'Unduh form kosong (PDF)'}
            </a>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,image/jpeg"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        disabled={memproses}
      />

      <div className="mt-3">
        {memproses ? (
          <div className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-sawah/40 bg-sawah/5 py-3 text-sm font-semibold text-sawah-gelap">
            <Loader2 size={18} className="animate-spin" />
            Memproses foto...
          </div>
        ) : !file ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-garis py-3 text-sm font-semibold text-sawah-gelap hover:border-sawah hover:bg-sawah/5 transition-colors"
          >
            <Camera size={18} />
            Ambil Foto / Pilih File
          </button>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-sawah/10 px-3 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <FileCheck2 size={18} className="text-sawah-gelap shrink-0" />
              <span className="truncate text-sm font-medium text-sawah-gelap">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setValidationError('');
                if (inputRef.current) inputRef.current.value = '';
              }}
              aria-label={`Hapus ${doc.label}`}
              className="shrink-0 rounded-full p-1 text-tinta/50 hover:bg-bata/10 hover:text-bata transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {(error || validationError) && (
        <p className="mt-2 text-xs font-semibold text-bata">
          {validationError || error}
        </p>
      )}
    </div>
  );
}
