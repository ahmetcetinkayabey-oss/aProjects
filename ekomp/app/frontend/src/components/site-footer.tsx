const OLYMPIC_LINKS = [
  "Kış Sporları & Buz Pisti",
  "Olimpik Yüzme Kompleksi",
  "Atletizm & Tartan Parkur",
  "Dövüş Sporları & Kondisyon",
];

const SCIENCE_LINKS = [
  "Font-Romeu & Sierra Nevada Kıyas",
  "VO2 Max & Laktat Haritalama",
  "Merkez Performans Puanlama",
  "Aklimatizasyon Protokolleri",
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest">
      <div className="w-full px-margin-mobile py-space-xl md:px-margin">
        <div className="mb-space-xl grid grid-cols-1 gap-space-xl md:grid-cols-4">
          <div className="flex flex-col gap-space-md md:col-span-1">
            <div className="flex items-center gap-space-sm">
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpg" alt="Ejder Kayak Merkezleri" className="h-full w-full object-contain p-0.5" />
              </div>
              <span className="font-headline-md text-headline-md tracking-tight text-on-surface uppercase">
                Erzurum Yüksek İrtifa Kamp Merkezi
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Palandöken Dağı 2.100 metre irtifada Olimpik ve elit sporcular
              için küresel düzeyde yüksek irtifa fizyolojisi, hipoksi
              antrenman ve performans merkezi.
            </p>
            <div className="flex items-center gap-space-xs">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              <span className="font-label-caps text-label-caps text-secondary-fixed uppercase">
                Barometrik İrtifa Odası Aktif
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-space-sm">
            <span className="font-label-caps text-label-caps tracking-wider text-primary uppercase">
              Olimpik Branşlar
            </span>
            {OLYMPIC_LINKS.map((link) => (
              <a
                key={link}
                href="#tesisler"
                className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-space-sm">
            <span className="font-label-caps text-label-caps tracking-wider text-primary uppercase">
              İrtifa Bilimi & Analiz
            </span>
            {SCIENCE_LINKS.map((link) => (
              <a
                key={link}
                href="#karsilastirma"
                className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-space-sm">
            <span className="font-label-caps text-label-caps tracking-wider text-primary uppercase">
              Akreditasyonlar & Destek
            </span>
            <div className="flex flex-col gap-space-xs rounded bg-surface-container p-space-md">
              <span className="font-label-md text-label-md text-on-surface">
                TMOK & Uluslararası Federasyonlar
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant">
                T.C. Gençlik ve Spor Bakanlığı Yüksek İrtifa Akrediteli Tesis
              </span>
            </div>
            <div className="mt-space-xs flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-sm text-secondary">verified</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                WADA Uyumlu Test Laboratuvarı
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-space-md bg-surface-container-lowest pt-space-lg sm:flex-row">
          <p className="font-label-md text-label-md text-on-surface-variant">
            © {new Date().getFullYear()} Erzurum Yüksek İrtifa Kamp Merkezi
            (Palandöken). Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-space-lg">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              40°17&apos;N 41°16&apos;E • 2.100M ASL
            </span>
            <span className="font-label-caps text-label-caps text-secondary-fixed uppercase">
              Palandöken / Erzurum
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
