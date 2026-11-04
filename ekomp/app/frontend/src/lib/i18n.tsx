"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DICTIONARY, type DictKey, type Locale } from "./dictionary";

const STORAGE_KEY = "ekomp_locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: DictKey) => string;
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
export function LocaleProvider({ children }: { children: ReactNode }) {
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
    () => ({ locale, setLocale, t: (key) => DICTIONARY[locale][key] ?? DICTIONARY.tr[key] }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale, LocaleProvider içinde kullanılmalı.");
  return ctx;
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
