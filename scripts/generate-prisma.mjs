import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const optional = process.argv.includes("--optional");
const prismaCli = path.join(root, "node_modules", "prisma", "build", "index.js");
const envFiles = [".env.local", ".env"];
const envFile = envFiles.find((file) => fs.existsSync(path.join(root, file)));

function stop(message, code = 1) {
  console.error(`\n${message}\n`);
  process.exit(code);
}

if (!fs.existsSync(prismaCli)) {
  if (optional) {
    console.log("[Prisma] CLI lokal belum tersedia; generation dilewati saat postinstall.");
    process.exit(0);
  }

  stop(
    [
      "Dependensi proyek belum terpasang.",
      "Jalankan `npm ci`, kemudian ulangi perintah ini.",
    ].join("\n")
  );
}

const hasEnvConfig = Boolean(
  envFile ||
  process.env.DATABASE_URL ||
  process.env.DIRECT_URL ||
  process.env.VERCEL
);

if (!hasEnvConfig) {
  if (optional) {
    console.log("[Prisma] Konfigurasi environment belum ada; generation dilewati.");
    process.exit(0);
  }

  stop(
    [
      "Environment variable (DATABASE_URL / DIRECT_URL) belum diatur.",
      "Atur Environment Variables pada Vercel Dashboard, atau salin .env.example ke .env.local untuk lokal.",
    ].join("\n")
  );
}

console.log(`[Prisma] Membuat Prisma Client (${envFile ? `menggunakan ${envFile}` : "menggunakan process.env"})...`);
const result = spawnSync(process.execPath, [prismaCli, "generate"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  stop(`Gagal menjalankan Prisma CLI: ${result.error.message}`);
}

process.exit(result.status ?? 1);
