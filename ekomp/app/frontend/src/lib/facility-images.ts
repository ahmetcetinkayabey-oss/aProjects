import { assetUrl } from "./api";
import type { Facility } from "./types";

/** Yönetim panelinden görsel yüklenmemiş tesisler için her tesisin branşına uygun varsayılan fotoğraflar. */
const IMAGE_BY_SLUG: Record<string, string> = {
  "yuzme-havuzu": "/images/yuzme-havuzu.jpg",
  "futbol-sahalari": "/images/facility-futbol.jpg",
  "buz-curling-arenasi": "/images/curling-salonu.jpg",
  "dovus-sporlari-tohm": "/images/guresler-minder.jpg",
  "atletizm-kros": "/images/atletizm-pist.jpg",
  "salon-sporlari": "/images/salon-erzurum.jpg",
  "judo-salonu": "/images/judo.jpg",
  "kayak-snowboard": "/images/kayak-palandoken.jpg",
  "kayakla-atlama": "/images/atlama-kuleleri-kiremitlik.jpg",
  "buz-hokeyi-pateni": "/images/buz-arenasi-erzurum.jpg",
};

export type GalleryImage = { src: string; tr: string; en: string };

/**
 * Tesis detay sayfasındaki galeriye eklenen ek fotoğraflar (ana görselden sonra).
 * Açıklamalar yalnızca fotoğrafta görünen şeyi anlatır; tesise dair iddia taşımaz.
 * Başka bir şehre/organizasyona ait yazı ve marka içeren fotoğraflar bu listeye alınmaz.
 */
const GALLERY_BY_SLUG: Record<string, GalleryImage[]> = {
  "yuzme-havuzu": [
    { src: "/images/yuzme-havuzu-2.jpg", tr: "Olimpik yüzme havuzu kompleksinin dış görünümü", en: "Exterior of the Olympic swimming pool complex" },
  ],
  "futbol-sahalari": [
    { src: "/images/futbol-2.jpg", tr: "Saha ve çevresindeki dağ manzarası, drone görüntüsü", en: "Pitch and the surrounding mountains, drone view" },
    { src: "/images/futbol-3.jpg", tr: "Çim sahalar ve tesis binası, havadan görünüm", en: "Grass pitches and the facility building from above" },
    { src: "/images/futbol-4.jpg", tr: "Yan yana dizili antrenman sahaları", en: "Training pitches laid out side by side" },
    { src: "/images/futbol-5.jpg", tr: "Çok sahalı kampüs ve yerleşim alanına yakınlığı", en: "The multi-pitch campus and its closeness to the city" },
    { src: "/images/futbol-6.jpg", tr: "Yamaca kademeli yerleştirilmiş sahalar", en: "Pitches terraced into the slope" },
    { src: "/images/futbol-7.jpg", tr: "Karlı zirvelerin eteğinde futbol sahaları", en: "Football pitches below snow-capped peaks" },
  ],
  "dovus-sporlari-tohm": [
    { src: "/images/judo.jpg", tr: "Judo müsabakasından bir an", en: "A moment from a judo match" },
  ],
  "atletizm-kros": [
    { src: "/images/atletizm-dag.jpg", tr: "Kros parkurlarının geçtiği yüksek rakımlı dağ yamaçları", en: "High-altitude mountain slopes used for cross-country running" },
  ],
  "judo-salonu": [
    { src: "/images/guresler-minder.jpg", tr: "Minder üzerinde güreş müsabakası", en: "A wrestling bout on the mat" },
  ],
  "kayak-snowboard": [
    { src: "/images/kayak-merkezi.jpg", tr: "Pist başındaki konaklama ve hizmet binaları", en: "Lodging and service buildings at the foot of the slopes" },
    { src: "/images/kayak-pist.jpg", tr: "Karla kaplı yamaçlar ve çam ağaçları", en: "Snow-covered slopes and pine trees" },
    { src: "/images/palandoken-dag-yaz.jpg", tr: "Palandöken dağı, yaz görünümü", en: "Mount Palandöken in summer" },
  ],
  "kayakla-atlama": [
    { src: "/images/kayakla-atlama.jpg", tr: "Atlama kulesi, rampa ve gözetleme platformları", en: "Jumping hill, in-run and viewing platforms" },
    { src: "/images/atlama-kule-cikis.jpg", tr: "Kuleden aşağıya bakış: rampa ve iniş alanı", en: "Looking down from the tower: in-run and landing area" },
    { src: "/images/haber-atlama-kuleleri.jpg", tr: "Atlama tesisi, yüksek noktadan genel görünüm", en: "Ski jumping complex seen from a high vantage point" },
    { src: "/images/atlama-manzara.jpg", tr: "Karlı parkın ardında atlama kuleleri", en: "Ski jumping towers beyond the snowy park" },
  ],
};

export function facilityImage(facility: Facility): string | undefined {
  return assetUrl(facility.imageUrl) ?? IMAGE_BY_SLUG[facility.slug];
}

/** Ana görsel hariç, tesisin ek fotoğrafları (aynı görsel iki kez gösterilmez). */
export function facilityGallery(facility: Facility): GalleryImage[] {
  const hero = facilityImage(facility);
  return (GALLERY_BY_SLUG[facility.slug] ?? []).filter((g) => g.src !== hero);
}

/** Ana görselin altına yazılacak kısa açıklama (yalnızca varsayılan fotoğraflar için). */
const HERO_CAPTION: Record<string, { tr: string; en: string }> = {
  "yuzme-havuzu": { tr: "Çok kulvarlı olimpik yüzme havuzu", en: "Multi-lane Olympic swimming pool" },
  "futbol-sahalari": { tr: "Futbol sahalarının havadan görünümü", en: "Aerial view of the football pitches" },
  "buz-curling-arenasi": { tr: "Spor salonu kompleksinin dış cephesi", en: "Exterior of the sports hall complex" },
  "dovus-sporlari-tohm": { tr: "Minder üzerinde güreş müsabakası", en: "A wrestling bout on the mat" },
  "atletizm-kros": { tr: "Kırmızı tartan atletizm pisti", en: "Red-surface athletics track" },
  "salon-sporlari": { tr: "Çok amaçlı spor salonu", en: "Multi-purpose sports hall" },
  "judo-salonu": { tr: "Judo müsabakasından bir an", en: "A moment from a judo match" },
  "kayak-snowboard": { tr: "Palandöken'de teleferik hattı ve pistler", en: "Gondola line and slopes at Palandöken" },
  "kayakla-atlama": { tr: "Kiremitliktepe kayakla atlama kuleleri", en: "Kiremitliktepe ski jumping towers" },
  "buz-hokeyi-pateni": { tr: "Buz pateni ve hokey arenasının içi", en: "Inside the ice skating and hockey arena" },
};

export function facilityHeroCaption(facility: Facility): { tr: string; en: string } | undefined {
  if (assetUrl(facility.imageUrl)) return undefined;
  return HERO_CAPTION[facility.slug];
}
