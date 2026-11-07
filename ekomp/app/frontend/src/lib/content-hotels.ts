import type { ContentGroup } from "./content-registry";
import { HOTELS } from "./hotels";

/** Otel detay sayfalarındaki düzenlenebilir yazılar (varsayılanlar lib/hotels.ts'ten gelir). Yalnızca yönetim panelinde yüklenir. */
export const hotelKey = {
  tagline: (slug: string) => `hotel.${slug}.tagline`,
  about: (slug: string, index: number) => `hotel.${slug}.about.${index}`,
  section: (slug: string, id: string) => `hotel.${slug}.sec.${id}`,
};

export const HOTEL_CONTENT_GROUPS: ContentGroup[] = HOTELS.map((h) => ({
  id: `hotel-${h.slug}`,
  title: `Otel sayfası · ${h.name}`,
  description: "Anlaşmalı otelin detay sayfasındaki tanıtım yazıları. Oda tipleri ve olanak listeleri kodda tanımlıdır.",
  path: `/rezervasyon/oteller/${h.slug}`,
  fields: [
    { key: hotelKey.tagline(h.slug), label: "Kapak altı kısa tanıtım", tr: h.tagline.tr, en: h.tagline.en, multiline: true },
    ...h.about.map((p, i) => ({ key: hotelKey.about(h.slug, i), label: `Otel hakkında · ${i + 1}. paragraf`, tr: p.tr, en: p.en, multiline: true })),
    ...h.sections.map((s) => ({ key: hotelKey.section(h.slug, s.id), label: `${s.title.tr} · açıklama`, tr: s.text.tr, en: s.text.en, multiline: true })),
  ],
}));
