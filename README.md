# Posyandu Aster — Supabase Realtime & Vercel Production Edition

**Posyandu Aster** (Siantan Hilir, Kec. Pontianak Utara, Kota Pontianak) adalah sistem informasi manajemen kesehatan posyandu berbasis Next.js 14, Prisma ORM, Supabase Postgres, Supabase Realtime, dan Supabase Storage.

Didesain untuk mengelola 6 bidang SPM Posyandu (Kesehatan, Pendidikan, Pekerjaan Umum, Perumahan Rakyat, Trantibum LINMAS, & Sosial), monitoring 5 siklus hidup sasaran (Balita, Ibu Hamil, Remaja, Usia Produktif, Lansia), absensi kegiatan, serta konten publik & arsip digital.

---

## 🌟 Fitur Unggulan

- **6 Bidang SPM Posyandu**: Layanan kesehatan terintegrasi berbasis standar pelayanan minimal.
- **Monitoring 5 Kelompok Sasaran**: Pencatatan & grafik pemantauan kesehatan berkala (Balita, Ibu Hamil, Remaja, Usia Produktif, Lansia).
- **Integrasi Supabase Realtime**: Notifikasi update data instan tanpa reload halaman dan tanpa kebocoran data sensitif di channel.
- **Kompresi Gambar Otomatis (WebP max 1200px)**: Mengubah format PNG/JPEG ke WebP & memperkecil resolusi otomatis sebelum diunggah ke Supabase Storage, menghemat hingga 90% ruang penyimpanan.
- **Storage Eksternal & YouTube Embed**: mendukung fallback ke Imgur/Cloudinary/Unsplash & embed video YouTube untuk kegiatan.
- **Backup Storage Terjadwal**: Panduan sync berkala Supabase Storage ke Google Drive (`posyanduasterpontianak@gmail.com`) menggunakan `rclone`.
- **Keamanan Ketat (Server-Side Auth & RLS)**: Data kesehatan hanya dapat diakses melalui server API yang memverifikasi JWT session & role user (`ADMIN`, `KADER`, `MASYARAKAT`).

---

## 🛠️ Stack Teknologi

- **Framework**: Next.js 14 (App Router, Server Actions, API Routes)
- **Database & Auth**: Supabase Postgres, Prisma ORM, JWT Session
- **Realtime & Storage**: Supabase Realtime Broadcast & Supabase Storage (Bucket Public & Private)
- **Styling & UI**: Tailwind CSS, Lucide Icons, Recharts, Framer Motion
- **Deployment**: Vercel (Production Hosting)

---

## 🚀 Panduan Deployment ke Vercel

### 1. Push Codebase ke GitHub

Jalankan perintah berikut di terminal lokal:

```bash
git init
git add .
git commit -m "feat: production build Posyandu Aster Pontianak"
git branch -M main
git remote add origin https://github.com/posyanduasterpontianak-commits/Posyandu-Aster-Pontianak.git
git push -u origin main --force
```

### 2. Import Repository di Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard) ➔ **Add New Project**.
2. Hubungkan akun GitHub Anda dan pilih repository project ini.
3. Di bagian **Build and Output Settings**, biarkan default (Next.js preset).

### 3. Konfigurasi Environment Variables di Vercel

Tambahkan variabel berikut pada **Environment Variables** di Vercel Project Settings (ganti dengan kredensial Supabase milik Anda):

```env
# 1. DATABASE (SUPABASE POSTGRES)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# 2. SUPABASE API & REALTIME
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key_here"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_supabase_publishable_key_here"

# 3. SUPABASE SECRET & STORAGE
SUPABASE_SECRET_KEY="your_supabase_secret_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key_here"
SUPABASE_SERVICE_ROLE_JWT="your_supabase_service_role_jwt_here"
SUPABASE_STORAGE_BUCKET="posyandu-aster-public"
SUPABASE_PRIVATE_STORAGE_BUCKET="posyandu-aster-private"

# 4. SESSION & APP URL
JWT_SECRET="posyandu_aster_secret_jwt_token_key_32_chars_min"
NEXT_PUBLIC_APP_URL="https://nama-app-anda.vercel.app"
```

### 4. Deploy!

Klik **Deploy**. Vercel akan memproses build Next.js dan aplikasi akan aktif secara online.

---

## ⚡ Perintah Penting (Lokal / CLI)

```bash
npm run dev                 # Menjalankan development server lokal
npm run build               # Menguji production build
node scripts/check-supabase.mjs # Verifikasi status DB, Realtime, & Storage Supabase
node scripts/setup-supabase-storage.mjs # Membuat bucket Storage otomatis
```

---

## 📂 Dokumentasi & Panduan Terkait

- [backup-storage-guide.md](file:///c:/KULIAH/Posyandu-Aster-Supabase-Realtime-Production/scripts/backup-storage-guide.md) — Panduan backup otomatis Supabase Storage ke Google Drive `posyanduasterpontianak@gmail.com`.
- [SETUP-SUPABASE-STEP-BY-STEP.md](file:///c:/KULIAH/Posyandu-Aster-Supabase-Realtime-Production/SETUP-SUPABASE-STEP-BY-STEP.md) — Langkah setup awal Supabase project.

---

**Posyandu Aster** — Siantan Hilir, Kec. Pontianak Utara, Kota Pontianak, Kalimantan Barat 78243.
