"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Clock, Trophy, ExternalLink, Video } from "lucide-react";
import ShareButton from "./ShareButton";

export type NewsSectionType = "paragraph" | "subheading" | "image" | "highlight" | "link" | "youtube";

export interface NewsSection {
  id: string;
  type: NewsSectionType;
  content: string;
  caption?: string;
}

export interface NewsArticleData {
  id: number;
  title: string;
  excerpt?: string | null;
  content: string;
  thumbnail?: string | null;
  isPublished?: boolean;
  publishedAt?: string | Date | null;
  createdAt?: string | Date;
  category?: { id: number; name: string } | null;
  author?: { id: number; fullName: string } | null;
}

interface Props {
  article: NewsArticleData;
  onBack?: () => void;
  backHref?: string;
  backLabel?: string;
}

function getNewsThumbnail(url?: string | null): string {
  if (!url || url.startsWith("/images/news/") || url.startsWith("/images/")) {
    return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop";
  }
  return url;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
}

export function renderTextWithLinks(text: string) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline font-medium hover:text-blue-800 break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export default function NewsDetailView({
  article,
  onBack,
  backHref = "/berita",
  backLabel = "Kembali ke Daftar Berita",
}: Props) {
  const thumbnailUrl = getNewsThumbnail(article.thumbnail);

  // Parse structured sections if content is stored as JSON array
  let parsedSections: NewsSection[] | null = null;
  try {
    if (article.content && article.content.trim().startsWith("[")) {
      const parsed = JSON.parse(article.content);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
        parsedSections = parsed;
      }
    }
  } catch {
    parsedSections = null;
  }

  const formattedDate = new Date(
    article.publishedAt || article.createdAt || Date.now()
  ).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── 1. TOMBOL KEMBALI HIERARKIS (SINGLE ICON) ───────────────────── */}
      <div>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-gray-200/80 px-4 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </button>
        ) : (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-gray-200/80 px-4 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
        )}
      </div>

      {/* ── 2. UNIFORM DETAIL CARD LAYOUT ───────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 sm:p-10 space-y-6 overflow-hidden">
        {/* Meta Header */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
            <Tag size={12} />
            {article.category?.name || "Berita & Pengumuman"}
          </span>

          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{formattedDate}</span>
          </div>

          {article.author && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium ml-auto">
              <User size={13} className="text-gray-400" />
              <span>{article.author.fullName}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
          {article.title}
        </h1>

        {/* Excerpt Summary */}
        {article.excerpt && (
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed bg-blue-50/60 border-l-4 border-blue-600 p-4 rounded-r-2xl">
            {article.excerpt}
          </p>
        )}

        {/* Featured Image */}
        {thumbnailUrl && (
          <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-xs border border-gray-100 bg-slate-100">
            <img
              src={thumbnailUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop";
              }}
            />
          </div>
        )}

        {/* Article Body Content (Structured Sections or Fallback Text) */}
        <div className="pt-4 border-t border-gray-100 text-slate-700 text-sm sm:text-base leading-relaxed space-y-5">
          {parsedSections ? (
            parsedSections.map((section, idx) => {
              if (section.type === "subheading") {
                return (
                  <h2
                    key={section.id || idx}
                    className="text-xl sm:text-2xl font-bold text-slate-900 pt-4 pb-1 border-b border-gray-100"
                  >
                    {section.content}
                  </h2>
                );
              }

              if (section.type === "paragraph") {
                return (
                  <p key={section.id || idx} className="whitespace-pre-line text-slate-700 leading-relaxed">
                    {renderTextWithLinks(section.content)}
                  </p>
                );
              }

              if (section.type === "image") {
                return (
                  <figure key={section.id || idx} className="my-6 space-y-2">
                    <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-xs bg-slate-100">
                      <img
                        src={section.content}
                        alt={section.caption || "Gambar Berita"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop";
                        }}
                      />
                    </div>
                    {section.caption && (
                      <figcaption className="text-xs text-center text-gray-500 font-medium italic">
                        📷 {section.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }

              if (section.type === "highlight") {
                return (
                  <div
                    key={section.id || idx}
                    className="my-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-6 rounded-2xl shadow-md flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200 block">
                        Highlight / Pencapaian Kegiatan
                      </span>
                      <h4 className="text-lg font-extrabold mt-0.5 text-white">
                        {section.content}
                      </h4>
                      {section.caption && (
                        <p className="text-xs text-blue-100 mt-1.5 leading-relaxed">
                          {section.caption}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }

              if (section.type === "link") {
                const targetUrl = section.content.trim();
                const linkLabel = section.caption || "Baca Sumber Berita / Referensi Asli";
                return (
                  <div key={section.id || idx} className="my-6 p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <ExternalLink size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block">
                          Link Berita Asli / Sumber Web
                        </span>
                        <h4 className="text-sm font-bold text-slate-800">
                          {linkLabel}
                        </h4>
                      </div>
                    </div>
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs transition shrink-0"
                    >
                      Buka Link <ExternalLink size={14} />
                    </a>
                  </div>
                );
              }

              if (section.type === "youtube") {
                const embedUrl = getYouTubeEmbedUrl(section.content.trim());
                return (
                  <figure key={section.id || idx} className="my-6 space-y-2">
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-black">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={section.caption || "Video Berita YouTube"}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white p-4 text-center">
                          <Video size={48} className="text-red-500 mb-2" />
                          <p className="text-xs text-gray-300">Format link YouTube tidak valid: {section.content}</p>
                        </div>
                      )}
                    </div>
                    {section.caption && (
                      <figcaption className="text-xs text-center text-gray-500 font-medium italic">
                        🎬 {section.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }

              return null;
            })
          ) : (
            <div className="whitespace-pre-line text-slate-700 leading-relaxed">
              {renderTextWithLinks(article.content)}
            </div>
          )}
        </div>

        {/* Share & Footer info */}
        <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <Clock size={14} />
            Dipublikasikan oleh Sistem Posyandu Aster Digital
          </span>
          <ShareButton />
        </div>
      </div>
    </div>
  );
}
