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
  "kayakla-atlama": "/images/kayakla-atlama.jpg",
  "buz-hokeyi-pateni": "/images/buz-arenasi-erzurum.jpg",
};

/** Tesis detay sayfasındaki galeriye eklenen ek fotoğraflar (ana görselden sonra). */
const GALLERY_BY_SLUG: Record<string, string[]> = {
  "yuzme-havuzu": ["/images/yuzme-havuzu-2.jpg"],
  "futbol-sahalari": [
    "/images/futbol-2.jpg",
    "/images/futbol-3.jpg",
    "/images/futbol-4.jpg",
    "/images/futbol-5.jpg",
    "/images/futbol-6.jpg",
    "/images/futbol-7.jpg",
  ],
  "dovus-sporlari-tohm": ["/images/judo.jpg"],
  "atletizm-kros": ["/images/atletizm-dag.jpg"],
  "salon-sporlari": ["/images/salon-voleybol.jpg"],
  "buz-hokeyi-pateni": ["/images/buz-pateni.jpg"],
  "judo-salonu": ["/images/guresler-minder.jpg"],
  "kayak-snowboard": ["/images/kayak-merkezi.jpg", "/images/kayak-pist.jpg", "/images/palandoken-dag-yaz.jpg"],
  "kayakla-atlama": [
    "/images/atlama-kule-cikis.jpg",
    "/images/atlama-kuleleri-3.jpg",
    "/images/atlama-manzara.jpg",
    "/images/haber-atlama-kuleleri.jpg",
  ],
};

export function facilityImage(facility: Facility): string | undefined {
  return assetUrl(facility.imageUrl) ?? IMAGE_BY_SLUG[facility.slug];
}

/** Ana görsel hariç, tesisin ek fotoğrafları (aynı görsel iki kez gösterilmez). */
export function facilityGallery(facility: Facility): string[] {
  const hero = facilityImage(facility);
  return (GALLERY_BY_SLUG[facility.slug] ?? []).filter((src) => src !== hero);
}
