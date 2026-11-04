import type { DigitalScore } from "@/lib/types";

const BAR_COLORS = [
  "bg-secondary-fixed-dim",
  "bg-tertiary",
  "bg-surface-bright",
  "bg-surface-container-highest",
];

export function DigitalScoreboard({ scores }: { scores: DigitalScore[] }) {
  const visionScore = scores.find((score) => score.isVision);
  const otherScores = scores.filter((score) => !score.isVision);

  return (
    <section className="w-full bg-surface-container-lowest px-margin-mobile py-space-xl md:px-margin">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-space-lg flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div>
            <div className="mb-space-xs flex items-center gap-space-xs font-label-caps text-label-caps text-secondary uppercase">
              <span className="material-symbols-outlined text-sm">devices</span>
              DIGITAL PLATFORM BENCHMARKING
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface uppercase md:text-headline-lg">
              Web Siteleri Değerlendirme & Puanlama Tablosu
            </h2>
            <p className="font-body-md text-body-md mt-space-xs max-w-2xl text-on-surface-variant">
              Merkezlerin UI/UX şeffaflığı, dijital rezervasyon kabiliyeti,
              fizyolojik telemetri paylaşımı ve çok dilli erişilebilirlik
              skorları.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded bg-surface-container-high px-space-md py-space-xs text-xs text-on-surface">
            <span className="material-symbols-outlined text-sm text-secondary">insights</span>
            Ağırlıklı Değerlendirme Metodolojisi (10 Üzerinden)
          </div>
        </div>

        <div className="mb-space-lg grid grid-cols-1 gap-space-md md:grid-cols-2 lg:grid-cols-5">
          {otherScores.map((score) => (
            <div
              key={score.id}
              className="flex flex-col justify-between rounded-xl bg-surface-container p-space-md transition-all hover:bg-surface-container-high"
            >
              <div>
                <div className="mb-space-sm flex items-start justify-between">
                  <span className="rounded bg-surface-container-highest px-2 py-0.5 text-[10px] font-bold text-secondary-fixed">
                    {score.countryCode}
                  </span>
                  <span className="font-metric-display-mobile text-headline-md font-bold text-on-surface">
                    {score.totalScore.toFixed(2)}
                  </span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface">
                  {score.centerName}
                </h3>
                <p className="mt-space-xs text-xs text-on-surface-variant">
                  {score.description}
                </p>
              </div>
              <div className="mt-space-md space-y-1.5 border-t border-surface-container-high/60 pt-space-sm text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>UI/UX & Tasarım:</span>
                  <strong className="text-on-surface">{score.uxScore.toFixed(1)}</strong>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Rezervasyon:</span>
                  <strong className="text-on-surface">
                    {score.reservationScore.toFixed(1)}
                  </strong>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>{score.thirdMetricLabel}:</span>
                  <strong className="text-on-surface">
                    {score.thirdMetricScore.toFixed(1)}
                  </strong>
                </div>
              </div>
            </div>
          ))}

          {visionScore ? (
            <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-highest p-space-md shadow-[0_0_24px_rgba(255,101,0,0.18)]">
              <div className="pointer-events-none absolute -top-4 -right-4 h-20 w-20 rounded-full bg-primary/20 blur-xl" />
              <div>
                <div className="mb-space-sm flex items-start justify-between">
                  <span className="rounded bg-primary-container px-2 py-0.5 text-[10px] font-bold text-on-primary-container uppercase">
                    HEDEFLENEN VİZYON
                  </span>
                  <span className="font-metric-display-mobile text-headline-md font-bold text-primary">
                    {visionScore.totalScore.toFixed(2)}
                  </span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface uppercase">
                  {visionScore.centerName}
                </h3>
                <p className="mt-space-xs text-xs text-on-surface-variant">
                  {visionScore.description}
                </p>
              </div>
              <div className="mt-space-md space-y-1.5 border-t border-surface-container-high/60 pt-space-sm text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>UI/UX & Tasarım:</span>
                  <strong className="font-bold text-primary">
                    {visionScore.uxScore.toFixed(1)}
                  </strong>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Rezervasyon:</span>
                  <strong className="font-bold text-primary">
                    {visionScore.reservationScore.toFixed(1)}
                  </strong>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>{visionScore.thirdMetricLabel}:</span>
                  <strong className="font-bold text-primary">
                    {visionScore.thirdMetricScore.toFixed(1)}
                  </strong>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="w-full rounded-xl bg-surface-container p-space-lg">
          <h4 className="font-label-caps text-label-caps mb-space-md text-on-surface-variant uppercase">
            DİJİTAL PERFORMANS & PLATFORM KABİLİYET PUANLARI DAĞILIMI
          </h4>
          <div className="space-y-space-sm">
            {scores.map((score, index) => (
              <div key={score.id}>
                <div className="mb-1 flex justify-between text-xs font-semibold">
                  <span className={score.isVision ? "text-primary" : "text-on-surface"}>
                    {score.centerName}
                    {score.isVision ? " (Hedeflenen Portal)" : ""}
                  </span>
                  <span className={score.isVision ? "text-primary" : "text-on-surface"}>
                    {score.totalScore.toFixed(2)} / 10 ({(score.totalScore * 10).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-lowest">
                  <div
                    className={
                      score.isVision
                        ? "h-full rounded-full bg-gradient-to-r from-primary-container to-secondary"
                        : `h-full rounded-full ${BAR_COLORS[index % BAR_COLORS.length]}`
                    }
                    style={{ width: `${score.totalScore * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
