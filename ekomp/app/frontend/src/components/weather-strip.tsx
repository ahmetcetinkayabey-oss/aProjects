import { L } from "./t";

/** Palandöken yaklaşık konumu; sıcaklık kamp merkezinin rakımına (2.100 m) göre hesaplanır. */
const URL =
  "https://api.open-meteo.com/v1/forecast?latitude=39.84&longitude=41.29&elevation=2100" +
  "&current=temperature_2m,weather_code,wind_speed_10m,snow_depth&wind_speed_unit=kmh&timezone=Europe%2FIstanbul";

/** WMO hava durumu kodu → Türkçe/İngilizce açıklama ve ikon. */
function describe(code: number): { tr: string; en: string; icon: string } {
  if (code === 0) return { tr: "Açık", en: "Clear", icon: "wb_sunny" };
  if (code <= 2) return { tr: "Az bulutlu", en: "Partly cloudy", icon: "partly_cloudy_day" };
  if (code === 3) return { tr: "Kapalı", en: "Overcast", icon: "cloud" };
  if (code <= 48) return { tr: "Sisli", en: "Foggy", icon: "foggy" };
  if (code <= 67 || (code >= 80 && code <= 82)) return { tr: "Yağmurlu", en: "Rainy", icon: "rainy" };
  if (code <= 77 || (code >= 85 && code <= 86)) return { tr: "Karlı", en: "Snowy", icon: "weather_snowy" };
  return { tr: "Fırtınalı", en: "Stormy", icon: "thunderstorm" };
}

interface Current {
  temperature_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  snow_depth?: number;
}

async function getCurrent(): Promise<Current | null> {
  try {
    const res = await fetch(URL, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { current?: Current };
    return json.current ?? null;
  } catch {
    return null;
  }
}

/** Palandöken anlık hava durumu (Open-Meteo, anahtarsız ve ücretsiz). Veri alınamazsa hiçbir şey göstermez. */
export async function WeatherStrip() {
  const now = await getCurrent();
  if (!now) return null;
  const w = describe(now.weather_code);
  const snowCm = Math.round((now.snow_depth ?? 0) * 100);
  return (
    <section className="w-full bg-surface px-margin-mobile pt-10 md:px-margin">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-surface-container-high bg-surface-container-low px-6 py-4">
        <span className="inline-flex items-center gap-3 font-title-md text-lg font-bold text-on-surface">
          <span aria-hidden className="material-symbols-outlined text-primary">{w.icon}</span>
          <L tr="Palandöken şimdi" en="Palandöken now" />
          <span className="text-2xl tabular-nums">{Math.round(now.temperature_2m)}°C</span>
          <span className="font-normal text-on-surface-variant"><L tr={w.tr} en={w.en} /></span>
        </span>
        <span className="inline-flex items-center gap-2 text-sm text-on-surface-variant">
          <span aria-hidden className="material-symbols-outlined text-[18px]">air</span>
          <L tr={`Rüzgâr ${Math.round(now.wind_speed_10m)} km/sa`} en={`Wind ${Math.round(now.wind_speed_10m)} km/h`} />
        </span>
        {snowCm > 0 ? (
          <span className="inline-flex items-center gap-2 text-sm text-on-surface-variant">
            <span aria-hidden className="material-symbols-outlined text-[18px]">ac_unit</span>
            <L tr={`Kar kalınlığı ${snowCm} cm`} en={`Snow depth ${snowCm} cm`} />
          </span>
        ) : null}
        <span className="ml-auto text-xs text-on-surface-variant/80">Open-Meteo</span>
      </div>
    </section>
  );
}
