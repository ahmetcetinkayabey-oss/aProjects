import type { MetadataRoute } from "next";
import { getFacilities, getNews } from "@/lib/api";
import { HOTELS } from "@/lib/hotels";
import { SITE_URL } from "@/lib/site-url";

const STATIC_PAGES = ["", "/hakkimizda", "/tesisler", "/haberler", "/rezervasyon", "/forum", "/forum/program", "/forum/konusmacilar", "/gizlilik"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [facilities, news] = await Promise.all([getFacilities(), getNews()]);
  const now = new Date();
  return [
    ...STATIC_PAGES.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
    })),
    ...facilities.map((f) => ({ url: `${SITE_URL}/tesisler/${f.slug}`, lastModified: now, priority: 0.8 })),
    ...HOTELS.map((h) => ({ url: `${SITE_URL}/rezervasyon/oteller/${h.slug}`, lastModified: now, priority: 0.7 })),
    // Dış bağlantılı basın haberlerinin kendi sayfası olmadığı için sitemap'e girmez.
    ...news
      .filter((n) => !n.sourceUrl)
      .map((n) => ({ url: `${SITE_URL}/haberler/${n.slug}`, lastModified: now, priority: 0.5 })),
  ];
}
