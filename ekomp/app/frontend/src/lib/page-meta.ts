import type { Metadata } from "next";
import { getRequestLocale } from "./server-locale";
import { SITE_NAME, SITE_NAME_EN } from "./site-url";

interface Text {
  title: string;
  description?: string;
}

/** Sabit sayfalar için dile göre başlık ve açıklama. Canonical/hreflang kök düzende üretilir. */
export async function pageMeta(tr: Text, en: Text): Promise<Metadata> {
  const isEn = (await getRequestLocale()) === "en";
  const m = isEn ? en : tr;
  return { title: `${m.title} | ${isEn ? SITE_NAME_EN : SITE_NAME}`, description: m.description };
}
