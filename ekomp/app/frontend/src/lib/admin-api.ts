"use client";

import { API_URL } from "./api";

const TOKEN_KEY = "ekomp_admin_token";

export function getToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // yoksay
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** Yönetim API'sine yetkili istek atar. 401 gelirse oturumu temizleyip girişe yönlendirir. */
export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError("Sunucuya ulaşılamadı.", 0);
  }

  if (res.status === 401 && path !== "/admin/login" && path !== "/admin/password") {
    clearToken();
    window.location.replace("/admin/login");
    throw new ApiError("Oturum süresi doldu.", 401);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : (body?.message ?? "İşlem başarısız.");
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const { url } = await adminFetch<{ url: string }>("/admin/uploads", { method: "POST", body: form });
  return url;
}

export type ReservationStatus = "PENDING" | "CONTACTED" | "CONFIRMED" | "CANCELLED";

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "Yeni",
  CONTACTED: "Görüşüldü",
  CONFIRMED: "Onaylandı",
  CANCELLED: "İptal",
};

export interface AdminReservation {
  id: string;
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  sportBranch: string;
  groupSize?: number | null;
  preferredStartDate?: string | null;
  preferredEndDate?: string | null;
  message?: string | null;
  status: ReservationStatus;
  adminNote?: string | null;
  createdAt: string;
}

export interface AdminFeedback {
  id: string;
  name: string;
  email?: string | null;
  category: string;
  rating?: number | null;
  message: string;
  handled: boolean;
  createdAt: string;
}

export interface AdminStats {
  reservations: { total: number; byStatus: Partial<Record<ReservationStatus, number>> };
  facilities: number;
  news: number;
}

export interface AdminNews {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string | null;
  imageUrl?: string | null;
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
  publishedAt: string;
  published: boolean;
}

export interface AdminFacility {
  id: string;
  slug: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
  imageUrl?: string | null;
  footerLeft: string;
  footerRight: string;
  stats?: { label: string; value: string }[] | null;
  categoryEn?: string | null;
  titleEn?: string | null;
  descriptionEn?: string | null;
  badgeEn?: string | null;
  footerLeftEn?: string | null;
  footerRightEn?: string | null;
  statsEn?: { label: string; value: string }[] | null;
  sortOrder: number;
}

/** "Yüksek İrtifa Kampı!" -> "yuksek-irtifa-kampi" */
export function slugify(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
