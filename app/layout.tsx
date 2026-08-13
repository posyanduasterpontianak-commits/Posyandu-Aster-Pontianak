import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { RealtimeProvider } from "@/components/realtime/RealtimeProvider";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://posyanduaster.com"),
  title: {
    default: "Posyandu Aster Pontianak — Layanan Kesehatan Masyarakat",
    template: "%s | Posyandu Aster Pontianak",
  },
  description:
    "Informasi resmi dan layanan kesehatan Posyandu Aster Pontianak. Pemantauan tumbuh kembang balita, pemeriksaan ibu hamil, lansia, usia produktif, remaja, serta informasi kegiatan & jadwal posyandu.",
  keywords: [
    "Posyandu Aster Pontianak",
    "Posyandu Aster",
    "Layanan Kesehatan Posyandu",
    "Posyandu Siantan Hilir",
    "Kesehatan Masyarakat Pontianak",
    "Pemantauan Balita",
    "Ibu Hamil",
    "Lansia",
    "Pencegahan Stunting",
    "Imunisasi Balita",
    "PMT Posyandu",
    "Jadwal Posyandu",
    "Kalimantan Barat",
  ],
  authors: [{ name: "Posyandu Aster Pontianak", url: "https://posyanduaster.com" }],
  creator: "Posyandu Aster Pontianak",
  publisher: "Posyandu Aster Pontianak",
  alternates: {
    canonical: "https://posyanduaster.com",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://posyanduaster.com",
    siteName: "Posyandu Aster Pontianak",
    title: "Posyandu Aster Pontianak — Layanan Kesehatan Masyarakat",
    description:
      "Informasi resmi dan layanan kesehatan Posyandu Aster Pontianak. Pemantauan balita, ibu hamil, lansia, remaja, usia produktif, serta jadwal dan berita kegiatan posyandu.",
    images: [
      {
        url: "/images/logo-aster.jpg",
        width: 1200,
        height: 630,
        alt: "Posyandu Aster Pontianak",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Posyandu Aster Pontianak — Layanan Kesehatan Masyarakat",
    description:
      "Informasi resmi dan layanan kesehatan Posyandu Aster Pontianak.",
    images: ["/images/logo-aster.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-[#f8fafc] text-slate-800 selection:bg-blue-600 selection:text-white">
        <Script
          src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.107.0"
          strategy="beforeInteractive"
        />
        <RealtimeProvider>
          <ToastProvider>{children}</ToastProvider>
        </RealtimeProvider>
      </body>
    </html>
  );
}