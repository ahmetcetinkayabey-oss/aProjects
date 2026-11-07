import type { DictKey } from "./dictionary";

/**
 * Yönetim panelinden değiştirilebilen site metinleri (tek kaynak).
 * - Siteyi gösteren bileşenler metni <C k="anahtar" /> ile alır; varsayılan değer burada tutulur.
 * - Panel "Sayfa İçerikleri" bu listeden oluşur. Yeni bir metin = buraya alan ekle + bileşende <C k="..." /> kullan.
 * - `dict` verilen alanlar sözlükteki (dictionary.ts) metni yönetir; varsayılanı oradan okunur.
 * - Yer tutucu: metinde {count} gibi ifadeler bileşenin verdiği değerle değiştirilir.
 */
export interface ContentField {
  key: string;
  label: string;
  /** Varsayılan Türkçe/İngilizce metin (dict verilmişse gerekmez). */
  tr?: string;
  en?: string;
  dict?: DictKey;
  multiline?: boolean;
  hint?: string;
}

export interface ContentGroup {
  id: string;
  title: string;
  description: string;
  /** Sayfada görüldüğü yer (panelde bağlantı olarak gösterilir). */
  path: string;
  fields: ContentField[];
}

export const CONTENT_GROUPS: ContentGroup[] = [
  {
    id: "home-hero",
    title: "Ana sayfa · Üst görsel alanı",
    description: "Sayfanın en üstündeki büyük karşılama alanı.",
    path: "/",
    fields: [
      { key: "home.hero.badge", label: "Üst etiket", tr: "Palandöken, Erzurum", en: "Palandöken, Erzurum" },
      { key: "home.hero.title1", label: "Başlık (ilk bölüm)", tr: "Şampiyonların", en: "Home of", hint: "Başlık iki parçadır: ilk bölüm beyaz, ikinci bölüm vurgu renginde görünür." },
      { key: "home.hero.title2", label: "Başlık (vurgulu bölüm)", tr: "evi", en: "champions" },
      { key: "home.hero.text", label: "Alt metin", tr: "2.100 metrede, takımlar için yıl boyu açık çok branşlı kamp merkezi.", en: "A year-round, multi-sport camp centre for teams at 2,100 metres.", multiline: true },
      { key: "home.hero.btn1", label: "Birinci düğme", tr: "Kamp planla", en: "Plan your camp" },
      { key: "home.hero.btn2", label: "İkinci düğme", tr: "Tesisler", en: "Facilities" },
    ],
  },
  {
    id: "intro",
    title: "Hakkımızda bölümü",
    description: "Ana sayfada ve Hakkımızda sayfasında görünen tanıtım bölümü.",
    path: "/hakkimizda",
    fields: [
      { key: "intro.eyebrow", label: "Küçük başlık", tr: "Hakkımızda", en: "About us" },
      { key: "intro.title", label: "Başlık", tr: "Tek merkez, çok branş", en: "One centre, many sports" },
      {
        key: "intro.text",
        label: "Açıklama",
        tr: "Palandöken eteklerinde kurulu merkezimiz; kulüplere ve milli takımlara futbol, yüzme, kış sporları ve dövüş sporlarında kamp imkânı sunar.",
        en: "Set on the slopes of Palandöken, our centre offers clubs and national teams camp facilities for football, swimming, winter sports and combat sports.",
        multiline: true,
      },
      { key: "intro.button", label: "Düğme", tr: "Tesisleri gör", en: "View facilities" },
      { key: "intro.badge.value", label: "Fotoğraf üstü rozet (büyük)", tr: "2.100 m", en: "2,100 m" },
      { key: "intro.badge.label", label: "Fotoğraf üstü rozet (alt yazı)", tr: "Yüksek irtifa", en: "High altitude" },
    ],
  },
  {
    id: "facilities",
    title: "Tesisler bölümü",
    description: "Ana sayfa ve Tesisler sayfasındaki tesis listesinin başlığı. Tesislerin kendisi “Tesisler” menüsünden yönetilir.",
    path: "/tesisler",
    fields: [
      { key: "facilities.eyebrow", label: "Küçük başlık", tr: "Tesisler", en: "Facilities" },
      { key: "facilities.title", label: "Başlık", tr: "Her branşa bir tesis", en: "A facility for every discipline" },
      { key: "facilities.text", label: "Açıklama", tr: "Palandöken eteklerinde {count} ana tesis.", en: "{count} main facilities at the foot of Palandöken.", hint: "{count} yazan yer tesis sayısıyla otomatik değişir." },
      { key: "facilities.page.subtitle", label: "Tesisler sayfası alt başlığı", tr: "Branşlara göre kamp tesislerimiz.", en: "Our camp facilities by discipline." },
    ],
  },
  {
    id: "gallery",
    title: "Galeri bölümü",
    description: "Fotoğraf galerisinin başlığı.",
    path: "/#galeri",
    fields: [
      { key: "gallery.eyebrow", label: "Küçük başlık", tr: "Galeri", en: "Gallery" },
      { key: "gallery.title", label: "Başlık", tr: "Sahadan kareler", en: "Moments from the pitch" },
    ],
  },
  {
    id: "forum",
    title: "Forum 2027 bölümü",
    description: "Ana sayfadaki forum tanıtım bölümü (forum sayfalarında da kullanılır).",
    path: "/#forum",
    fields: [
      { key: "forum.short", label: "Etiket", dict: "forum.short" },
      { key: "forum.name", label: "Forumun adı", dict: "forum.name" },
      { key: "forum.dates", label: "Tarih", dict: "forum.dates" },
      { key: "forum.about.text", label: "Tanıtım metni", dict: "forum.about.text", multiline: true },
      { key: "forum.register", label: "Kayıt düğmesi", dict: "forum.register" },
      { key: "forum.programme", label: "Program düğmesi", dict: "forum.programme" },
    ],
  },
  {
    id: "news",
    title: "Haberler bölümü",
    description: "Ana sayfadaki ve Haberler sayfasındaki haber listesinin başlığı. Haberlerin kendisi “Haberler” menüsünden yönetilir.",
    path: "/haberler",
    fields: [
      { key: "news.eyebrow", label: "Küçük başlık", tr: "Haberler", en: "News" },
      { key: "news.title", label: "Başlık", tr: "Güncel gelişmeler", en: "Latest developments" },
      {
        key: "news.text",
        label: "Açıklama",
        tr: "Kamp merkezinden, Erzurum'un kış ve yaz sporlarından haberler ve rehberler.",
        en: "News and guides from the camp centre and from winter and summer sports in Erzurum.",
        multiline: true,
      },
      { key: "news.all", label: "“Tümü” düğmesi", tr: "Tümü", en: "View all" },
      { key: "news.page.subtitle", label: "Haberler sayfası alt başlığı", tr: "Merkezimizden güncel gelişmeler.", en: "Latest developments from our centre." },
    ],
  },
  {
    id: "about-page",
    title: "Hakkımızda sayfası",
    description: "Hakkımızda sayfasının üst başlığı.",
    path: "/hakkimizda",
    fields: [{ key: "about.page.subtitle", label: "Alt başlık", tr: "Merkezimiz hakkında kısaca.", en: "A brief introduction to our centre." }],
  },
  {
    id: "stay",
    title: "Sayfa sonu çağrı alanı (Kampınızı planlayalım)",
    description: "Ana sayfa, Hakkımızda ve Tesisler sayfalarının altındaki koyu çağrı kutusu.",
    path: "/hakkimizda",
    fields: [
      { key: "stay.title1", label: "Başlık (ilk bölüm)", tr: "Kampınızı", en: "Let us" },
      { key: "stay.title2", label: "Başlık (vurgulu bölüm)", tr: "planlayalım", en: "plan" },
      { key: "stay.title3", label: "Başlık (son bölüm)", tr: "", en: "your camp", hint: "Türkçede genellikle boş kalır; İngilizce cümleyi tamamlamak içindir." },
      { key: "stay.text", label: "Açıklama", tr: "Tarih, branş ve kafile bilgisini iletin; ekibimiz size dönsün.", en: "Send us your dates, sport and group details, and our team will get back to you.", multiline: true },
      { key: "stay.button", label: "Düğme", tr: "Talep oluştur", en: "Submit a request" },
    ],
  },
  {
    id: "reservation-page",
    title: "Rezervasyon sayfası · Başlık ve bölümler",
    description: "Rezervasyon sayfasındaki bölüm başlıkları ve açıklamaları. Otel, mekân ve ekipman adları kodda tanımlıdır.",
    path: "/rezervasyon",
    fields: [
      { key: "rez.subtitle", label: "Sayfa alt başlığı", tr: "Konaklama, ekipman kiralama, branş kampı ve masa rezervasyonu için talebinizi iletin.", en: "Send your request for accommodation, equipment rental, sport camps and table bookings.", multiline: true },
      { key: "rez.hotels.title", label: "Oteller · başlık", tr: "Anlaşmalı oteller", en: "Partner hotels" },
      {
        key: "rez.hotels.text",
        label: "Oteller · açıklama",
        tr: "Palandöken'de bulunan anlaşmalı otellerimizde kafile büyüklüğüne ve branşa uygun konaklama için talep oluşturun. Fiyat ve doluluk bilgisi talebiniz üzerine ekibimiz tarafından size iletilir.",
        en: "Request accommodation suited to your group size and sport at our partner hotels in Palandöken. Our team will send you prices and availability on request.",
        multiline: true,
      },
      { key: "rez.equip.title", label: "Ekipman · başlık", tr: "Ekipman kiralama", en: "Equipment rental" },
      { key: "rez.equip.text", label: "Ekipman · açıklama", tr: "İhtiyaç duyduğunuz ekipmanı ve adedini iletin; fiyat, uygunluk ve koşullar hakkında size dönüş yapılır.", en: "Tell us which equipment you need and how many; we will get back to you on prices, availability and terms.", multiline: true },
      { key: "rez.branch.title", label: "Branş kampı · başlık", tr: "Hangi branş için kamp planlıyorsunuz?", en: "Which sport are you planning a camp for?" },
      { key: "rez.branch.text", label: "Branş kampı · açıklama", tr: "Branşınızı seçin; saha, salon ve fizyoterapi ihtiyaçlarınızı birlikte planlayalım.", en: "Choose your sport and we will plan the pitches, halls and physiotherapy you need together.", multiline: true },
      { key: "rez.tables.title", label: "Masa · başlık", tr: "Masa rezervasyonu", en: "Table bookings" },
      { key: "rez.tables.text", label: "Masa · açıklama", tr: "Kafileniz için yemek ve dinlenme alanlarında yer ayırtın.", en: "Reserve a place for your group in our dining and rest areas." },
    ],
  },
  {
    id: "reservation-test",
    title: "Rezervasyon sayfası · Performans testi",
    description: "Performans testi kutusu.",
    path: "/rezervasyon#test",
    fields: [
      { key: "rez.test.badge", label: "Etiket", tr: "Performans", en: "Performance" },
      { key: "rez.test.title", label: "Başlık", tr: "Yüksek İrtifa Performans Testleri", en: "High Altitude Performance Tests" },
      { key: "rez.test.text", label: "Açıklama", tr: "VO2 Max, laktat eşiği ve irtifaya uyum (aklimatizasyon) takibi için randevu talebi iletin; kapsam ve uygunluk hakkında size bilgi verilir.", en: "Request an appointment for VO2 max, lactate threshold and altitude acclimatisation monitoring; we will inform you about scope and availability.", multiline: true },
      { key: "rez.test.button", label: "Düğme", tr: "Test randevusu talep et", en: "Request a test appointment" },
    ],
  },
  {
    id: "request-form",
    title: "Talep formu (sayfa altı)",
    description: "Rezervasyon sayfasındaki kamp talep formunun sol paneli.",
    path: "/rezervasyon#rezervasyon",
    fields: [
      { key: "cta.badge", label: "Etiket", tr: "Kamp talebi", en: "Camp request" },
      { key: "cta.title", label: "Başlık", tr: "Kampınızı birlikte planlayalım", en: "Let us plan your camp together" },
      { key: "cta.text", label: "Açıklama", tr: "Formu doldurun, ekibimiz sizi arasın.", en: "Fill in the form and our team will call you." },
      { key: "cta.success", label: "Gönderim sonrası mesaj", tr: "Talebiniz alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.", en: "Your request has been received. Our team will contact you shortly.", multiline: true },
    ],
  },
  {
    id: "map",
    title: "Konum (harita) bölümü",
    description: "Rezervasyon sayfasının altındaki harita bölümü.",
    path: "/rezervasyon#konum",
    fields: [
      { key: "map.eyebrow", label: "Küçük başlık", dict: "map.eyebrow" },
      { key: "map.title", label: "Başlık", dict: "map.title" },
      { key: "map.text", label: "Açıklama", dict: "map.text", multiline: true },
      { key: "map.directions", label: "Düğme", dict: "map.directions" },
    ],
  },
  {
    id: "feedback",
    title: "Dilek ve şikayet formu",
    description: "Alt bilgi alanının üstündeki geri bildirim bölümü.",
    path: "/#geri-bildirim",
    fields: [
      { key: "feedback.eyebrow", label: "Küçük başlık", tr: "Geri bildirim", en: "Feedback" },
      { key: "feedback.title", label: "Başlık", tr: "Görüşünüz bizim için değerli", en: "Your opinion matters to us" },
      { key: "feedback.text", label: "Açıklama", tr: "Kamp deneyiminiz, önerileriniz veya sorunlarınız hakkında bize yazın. Mesajlarınızı yönetim ekibimiz okur.", en: "Write to us about your camp experience, suggestions or any problems. Our management team reads every message.", multiline: true },
      { key: "feedback.success", label: "Gönderim sonrası mesaj", tr: "Teşekkürler! Geri bildiriminiz bize ulaştı.", en: "Thank you! Your feedback has reached us." },
    ],
  },
  {
    id: "footer",
    title: "Alt bilgi (footer)",
    description: "Sitenin en altındaki alan.",
    path: "/#footer",
    fields: [
      { key: "footer.desc", label: "Kuruluş tanımı", tr: "Palandöken'de 2.100 metrede çok branşlı kamp merkezi.", en: "A multi-sport camp centre at 2,100 metres in Palandöken.", multiline: true },
      { key: "footer.cta", label: "Düğme", tr: "Kamp talebi oluştur", en: "Request a camp" },
      { key: "footer.help", label: "Yardım sütunu başlığı", tr: "Yardıma mı ihtiyacınız var?", en: "Need assistance?" },
    ],
  },
];

export const CONTENT_FIELDS: Record<string, ContentField> = Object.fromEntries(
  CONTENT_GROUPS.flatMap((g) => g.fields).map((f) => [f.key, f]),
);

export type ContentKey = string;
