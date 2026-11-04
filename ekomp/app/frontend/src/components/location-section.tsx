"use client";

import { useLocale } from "@/lib/i18n";

/** Konum: koordinat uydurmamak için Google Haritalar kurum adıyla arama yapar. */
const QUERY = "Erzurum Yüksek İrtifa Kamp Merkezi";

export function LocationSection() {
  const { t } = useLocale();
  const q = encodeURIComponent(QUERY);
  return (
    <section id="konum" className="w-full bg-surface px-margin-mobile pb-20 md:px-margin md:pb-28">
      <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[0.8fr_1.4fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary uppercase">
            <span className="h-0.5 w-8 bg-primary-container" />
            {t("map.eyebrow")}
          </span>
          <h2 className="mt-3 font-headline-lg text-[28px] leading-tight font-extrabold tracking-tight text-on-surface md:text-4xl">
            {t("map.title")}
          </h2>
          <p className="mt-3 font-body-lg text-lg text-on-surface-variant">{t("map.text")}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${q}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-container hover:text-on-primary-container"
          >
            <span className="material-symbols-outlined text-[18px]">directions</span>
            {t("map.directions")}
          </a>
        </div>
        <div className="overflow-hidden rounded-3xl border border-surface-container-high shadow-lg">
          <iframe
            title={t("map.frame")}
            src={`https://www.google.com/maps?q=${q}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[320px] w-full md:h-[420px]"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
