# Panduan Efisiensi Storage & Backup Supabase Storage ke Google Drive

Dokumen ini memuat panduan teknis pengelolaan storage media Posyandu Aster, mencakup **kompresi gambar otomatis WebP**, **opsi penyimpanan eksternal gratis**, dan **langkah backup otomatis Supabase Storage ke Google Drive** (`posyanduasterpontianak@gmail.com`).

---

## 1. Kompresi Gambar Otomatis (WebP & Max 1200px)

Telah diimplementasikan secara otomatis di aplikasi Posyandu Aster ([lib/image-compress.ts](file:///c:/KULIAH/Posyandu-Aster-Supabase-Realtime-Production/lib/image-compress.ts)):

- **Pengubahan Format**: Setiap file gambar yang diunggah (`PNG`, `JPEG`, `BMP`) otomatis dikonversi ke format **WebP**.
- **Resize Resolusi**: Batas lebar & tinggi maksimal diatur ke **1200px** dengan aspek rasio tetap.
- **Hasil Kompresi**: File foto berukuran 4 MB disusutkan hingga **~100 - 150 KB** (menghemat storage Supabase hingga **90%**).
- **Komponen Pengunggah**: Terintegrasi di [ImageUploader.tsx](file:///c:/KULIAH/Posyandu-Aster-Supabase-Realtime-Production/components/ui/ImageUploader.tsx) pada formulir **Produk PMT**, **Berita**, **Dokumentasi**, dan **Arsip Digital**.

---

## 2. Penggunaan Penyimpanan Eksternal Gratis & YouTube Embed

Jika kuota gratis 1 GB Supabase Storage telah penuh, aplikasi mendukung penggunaan tautan media eksternal tanpa biaya:

1. **Foto Berita & Katalog Produk**:
   - Manfaatkan layanan hosting gambar gratis seperti **Imgur**, **Cloudinary**, atau **Unsplash**.
   - Pada form pengunggahan, pilih mode **"Link URL / YouTube"** lalu tempelkan URL foto eksternal tersebut.

2. **Video Kegiatan**:
   - Seluruh video kegiatan wajib diunggah ke channel **YouTube Posyandu Aster** (dapat diatur ke status *Unlisted* jika bersifat privat).
   - Tempelkan URL video YouTube tersebut pada form Dokumentasi Kegiatan. Sistem akan otomatis mendeteksi dan menampilkan player video YouTube.

---

## 3. Panduan Backup Supabase Storage ke Google Drive (`posyanduasterpontianak@gmail.com`)

Untuk memastikan seluruh aset media Posyandu Aster aman dari risiko kehilangan data, ikuti langkah backup menggunakan **rclone**:

### Langkah A: Install `rclone`
- **Windows**: Unduh dari [rclone.org/downloads](https://rclone.org/downloads/) atau jalankan PowerShell:
  ```powershell
  winget install Rclone.Rclone
  ```

### Langkah B: Konfigurasi Remote Google Drive (`gdrive`)
1. Jalankan perintah di terminal:
   ```bash
   rclone config
   ```
2. Pilih `n` (New remote), beri nama `gdrive`.
3. Pilih storage type `drive` (Google Drive).
4. Opsi OAuth: Tekan Enter untuk login via browser dengan akun **`posyanduasterpontianak@gmail.com`**.
5. Izinkan akses Rclone ke Google Drive, lalu simpan konfigurasi (`y`).

### Langkah C: Konfigurasi Remote Supabase S3 (`supabase_s3`)
1. Dapatkan S3 Access Key & Secret Key dari Dashboard Supabase:
   * **Project Settings** ➔ **Storage** ➔ **S3 Access Keys**.
2. Jalankan `rclone config` ➔ pilih `n` ➔ beri nama `supabase_s3`.
3. Pilih storage type `s3`.
4. Provider: `Other`.
5. Endpoint: `https://<PROJECT_REF>.supabase.co/storage/v1/s3`
6. Masukkan Access Key & Secret Key.

### Langkah D: Jalankan Perintah Backup / Sync
Jalankan perintah berikut untuk menyalin seluruh isi Supabase Storage ke folder Google Drive:

```bash
# Backup/Sync folder media public dan arsip ke Google Drive
rclone sync supabase_s3:posyandu-aster gdrive:"Backup Posyandu Aster/Supabase Storage" --progress
```

> 💡 **Rekomendasi**: Perintah di atas dapat dijadwalkan secara otomatis mingguan menggunakan **Task Scheduler (Windows)** atau **Cron Job (Linux)**.
