import { MetadataRoute } from "next";

// Domain produksi resmi — hardcoded agar robots.txt selalu benar
const BASE_URL = "https://posyanduaster.com";

/**
 * File robots.txt otomatis untuk Posyandu Aster.
 * Tersedia di: https://posyanduaster.com/robots.txt
 *
 * - Halaman dashboard & API tidak diindeks Google.
 * - Halaman publik (landing, berita, produk, dokumentasi) boleh diindeks.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/berita/", "/produk/", "/dokumentasi/"],
        disallow: [
          "/dashboard/",
          "/monitoring/",
          "/sasaran/",
          "/absensi/",
          "/konten/",
          "/jadwal/",
          "/user/",
          "/api/",
          "/login",
          "/logout",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
