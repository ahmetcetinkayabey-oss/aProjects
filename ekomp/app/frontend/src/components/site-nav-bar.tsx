"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/site";
import { useLocale } from "@/lib/i18n";
import { LangSwitch } from "./lang-switch";
import { OptImg } from "@/components/opt-img";

/** Ana sayfaya logo/marka bağlantısı götürür; yatay menüde ayrıca "Ana Sayfa" yer almaz. */
const HEADER_LINKS = NAV_LINKS.filter((l) => l.href !== "/");

/** Üst bilgi bandının hemen altında, kaydırınca da üstte kalan logo + menü çubuğu (xl ve üstünde yatay menü, altında hamburger). */
export function SiteNavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t, locale } = useLocale();
  const loginLabel = locale === "en" ? "Log in" : "Giriş Yap";
  const brandName = locale === "en" ? "Erzurum High Altitude Camp Centre" : "Erzurum Yüksek İrtifa Kamp Merkezi";

  return (
    <header className="relative">
      <div className="mx-auto flex h-[108px] w-full max-w-[1600px] items-center gap-4 px-margin-mobile md:h-[120px] md:px-margin">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-4"
          onClick={() => setOpen(false)}
        >
          <OptImg priority widths={[96, 128, 256, 384]} sizes="130px"
            src="/logo.jpg"
            alt={brandName}
            className="h-[84px] w-auto rounded-xl bg-white object-contain p-1.5 md:h-[102px]"
          />
          <span className="hidden md:block">
            <span className="block text-[17px] leading-tight font-extrabold tracking-wide whitespace-nowrap text-white">
              {locale === "en" ? "ERZURUM HIGH ALTITUDE" : "ERZURUM YÜKSEK İRTİFA"}
            </span>
            <span className="mt-1 block text-[12px] font-bold tracking-[0.18em] text-primary-container">
              {locale === "en" ? "CAMP CENTRE" : "KAMP MERKEZİ"}
            </span>
          </span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-1 xl:flex"
          aria-label={locale === "en" ? "Main menu" : "Ana menü"}
        >
          {HEADER_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2.5 text-[15px] font-bold tracking-wide whitespace-nowrap transition-colors ${
                  active
                    ? "bg-primary-container text-on-primary-container"
                    : "text-white/85 hover:bg-white/10 hover:text-primary-container"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <LangSwitch />
          <Link
            href="/admin"
            title={loginLabel}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-3 text-[15px] font-bold tracking-wide whitespace-nowrap text-white transition-colors hover:bg-white/15 md:px-4"
          >
            <span aria-hidden className="material-symbols-outlined text-[20px]">login</span>
            <span className="max-md:sr-only">{loginLabel}</span>
          </Link>
          <button
            type="button"
            aria-label={t("nav.menuToggle")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white xl:hidden"
          >
            <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="grid border-t border-white/10 bg-ink xl:hidden" aria-label={locale === "en" ? "Mobile menu" : "Mobil menü"}>
          {NAV_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`border-b border-white/5 px-6 py-4 text-base font-bold last:border-b-0 ${
                  active ? "bg-primary-container text-on-primary-container" : "text-white"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
