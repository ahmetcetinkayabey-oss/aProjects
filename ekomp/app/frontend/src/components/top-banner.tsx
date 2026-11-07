"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { DictKey } from "@/lib/dictionary";
import { pick, useLocale } from "@/lib/i18n";
import { OptImg } from "@/components/opt-img";

const SLIDES = [
  { src: "/images/hero-palandoken.jpg", alt: "Kamp merkezi ve Palandöken dağları", altEn: "The camp centre and the Palandöken mountains" },
  { src: "/images/gallery-drone-closeup.jpg", alt: "Kamp merkezinin futbol sahaları", altEn: "Football pitches at the camp centre" },
  { src: "/images/gallery-golden-hour-action.jpg", alt: "Gün batımında antrenman sahaları", altEn: "Training pitches at sunset" },
  { src: "/images/gallery-mountain-backdrop.jpg", alt: "Palandöken zirveleri", altEn: "Palandöken peaks" },
];

const HIGHLIGHTS = [
  { value: "2.100 m", valueEn: "2,100 m", label: "Rakım", labelEn: "Altitude" },
  { value: "Çok branş", valueEn: "Multi-sport", label: "Kamp", labelEn: "Camp" },
  { value: "Yıl boyu", valueEn: "Year-round", label: "Açık", labelEn: "Open" },
];

const SUB_TITLES: Record<string, string | DictKey> = {
  "/forum": "forum.short",
  "/hakkimizda": "nav.about",
  "/gizlilik": "privacy.title",
  "/tesisler": "nav.facilities",
  "/haberler": "nav.news",
  "/rezervasyon": "nav.reserve",
};

export function TopBanner() {
  const pathname = usePathname();
  const { t, c, locale } = useLocale();
  const isHome = pathname === "/";
  const [active, setActive] = useState(0);
  const [extraSlides, setExtraSlides] = useState(false);

  useEffect(() => {
    const later = setTimeout(() => setExtraSlides(true), 2500);
    return () => clearTimeout(later);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const rawTitle = SUB_TITLES[`/${pathname.split("/")[1] ?? ""}`];
  const subTitle = rawTitle?.includes(".") ? t(rawTitle as DictKey) : rawTitle;

  return (
    <section
      aria-label={pick(locale, "Tanıtım görseli", "Introduction")}
      className={`relative w-full overflow-hidden bg-ink ${
        isHome ? "h-[700px] sm:h-[780px] lg:h-svh lg:min-h-[720px]" : "h-[440px] sm:h-[520px] lg:h-[600px]"
      }`}
    >
      <div className="hero-drift absolute inset-0">
      {SLIDES.map((slide, index) => (index > 0 && !extraSlides ? null : (
        <OptImg
          key={slide.src}
          src={slide.src}
          priority={index === 0}
          fetchPriority={index === 0 ? "high" : "low"}
          sizes="100vw"
          alt={pick(locale, slide.alt, slide.altEn)}
          aria-hidden={index !== active}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            index === active ? "animate-kenburns opacity-100" : "opacity-0"
          }`}
        />
      )))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

      {isHome ? (
        <div className="hero-fade absolute inset-x-0 bottom-0 mx-auto flex max-w-[1400px] flex-col gap-space-lg px-margin-mobile pb-14 md:px-margin md:pb-20">
          <div className="animate-fade-up max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-1.5 font-label-caps text-label-caps text-on-primary-container uppercase">
              <span className="material-symbols-outlined text-[16px]">landscape</span>
              {c("home.hero.badge")}
            </span>
            <h1 className="mt-space-md font-display-xl text-[44px] leading-[1.02] font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {c("home.hero.title1")}{" "}
              <span className="text-primary-container">{c("home.hero.title2")}</span>
            </h1>
            <p className="mt-space-md max-w-xl font-body-lg text-lg text-white/85">
              {c("home.hero.text")}
            </p>
            <div className="mt-space-lg flex flex-wrap gap-space-sm">
              <Link
                href="/rezervasyon#rezervasyon"
                className="inline-flex items-center gap-2 rounded-full bg-primary-container px-8 py-4 font-label-caps text-label-caps text-on-primary-container uppercase transition-colors hover:bg-white"
              >
                {c("home.hero.btn1")}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                href="/tesisler"
                className="inline-flex items-center rounded-full border border-white/60 px-8 py-4 font-label-caps text-label-caps text-white uppercase backdrop-blur transition-colors hover:bg-white hover:text-ink"
              >
                {c("home.hero.btn2")}
              </Link>
            </div>
          </div>

          <dl className="animate-fade-up hidden w-fit gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md sm:grid sm:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <div key={item.label} className="px-8 py-4">
                <dt className="font-label-caps text-label-caps text-white/60 uppercase">
                  {pick(locale, item.label, item.labelEn)}
                </dt>
                <dd className="mt-1 font-title-md text-xl font-bold text-white">{pick(locale, item.value, item.valueEn)}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <div className="hero-fade absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-margin-mobile pb-8 md:px-margin md:pb-12">
          <span className="inline-block h-1 w-12 rounded-full bg-primary-container" />
          <p className="mt-3 font-display-xl text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            {subTitle}
          </p>
        </div>
      )}

      {isHome ? (
        <div className="absolute top-40 right-margin-mobile flex md:top-44 items-center gap-2 md:right-margin">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={pick(locale, `${index + 1}. görsele git`, `Go to image ${index + 1}`)}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? "w-10 bg-primary-container" : "w-5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
