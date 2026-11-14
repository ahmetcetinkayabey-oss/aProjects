"use client";

import { usePlainPathname } from "@/lib/i18n";
import { useEffect, useState, type ReactNode } from "react";
import { ChatWidget } from "./chat-widget";
import { SiteFooter } from "./site-footer";
import { SiteNavBar } from "./site-nav-bar";
import { TopBanner } from "./top-banner";

/** Herkese açık sitenin ortak çerçevesi. Yönetim paneli (/admin) kendi düzenini kullanır. */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePlainPathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <div
        aria-hidden
        className="scroll-progress fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-primary-container"
        style={{ transform: "scaleX(0)" }}
      />
      {/* Sayfanın en üstünde opak; aşağı inildiğinde şeffaflaşır ve içerik bulanık görünür */}
      <div
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled ? "bg-[#0B132B]/90 shadow-[0_6px_24px_rgba(11,19,43,0.25)] backdrop-blur-lg" : "bg-[#0B132B] shadow-[0_3px_16px_rgba(0,0,0,0.18)]"
        }`}
      >
        <SiteNavBar />
      </div>
      <TopBanner />
      {children}
      <SiteFooter />
      <ChatWidget />
    </>
  );
}
