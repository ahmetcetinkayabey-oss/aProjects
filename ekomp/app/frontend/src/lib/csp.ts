import { SITE_URL } from "./site-url";

/** API'nin kaynağı (fetch, yüklenen görseller). NEXT_PUBLIC_API_URL derleme zamanında gömülür. */
function apiOrigin(): string | null {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api").origin;
  } catch {
    return null;
  }
}

/**
 * İçerik Güvenlik Politikası. Her istekte yeni bir nonce üretilir; yalnızca bu nonce'u taşıyan betikler çalışır
 * ('strict-dynamic' ile onların yüklediği betikler de). Böylece bir yerde enjekte edilen satır içi betik çalışmaz.
 *
 * İzin verilen dış kaynaklar (sitenin gerçekten kullandıkları): Google Fonts (yazı tipi ve simge), Open-Meteo (hava durumu),
 * Google Haritalar / YouTube / Vimeo (gömülü çerçeveler). Yeni bir dış hizmet eklenirse buraya da eklenmelidir.
 */
export function buildCsp(nonce: string): string {
  const dev = process.env.NODE_ENV !== "production";
  const api = apiOrigin();
  const httpsSite = SITE_URL.startsWith("https://");
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // Geliştirmede Next, hata katmanı için eval kullanır.
    "script-src": ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...(dev ? ["'unsafe-eval'"] : [])],
    // Tailwind/Next satır içi style öznitelikleri kullandığı için 'unsafe-inline' (yalnızca stil; betik değil).
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
    // Yönetim panelinden yüklenen görseller API'den ya da bir depolama hizmetinden (https) gelebilir.
    "img-src": ["'self'", "data:", "blob:", "https:", ...(api ? [api] : [])],
    "connect-src": ["'self'", ...(api ? [api] : []), "https://api.open-meteo.com", ...(dev ? ["ws:", "wss:"] : [])],
    "frame-src": ["https://www.google.com", "https://www.youtube-nocookie.com", "https://player.vimeo.com"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'self'"],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
  };
  const parts = Object.entries(directives).map(([k, v]) => `${k} ${v.join(" ")}`);
  // Yalnızca siteye https ile hizmet verildiğinde: yerel/ağ testlerinde (http) kaynakları bozmasın.
  if (httpsSite) parts.push("upgrade-insecure-requests");
  return parts.join("; ");
}
