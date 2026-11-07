import { FALLBACK_FACILITIES } from "./fallback-data";
import { NEWS_ITEMS, type NewsItem } from "./site";
import type { ContentOverrides } from "./i18n";
import type { CreateReservationInput, Facility } from "./types";

if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL tanımlı değil (Vercel > Environment Variables).");
}
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

/** Yönetim panelinden yüklenen görseller (/uploads/...) backend'den servis edilir. */
export function assetUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  return url.startsWith("/uploads/") ? `${API_ORIGIN}${url}` : url;
}

async function getJson<T>(path: string, fallback: T, tags?: string[]): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60, tags } });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

/** Yönetim panelinden değiştirilmiş site metinleri (panel kaydedince önbellek "content" etiketiyle hemen yenilenir). */
export function getContent(): Promise<ContentOverrides> {
  return getJson<ContentOverrides>("/content", {}, ["content"]);
}

export function getFacilities(): Promise<Facility[]> {
  return getJson("/facilities", FALLBACK_FACILITIES);
}

interface ApiNews {
  slug: string;
  title: string;
  summary: string;
  imageUrl?: string | null;
  content?: string | null;
  publishedAt: string;
  category?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  dateLabel?: string | null;
  titleEn?: string | null;
  summaryEn?: string | null;
  contentEn?: string | null;
  categoryEn?: string | null;
  sourceNameEn?: string | null;
  dateLabelEn?: string | null;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}.${m}.${y}`;
}

export async function getNews(): Promise<NewsItem[]> {
  const items = await getJson<ApiNews[] | null>("/news", null);
  if (!items) return NEWS_ITEMS;
  return items.map((n) => ({
    slug: n.slug,
    date: formatDate(n.publishedAt),
    title: n.title,
    summary: n.summary,
    content: n.content,
    category: n.category,
    sourceName: n.sourceName,
    sourceUrl: n.sourceUrl,
    dateLabel: n.dateLabel,
    titleEn: n.titleEn,
    summaryEn: n.summaryEn,
    contentEn: n.contentEn,
    categoryEn: n.categoryEn,
    sourceNameEn: n.sourceNameEn,
    dateLabelEn: n.dateLabelEn,
    image: assetUrl(n.imageUrl) ?? "/images/gallery-drone-closeup.jpg",
  }));
}

export async function getNewsItem(slug: string): Promise<NewsItem | undefined> {
  return (await getNews()).find((n) => n.slug === slug);
}

export async function getFacility(slug: string): Promise<Facility | undefined> {
  return (await getFacilities()).find((f) => f.slug === slug);
}

export interface CreateReservationResult {
  success: boolean;
  error?: string;
}

export interface CreateFeedbackInput {
  name: string;
  email?: string;
  category: string;
  rating?: number;
  message: string;
}

export async function createFeedback(input: CreateFeedbackInput): Promise<CreateReservationResult> {
  try {
    const res = await fetch(`${API_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const message = Array.isArray(body?.message)
        ? body.message.join(", ")
        : (body?.message ?? "Geri bildirim gönderilemedi.");
      return { success: false, error: message };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin." };
  }
}

export async function createReservation(
  input: CreateReservationInput,
): Promise<CreateReservationResult> {
  try {
    const res = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const message = Array.isArray(body?.message)
        ? body.message.join(", ")
        : (body?.message ?? "Talep gönderilemedi.");
      return { success: false, error: message };
    }
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin.",
    };
  }
}
