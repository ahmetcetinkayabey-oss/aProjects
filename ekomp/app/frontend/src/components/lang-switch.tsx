"use client";

import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/dictionary";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "tr", label: "TR" },
  { value: "en", label: "EN" },
];

/** Sağ üst köşedeki tek tıklamalık TR | EN seçici. Sayfayı yeniden yüklemez. */
export function LangSwitch() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div role="group" aria-label={t("lang.label")} className="flex items-center overflow-hidden rounded-full border border-white/30">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          lang={option.value}
          aria-pressed={locale === option.value}
          onClick={() => setLocale(option.value)}
          className={`min-h-9 min-w-11 px-3 text-[13px] font-extrabold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container ${
            locale === option.value
              ? "bg-primary-container text-on-primary-container"
              : "text-white hover:bg-white/15"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
