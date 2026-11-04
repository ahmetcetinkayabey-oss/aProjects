"use client";

import { useLocale } from "@/lib/i18n";
import Link from "next/link";

import { L } from "./t";
import { OptImg } from "@/components/opt-img";

const INCLUDED = [
  { icon: "hotel", label: <L tr="Konaklama" en="Accommodation" /> },
  { icon: "restaurant", label: <L tr="Beslenme uzmanı" en="Nutrition specialist" /> },
  { icon: "healing", label: <L tr="Fizyoterapi" en="Physiotherapy" /> },
  { icon: "stadium", label: <L tr="Antrenman sahaları" en="Training pitches" /> },
];

export function StayCta() {
  const { locale } = useLocale();
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
              <L tr="Kampınızı " en="Let us " /><span className="text-primary-container"><L tr="planlayalım" en="plan" /></span>{locale === "en" ? " your camp" : null}
            </h2>
            <p className="mt-4 max-w-xl font-body-lg text-lg text-white/75">
              <L tr="Tarih, branş ve kafile bilgisini iletin; ekibimiz size dönsün." en="Send us your dates, sport and group details, and our team will get back to you." />
            </p>
            <Link
              href="/iletisim#rezervasyon"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-container px-8 py-4 font-label-caps text-label-caps text-on-primary-container uppercase transition-colors hover:bg-white"
            >
              <L tr="Talep oluştur" en="Submit a request" />
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
