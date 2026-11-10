import type { CrudConfig } from "./forum-crud";

const DAYS = [
  { value: "2027-04-16", label: "16 Nisan 2027 (Cuma)" },
  { value: "2027-04-17", label: "17 Nisan 2027 (Cumartesi)" },
];

const SESSION_TYPES = [
  { value: "OPENING", label: "Açılış" },
  { value: "KEYNOTE", label: "Ana konuşma" },
  { value: "PANEL", label: "Panel" },
  { value: "WORKSHOP", label: "Atölye" },
  { value: "TECHNICAL", label: "Teknik oturum" },
  { value: "B2B", label: "B2B görüşmeleri" },
  { value: "BREAK", label: "Ara" },
  { value: "CLOSING", label: "Kapanış" },
];

const SESSION_STATUSES = [
  { value: "DRAFT", label: "Taslak (görünmez)" },
  { value: "CONFIRMED", label: "Onaylı (henüz görünmez)" },
  { value: "PUBLISHED", label: "Yayında (programda görünür)" },
];

const CONFIRMATIONS = [
  { value: "INVITED", label: "Davet edildi" },
  { value: "CONFIRMED", label: "Katılımı onaylandı" },
];

const MEDIA_KINDS = [
  { value: "GALLERY", label: "Galeri fotoğrafı" },
  { value: "BANNER", label: "Afiş / banner" },
  { value: "HERO", label: "Forum ana görseli" },
];

const label = (list: { value: string; label: string }[], value: unknown) =>
  list.find((o) => o.value === value)?.label ?? String(value ?? "");

const str = (v: unknown) => (typeof v === "string" ? v : "");

export const SESSIONS_CONFIG: CrudConfig = {
  path: "sessions",
  noun: "oturum",
  empty: "Henüz oturum eklenmedi. Yalnızca “Yayında” durumundaki oturumlar herkese açık programda görünür.",
  defaults: { day: "2027-04-16", startTime: "09:00", endTime: "10:00", type: "PANEL", status: "DRAFT", sortOrder: "0" },
  rowTitle: (i) => str(i.titleTr),
  rowMeta: (i) =>
    `${label(DAYS, i.day).split(" (")[0]} · ${str(i.startTime)}–${str(i.endTime)}${i.room ? ` · ${str(i.room)}` : ""} · ${label(SESSION_TYPES, i.type)}`,
  badges: (i) => {
    const out: { text: string; tone: "ok" | "warn" | "muted" }[] = [
      { text: label(SESSION_STATUSES, i.status).split(" (")[0], tone: i.status === "PUBLISHED" ? "ok" : i.status === "CONFIRMED" ? "warn" : "muted" },
    ];
    if (!str(i.titleEn).trim()) out.push({ text: "İngilizce başlık eksik", tone: "warn" });
    return out;
  },
  fields: [
    { key: "day", label: "Gün", type: "select", required: true, options: DAYS, half: true },
    { key: "type", label: "Oturum türü", type: "select", required: true, options: SESSION_TYPES, half: true },
    { key: "startTime", label: "Başlangıç", type: "time", required: true, half: true },
    { key: "endTime", label: "Bitiş", type: "time", required: true, half: true },
    { key: "titleTr", label: "Başlık", type: "text", required: true },
    { key: "descriptionTr", label: "Açıklama", type: "textarea", rows: 3 },
    { key: "room", label: "Salon", type: "text", half: true },
    { key: "moderator", label: "Moderatör", type: "text", half: true },
    { key: "speakerIds", itemKey: "speakers", label: "Konuşmacılar", type: "speakers" },
    { key: "status", label: "Durum", type: "select", required: true, options: SESSION_STATUSES, half: true },
    { key: "sortOrder", label: "Sıra (aynı saatte)", type: "number", half: true },
    { key: "titleEn", label: "Title", type: "text", group: "en" },
    { key: "descriptionEn", label: "Description", type: "textarea", rows: 3, group: "en" },
  ],
};

export const SPEAKERS_CONFIG: CrudConfig = {
  path: "speakers",
  noun: "konuşmacı",
  empty: "Henüz konuşmacı eklenmedi. Yalnızca “Yayında” işaretli konuşmacılar sitede görünür.",
  publishToggle: true,
  defaults: { confirmation: "INVITED", published: false, sortOrder: "0" },
  rowTitle: (i) => str(i.name),
  rowMeta: (i) => [str(i.titleTr), str(i.organization), str(i.country)].filter(Boolean).join(" · ") || "—",
  badges: (i) => {
    const out: { text: string; tone: "ok" | "warn" | "muted" }[] = [
      { text: i.confirmation === "CONFIRMED" ? "Onaylı" : "Davetli", tone: i.confirmation === "CONFIRMED" ? "ok" : "muted" },
      { text: i.published ? "Yayında" : "Taslak", tone: i.published ? "ok" : "muted" },
    ];
    if (str(i.bioTr).trim() && !str(i.bioEn).trim()) out.push({ text: "İngilizce özgeçmiş eksik", tone: "warn" });
    return out;
  },
  fields: [
    { key: "name", label: "Ad soyad", type: "text", required: true },
    { key: "titleTr", label: "Unvan", type: "text", half: true },
    { key: "organization", label: "Kurum", type: "text", half: true },
    { key: "country", label: "Ülke", type: "text", half: true },
    { key: "confirmation", label: "Katılım durumu", type: "select", required: true, options: CONFIRMATIONS, half: true },
    { key: "photoUrl", label: "Fotoğraf", type: "image", nullable: true },
    { key: "bioTr", label: "Özgeçmiş", type: "textarea", rows: 4 },
    { key: "links", label: "Bağlantılar (LinkedIn, web…)", type: "lines", hint: "Her satıra bir adres; https:// ile başlamalı. En çok 6." },
    { key: "sortOrder", label: "Sıra", type: "number", half: true },
    { key: "published", label: "Sitede yayınlansın", type: "checkbox" },
    { key: "titleEn", label: "Title", type: "text", group: "en" },
    { key: "bioEn", label: "Biography", type: "textarea", rows: 4, group: "en" },
  ],
};

export const ANNOUNCEMENTS_CONFIG: CrudConfig = {
  path: "announcements",
  noun: "duyuru",
  empty: "Henüz duyuru yok.",
  publishToggle: true,
  defaults: { publishedAt: new Date().toISOString().slice(0, 10), published: false },
  rowTitle: (i) => str(i.titleTr),
  rowMeta: (i) => new Date(str(i.publishedAt)).toLocaleDateString("tr-TR"),
  badges: (i) => {
    const out: { text: string; tone: "ok" | "warn" | "muted" }[] = [{ text: i.published ? "Yayında" : "Taslak", tone: i.published ? "ok" : "muted" }];
    if (!str(i.titleEn).trim()) out.push({ text: "İngilizce başlık eksik", tone: "warn" });
    return out;
  },
  fields: [
    { key: "titleTr", label: "Başlık", type: "text", required: true },
    { key: "contentTr", label: "Metin", type: "textarea", rows: 5 },
    { key: "publishedAt", label: "Tarih", type: "date", required: true, half: true },
    { key: "published", label: "Sitede yayınlansın", type: "checkbox", half: true },
    { key: "titleEn", label: "Title", type: "text", group: "en" },
    { key: "contentEn", label: "Text", type: "textarea", rows: 5, group: "en" },
  ],
};

export const SPONSORS_CONFIG: CrudConfig = {
  path: "sponsors",
  noun: "destekçi",
  empty: "Henüz destekçi eklenmedi. Yayında işaretli kurumlar forum sayfasında görünür.",
  publishToggle: true,
  defaults: { confirmation: "INVITED", published: false, sortOrder: "0" },
  rowTitle: (i) => str(i.name),
  rowMeta: (i) => str(i.website) || "Web adresi yok",
  badges: (i) => [
    { text: i.confirmation === "CONFIRMED" ? "Onaylı" : "Davetli", tone: i.confirmation === "CONFIRMED" ? "ok" : "muted" },
    { text: i.published ? "Yayında" : "Taslak", tone: i.published ? "ok" : "muted" },
  ],
  fields: [
    { key: "name", label: "Kurum adı", type: "text", required: true },
    { key: "logoUrl", label: "Logo", type: "image", nullable: true },
    { key: "website", label: "Web sitesi", type: "url", nullable: true, hint: "https:// ile başlamalı", half: true },
    { key: "confirmation", label: "Katılım durumu", type: "select", required: true, options: CONFIRMATIONS, half: true },
    { key: "sortOrder", label: "Sıra", type: "number", half: true },
    { key: "published", label: "Sitede yayınlansın", type: "checkbox", half: true },
  ],
};

export const MEDIA_CONFIG: CrudConfig = {
  path: "media",
  noun: "medya",
  empty: "Henüz fotoğraf/video yok. Yayında işaretli olanlar forum galerisinde görünür.",
  publishToggle: true,
  defaults: { kind: "GALLERY", published: false, sortOrder: "0" },
  rowTitle: (i) => str(i.titleTr) || str(i.url) || str(i.videoUrl) || "(başlıksız)",
  rowMeta: (i) => `${label(MEDIA_KINDS, i.kind)}${i.videoUrl ? " · video" : ""}`,
  badges: (i) => {
    const out: { text: string; tone: "ok" | "warn" | "muted" }[] = [{ text: i.published ? "Yayında" : "Taslak", tone: i.published ? "ok" : "muted" }];
    if (str(i.titleTr).trim() && !str(i.titleEn).trim()) out.push({ text: "İngilizce başlık eksik", tone: "warn" });
    return out;
  },
  fields: [
    { key: "kind", label: "Tür", type: "select", required: true, options: MEDIA_KINDS, half: true },
    { key: "sortOrder", label: "Sıra", type: "number", half: true },
    { key: "url", label: "Görsel", type: "image", nullable: true },
    { key: "videoUrl", label: "Video bağlantısı (isteğe bağlı)", type: "text", nullable: true, hint: "Yalnızca YouTube veya Vimeo adresi." },
    { key: "titleTr", label: "Başlık", type: "text" },
    { key: "descriptionTr", label: "Açıklama", type: "textarea", rows: 2 },
    { key: "published", label: "Sitede yayınlansın", type: "checkbox" },
    { key: "titleEn", label: "Title", type: "text", group: "en" },
    { key: "descriptionEn", label: "Description", type: "textarea", rows: 2, group: "en" },
  ],
};
