const QUICK_STATS = [
  { label: "FUTBOL", icon: "sports_soccer", value: "11+", caption: "Doğal Çim FIFA Saha" },
  { label: "YÜZME", icon: "pool", value: "50 M", caption: "Kapalı Olimpik Havuz" },
  { label: "CURLING", icon: "ac_unit", value: "5 Pist", caption: "Müstakil Curling Salonu" },
  { label: "DÖVÜŞ (TOHM)", icon: "sports_mma", value: "6 Ring", caption: "Güreş, Boks & Tatami" },
  { label: "ATLETİZM", icon: "sprint", value: "400 M", caption: "Tartan & Kros Parkur" },
  { label: "ÇOK AMAÇLI", icon: "stadium", value: "3.000", caption: "Kişilik Kapalı Arena" },
];

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-surface-container-lowest">
      <div className="relative h-[580px] w-full lg:h-[680px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1920&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/75 to-surface-container-lowest/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-margin-mobile pb-space-xl md:px-margin">
          <div className="mb-space-md flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center gap-space-xs rounded bg-surface-container-highest/90 px-space-sm py-space-xs font-label-caps text-label-caps text-secondary uppercase backdrop-blur">
              <span className="h-2 w-2 animate-ping rounded-full bg-secondary-fixed-dim" />
              LIVE BAROMETRIC STATUS: 782 hPa
            </div>
            <span className="rounded bg-primary-container/20 px-space-sm py-space-xs font-label-caps text-label-caps text-primary uppercase">
              2.100 M RAKIM | PALANDÖKEN - ERZURUM
            </span>
            <span className="rounded bg-surface-container-high/80 px-space-sm py-space-xs font-label-caps text-label-caps text-on-surface-variant uppercase">
              TMOK & TOHM ONAYLI KÜRESEL ÜS
            </span>
          </div>
          <div className="mb-space-lg max-w-4xl">
            <h1 className="font-display-xl text-display-xl-mobile text-on-surface uppercase tracking-tight md:text-display-xl">
              Dünyanın En Kapsamlı <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Çok Branşlı
              </span>{" "}
              Yüksek İrtifa Kompleksi
            </h1>
            <p className="font-body-lg text-body-lg mt-space-sm max-w-2xl text-on-surface-variant">
              1.950 – 2.200 metre yükseklikte; eritropoietin (EPO) hormon
              sentezini ve O₂ saturasyonunu maksimize eden, 11+ FIFA futbol
              sahası, 50m Olimpik havuz ve kış/buz arenalarını tek çatı
              altında toplayan küresel performans üssü.
            </p>
          </div>
          <div className="mb-space-xl flex flex-wrap items-center gap-space-md">
            <a
              href="#karsilastirma"
              className="flex items-center gap-space-xs rounded bg-primary-container px-space-lg py-space-md font-label-caps text-label-caps text-on-primary-container uppercase shadow-[0_4px_20px_rgba(255,101,0,0.35)] transition-all hover:bg-primary"
            >
              <span className="material-symbols-outlined text-base">table_chart</span>
              Kapsamlı Karşılaştırma Raporu
            </a>
            <a
              href="#tesisler"
              className="flex items-center gap-space-xs rounded bg-surface-container-high px-space-lg py-space-md font-label-caps text-label-caps text-on-surface uppercase transition-all hover:bg-surface-bright"
            >
              <span className="material-symbols-outlined text-base">view_in_ar</span>
              Tesisleri Keşfet
            </a>
            <a
              href="#simulator"
              className="flex items-center gap-space-xs rounded bg-surface-container-lowest/80 px-space-lg py-space-md font-label-caps text-label-caps text-secondary uppercase transition-all hover:text-white"
            >
              <span className="material-symbols-outlined text-base">vital_signs</span>
              İrtifa Simülatörü
            </a>
          </div>
          <div className="grid grid-cols-2 gap-space-xs rounded-xl bg-surface-container/85 p-space-xs backdrop-blur-md md:grid-cols-3 lg:grid-cols-6">
            {QUICK_STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col justify-between rounded bg-surface-container-low/70 p-space-sm"
              >
                <div className="flex items-center justify-between text-secondary">
                  <span className="font-label-caps text-label-caps">{stat.label}</span>
                  <span className="material-symbols-outlined text-sm">{stat.icon}</span>
                </div>
                <div className="font-metric-display-mobile text-metric-display-mobile mt-space-xs leading-none text-on-surface">
                  {stat.value}
                </div>
                <div className="font-label-md text-label-md truncate text-on-surface-variant">
                  {stat.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
