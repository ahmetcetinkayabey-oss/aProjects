"use client";

import { API_URL } from "./api";
import type { DictKey } from "./dictionary";

const TOKEN_KEY = "ekomp_forum_token";

export const FORUM_DAYS = ["2027-04-16", "2027-04-17"] as const;

export const CATEGORIES = [
  "TOUR_OPERATOR",
  "SPORTS_FEDERATION",
  "SKI_RESORT",
  "HIGH_ALTITUDE_CENTER",
  "HOTEL",
  "INVESTOR",
  "PUBLIC",
  "ACADEMIC",
  "SPEAKER",
  "PRESS",
  "OTHER",
] as const;

export interface ForumSpeaker {
  id: string;
  name: string;
  titleTr: string;
  titleEn: string;
  organization: string;
  country: string;
  photoUrl?: string | null;
  bioTr: string;
  bioEn: string;
  links?: string[] | null;
  confirmation: "INVITED" | "CONFIRMED";
}

export interface ForumSession {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  type: string;
  moderator: string;
  speakers: ForumSpeaker[];
}

export interface ForumMedia {
  id: string;
  kind: string;
  url?: string | null;
  videoUrl?: string | null;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
}

export interface ForumAnnouncement {
  id: string;
  titleTr: string;
  titleEn: string;
  contentTr: string;
  contentEn: string;
  publishedAt: string;
}

export interface ForumSponsor {
  id: string;
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  confirmation: "INVITED" | "CONFIRMED";
}

export interface PublicOrganization {
  organization: string;
  country: string;
  category: string;
}

export interface DirectoryEntry {
  id: string;
  firstName: string;
  lastName: string;
  organization: string;
  jobTitle: string;
  country: string;
  city: string;
  category: string;
  bio?: string | null;
  interests?: string | null;
  photoUrl?: string | null;
  wantsB2B: boolean;
  email?: string | null;
  phone?: string | null;
}

export interface OwnProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  organization: string;
  jobTitle: string;
  category: string;
  bio?: string | null;
  interests?: string | null;
  photoUrl?: string | null;
  wantsB2B: boolean;
  visibility: "PUBLIC" | "PARTICIPANTS" | "HIDDEN";
  shareContact: boolean;
  status: string;
}

export function getForumToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setForumToken(token: string): void {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // yoksay
  }
}

export function clearForumToken(): void {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // yoksay
  }
}

/** Sunucu hatası; `key` arayüzde seçili dilde gösterilecek sözlük anahtarıdır. */
export class ForumApiError extends Error {
  constructor(
    readonly key: DictKey | "notVerified",
    readonly status: number,
  ) {
    super(key);
  }
}

function errorKey(status: number, message: string): ForumApiError["key"] {
  if (status === 0) return "err.network";
  if (message === "EMAIL_NOT_VERIFIED") return "notVerified";
  if (status === 409) return "err.duplicate";
  if (status === 401 && message.includes("hatalı deneme")) return "err.locked";
  if (status === 401) return "err.credentials";
  if (status === 400 && message.includes("Bağlantı")) return "err.token";
  return "err.generic";
}

export async function forumFetch<T>(path: string, init: RequestInit = {}, auth = false): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  if (auth) {
    const token = getForumToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ForumApiError("err.network", 0);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message.join(", ") : String(body?.message ?? "");
    throw new ForumApiError(errorKey(res.status, message), res.status);
  }
  return (await res.json()) as T;
}

export const post = <T>(path: string, body: unknown, auth = false) =>
  forumFetch<T>(path, { method: "POST", body: JSON.stringify(body) }, auth);
