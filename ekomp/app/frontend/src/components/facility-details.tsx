"use client";

import { pick, useLocale } from "@/lib/i18n";

/**
 * Tesisin uzun açıklaması. Metin satır sonlarıyla paragraflara bölünür; "## " ile başlayan satır ara başlık olur.
 * İngilizce boşsa Türkçe gösterilir.
 */
export function FacilityDetails({ tr, en }: { tr?: string | null; en?: string | null }) {
  const { locale } = useLocale();
  const text = pick(locale, tr, en);
  const blocks = text
    .split(/\n+/)
    .map((b) => b.trim())
    .filter(Boolean);
  if (!blocks.length) return null;
  return (
    <div className="space-y-4 font-body-lg text-lg leading-relaxed text-on-surface-variant">
      {blocks.map((b, i) =>
        b.startsWith("## ") ? (
          <h2 key={i} className="pt-4 font-headline-lg text-2xl font-extrabold tracking-tight text-on-surface">
            {b.slice(3)}
          </h2>
        ) : (
          <p key={i}>{b}</p>
        ),
      )}
    </div>
  );
}
