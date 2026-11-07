"use client";

import Link from "next/link";
import { C, L, T, useL } from "./t";
import { NAV_LINKS } from "@/lib/site";
import { OptImg } from "@/components/opt-img";
import { FeedbackSection } from "./feedback-section";

const RESERVATION_LINKS = [
  { href: "/rezervasyon#oteller", tr: "Anlaşmalı oteller", en: "Partner hotels" },
  { href: "/rezervasyon#ekipman", tr: "Ekipman kiralama", en: "Equipment rental" },
  { href: "/rezervasyon#brans", tr: "Branş kampı", en: "Sport camp" },
  { href: "/rezervasyon#masa", tr: "Masa rezervasyonu", en: "Table bookings" },
  { href: "/rezervasyon#test", tr: "Performans testi", en: "Performance tests" },
];

const HELP_LINKS = [
  { href: "/rezervasyon#rezervasyon", icon: "edit_calendar", tr: "Talep formu", en: "Request form" },
  { href: "#geri-bildirim", icon: "forum", tr: "Dilek ve şikâyetler", en: "Feedback and complaints" },
  { href: "/rezervasyon#konum", icon: "directions", tr: "Yol tarifi ve harita", en: "Directions and map" },
  { href: "/gizlilik", icon: "shield", tr: "Gizlilik ve KVKK", en: "Privacy & data protection" },
];

const LINK =
  "text-[15px] text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-primary-container";
const HEADING = "font-label-caps text-label-caps text-primary-container uppercase";

/** Tüm ekran genişliklerinde tek, duyarlı alt bilgi: marka, sayfalar, rezervasyon kısayolları, destekleyenler. */
export function SiteFooter() {
  const l = useL();
  return (
    <footer className="w-full bg-ink text-white">
      <FeedbackSection dark />

      <div className="relative isolate overflow-hidden">
        <OptImg
          src="/images/gallery-mountain-backdrop.jpg"
          alt=""
          aria-hidden
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-bottom"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/95 via-ink/90 to-ink/80" />

        <div className="mx-auto grid max-w-[1400px] gap-12 px-margin-mobile pt-16 pb-12 md:grid-cols-2 md:px-margin lg:grid-cols-[1.4fr_0.8fr_1fr_1.1fr] lg:gap-10">
          {/* Marka */}
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <OptImg
                widths={[128, 256]}
                sizes="96px"
                src="/logo.jpg"
                alt={l("Erzurum Yüksek İrtifa Kamp Merkezi", "Erzurum High Altitude Camp Centre")}
                className="h-24 w-auto rounded-xl bg-white object-contain p-1.5"
              />
            </Link>
            <p className="mt-5 font-headline-md text-lg leading-snug font-bold">
              <L tr="Erzurum Yüksek İrtifa" en="Erzurum High Altitude" />
              <br />
              <L tr="Kamp Merkezi" en="Camp Centre" />
            </p>
            <p className="mt-3 max-w-xs text-[15px] text-white/65">
              <C k="footer.desc" />
            </p>
            <Link
              href="/rezervasyon#rezervasyon"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-container px-6 py-3 text-sm font-bold text-on-primary-container transition-colors hover:bg-white"
            >
              <span className="material-symbols-outlined text-[18px]">event_available</span>
              <C k="footer.cta" />
            </Link>
          </div>

          {/* Sayfalar */}
          <nav aria-label={l("Sayfalar", "Pages")} className="flex flex-col gap-3">
            <h2 className={HEADING}>
              <L tr="Sayfalar" en="Pages" />
            </h2>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={LINK}>
                <T k={link.key} />
              </Link>
            ))}
          </nav>

          {/* Rezervasyon kısayolları */}
          <nav aria-label={l("Rezervasyon", "Reservation")} className="flex flex-col gap-3">
            <h2 className={HEADING}>
              <L tr="Rezervasyon" en="Reservation" />
            </h2>
            {RESERVATION_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={LINK}>
                <L tr={link.tr} en={link.en} />
              </Link>
            ))}
          </nav>

          {/* Yardım */}
          <nav aria-label={l("Yardım", "Help")} className="flex flex-col gap-3">
            <h2 className={HEADING}>
              <C k="footer.help" />
            </h2>
            {HELP_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={`${LINK} inline-flex items-center gap-2`}>
                <span className="material-symbols-outlined text-[18px] text-primary-container">{link.icon}</span>
                <L tr={link.tr} en={link.en} />
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-margin-mobile py-8 md:px-margin sm:flex-row sm:justify-between">
            <h2 className={HEADING}>
              <L tr="Destekleyenler" en="Supporters" />
            </h2>
            <div className="w-full max-w-md rounded-2xl bg-white p-4">
              <OptImg
                widths={[640, 828]}
                sizes="448px"
                src="/images/partner-logos.png"
                alt={l(
                  "Ejder 3200 World Ski Center, Erzurum Büyükşehir Belediyesi ve Palandöken",
                  "Ejder 3200 World Ski Center, Erzurum Metropolitan Municipality and Palandöken",
                )}
                className="h-auto max-h-24 w-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/25">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-margin-mobile py-5 text-sm text-white/55 md:px-margin sm:flex-row">
            <p>
              © {new Date().getFullYear()}{" "}
              {l("Erzurum Yüksek İrtifa Kamp Merkezi. Tüm hakları saklıdır.", "Erzurum High Altitude Camp Centre. All rights reserved.")}
            </p>
            <div className="flex items-center gap-5">
              <Link href="/gizlilik" className="underline underline-offset-4 transition-colors hover:text-primary-container">
                {l("Gizlilik ve KVKK", "Privacy & data protection")}
              </Link>
              <a
                href="#"
                aria-label={l("Sayfanın başına dön", "Back to top")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-primary-container hover:text-on-primary-container"
              >
                <span className="material-symbols-outlined text-[20px]">keyboard_arrow_up</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
