export function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full bg-surface/85 shadow-[0_1px_12px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <div className="flex h-20 w-full items-center justify-between gap-space-lg px-margin-mobile md:px-margin">
        <a href="#" className="flex shrink-0 items-center gap-space-sm">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Ejder Kayak Merkezleri" className="h-full w-full object-contain p-0.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md leading-none tracking-tight text-on-surface uppercase">
              ERZURUM
            </span>
            <span className="font-label-caps text-label-caps text-secondary-fixed uppercase tracking-wider">
              YÜKSEK İRTİFA KAMP MERKEZİ
            </span>
          </div>
        </a>
        <div className="hidden items-center gap-space-xs rounded bg-surface-container-high px-space-sm py-space-xs xl:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
          <span className="font-label-caps text-label-caps text-on-surface uppercase">
            2.100M İRTİFA | PALANDÖKEN
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-space-md">
          <div className="hidden items-center rounded bg-surface-container-low p-space-xs sm:flex">
            <button
              type="button"
              className="rounded bg-surface-container-highest px-space-sm py-space-xs font-label-caps text-label-caps text-on-surface uppercase"
            >
              TR
            </button>
            <button
              type="button"
              className="px-space-sm py-space-xs font-label-caps text-label-caps text-on-surface-variant uppercase hover:text-on-surface"
            >
              EN
            </button>
          </div>
          <a
            href="#rezervasyon"
            className="rounded bg-primary-container px-space-lg py-space-sm font-label-caps text-label-caps text-on-primary-container uppercase shadow-[0_2px_14px_rgba(255,101,0,0.35)] transition-all hover:bg-primary hover:text-on-primary"
          >
            Kamp Planla / Kamp Talebi
          </a>
        </div>
      </div>
    </header>
  );
}
