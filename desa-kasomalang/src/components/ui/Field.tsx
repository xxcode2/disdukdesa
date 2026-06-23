'use client';

import { FieldDefinition } from '@/types';

interface FieldProps {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const baseInputClass =
  'w-full rounded-xl border-2 border-garis bg-white px-4 py-3 text-[16px] text-tinta placeholder:text-tinta/40 focus:border-sawah transition-colors';

export function Field({ field, value, onChange, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={field.key} className="text-sm font-semibold text-tinta">
        {field.label}
        {field.required && <span className="text-bata ml-1">*</span>}
      </label>

      {field.type === 'textarea' && (
        <textarea
          id={field.key}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`${baseInputClass} resize-none`}
        />
      )}

      {(field.type === 'text' || field.type === 'tel' || field.type === 'date') && (
        <input
          id={field.key}
          type={field.type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseInputClass}
          inputMode={field.type === 'tel' ? 'tel' : undefined}
        />
      )}

      {field.type === 'select' && (
        <select
          id={field.key}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClass} appearance-none`}
        >
          <option value="" disabled>
            Pilih salah satu
          </option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {field.type === 'radio' && (
        <div className="flex gap-3 flex-wrap">
          {field.options?.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 cursor-pointer transition-colors ${
                value === opt.value
                  ? 'border-sawah bg-sawah/10 text-sawah-gelap font-semibold'
                  : 'border-garis text-tinta'
              }`}
            >
              <input
                type="radio"
                name={field.key}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => onChange(e.target.value)}
                className="accent-[var(--sawah)]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}

      {field.helpText && <p className="text-xs text-tinta/60">{field.helpText}</p>}
      {error && <p className="text-xs font-semibold text-bata">{error}</p>}
    </div>
  );
}
