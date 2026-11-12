/** Sitenin herkese açık adresi (canonical, sitemap ve paylaşım önizlemeleri için). Yayında NEXT_PUBLIC_SITE_URL verin. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "Erzurum Yüksek İrtifa Kamp Merkezi";
export const SITE_DESCRIPTION =
  "Palandöken'de 2.000 metrede; futbol, yüzme, kış sporları ve dövüş sporlarını tek çatı altında toplayan çok branşlı yüksek irtifa kamp merkezi.";
