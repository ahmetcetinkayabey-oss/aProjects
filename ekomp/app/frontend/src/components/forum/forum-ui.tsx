"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useLocale } from "@/lib/i18n";
import { getForumToken, clearForumToken } from "@/lib/forum-api";
import type { DictKey } from "@/lib/dictionary";
import type { DataState } from "@/lib/use-forum-data";

export const fieldClass =
  "w-full rounded-lg border border-surface-container-highest bg-white px-4 py-3 font-body-md text-body-md text-on-surface outline-none focus:border-primary focus-visible:outline-2 focus-visible:outline-primary-container";

export const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-8 py-4 font-label-caps text-label-caps text-on-primary-container uppercase transition-colors hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60";

const LINKS: { href: string; key: DictKey }[] = [
  { href: "/forum", key: "forum.short" },
  { href: "/forum/program", key: "forum.programme" },
  { href: "/forum/konusmacilar", key: "forum.nav.speakers" },
  { href: "/forum/katilimcilar", key: "forum.nav.participants" },
  { href: "/forum/galeri", key: "forum.nav.gallery" },
];

/** Forum bölümünün alt menüsü: kayıt, program ve katılımcı paneline en fazla bir tık. */
export function ForumSubNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- oturum yalnızca tarayıcıda okunabilir
    setLoggedIn(Boolean(getForumToken()));
  }, [pathname]);

  const active = (href: string) => (href === "/forum" ? pathname === "/forum" : pathname.startsWith(href));
  const pill = "whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary";

  return (
    <nav aria-label="Forum" className="sticky top-0 z-40 border-b border-surface-container-high bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center gap-2 overflow-x-auto px-margin-mobile py-3 md:px-margin">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active(link.href) ? "page" : undefined}
            className={`${pill} ${active(link.href) ? "bg-ink text-white" : "text-on-surface hover:bg-surface-container"}`}
          >
            {t(link.key)}
          </Link>
        ))}
        <span className="ml-auto flex items-center gap-2">
          {loggedIn ? (
            <>
              <Link href="/forum/panel" className={`${pill} bg-primary-container text-on-primary-container`}>
                {t("forum.nav.panel")}
              </Link>
              <button
                type="button"
                className={`${pill} text-on-surface hover:bg-surface-container`}
                onClick={() => {
                  clearForumToken();
                  setLoggedIn(false);
                  router.push("/forum");
                  router.refresh();
                }}
              >
                {t("forum.nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link href="/forum/giris" className={`${pill} text-on-surface hover:bg-surface-container`}>
                {t("forum.nav.login")}
              </Link>
              <Link href="/forum/kayit" className={`${pill} bg-primary-container text-on-primary-container`}>
                {t("forum.register")}
              </Link>
            </>
          )}
        </span>
      </div>
    </nav>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-margin-mobile py-12 md:px-margin md:py-16">
      <h1 className="mb-8 font-headline-lg text-[32px] font-extrabold tracking-tight text-on-surface md:text-5xl">
        {title}
      </h1>
      {children}
    </section>
  );
}

/** Yükleniyor / hata / boş durumlarını tek yerde yönetir. */
export function DataView<T>({
  state,
  isEmpty,
  emptyKey,
  children,
}: {
  state: DataState<T>;
  isEmpty: (data: T) => boolean;
  emptyKey: DictKey;
  children: (data: T) => ReactNode;
}) {
  const { t } = useLocale();
  if (state.status === "loading") return <p role="status" className="text-on-surface-variant">{t("common.loading")}</p>;
  if (state.status === "error") return <p role="alert" className="text-red-700">{t("common.loadError")}</p>;
  if (isEmpty(state.data)) return <p className="rounded-xl bg-surface-container-low p-8 text-on-surface-variant">{t(emptyKey)}</p>;
  return <>{children(state.data)}</>;
}

export function ErrorText({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
      {children}
    </p>
  );
}
