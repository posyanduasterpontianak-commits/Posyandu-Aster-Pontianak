import nextEnv from "@next/env";
import { PrismaClient } from "@prisma/client";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

async function main() {
  const counts = {
    users: await prisma.user.count(),
    visitors: await prisma.visitor.count(),
    balita: await prisma.monitoringBalita.count(),
    bumil: await prisma.monitoringIbuHamil.count(),
    remaja: await prisma.monitoringRemaja.count(),
    produktif: await prisma.monitoringUsiaProduktif.count(),
    lansia: await prisma.monitoringLansia.count(),
    attendances: await prisma.attendance.count(),
    products: await prisma.product.count(),
    news: await prisma.news.count(),
    events: await prisma.event.count(),
    documentations: await prisma.documentation.count(),
    archives: await prisma.archive.count(),
  };
  console.log("\n--- CURRENT DATABASE COUNTS ---");
  console.table(counts);
}

main().finally(() => prisma.$disconnect());
