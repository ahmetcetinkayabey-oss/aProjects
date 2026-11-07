"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DICTIONARY, type DictKey, type Locale } from "./dictionary";
import { CONTENT_FIELDS } from "./content-registry";

/** Yönetim panelinden değiştirilmiş metinler: anahtar -> { tr, en }. */
export type ContentOverrides = Record<string, { tr: string; en: string | null }>;

const STORAGE_KEY = "ekomp_locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: DictKey) => string;
  /** Yönetilebilir metin (content-registry.ts): panelde değiştirilmişse o, yoksa varsayılan. {ad} yer tutucuları vars ile değişir. */
  c: (key: string, vars?: Record<string, string | number>, fallback?: { tr: string; en: string }) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStored(): Locale | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "tr" || value === "en" ? value : null;
  } catch {
    return null;
  }
}

/**
 * TR/EN seçimi. Manuel seçim her zaman önceliklidir ve tarayıcıda saklanır;
 * ilk ziyarette tarayıcı dili "tr" ise Türkçe, değilse İngilizce açılır.
 * Dil değişimi yalnızca bağlamı günceller; sayfa yeniden yüklenmez, form/oturum bozulmaz.
 */
export function LocaleProvider({ children, content = {} }: { children: ReactNode; content?: ContentOverrides }) {
  const [locale, setLocaleState] = useState<Locale>("tr");

  useEffect(() => {
    const initial = readStored() ?? (navigator.language?.toLowerCase().startsWith("tr") ? "tr" : "en");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tarayıcı dili yalnızca istemcide okunabilir
    setLocaleState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // yoksay
    }
  }, []);

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
