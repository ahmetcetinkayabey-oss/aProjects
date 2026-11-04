import type { BenchmarkCenter } from "@/lib/types";

function CenterCell({ center }: { center: BenchmarkCenter }) {
  return (
    <div className="flex items-center gap-space-sm">
      <div
        className={
          center.isHighlighted
            ? "h-10 w-2.5 rounded-sm bg-primary-container"
            : "h-8 w-1.5 rounded-sm bg-surface-bright"
        }
      />
      <div>
        <div className="flex items-center gap-space-xs">
          <span
            className={
              center.isHighlighted
                ? "font-title-md text-title-md font-bold text-on-surface uppercase"
                : "font-title-md text-title-md text-on-surface"
            }
          >
            {center.name}
          </span>
          <span
            className={
              center.isHighlighted
                ? "rounded bg-primary/20 px-space-xs py-0.5 text-[10px] font-bold text-primary"
                : "rounded bg-surface-container-highest px-space-xs py-0.5 text-[10px] text-on-surface-variant"
            }
          >
            {center.countryCode}
          </span>
        </div>
        <span
          className={
            center.isHighlighted
              ? "text-xs text-secondary-fixed"
              : "text-xs text-on-surface-variant"
          }
        >
          {center.location}
        </span>
      </div>
    </div>
  );
}

export function BenchmarkMatrix({ centers }: { centers: BenchmarkCenter[] }) {
  return (
    <section
      id="karsilastirma"
      className="w-full bg-surface px-margin-mobile py-space-xl md:px-margin"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-space-lg flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div>
            <div className="mb-space-xs flex items-center gap-space-xs font-label-caps text-label-caps text-primary uppercase">
              <span className="material-symbols-outlined text-sm">compare_arrows</span>
              GLOBAL BENCHMARK MATRIX
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface uppercase md:text-headline-lg">
              Dünya Merkezleri Detaylı Karşılaştırma Matrisi
            </h2>
            <p className="font-body-md text-body-md mt-space-xs max-w-2xl text-on-surface-variant">
              Sierra Nevada, Font-Romeu, Sant Cugat, Iten ve Kunming ile
              Erzurum YİKM tesis, irtifa ve branş çeşitliliğinin kapsamlı
              analizi.
            </p>
          </div>
          <div className="flex items-center gap-space-xs rounded bg-surface-container-low p-1.5">
            <button
              type="button"
              className="rounded bg-primary-container px-space-md py-space-xs font-label-caps text-label-caps text-on-primary-container uppercase"
            >
              Tüm Branşlar ({centers.length})
            </button>
            <span className="px-2 text-xs text-on-surface-variant">
              Veri Güncelleme: 2025/Q1
            </span>
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-xl bg-surface-container shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-high font-label-caps text-label-caps tracking-wider text-on-surface-variant uppercase">
                  <th className="min-w-[220px] px-space-md py-space-md">Kamp Merkezi</th>
                  <th className="px-space-sm py-space-md text-center">İrtifa (m)</th>
                  <th className="px-space-sm py-space-md text-center">Yüzme (50m)</th>
                  <th className="px-space-sm py-space-md text-center">Futbol Sahaları</th>
                  <th className="px-space-sm py-space-md text-center">Atletizm & Kros</th>
                  <th className="px-space-sm py-space-md text-center">Dövüş & TOHM</th>
                  <th className="px-space-sm py-space-md text-center">Buz & Curling</th>
                  <th className="px-space-sm py-space-md text-center">Salon Sporları</th>
                  <th className="px-space-sm py-space-md text-center">Spor Bilimi Lab.</th>
                  <th className="min-w-[120px] px-space-sm py-space-md text-center">
                    Tesis Skoru
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md divide-y divide-surface-container-high/40">
                {centers.map((center) => (
                  <tr
                    key={center.id}
                    className={
                      center.isHighlighted
                        ? "bg-surface-container-highest/60 transition-colors hover:bg-surface-container-highest"
                        : "transition-colors hover:bg-surface-container-high/40"
                    }
                  >
                    <td className="px-space-md py-space-md">
                      <CenterCell center={center} />
                    </td>
                    <td className="px-space-sm py-space-md text-center">
                      <span
                        className={
                          center.isHighlighted
                            ? "font-title-md text-title-md font-bold text-primary"
                            : "font-semibold text-on-surface"
                        }
                      >
                        {center.altitudeLabel}
                      </span>
                    </td>
                    <td className="px-space-sm py-space-md text-center text-xs text-on-surface">
                      {center.swimming}
                    </td>
                    <td className="px-space-sm py-space-md text-center text-xs text-on-surface">
                      {center.football}
                    </td>
                    <td className="px-space-sm py-space-md text-center text-xs text-on-surface">
                      {center.athletics}
                    </td>
                    <td className="px-space-sm py-space-md text-center text-xs text-on-surface">
                      {center.combatSports}
                    </td>
                    <td className="px-space-sm py-space-md text-center text-xs text-on-surface">
                      {center.iceAndCurling}
                    </td>
                    <td className="px-space-sm py-space-md text-center text-xs text-on-surface">
                      {center.indoorSports}
                    </td>
                    <td className="px-space-sm py-space-md text-center text-xs text-on-surface-variant">
                      {center.sportsScienceLab}
                    </td>
                    <td className="px-space-sm py-space-md text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span
                          className={
                            center.isHighlighted
                              ? "font-metric-display-mobile text-headline-md font-bold text-primary"
                              : "font-title-md text-title-md font-bold text-on-surface"
                          }
                        >
                          {center.facilityScore.toFixed(1)}
                        </span>
                        <span className="text-xs text-on-surface-variant">/10</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center justify-between gap-space-sm bg-surface-container-lowest p-space-md md:flex-row">
            <div className="flex flex-wrap items-center gap-space-md text-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <strong>Erzurum Farkı:</strong> Futbol sahası adedi + Buz/Curling +
                50m Olimpik yüzmeyi aynı koordinatta sunan dünyadaki tek tesis.
              </span>
            </div>
            <a
              href="#tesisler"
              className="flex items-center gap-1 text-xs text-secondary hover:underline"
            >
              Tüm Tesis Metrajlarını İncele
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
