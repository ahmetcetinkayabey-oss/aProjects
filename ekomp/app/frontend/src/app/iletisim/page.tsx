import { permanentRedirect } from "next/navigation";

/** İletişim sayfası kaldırıldı: talep formu ve harita /rezervasyon sayfasında. */
export default function ContactPage() {
  permanentRedirect("/rezervasyon");
}
