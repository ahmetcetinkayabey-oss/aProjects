"use client";

import { pick, useLocale } from "@/lib/i18n";
import type { DictKey } from "@/lib/dictionary";

/** Sunucu bileşenlerinin içinde sözlük metni göstermek için küçük yardımcı. */
export function T({ k }: { k: DictKey }) {
  const { t } = useLocale();
  return <>{t(k)}</>;
}

/**
 * Satır içi çeviri: sunucu bileşenlerinde sabit bir metnin iki dilini yan yana yazmak için.
 * İngilizce boşsa Türkçe gösterilir (örn. yöneticinin girdiği ve çevirisi olmayan içerik).
 */
export function L({ tr, en }: { tr: string; en?: string | null }) {
  const { locale } = useLocale();
  return <>{pick(locale, tr, en)}</>;
}

/** İstemci bileşenlerinde alt, placeholder, aria-label gibi metin gereken yerler için: const l = useL(); l("Türkçe", "English") */
export function useL(): (tr: string, en?: string | null) => string {
  const { locale } = useLocale();
  return (tr, en) => pick(locale, tr, en);
}
