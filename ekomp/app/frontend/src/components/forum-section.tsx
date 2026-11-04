"use client";

import Link from "next/link";
import type { DictKey } from "@/lib/dictionary";
import { useLocale } from "@/lib/i18n";
import { OptImg } from "@/components/opt-img";

const THEMES: DictKey[] = [
  "forum.theme.winter",
  "forum.theme.altitude",
  "forum.theme.destination",
  "forum.theme.camp",
  "forum.theme.operators",
  "forum.theme.b2b",
];

/** Ana sayfaya gömülü Forum 2027 bölümü: görsel tüm bölümü kaplar (ayrı menü sekmesi yok). */
export function ForumSection() {
  const { t } = useLocale();

  return (
    <section
      id="forum"
      className="relative flex min-h-svh w-full items-center overflow-hidden bg-ink px-margin-mobile py-24 text-white md:px-margin md:py-32"
    >
      <OptImg sizes="100vw"
        src="/images/gallery-mountain-backdrop.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/30" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/40" />

      <div className="relative mx-auto w-full max-w-[1400px]">
        <div className="reveal-left max-w-4xl">
          <span className="inline-flex items-center gap-3 rounded-full bg-primary-container px-5 py-2 font-label-caps text-label-caps text-on-primary-container uppercase">
            <span className="material-symbols-outlined text-[18px]">flag</span>
            {t("forum.short")}
          </span>
          <h2 className="mt-6 font-display-xl text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            {t("forum.name")}
          </h2>
          <p className="mt-6 max-w-2xl font-body-lg text-lg text-white/85 md:text-xl">{t("forum.about.text")}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/forum/kayit"
              className="inline-flex items-center gap-2 rounded-full bg-primary-container px-8 py-4 font-label-caps text-label-caps text-on-primary-container uppercase transition-colors hover:bg-white"
            >
              {t("forum.register")}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link
              href="/forum/program"
              className="inline-flex items-center rounded-full border border-white/60 px-8 py-4 font-label-caps text-label-caps text-white uppercase backdrop-blur transition-colors hover:bg-white hover:text-ink"
            >
              {t("forum.programme")}
            </Link>
            <Link
              href="/forum"
              className="inline-flex items-center rounded-full px-4 py-4 font-label-caps text-label-caps text-white/80 uppercase underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {t("forum.seeAll")}
            </Link>
          </div>
        </div>

        <ul className="reveal mt-14 grid gap-4 md:grid-cols-3">
          <li className="flex items-start gap-4 rounded-2xl border border-white/15 bg-ink/40 p-6 backdrop-blur-md">
            <span aria-hidden className="material-symbols-outlined text-primary-container">event</span>
            <p className="font-title-md text-lg leading-snug font-bold">{t("forum.dates")}</p>
          </li>
          <li className="flex items-start gap-4 rounded-2xl border border-white/15 bg-ink/40 p-6 backdrop-blur-md">
            <span aria-hidden className="material-symbols-outlined text-primary-container">location_on</span>
            <p className="font-title-md text-lg leading-snug font-bold">{t("forum.place")}</p>
          </li>
          <li className="flex items-start gap-4 rounded-2xl border border-white/15 bg-ink/40 p-6 backdrop-blur-md">
            <span aria-hidden className="material-symbols-outlined text-primary-container">handshake</span>
            <p className="font-title-md text-lg leading-snug font-bold">{t("forum.b2b.title")}</p>
          </li>
        </ul>

        <ul className="reveal mt-8 flex flex-wrap gap-3">
          {THEMES.map((key) => (
            <li
              key={key}
              className="rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur"
            >
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
