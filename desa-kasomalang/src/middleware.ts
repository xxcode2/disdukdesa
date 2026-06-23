import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Contoh: Cek env variable dengan aman
  const secret = process.env.MY_SECRET;
  
  if (!secret) {
    console.error("Missing environment variable");
    // Jangan throw error, tapi handle dengan redirect atau next()
    return NextResponse.next(); 
  }

  // Logika lainnya...

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
