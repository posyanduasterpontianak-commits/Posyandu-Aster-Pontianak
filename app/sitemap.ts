import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://posyanduaster.com";

/**
 * Sitemap dinamis untuk aplikasi Posyandu Aster.
 * Halaman publik (landing page, berita, produk, dokumentasi) dimasukkan ke sitemap.
 * Halaman dashboard (memerlukan autentikasi) tidak dimasukkan ke sitemap.
 *
 * Tersedia otomatis di: https://posyanduaster.com/sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Halaman statis publik yang dapat diindeks Google
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/berita`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/produk`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/dokumentasi`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Halaman berita individual (dinamis dari database)
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${BASE_URL}/api/news?limit=100&published=true`, {
      next: { revalidate: 3600 }, // cache 1 jam
    });
    if (res.ok) {
      const json = await res.json();
      const articles = Array.isArray(json.data) ? json.data : [];
      newsRoutes = articles.map((article: { id: number | string; updatedAt?: string; createdAt?: string }) => ({
        url: `${BASE_URL}/berita/${article.id}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Jika API tidak tersedia saat build, sitemap tetap berisi halaman statis
  }

  return [...staticRoutes, ...newsRoutes];
}
