import type { MetadataRoute } from "next";
import { getFacilities, getNews } from "@/lib/api";
import { HOTELS } from "@/lib/hotels";
import { localizedUrls } from "@/lib/site-url";

const STATIC_PAGES = ["", "/hakkimizda", "/tesisler", "/haberler", "/rezervasyon", "/forum", "/forum/program", "/forum/konusmacilar", "/gizlilik"];

type Entry = MetadataRoute.Sitemap[number];

/** Her sayfa Türkçe ve İngilizce adresiyle ayrı ayrı listelenir; ikisi de birbirini hreflang karşılığı olarak gösterir. */
function both(path: string, extra: Pick<Entry, "lastModified" | "changeFrequency" | "priority">): Entry[] {
  const urls = localizedUrls(path === "" ? "/" : path);
  const languages = { tr: urls.tr, en: urls.en };
  return [
    { url: urls.tr, alternates: { languages }, ...extra },
    { url: urls.en, alternates: { languages }, ...extra },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [facilities, news] = await Promise.all([getFacilities(), getNews()]);
  const now = new Date();
  return [
    ...STATIC_PAGES.flatMap((path) =>
      both(path, { lastModified: now, changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : 0.7 }),
    ),
    ...facilities.flatMap((f) => both(`/tesisler/${f.slug}`, { lastModified: now, priority: 0.8 })),
    ...HOTELS.flatMap((h) => both(`/rezervasyon/oteller/${h.slug}`, { lastModified: now, priority: 0.7 })),
    // Dış bağlantılı basın haberlerinin kendi sayfası olmadığı için sitemap'e girmez.
    ...news.filter((n) => !n.sourceUrl).flatMap((n) => both(`/haberler/${n.slug}`, { lastModified: now, priority: 0.5 })),
  ];
}
