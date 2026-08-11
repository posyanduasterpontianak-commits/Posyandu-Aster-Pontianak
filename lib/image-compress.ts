/**
 * Utility Kompresi Gambar Otomatis untuk Posyandu Aster
 * Memformat gambar (JPEG/PNG/GIF) menjadi WebP dengan resolusi maksimal 1200px.
 * Mengurangi ukuran file hingga ~90% (misal 4 MB -> 150 KB) tanpa penurunan kualitas visual signifikan.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default: 0.8)
  format?: "image/webp" | "image/jpeg";
}

export async function compressImageFile(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  // Hanya kompres file berformat gambar (PNG, JPEG, JPG, WEBP, GIF, BMP)
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const maxWidth = options.maxWidth || 1200;
  const maxHeight = options.maxHeight || 1200;
  const quality = options.quality || 0.8;
  const targetMime = options.format || "image/webp";

  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Scaling proporsional dengan menjaga aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          maxHeight;
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      // Smooth image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // Buat nama file baru dengan ekstensi .webp
          const originalName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
          const newFileName = `${originalName}.webp`;

          const compressedFile = new File([blob], newFileName, {
            type: targetMime,
            lastModified: Date.now(),
          });

          console.log(
            `[ImageCompress] Original: ${(file.size / 1024).toFixed(1)} KB -> Compressed: ${(compressedFile.size / 1024).toFixed(1)} KB (${Math.round((1 - compressedFile.size / file.size) * 100)}% hemat)`
          );

          resolve(compressedFile);
        },
        targetMime,
        quality
      );
    };

    img.onerror = () => resolve(file);
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
