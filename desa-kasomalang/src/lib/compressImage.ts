/**
 * Kompresi gambar di sisi browser sebelum diupload.
 *
 * Foto langsung dari kamera HP modern biasanya 3-8MB, padahal server hanya
 * menerima maksimal 1MB. Tanpa kompresi otomatis, warga dengan koneksi
 * lambat akan kesulitan upload dan sering gagal karena ukuran kebesaran.
 *
 * Pakai Canvas API native browser (resize + re-encode JPEG dengan quality
 * yang diturunkan bertahap) — tidak perlu library tambahan / npm install.
 */

const MAX_DIMENSI = 1600; // px, sisi terpanjang — cukup untuk dokumen tetap terbaca jelas
const TARGET_MAX_BYTES = 950 * 1024; // sedikit di bawah 1MB agar ada margin aman
const KUALITAS_AWAL = 0.85;
const KUALITAS_MINIMUM = 0.4;

/**
 * Memuat File menjadi HTMLImageElement.
 */
function muatGambar(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gagal memuat gambar.'));
    };
    img.src = url;
  });
}

/**
 * Konversi canvas ke Blob JPEG dengan kualitas tertentu.
 */
function canvasKeBlob(canvas: HTMLCanvasElement, kualitas: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', kualitas);
  });
}

/**
 * Kompres File gambar agar ukurannya di bawah target, dengan menurunkan
 * resolusi (jika perlu) dan kualitas JPEG secara bertahap.
 *
 * Jika file sudah cukup kecil (di bawah target), file asli dikembalikan
 * tanpa diproses ulang — supaya tidak menurunkan kualitas tanpa perlu.
 *
 * Jika gagal kompres karena alasan apapun (browser tidak support, dll),
 * file asli dikembalikan sebagai fallback — biarkan validasi ukuran di
 * langkah berikutnya yang menentukan apakah file tetap ditolak.
 */
export async function compressImage(file: File): Promise<File> {
  if (file.size <= TARGET_MAX_BYTES) {
    return file;
  }

  try {
    const img = await muatGambar(file);

    // Hitung dimensi baru, jaga aspect ratio, batasi sisi terpanjang
    let { width, height } = img;
    if (width > height && width > MAX_DIMENSI) {
      height = Math.round((height * MAX_DIMENSI) / width);
      width = MAX_DIMENSI;
    } else if (height > MAX_DIMENSI) {
      width = Math.round((width * MAX_DIMENSI) / height);
      height = MAX_DIMENSI;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, width, height);

    // Turunkan kualitas bertahap sampai ukuran target tercapai
    let kualitas = KUALITAS_AWAL;
    let blob = await canvasKeBlob(canvas, kualitas);

    while (blob && blob.size > TARGET_MAX_BYTES && kualitas > KUALITAS_MINIMUM) {
      kualitas -= 0.1;
      blob = await canvasKeBlob(canvas, kualitas);
    }

    if (!blob) return file;

    // Kalau hasil kompresi malah lebih besar dari file asli, pakai yang asli
    if (blob.size >= file.size) return file;

    const namaBaru = file.name.replace(/\.(png|webp|heic|heif)$/i, '.jpg');
    return new File([blob], namaBaru, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    // Jika kompresi gagal (browser lama, dll), kembalikan file asli
    return file;
  }
}
