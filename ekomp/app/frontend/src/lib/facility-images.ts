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
  "kayak-snowboard": ["/images/kayak-merkezi.jpg", "/images/kayak-pist.jpg"],
  "kayakla-atlama": [
    "/images/atlama-kule-cikis.jpg",
    "/images/atlama-kuleleri-3.jpg",
    "/images/atlama-manzara.jpg",
    "/images/haber-atlama-kuleleri.jpg",
  ],
};

export const IMAGE_CREDITS = [
  "Yüzme havuzu: WikiFix2007, Melbourne Sports and Aquatic Centre (CC BY-SA 4.0)",
  "Güreş: Gastón Cuello, Gençlik Olimpiyatları 2018 (CC BY-SA 4.0)",
  "Atletizm pisti: Neukoln (CC BY-SA 3.0)",
  "Üniversiade heykeli: Zeynel Cebeci (CC BY-SA 4.0)",
  "Salon sporları: Aysinpir, Bilkent Erzurum Spor Salonu (CC BY-SA 3.0)",
  "Kayak: hüseyin yeşil, Palandöken Kayak Merkezi (CC BY 3.0)",
  "Kayak pisti (haber görseli): Eric Miller (CC0)",
  "Curling Salonu, Kayakla Atlama Kuleleri: Eğitmen Mahmut (CC BY-SA 3.0)",
  "Buz arenası: Kkr1122, GSIM Buz Arenası, Erzurum (CC BY-SA 4.0)",
  "Judo: Korea.net / Korean Culture and Information Service (CC BY-SA 2.0)",
  "Yüzme havuzu binası: E-92, DPÜ Olimpik Yüzme Havuzu (CC BY-SA 4.0)",
  "Palandöken manzarası: Bjørn Christian Tørrissen (CC BY-SA 3.0)",
  "Kayakla atlama kuleleri: Mehrdad Sarhangi (CC BY 3.0)",
  "Futbol sahaları: Erzurum Yüksek İrtifa Kamp Merkezi arşivi",
  "Fotoğraflar Wikimedia Commons'tan alınmıştır; tesis görselleri temsilidir.",
];

export function facilityImage(facility: Facility): string | undefined {
  return assetUrl(facility.imageUrl) ?? IMAGE_BY_SLUG[facility.slug];
}

/** Ana görsel hariç, tesisin ek fotoğrafları (aynı görsel iki kez gösterilmez). */
export function facilityGallery(facility: Facility): string[] {
  const hero = facilityImage(facility);
  return (GALLERY_BY_SLUG[facility.slug] ?? []).filter((src) => src !== hero);
}
