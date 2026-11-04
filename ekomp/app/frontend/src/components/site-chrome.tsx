"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteNavBar } from "./site-nav-bar";
import { TopBanner } from "./top-banner";

/** Herkese açık sitenin ortak çerçevesi. Yönetim paneli (/admin) kendi düzenini kullanır. */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <div
        aria-hidden
        className="scroll-progress fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-primary-container"
        style={{ transform: "scaleX(0)" }}
      />
      {/* Header zemini her zaman opak: içerik altından geçerken görünmez */}
      <div className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#14161a] shadow-[0_3px_16px_rgba(0,0,0,0.18)]">
        <SiteNavBar />
      </div>
      <TopBanner />
      {children}
      <SiteFooter />
    </>
  );
}
