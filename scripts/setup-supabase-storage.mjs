/**
 * Script: setup-supabase-storage.mjs
 * Membuat bucket Supabase Storage melalui Management API menggunakan
 * service role key (JWT format eyJ...) bukan sb_secret format.
 * 
 * Jalankan dengan: node scripts/setup-supabase-storage.mjs
 */
import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_JWT || 
                       process.env.SUPABASE_SERVICE_ROLE_KEY || 
                       process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  console.error("✗ NEXT_PUBLIC_SUPABASE_URL belum diisi di .env.local");
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error("✗ SUPABASE_SERVICE_ROLE_JWT belum diisi di .env.local");
  process.exit(1);
}

// Deteksi apakah key adalah format JWT (harus mulai dengan "eyJ")
const isJwt = serviceRoleKey.startsWith("eyJ");
if (!isJwt) {
  console.error(`
✗ Key yang digunakan bukan format JWT!
  Key yang ada: ${serviceRoleKey.substring(0, 20)}...
  
  Supabase Storage memerlukan "service_role" key dalam format JWT (mulai dengan "eyJ...").
  
  Cara mendapatkan service_role JWT:
  1. Buka: https://supabase.com/dashboard/project/${supabaseUrl.replace("https://", "").split(".")[0]}/settings/api
  2. Scroll ke bagian "Project API keys"
  3. Salin nilai "service_role" (bukan anon) — formatnya dimulai dengan "eyJ"
  4. Tambahkan ke .env.local:
     SUPABASE_SERVICE_ROLE_JWT=eyJ...
`);
  process.exit(1);
}

const headers = {
  "apikey": serviceRoleKey,
  "Authorization": `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
};

const buckets = [
  {
    name: "posyandu-aster-public",
    isPublic: true,
    description: "Media publik (foto berita, produk, dokumentasi kegiatan)",
  },
  {
    name: "posyandu-aster-private",
    isPublic: false,
    description: "Dokumen privat (arsip digital)",
  },
];

async function ensureBucket({ name, isPublic, description }) {
  // Cek apakah bucket sudah ada
  const getRes = await fetch(`${supabaseUrl}/storage/v1/bucket/${encodeURIComponent(name)}`, {
    headers,
  });

  if (getRes.ok) {
    const data = await getRes.json();
    console.log(`✓ Bucket sudah ada: "${name}" (${data.public ? "public" : "private"})`);
    return;
  }

  // Supabase kadang mengembalikan 400 atau 404 untuk bucket yang belum ada
  // Periksa body apakah ini "Bucket not found"
  let errBody;
  try { errBody = await getRes.json(); } catch { errBody = {}; }
  const isNotFound = errBody?.code === "NoSuchBucket" || errBody?.error === "Bucket not found" || getRes.status === 404;

  if (!isNotFound) {
    throw new Error(`Gagal memeriksa bucket "${name}" (status ${getRes.status}): ${JSON.stringify(errBody)}`);
  }

  console.log(`  Bucket "${name}" belum ada, membuat sekarang...`);


  // Buat bucket baru
  const createRes = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      id: name,
      name: name,
      public: isPublic,
      file_size_limit: 20 * 1024 * 1024, // 20 MB
      allowed_mime_types: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
        "text/plain",
        "application/csv",
        "video/mp4",
        "video/webm",
        "video/quicktime",
      ],
    }),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    throw new Error(`Gagal membuat bucket "${name}" (status ${createRes.status}): ${text}`);
  }

  console.log(`✓ Bucket berhasil dibuat: "${name}" (${isPublic ? "public" : "private"}) — ${description}`);
}

async function listBuckets() {
  const res = await fetch(`${supabaseUrl}/storage/v1/bucket`, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gagal mengambil daftar bucket: ${text}`);
  }
  return res.json();
}

async function main() {
  console.log("\nPosyandu Aster — Setup Supabase Storage Buckets\n");
  console.log(`Project URL: ${supabaseUrl}`);
  console.log(`Key format : ${isJwt ? "JWT ✓" : "sb_secret (TIDAK VALID)"}\n`);

  // Buat atau verifikasi kedua bucket
  for (const bucket of buckets) {
    await ensureBucket(bucket);
  }

  // Tampilkan semua bucket yang ada
  console.log("\nDaftar seluruh bucket di Supabase Storage:");
  const all = await listBuckets();
  if (Array.isArray(all) && all.length > 0) {
    all.forEach((b) => {
      console.log(`  - ${b.name} (${b.public ? "public" : "private"}, id: ${b.id})`);
    });
  } else {
    console.log("  (kosong atau tidak ada bucket)");
  }

  console.log("\n✓ Setup Supabase Storage selesai.\n");
}

main().catch((err) => {
  console.error(`\n✗ Error: ${err.message}\n`);
  process.exit(1);
});
