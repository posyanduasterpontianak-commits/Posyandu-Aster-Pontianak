import nextEnv from "@next/env";
import { PrismaClient } from "@prisma/client";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

async function main() {
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {
      organizationName: "Posyandu Aster",
      tagline: "Mewujudkan Generasi Sehat Bersama Posyandu Aster",
      vision:
        'Terwujudnya Keluarga Sehat, Mandiri, dan Sejahtera Berbasis Pemberdayaan Masyarakat menuju Generasi Bebas Stunting.',
      mission:
        `- Meningkatkan Kualitas Pelayanan Kesehatan Ibu, Anak, dan Lansia\nMenyediakan pelayanan pemantauan tumbuh kembang, imunisasi, pencegahan stunting, serta pemeriksaan kesehatan rutin secara inklusif, ramah, dan ramah lingkungan.\n- Mendorong Edukasi dan Pola Hidup Bersih dan Sehat (PHBS)\nMemberikan edukasi gizi seimbang, pemanfaatan bahan pangan lokal, saniter, serta pola asuh positif kepada orang tua dan kader.\n- Memperkuat Kapasitas dan Kemandirian Kader Posyandu\nMeningkatkan keterampilan, pengetahuan, dan pemanfaatan teknologi digital sederhana bagi kader dalam pendataan dan pengelolaan layanan kesehatan berbasis komunitas.\n- Membangun Sinergi Strategis dan Pemanfaatan Lingkungan\nMengembangkan kolaborasi dengan pemerintah lokal, sektor swasta/CSR, dunia usaha, dan tokoh masyarakat dalam mendukung keberlanjutan program kesehatan terpadu.`,
      history:
        "Rincian 6 Bidang SPM Posyandu:\n• Kesehatan: Pemeriksaan ibu hamil, balita, imunisasi, penimbangan berat badan, serta gizi.\n• Pendidikan: Edukasi anak usia dini (PAUD) dan peningkatan literasi keluarga.\n• Pekerjaan Umum: Akses data dan informasi kebersihan lingkungan, sanitasi, serta air bersih.\n• Perumahan Rakyat: Pemantauan dan data rumah layak huni serta lingkungan sehat.\n• Ketenteraman, Ketertiban Umum, dan Perlindungan Masyarakat: Koordinasi keamanan lingkungan dan mitigasi bencana.\n• Sosial: Pendataan perlindungan sosial bagi kelompok rentan, lansia, dan penyandang disabilitas.",
      address:
        "Siantan Hilir, Kec. Pontianak Utara, Kota Pontianak, Kalimantan Barat 78243",
      phone: "+62 856-4651-9926",
      email: "nrl.azizah@gmail.com",
      mapsEmbed: "https://maps.app.goo.gl/WcqukfBndZsPDvG59?g_st=aw",
    },
    create: {
      id: 1,
      organizationName: "Posyandu Aster",
      tagline: "Mewujudkan Generasi Sehat Bersama Posyandu Aster",
      vision:
        'Terwujudnya Keluarga Sehat, Mandiri, dan Sejahtera Berbasis Pemberdayaan Masyarakat menuju Generasi Bebas Stunting.',
      mission:
        `- Meningkatkan Kualitas Pelayanan Kesehatan Ibu, Anak, dan Lansia\nMenyediakan pelayanan pemantauan tumbuh kembang, imunisasi, pencegahan stunting, serta pemeriksaan kesehatan rutin secara inklusif, ramah, dan ramah lingkungan.\n- Mendorong Edukasi dan Pola Hidup Bersih dan Sehat (PHBS)\nMemberikan edukasi gizi seimbang, pemanfaatan bahan pangan lokal, saniter, serta pola asuh positif kepada orang tua dan kader.\n- Memperkuat Kapasitas dan Kemandirian Kader Posyandu\nMeningkatkan keterampilan, pengetahuan, dan pemanfaatan teknologi digital sederhana bagi kader dalam pendataan dan pengelolaan layanan kesehatan berbasis komunitas.\n- Membangun Sinergi Strategis dan Pemanfaatan Lingkungan\nMengembangkan kolaborasi dengan pemerintah lokal, sektor swasta/CSR, dunia usaha, dan tokoh masyarakat dalam mendukung keberlanjutan program kesehatan terpadu.`,
      history:
        "Rincian 6 Bidang SPM Posyandu:\n• Kesehatan: Pemeriksaan ibu hamil, balita, imunisasi, penimbangan berat badan, serta gizi.\n• Pendidikan: Edukasi anak usia dini (PAUD) dan peningkatan literasi keluarga.\n• Pekerjaan Umum: Akses data dan informasi kebersihan lingkungan, sanitasi, serta air bersih.\n• Perumahan Rakyat: Pemantauan dan data rumah layak huni serta lingkungan sehat.\n• Ketenteraman, Ketertiban Umum, dan Perlindungan Masyarakat: Koordinasi keamanan lingkungan dan mitigasi bencana.\n• Sosial: Pendataan perlindungan sosial bagi kelompok rentan, lansia, dan penyandang disabilitas.",
      address:
        "Siantan Hilir, Kec. Pontianak Utara, Kota Pontianak, Kalimantan Barat 78243",
      phone: "+62 856-4651-9926",
      email: "nrl.azizah@gmail.com",
      mapsEmbed: "https://maps.app.goo.gl/WcqukfBndZsPDvG59?g_st=aw",
      logo: "/images/logo.png",
      heroImage: "/images/hero.jpg",
    },
  });

  console.log("✓ Profile DB successfully updated with new address & 6 SPM Posyandu details.");
}

main().finally(() => prisma.$disconnect());
