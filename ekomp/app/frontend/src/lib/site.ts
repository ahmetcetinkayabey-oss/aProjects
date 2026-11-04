import type { DictKey } from "./dictionary";

export const NAV_LINKS: { href: string; label: string; key: DictKey }[] = [
  { href: "/", label: "Ana Sayfa", key: "nav.home" },
  { href: "/hakkimizda", label: "Hakkımızda", key: "nav.about" },
  { href: "/tesisler", label: "Tesisler", key: "nav.facilities" },
  { href: "/haberler", label: "Haberler", key: "nav.news" },
  { href: "/iletisim", label: "İletişim", key: "nav.contact" },
  { href: "/rezervasyon", label: "Rezervasyon", key: "nav.reserve" },
];

export interface NewsItem {
  slug: string;
  date: string;
  title: string;
  summary: string;
  image: string;
  content?: string | null;
  /** Basın haberi ise: kategori, kaynak adı, özgün haber bağlantısı ve tarih yerine gösterilecek etiket. */
  category?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  dateLabel?: string | null;
  titleEn?: string | null;
  summaryEn?: string | null;
  contentEn?: string | null;
  categoryEn?: string | null;
  sourceNameEn?: string | null;
  dateLabelEn?: string | null;
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    slug: "erzurum-kamp-sezonunda-avrupa-kuluplerini-agirlamaya-hazirlaniyor",
    date: "13.06.2026",
    category: "KAMP SEZONU",
    sourceName: "Anadolu Ajansı",
    sourceUrl:
      "https://yerel-haberler.haberturk.com/erzurum-haberleri/erzurum-kamp-sezonunda-avrupa-kuluplerini-agirlamaya-hazirlaniyor-41658631",
    title: "Erzurum kamp sezonunda Avrupa kulüplerini ağırlamaya hazırlanıyor",
    summary: "Yüksek irtifa, modern tesisler ve futbol sahalarıyla Erzurum yeni kamp sezonuna hazırlanıyor.",
    image: "/images/gallery-antreman.jpg",
  },
  {
    slug: "erzurum-yuksek-irtifada-guc-depolamak-isteyen-takimlarin-gozdesi",
    date: "25.07.2025",
    category: "SPOR FAALİYETLERİ",
    sourceName: "Anadolu Ajansı",
    sourceUrl:
      "https://www.aa.com.tr/tr/guncel/erzurum-yuksek-irtifada-guc-depolamak-isteyen-yerli-ve-yabanci-takimlarin-gozdesi/3641773",
    title: "Erzurum yüksek irtifada güç depolamak isteyen takımların gözdesi",
    summary: "Yerli ve yabancı futbol kulüpleri Erzurum'da yeni sezon hazırlıklarını gerçekleştirdi.",
    image: "/images/gallery-matchday.jpg",
  },
  {
    slug: "yuksek-irtifa-kamp-merkezinde-ikinci-etap",
    date: "Arşiv haberi",
    dateLabel: "Arşiv haberi",
    category: "TESİS YATIRIMLARI",
    sourceName: "Erzurum Büyükşehir Belediyesi",
    sourceUrl: "https://eskisite.erzurum.bel.tr/GuncelHaber-yuksek-irtifa-kamp-merkezi-nde-ikinci-etap/29/202639.html",
    title: "Yüksek İrtifa Kamp Merkezi'nde ikinci etap",
    summary: "Kamp merkezinin geliştirilmesine yönelik ikinci etap çalışmaları.",
    image: "/images/gallery-drone-closeup.jpg",
  },
  {
    slug: "yuksek-irtifa-kampi-nasil-planlanir",
    date: "28.10.2026",
    title: "Yüksek irtifa kampı nasıl planlanır?",
    summary:
      "Kamp süresi, yüklenme planı ve toparlanma: 2.100 metrede verimli bir hazırlık dönemi için temel adımlar.",
    image: "/images/yuzme-havuzu.jpg",
  },
  {
    slug: "curling-nedir",
    date: "21.10.2026",
    title: "Curling nedir? Yeni başlayanlar için kısa rehber",
    summary: "Buz üzerinde taş kaydırılan, strateji ve hassasiyet gerektiren kış sporunu tanıyın.",
    image: "/images/curling-salonu.jpg",
  },
  {
    slug: "palandoken-kis-sporlari-kamplari",
    date: "14.10.2026",
    title: "Palandöken'de kış sporları kampları",
    summary: "2.000 ile 3.176 metre arasındaki rakım farkıyla kayak ve snowboard için uzun bir sezon.",
    image: "/images/kayak-pist.jpg",
  },
  {
    slug: "erzurumspor-hazirlik-maci",
    date: "09.05.2018",
    title: "Erzurumspor Hazırlık Maçı",
    summary: "Yüksek İrtifa Kamp Merkezi sahasında oynanan hazırlık müsabakası.",
    image: "/images/gallery-matchday.jpg",
  },
  {
    slug: "birinci-lig-takim-antrenmanlari",
    date: "12.07.2017",
    title: "1. Lig Takım Antrenmanları",
    summary: "Gün batımında saha ve dağ manzarası eşliğinde sezon öncesi antrenmanlar.",
    image: "/images/gallery-antreman.jpg",
  },
];
