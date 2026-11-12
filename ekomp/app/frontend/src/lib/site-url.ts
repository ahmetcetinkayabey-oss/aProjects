/** Sitenin herkese açık adresi (canonical, sitemap ve paylaşım önizlemeleri için). Yayında NEXT_PUBLIC_SITE_URL verin. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "Erzurum Yüksek İrtifa Kamp Merkezi";
export const SITE_NAME_EN = "Erzurum High Altitude Camp Centre";
export const SITE_DESCRIPTION =
  "Palandöken'de 2.000 metrede; futbol, yüzme, kış sporları ve dövüş sporlarını tek çatı altında toplayan çok branşlı yüksek irtifa kamp merkezi.";
export const SITE_DESCRIPTION_EN =
  "A multi-sport high-altitude camp centre at 2,000 metres in Palandöken, bringing football, swimming, winter sports and combat sports together under one roof.";

/** Bir yolun (örn. "/tesisler") her dildeki tam adresi. "/en" öneki yalnızca İngilizce adreste bulunur. */
export function localizedUrls(plainPath: string): { tr: string; en: string } {
  const path = plainPath === "/" ? "" : plainPath;
  return { tr: plainPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${plainPath}`, en: `${SITE_URL}/en${path}` };
}
