import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'utama' | 'sekunder' | 'hantu' | 'bahaya';
type Ukuran = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  ukuran?: Ukuran;
}

const variantClass: Record<Variant, string> = {
  utama:
    'bg-sawah text-kertas hover:bg-sawah-gelap active:bg-sawah-gelap disabled:bg-sawah-terang',
  sekunder:
    'bg-transparent text-sawah border-2 border-sawah hover:bg-sawah hover:text-kertas disabled:opacity-50',
  hantu: 'bg-transparent text-tinta hover:bg-kertas-2 disabled:opacity-50',
  bahaya:
    'bg-transparent text-bata border-2 border-bata hover:bg-bata hover:text-kertas disabled:opacity-50',
};

const ukuranClass: Record<Ukuran, string> = {
  md: 'px-4 py-2.5 text-[15px]',
  lg: 'px-6 py-3.5 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'utama', ukuran = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`font-semibold rounded-xl transition-colors duration-150 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 ${variantClass[variant]} ${ukuranClass[ukuran]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
