"use client";

import { useMemo, useState } from "react";

export function AltitudeCalculator() {
  const [days, setDays] = useState(21);

  const { hbGain, vo2Gain, threshGain, hbBar, vo2Bar, threshBar } = useMemo(() => {
    return {
      hbGain: (3.5 + days * 0.38).toFixed(1),
      vo2Gain: (1.2 + days * 0.16).toFixed(1),
      threshGain: (4.0 + days * 0.4).toFixed(1),
      hbBar: Math.min(100, days * 4.2),
      vo2Bar: Math.min(100, days * 3.5),
      threshBar: Math.min(100, days * 4.0),
    };
  }, [days]);

  return (
    <section
      id="simulator"
      className="w-full bg-surface-container-lowest px-margin-mobile py-space-xl md:px-margin"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
          <div className="flex flex-col gap-space-md lg:col-span-5">
            <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-primary uppercase">
              <span className="material-symbols-outlined text-sm">science</span>
              ALTITUDE PHYSIOLOGY SIMULATOR
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface uppercase md:text-headline-lg">
              İnteraktif İrtifa Fayda Hesaplayıcı
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              2.100 metre Palandöken irtifasında hipoksik maruziyet;
              böbreklerden Eritropoietin (EPO) salgılanmasını tetikler.
              Alyuvar kitlesi, hemoglobin konsantrasyonu ve mitokondriyal
              yoğunluk hızla artış gösterir.
            </p>
            <div className="space-y-space-xs rounded-lg bg-surface-container p-space-md text-xs">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-base text-secondary">check</span>
                <span>
                  <strong>Live High - Train High:</strong> Hem konaklama hem
                  antrenman 2.100m&apos;de.
                </span>
              </div>
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-base text-secondary">check</span>
                <span>
                  <strong>VO2 Max Artışı:</strong> Deniz seviyesine dönüşte
                  %3.8 - %5.2 kalıcı kazanç.
                </span>
              </div>
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-base text-primary">check</span>
                <span>
                  <strong>Laktat Tamponlama:</strong> H⁺ iyon toleransında
                  %14&apos;e varan iyileşme.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-md pt-space-xs">
              <div className="flex flex-col">
                <span className="font-metric-display-mobile text-metric-display-mobile font-bold text-primary">
                  21 Gün
                </span>
                <span className="text-xs text-on-surface-variant">
                  İdeal Aklimatizasyon & Kamp Süresi
                </span>
              </div>
              <div className="h-10 w-px bg-surface-container-high" />
              <div className="flex flex-col">
                <span className="font-metric-display-mobile text-metric-display-mobile font-bold text-secondary">
                  +%12.4
                </span>
                <span className="text-xs text-on-surface-variant">
                  Net Dayanıklılık Performans Çıktısı
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-surface-container p-space-lg shadow-2xl lg:col-span-7">
            <div className="flex items-center justify-between border-b border-surface-container-high/60 pb-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
                <span className="font-title-md text-title-md text-on-surface uppercase">
                  Biyometrik Projeksiyon Modülü
                </span>
              </div>
              <span className="rounded bg-surface-container-highest px-space-sm py-1 font-label-caps text-xs text-secondary uppercase">
                WADA & IOC UYUMLU FİZYOLOJİ
              </span>
            </div>

            <div className="my-space-lg grid grid-cols-1 gap-space-md md:grid-cols-2">
              <div>
                <label className="mb-space-xs block font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Antrenman İrtifası
                </label>
                <div className="flex items-center justify-between rounded bg-surface-container-lowest p-space-sm">
                  <span className="font-headline-md text-headline-md font-bold text-primary">
                    2.100 m
                  </span>
                  <span className="text-xs text-secondary-fixed">
                    Palandöken Zirve Üssü
                  </span>
                </div>
              </div>
              <div>
                <label className="mb-space-xs block font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Hedef Kamp Süresi (Gün)
                </label>
                <div className="flex items-center gap-space-sm">
                  <input
                    type="range"
                    min={7}
                    max={35}
                    value={days}
                    onChange={(event) => setDays(Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded bg-surface-container-lowest accent-primary-container"
                  />
                  <span className="min-w-[50px] text-right font-headline-md text-headline-md font-bold text-on-surface">
                    {days} G
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-space-lg grid grid-cols-1 gap-space-md pt-space-xs md:grid-cols-3">
              <div className="flex flex-col justify-between rounded-lg bg-surface-container-lowest p-space-md">
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Hemoglobin / Alyuvar
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-metric-display-mobile text-headline-lg font-bold text-secondary tabular-nums">
                      +%{hbGain}
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full bg-secondary transition-all duration-300"
                    style={{ width: `${hbBar}%` }}
                  />
                </div>
                <span className="mt-2 block text-[10px] text-on-surface-variant">
                  EPO artışı ile oksijen bağlama kapasitesi
                </span>
              </div>
              <div className="flex flex-col justify-between rounded-lg bg-surface-container-lowest p-space-md">
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    VO2 Max Gelişimi
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-metric-display-mobile text-headline-lg font-bold text-primary tabular-nums">
                      +%{vo2Gain}
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${vo2Bar}%` }}
                  />
                </div>
                <span className="mt-2 block text-[10px] text-on-surface-variant">
                  Deniz seviyesi yarış tempo verimliliği
                </span>
              </div>
              <div className="flex flex-col justify-between rounded-lg bg-surface-container-lowest p-space-md">
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Aerobik Eşik Artışı
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-metric-display-mobile text-headline-lg font-bold text-on-surface tabular-nums">
                      +%{threshGain}
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full bg-primary-container transition-all duration-300"
                    style={{ width: `${threshBar}%` }}
                  />
                </div>
                <span className="mt-2 block text-[10px] text-on-surface-variant">
                  Laktat birikimini geciktirme oranı
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-space-md rounded bg-surface-container-high/60 p-space-sm sm:flex-row">
              <div className="text-xs text-on-surface-variant">
                Spor dalınıza özel aklimatizasyon ve hipoksi protokol raporunu
                PDF olarak indirin.
              </div>
              <button
                type="button"
                className="rounded bg-primary-container px-space-md py-space-xs font-label-caps text-label-caps whitespace-nowrap text-on-primary-container uppercase shadow-[0_2px_10px_rgba(255,101,0,0.3)] transition-colors hover:bg-primary"
              >
                Özel Protokol Çıkar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
