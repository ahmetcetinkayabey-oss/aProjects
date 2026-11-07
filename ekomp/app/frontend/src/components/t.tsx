"use client";

import { pick, useLocale } from "@/lib/i18n";
import type { DictKey } from "@/lib/dictionary";

/** Sunucu bileşenlerinin içinde sözlük metni göstermek için küçük yardımcı. */
export function T({ k }: { k: DictKey }) {
  const { t } = useLocale();
  return <>{t(k)}</>;
}

/** Yönetim panelinden değiştirilebilen metin (lib/content-registry.ts). Düz metin döndürür; stil kapsayıcıdan gelir. */
export function C({ k, vars, fallback }: { k: string; vars?: Record<string, string | number>; fallback?: { tr: string; en: string } }) {
  const { c } = useLocale();
  return <>{c(k, vars, fallback)}</>;
}

/** İstemci bileşenlerinde alt, placeholder gibi yerlerde yönetilebilir metin: const c = useC(); c("anahtar") */
export function useC(): (key: string, vars?: Record<string, string | number>, fallback?: { tr: string; en: string }) => string {
  return useLocale().c;
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
