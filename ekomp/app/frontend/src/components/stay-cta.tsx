"use client";

import { useLocale } from "@/lib/i18n";
import Link from "@/components/locale-link";

import { C, L } from "./t";
import { OptImg } from "@/components/opt-img";

const INCLUDED = [
  { icon: "hotel", label: <L tr="Konaklama" en="Accommodation" /> },
  { icon: "restaurant", label: <L tr="Beslenme uzmanı" en="Nutrition specialist" /> },
  { icon: "healing", label: <L tr="Fizyoterapi" en="Physiotherapy" /> },
  { icon: "stadium", label: <L tr="Antrenman sahaları" en="Training pitches" /> },
];

export function StayCta() {
  const { c } = useLocale();
  return (
    <section className="w-full bg-surface px-margin-mobile py-12 md:px-margin md:py-20">
      <div className="reveal-zoom relative mx-auto max-w-[1400px] overflow-hidden rounded-3xl bg-ink">
        <OptImg sizes="100vw"
          src="/images/reservation-bg.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="relative grid gap-10 p-8 md:p-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2 className="font-headline-lg text-[32px] leading-tight font-extrabold tracking-tight text-white md:text-5xl">
              <C k="stay.title1" />{" "}<span className="text-primary-container"><C k="stay.title2" /></span>{c("stay.title3") ? ` ${c("stay.title3")}` : null}
            </h2>
            <p className="mt-4 max-w-xl font-body-lg text-lg text-white/75">
              <C k="stay.text" />
            </p>
            <Link
              href="/rezervasyon#rezervasyon"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-container px-8 py-4 font-label-caps text-label-caps text-on-primary-container uppercase transition-colors hover:bg-white"
            >
              <C k="stay.button" />
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {INCLUDED.map((item) => (
              <li
                key={item.icon}
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 font-semibold text-white backdrop-blur"
              >
                <span className="material-symbols-outlined text-primary-container">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
