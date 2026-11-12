"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { adminFetch, clearToken, getToken } from "@/lib/admin-api";

const MENU = [
  { href: "/admin", label: "Özet", icon: "dashboard" },
  { href: "/admin/rezervasyonlar", label: "Rezervasyon Talepleri", icon: "event_available" },
  { href: "/admin/geri-bildirimler", label: "Geri Bildirimler", icon: "rate_review" },
  { href: "/admin/rezervasyon-kayitlari", label: "Kaynak Rezervasyonları", icon: "assignment" },
  { href: "/admin/kaynaklar", label: "Kaynaklar", icon: "event_seat" },
  { href: "/admin/forum", label: "Forum 2027", icon: "event" },
  { href: "/admin/icerik", label: "Sayfa İçerikleri", icon: "edit_note" },
  { href: "/admin/tesisler", label: "Tesisler", icon: "stadium" },
  { href: "/admin/haberler", label: "Haberler", icon: "newspaper" },
  { href: "/admin/ayarlar", label: "Hesap Ayarları", icon: "manage_accounts" },
];

/** Giriş kontrolü + yan menü. Giriş sayfası kabuksuz gösterilir. */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [defaultPassword, setDefaultPassword] = useState(false);
  // Uyarı, yönetici bilerek aynı şifreyi kullanıyorsa bu oturum boyunca kapatılabilir.
  const [warningHidden, setWarningHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) return;
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    adminFetch<{ username: string; defaultPassword?: boolean }>("/admin/me")
      .then((me) => {
        setUsername(me.username);
        setDefaultPassword(Boolean(me.defaultPassword));
        try {
          setWarningHidden(window.sessionStorage.getItem("ekomp_pw_warning_hidden") === "1");
        } catch {
          // sessionStorage kapalıysa uyarı her seferinde gösterilir.
        }
      })
      .catch(() => undefined);
  }, [isLogin, router]);

  if (isLogin) return <>{children}</>;
  if (!username) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-container-low text-on-surface-variant">
        Yükleniyor...
      </div>
    );
  }

  function logout() {
    clearToken();
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-surface-container-low lg:flex">
      <aside
        className={`${menuOpen ? "block" : "hidden"} w-full shrink-0 bg-[#0B132B] text-white lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:overflow-y-auto`}
      >
        <div className="px-space-lg py-space-lg">
          <p className="font-headline-md text-headline-md leading-tight">Yönetim Paneli</p>
          <p className="mt-1 text-xs text-white/60">Erzurum Yüksek İrtifa Kamp Merkezi</p>
        </div>
        <nav className="flex flex-col" aria-label="Yönetim menüsü">
          {MENU.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-space-sm border-l-4 px-space-lg py-space-md text-sm font-semibold transition-colors ${
                  active
                    ? "border-white bg-primary-container text-on-primary-container"
                    : "border-transparent text-white/80 hover:bg-white/10"
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-space-lg border-t border-white/10 px-space-lg py-space-md text-sm">
          <p className="text-white/60">Giriş yapan: {username}</p>
          <div className="mt-space-sm flex gap-space-md">
            <Link href="/" target="_blank" className="text-white/80 underline">
              Siteyi aç
            </Link>
            <button type="button" onClick={logout} className="text-white/80 underline">
              Çıkış yap
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between bg-[#0B132B] px-space-md py-space-sm text-white lg:hidden">
          <span className="font-semibold">Yönetim Paneli</span>
          <button
            type="button"
            aria-label="Menüyü aç/kapat"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center"
          >
            <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
        {defaultPassword && !warningHidden ? (
          <div role="alert" className="flex flex-wrap items-center gap-x-space-md gap-y-1 bg-red-700 px-space-md py-space-sm text-sm text-white">
            <span className="material-symbols-outlined text-[20px]" aria-hidden>warning</span>
            <span className="font-semibold">Yönetici şifreniz tahmin edilmesi kolay (kurulum şifresi veya yaygın bir şifre).</span>
            <Link href="/admin/ayarlar" className="underline">Şifreyi şimdi değiştirin</Link>
            <span className="text-white/80">(site yayına çıkmadan önce mutlaka)</span>
            <button
              type="button"
              className="ml-auto underline"
              onClick={() => {
                setWarningHidden(true);
                try {
                  window.sessionStorage.setItem("ekomp_pw_warning_hidden", "1");
                } catch {
                  // yoksay
                }
              }}
            >
              Bu oturumda gizle
            </button>
          </div>
        ) : null}
        <main className="mx-auto w-full max-w-6xl p-space-md md:p-space-xl">{children}</main>
      </div>
    </div>
  );
}
