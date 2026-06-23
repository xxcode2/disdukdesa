'use client';

import { useRef, useState } from 'react';
import { Camera, FileCheck2, X } from 'lucide-react';
import { DocumentRequirement } from '@/types';

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
      setValidationError('Ukuran file tidak boleh lebih dari 1MB.');
      return false;
    }

    return true;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;
    
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        onChange(selectedFile);
      } else {
        // Reset input file jika validasi gagal
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
            {doc.helpText || 'Format: JPEG, Maksimal: 1MB'}
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,image/jpeg"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mt-3">
        {!file ? (
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
