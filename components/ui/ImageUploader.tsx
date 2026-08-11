"use client";

import { useState } from "react";
import { Upload, Link as LinkIcon, Loader2, CheckCircle2, Image as ImageIcon, Video } from "lucide-react";
import { compressImageFile } from "@/lib/image-compress";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: "news" | "produk" | "dokumentasi" | "profile" | "uploads";
  label?: string;
  placeholder?: string;
  allowVideo?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "uploads",
  label = "Foto / Gambar",
  placeholder = "https://...",
  allowVideo = false,
}: ImageUploaderProps) {
  const [mode, setMode] = useState<"file" | "url">("file");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compressInfo, setCompressInfo] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setCompressInfo(null);

    try {
      // 1. Kompresi gambar otomatis ke format WebP & max 1200px
      let fileToUpload = file;
      if (file.type.startsWith("image/")) {
        const origSizeKb = (file.size / 1024).toFixed(1);
        fileToUpload = await compressImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.8 });
        const compSizeKb = (fileToUpload.size / 1024).toFixed(1);
        setCompressInfo(`Dikompresi: ${origSizeKb} KB ➔ ${compSizeKb} KB (Format WebP)`);
      }

      // 2. Upload file ke /api/upload (Supabase Storage)
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengunggah file.");
      }

      onChange(json.data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <ImageIcon size={14} className="text-blue-500" /> {label}
        </label>
        <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-2.5 py-1 rounded-md transition ${
              mode === "file" ? "bg-white text-blue-600 shadow-2xs" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upload File (WebP Auto)
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-md transition ${
              mode === "url" ? "bg-white text-blue-600 shadow-2xs" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Link URL / YouTube
          </button>
        </div>
      </div>

      {mode === "file" ? (
        <div className="space-y-2">
          <div className="relative border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50/60 rounded-xl p-3 text-center transition">
            <input
              type="file"
              accept={allowVideo ? "image/*,video/*" : "image/*"}
              onChange={handleFileChange}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            />
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 py-2">
                <Loader2 size={16} className="animate-spin" />
                <span>Mengompresi & Mengunggah WebP...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-1">
                <Upload size={20} className="text-blue-500 mb-1" />
                <p className="text-xs font-semibold text-slate-700">
                  Klik atau seret file gambar ke sini
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Otomatis dikompresi ke WebP max 1200px (Hemat storage ~90%)
                </p>
              </div>
            )}
          </div>

          {compressInfo && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
              <CheckCircle2 size={13} />
              <span>{compressInfo}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || (allowVideo ? "https://... (Gambar Imgur/Cloudinary atau Link Youtube)" : "https://... (Imgur, Cloudinary, Unsplash)")}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      )}

      {error && (
        <p className="text-[11px] font-semibold text-rose-600 mt-1">{error}</p>
      )}

      {/* Preview if URL exists */}
      {value && (
        <div className="mt-2 flex items-center gap-3 p-2 bg-gray-50 border border-gray-200/80 rounded-xl overflow-hidden">
          {value.includes("youtube.com") || value.includes("youtu.be") ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700">
              <Video size={16} /> Link Video YouTube Terdeteksi
            </div>
          ) : (
            <div className="relative w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-gray-500 truncate">{value}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] text-rose-500 hover:text-rose-700 font-bold px-2 py-1 rounded bg-rose-50"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}
