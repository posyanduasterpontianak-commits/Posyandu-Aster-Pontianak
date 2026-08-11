import nextEnv from "@next/env";
import { PrismaClient } from "@prisma/client";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

const TABLES_TO_TRUNCATE = [
  "monitoring_balita",
  "monitoring_ibu_hamil",
  "monitoring_remaja",
  "monitoring_usia_produktif",
  "monitoring_lansia",
  "attendances",
  "products",
  "news",
  "events",
  "documentations",
  "archives",
  "visitors",
];

async function main() {
  console.log("\n🧹 Memulai pembersihan data dummy dari database...\n");

  // Delete all dummy operational and content records
  await prisma.monitoringBalita.deleteMany({});
  await prisma.monitoringIbuHamil.deleteMany({});
  await prisma.monitoringRemaja.deleteMany({});
  await prisma.monitoringUsiaProduktif.deleteMany({});
  await prisma.monitoringLansia.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.news.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.documentation.deleteMany({});
  await prisma.archive.deleteMany({});

  // Delete dummy masyarakat user if linked to demo visitor
  await prisma.user.deleteMany({
    where: {
      role: "MASYARAKAT",
    },
  });

  // Delete all visitors
  await prisma.visitor.deleteMany({});

  // Reset serial auto-increment sequence counters for cleaned tables
  for (const table of TABLES_TO_TRUNCATE) {
    try {
      await prisma.$executeRawUnsafe(
        `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), 1, false) FROM "${table}";`
      );
    } catch (err) {
      console.warn(`Catatan sequence reset (${table}):`, err.message);
    }
  }

  console.log("✓ Seluruh data dummy (sasaran, pemeriksaan, absensi, berita, produk, event, dokumentasi, arsip) berhasil dihapus.");
  console.log("✓ Hanya akun Admin/Kader utama & master kategori yang dipertahankan.\n");
}

main()
  .catch((e) => {
    console.error("❌ Pembersihan data dummy gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
