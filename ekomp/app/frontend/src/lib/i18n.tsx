"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DICTIONARY, type DictKey, type Locale } from "./dictionary";
import { CONTENT_FIELDS } from "./content-registry";

/** Yönetim panelinden değiştirilmiş metinler: anahtar -> { tr, en }. */
export type ContentOverrides = Record<string, { tr: string; en: string | null }>;

const EN_PREFIX = "/en";

/** "/en/tesisler" -> "/tesisler"; "/en" -> "/". Önek yoksa yolu olduğu gibi döndürür. */
export function stripLocalePrefix(path: string): string {
  if (path === EN_PREFIX) return "/";
  return path.startsWith(`${EN_PREFIX}/`) ? path.slice(EN_PREFIX.length) : path;
}

/** İngilizce görünümde site içi adreslere "/en" öneki ekler. Dış adres, yönetim paneli ve API'ye dokunmaz. */
export function localizePath(locale: Locale, href: string): string {
  if (locale !== "en" || !href.startsWith("/") || href.startsWith("//")) return href;
  if (href === EN_PREFIX || href.startsWith(`${EN_PREFIX}/`) || href.startsWith("/admin") || href.startsWith("/api")) return href;
  const m = /^([^?#]*)(.*)$/.exec(href);
  const path = m?.[1] === "/" ? "" : (m?.[1] ?? "");
  return `${EN_PREFIX}${path}${m?.[2] ?? ""}`;
}

/** Önek çıkarılmış geçerli yol: menü vurgusu ve yol karşılaştırmaları için. */
export function usePlainPathname(): string {
  return stripLocalePrefix(usePathname() ?? "/");
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: DictKey) => string;
  /** Yönetilebilir metin (content-registry.ts): panelde değiştirilmişse o, yoksa varsayılan. {ad} yer tutucuları vars ile değişir. */
  c: (key: string, vars?: Record<string, string | number>, fallback?: { tr: string; en: string }) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * TR/EN: dil adresten gelir ("/en" ile başlayan adresler İngilizce). Sunucu, ilk çizim için dili proxy başlığından verir
 * (initialLocale); sonraki sayfa geçişlerinde adres izlenir. Dil düğmesi aynı sayfanın diğer dil adresine gider.
 */
export function LocaleProvider({
  children,
  content = {},
  initialLocale = "tr",
}: {
  children: ReactNode;
  content?: ContentOverrides;
  initialLocale?: Locale;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const fromPath: Locale = pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`) ? "en" : "tr";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- dil, istemci tarafı sayfa geçişlerinde adresten okunur
    setLocaleState(fromPath);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      const { pathname: current, search, hash } = window.location;
      setLocaleState(next);
      router.push(localizePath(next, stripLocalePrefix(current)) + search + hash);
    },
    [router],
  );

  const value = useMemo<LocaleContextValue>(
    () => {
      const resolve = (key: string, vars?: Record<string, string | number>, fallback?: { tr: string; en: string }): string => {
        const field = CONTENT_FIELDS[key];
        const override = content[key];
        let text: string;
        if (override) text = pickOverride(locale, override);
        else if (field?.dict) text = DICTIONARY[locale][field.dict] ?? DICTIONARY.tr[field.dict];
        else if (field) text = (locale === "tr" ? field.tr : field.en) ?? field.tr ?? "";
        else if (fallback) text = locale === "tr" ? fallback.tr : fallback.en || fallback.tr;
        else text = "";
        return vars ? text.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m)) : text;
      };
      return {
        locale,
        setLocale,
        t: (key) => {
          const override = content[key];
          return override ? pickOverride(locale, override) : (DICTIONARY[locale][key] ?? DICTIONARY.tr[key]);
        },
        c: resolve,
      };
    },
    [locale, setLocale, content],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale, LocaleProvider içinde kullanılmalı.");
  return ctx;
}

/** Panelden değiştirilmiş metin: Türkçe birebir kullanılır (boş olabilir); İngilizce boşsa Türkçe gösterilir. */
function pickOverride(locale: Locale, o: { tr: string; en: string | null }): string {
  return locale === "tr" ? o.tr : o.en?.trim() ? o.en : o.tr;
}

/** Yönetilebilir içerik: seçili dil boşsa kontrollü olarak diğer dile döner. */
export function pick(locale: Locale, tr?: string | null, en?: string | null): string {
  const primary = locale === "tr" ? tr : en;
  const fallback = locale === "tr" ? en : tr;
  return (primary?.trim() ? primary : fallback) ?? "";
}

/** Tarih ve saatler aynı veriden, dile göre biçimlenir. Saat dilimi sabit: Europe/Istanbul. */
export function formatDay(locale: Locale, isoDay: string): string {
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    dateStyle: "full",
    timeZone: "Europe/Istanbul",
  }).format(new Date(`${isoDay}T12:00:00+03:00`));
}

/** Site içi adresi geçerli dile göre döndürür (router.push gibi koddan yönlendirmeler için). */
export function useLocalePath(): (href: string) => string {
  const { locale } = useLocale();
  return useCallback((href: string) => localizePath(locale, href), [locale]);
}
