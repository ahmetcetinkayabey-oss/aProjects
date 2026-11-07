"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/site";
import { useLocale } from "@/lib/i18n";
import type { DictKey } from "@/lib/dictionary";
import { LangSwitch } from "./lang-switch";
import { OptImg } from "@/components/opt-img";

/** Ana sayfaya logo/marka bağlantısı götürür; yatay menüde ayrıca "Ana Sayfa" yer almaz. */
const HEADER_LINKS = NAV_LINKS.filter((l) => l.href !== "/");

/** "Forum 2027" sekmesinin açılır menüsü: her satır bir forum sayfasına götürür ve kısa açıklama gösterir. */
const FORUM_ITEMS: { href: string; icon: string; key: DictKey; tr: string; en: string }[] = [
  { href: "/forum", icon: "info", key: "forum.about.title", tr: "Amaç, temalar ve duyurular", en: "Purpose, themes and announcements" },
  { href: "/forum/program", icon: "schedule", key: "forum.programme", tr: "16–17 Nisan 2027 oturum akışı", en: "Session schedule, 16–17 April 2027" },
  { href: "/forum/konusmacilar", icon: "record_voice_over", key: "forum.nav.speakers", tr: "Konuşmacılar ve panelistler", en: "Speakers and panellists" },
  { href: "/forum/katilimcilar", icon: "corporate_fare", key: "forum.nav.participants", tr: "Foruma katılan kurumlar", en: "Organisations taking part" },
  { href: "/forum/galeri", icon: "photo_library", key: "forum.nav.gallery", tr: "Forumdan fotoğraflar", en: "Photos from the forum" },
];

function ForumDropdown({ active }: { active: boolean }) {
  const { t, locale } = useLocale();
  const [open, setOpen] = useState(false);
  /** Fare/dokunma menüyü açtıktan hemen sonra gelen tıklama menüyü geri kapatmasın. */
  const openedAt = useRef(0);
  const close = () => setOpen(false);
  const openMenu = () => {
    openedAt.current = Date.now();
    setOpen(true);
  };

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={close}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-current={active ? "page" : undefined}
        onClick={() => {
          if (Date.now() - openedAt.current < 500) return;
          setOpen((v) => !v);
        }}
        className={`inline-flex items-center gap-1 rounded-full px-4 py-2.5 text-[15px] font-bold tracking-wide whitespace-nowrap transition-colors ${
          active || open
            ? "bg-primary-container text-on-primary-container"
            : "text-white/85 hover:bg-white/10 hover:text-primary-container"
        }`}
      >
        {t("nav.forum")}
        <span aria-hidden className={`material-symbols-outlined text-[20px] transition-transform ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {open ? (
        <div className="absolute top-full left-1/2 z-50 w-[27rem] -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
            <Link href="/forum" onClick={close} className="block bg-ink px-6 py-5 text-white transition-colors hover:bg-ink-soft">
              <span className="block font-label-caps text-label-caps text-primary-container uppercase">
                {t("forum.dates")}
              </span>
              <span className="mt-2 block text-[15px] leading-snug font-bold">{t("forum.name")}</span>
              <span className="mt-1 flex items-center gap-1 text-sm text-white/70">
                <span aria-hidden className="material-symbols-outlined text-[16px]">location_on</span>
                {t("forum.place")}
              </span>
            </Link>
            <ul className="p-2">
              {FORUM_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="group flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-surface-container-low"
                  >
                    <span aria-hidden className="material-symbols-outlined flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container text-[22px] text-primary transition-colors group-hover:bg-primary-container group-hover:text-on-primary-container">
                      {item.icon}
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold text-on-surface">{t(item.key)}</span>
                      <span className="block text-sm text-on-surface-variant">{locale === "en" ? item.en : item.tr}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-surface-container-high bg-surface-container-low p-4">
              <Link
                href="/forum/kayit"
                onClick={close}
                className="flex items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-3 text-sm font-bold text-on-primary-container transition-colors hover:bg-ink hover:text-white"
              >
                <span aria-hidden className="material-symbols-outlined text-[20px]">person_add</span>
                {t("forum.register")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

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
            if (link.href === "/forum") return <ForumDropdown key={link.href} active={active} />;
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
            const isForum = link.href === "/forum";
            return (
              <div key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`block border-b border-white/5 px-6 py-4 text-base font-bold ${
                    active ? "bg-primary-container text-on-primary-container" : "text-white"
                  }`}
                >
                  {t(link.key)}
                </Link>
                {isForum && active ? (
                  <ul className="border-b border-white/5 bg-black/20">
                    {FORUM_ITEMS.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={pathname === item.href ? "page" : undefined}
                          className={`flex items-center gap-3 px-10 py-3 text-[15px] font-semibold ${
                            pathname === item.href ? "text-primary-container" : "text-white/80"
                          }`}
                        >
                          <span aria-hidden className="material-symbols-outlined text-[20px]">{item.icon}</span>
                          {t(item.key)}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/forum/kayit"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-10 py-3 text-[15px] font-bold text-primary-container"
                      >
                        <span aria-hidden className="material-symbols-outlined text-[20px]">person_add</span>
                        {t("forum.register")}
                      </Link>
                    </li>
                  </ul>
                ) : null}
              </div>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
