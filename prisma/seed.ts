// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { seedCategories } from "./seeds/categories";
import { seedProfiles } from "./seeds/profiles";
import { seedNewsCategories } from "./seeds/newsCategories";

const prisma = new PrismaClient();

const MASTER_TABLES = [
  "users",
  "categories",
  "archive_categories",
  "profiles",
  "news_categories",
] as const;

async function synchronizeSequences() {
  for (const table of MASTER_TABLES) {
    try {
      await prisma.$executeRawUnsafe(
        `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "${table}";`
      );
    } catch {
      // Ignore if table has no serial sequence
    }
  }
}

async function upsertInitialUsers() {
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@posyanduaster.id").trim().toLowerCase();
  const adminName = (process.env.SEED_ADMIN_NAME || "Administrator").trim();
  const kaderEmail = (process.env.SEED_KADER_EMAIL || "kader@posyanduaster.id").trim().toLowerCase();
  const kaderName = (process.env.SEED_KADER_NAME || "Kader Aster").trim();

  const adminPass = process.env.SEED_ADMIN_PASSWORD || "AdminAster#2026";
  const kaderPass = process.env.SEED_USER_PASSWORD || "KaderAster#2026";

  const [adminHash, kaderHash] = await Promise.all([
    bcrypt.hash(adminPass, 12),
    bcrypt.hash(kaderPass, 12),
  ]);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { fullName: adminName, role: Role.ADMIN, isActive: true },
    create: {
      fullName: adminName,
      email: adminEmail,
      password: adminHash,
      role: Role.ADMIN,
      isActive: true,
      mustChangePassword: false,
    },
  });

  await prisma.user.upsert({
    where: { email: kaderEmail },
    update: { fullName: kaderName, role: Role.KADER, isActive: true },
    create: {
      fullName: kaderName,
      email: kaderEmail,
      password: kaderHash,
      role: Role.KADER,
      isActive: true,
      mustChangePassword: false,
    },
  });
}

async function main() {
  console.log("🌱 Memulai proses Seeding Master Data Production Posyandu Aster...");

  await seedCategories(prisma);
  await seedNewsCategories(prisma);
  await seedProfiles(prisma);
  await upsertInitialUsers();
  await synchronizeSequences();

  console.log("✓ Master data (Kategori, Profil, Akun Admin/Kader) berhasil disiapkan.");
  console.log("✓ Tanpa sampel sasaran, pemeriksaan, absensi, berita, atau produk dummy.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal dengan error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });