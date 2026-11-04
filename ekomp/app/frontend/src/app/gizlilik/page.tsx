import type { Metadata } from "next";
import { L } from "@/components/t";
import { PageTitle } from "@/components/page-title";

export const metadata: Metadata = {
  title: "Gizlilik ve Kişisel Verilerin Korunması | Erzurum Yüksek İrtifa Kamp Merkezi",
  alternates: { canonical: "/gizlilik" },
};

type Bi = { tr: string; en: string };
interface Section {
  title: Bi;
  paragraphs?: Bi[];
  items?: Bi[];
}

/**
 * KVKK (6698 sayılı Kanun) kapsamında aydınlatma metni. Sitenin gerçekten topladığı veriler ve kullandığı
 * üçüncü taraf hizmetleri anlatılır. Yayından önce kurumun hukuk danışmanı tarafından gözden geçirilmeli ve
 * resmî unvan/adres/KEP bilgileriyle tamamlanmalıdır.
 */
const SECTIONS: Section[] = [
  {
    title: { tr: "1. Veri sorumlusu", en: "1. Data controller" },
    paragraphs: [
      {
        tr: "6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında veri sorumlusu, bu internet sitesini işleten Erzurum Yüksek İrtifa Kamp Merkezi’dir. Bu metin, sitedeki formlar aracılığıyla toplanan kişisel verilerin nasıl işlendiğini açıklar.",
        en: "Under Law No. 6698 on the Protection of Personal Data (“KVKK”), the data controller is Erzurum High Altitude Camp Centre, which operates this website. This notice explains how personal data collected through the forms on this site is processed.",
      },
    ],
  },
  {
    title: { tr: "2. İşlenen kişisel veriler ve amaçları", en: "2. Personal data processed and purposes" },
    items: [
      {
        tr: "Kamp talebi formu: kurum adı, yetkili adı soyadı, e-posta, telefon, spor branşı, kafile kişi sayısı, tercih edilen tarih aralığı ve notunuz. Amaç: talebinizi değerlendirmek, sizinle iletişime geçmek ve kamp planı hazırlamak.",
        en: "Camp request form: organisation name, contact name, email, phone, sport, group size, preferred dates and your note. Purpose: to assess your request, contact you and prepare a camp plan.",
      },
      {
        tr: "Geri bildirim formu: adınız, (isteğe bağlı) e-posta adresiniz, kategori, memnuniyet puanı ve mesajınız. Amaç: öneri ve şikayetlerinizi değerlendirip hizmet kalitesini artırmak.",
        en: "Feedback form: your name, (optional) email address, category, satisfaction rating and message. Purpose: to review your suggestions and complaints and improve our service.",
      },
      {
        tr: "Forum 2027 başvurusu ve hesabı: ad, soyad, e-posta, telefon, ülke, şehir, kurum, unvan, katılımcı kategorisi, (isteğe bağlı) kısa tanıtım, B2B görüşme tercihi, görünürlük tercihi ve şifreniz (yalnızca şifrelenmiş özeti saklanır). Amaç: başvurunuzu değerlendirmek, etkinliği organize etmek ve katılımcılarla iletişim kurmak.",
        en: "Forum 2027 application and account: first and last name, email, phone, country, city, organisation, job title, participant category, (optional) short bio, B2B meeting preference, visibility preference and your password (only an encrypted hash is stored). Purpose: to assess your application, organise the event and communicate with participants.",
      },
    ],
  },
  {
    title: { tr: "3. Hukuki sebep", en: "3. Legal basis" },
    paragraphs: [
      {
        tr: "Veriler, KVKK m. 5/2 kapsamında bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, veri sorumlusunun meşru menfaati ve forum başvurusunda ayrıca verdiğiniz açık rıza dayanaklarına göre işlenir. Forum başvurusunda onay kutusunu işaretleyerek bu metni okuduğunuzu ve kabul ettiğinizi beyan edersiniz.",
        en: "Data is processed under KVKK Art. 5/2 on the grounds that it is directly related to the conclusion or performance of a contract, the controller’s legitimate interests and, for the Forum application, the explicit consent you give. By ticking the box in the Forum application you confirm that you have read and accepted this notice.",
      },
    ],
  },
  {
    title: { tr: "4. Verilerin aktarılması", en: "4. Disclosure of data" },
    paragraphs: [
      {
        tr: "Kişisel verileriniz satılmaz ve pazarlama amacıyla üçüncü kişilerle paylaşılmaz. Yalnızca hizmetin sunulması için gerekli olduğu ölçüde, barındırma ve e-posta hizmeti sağlayan hizmet sağlayıcılarla ve yasal yükümlülükler gereği yetkili kamu kurumlarıyla paylaşılabilir. Forum katılımcı dizininde bilgileriniz yalnızca seçtiğiniz görünürlük düzeyinde (yalnızca onaylı katılımcılar, herkese açık veya gizli) gösterilir.",
        en: "Your personal data is not sold or shared with third parties for marketing. It may be shared only as far as necessary to provide the service with hosting and email service providers, and with competent public authorities where legally required. In the Forum participant directory your details are shown only at the visibility level you choose (approved participants only, public or hidden).",
      },
    ],
  },
  {
    title: { tr: "5. Saklama süresi", en: "5. Retention" },
    paragraphs: [
      {
        tr: "Veriler, işlenme amacı için gerekli süre ve ilgili mevzuatta öngörülen süreler boyunca saklanır; süre sonunda silinir veya anonim hale getirilir. Forum hesabınızı ve verilerinizi silmemizi talep edebilirsiniz.",
        en: "Data is kept for as long as needed for the purpose of processing and for the periods required by applicable law, and is then deleted or anonymised. You may ask us to delete your Forum account and data.",
      },
    ],
  },
  {
    title: { tr: "6. Çerezler, tarayıcı depolaması ve üçüncü taraf hizmetler", en: "6. Cookies, browser storage and third-party services" },
    items: [
      {
        tr: "Sitede reklam veya takip amaçlı çerez kullanılmaz. Tarayıcınızda yalnızca dil tercihiniz ve (forum hesabınızla giriş yaptıysanız) oturum bilginiz saklanır.",
        en: "The site does not use advertising or tracking cookies. Your browser only stores your language preference and, if you log in to a Forum account, your session token.",
      },
      {
        tr: "İletişim sayfasındaki harita Google Haritalar’dan, simge yazı tipi ise Google Fonts’tan yüklenir; bu sırada IP adresiniz bu hizmet sağlayıcılara iletilir. Ana sayfadaki hava durumu bilgisi sunucumuz tarafından Open-Meteo’dan alınır; ziyaretçi bilgisi bu hizmete iletilmez.",
        en: "The map on the Contact page is loaded from Google Maps and the icon font from Google Fonts; your IP address is transmitted to these providers when they load. The weather information on the home page is fetched by our server from Open-Meteo; no visitor data is sent to that service.",
      },
      {
        tr: "Güvenlik amacıyla formlara ve yönetici girişine yönelik hatalı veya aşırı denemeler IP adresine göre geçici olarak (bellekte) sınırlandırılır; bu bilgi kalıcı olarak saklanmaz.",
        en: "For security, excessive or failed attempts on forms and the admin login are limited temporarily by IP address (in memory); this information is not stored permanently.",
      },
    ],
  },
  {
    title: { tr: "7. Haklarınız", en: "7. Your rights" },
    paragraphs: [
      {
        tr: "KVKK m. 11 uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, KVKK m. 7 kapsamında silinmesini veya yok edilmesini isteme, bu işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme, işlenen verilerin otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.",
        en: "Under KVKK Art. 11 you have the right to learn whether your personal data is processed; request information if it has been processed; learn the purpose of processing and whether it is used accordingly; know the third parties to whom it is transferred in Türkiye or abroad; request correction of incomplete or inaccurate data; request deletion or destruction under KVKK Art. 7; request that these actions be notified to third parties to whom the data was transferred; object to a result against you arising from automated analysis; and claim compensation if you suffer damage due to unlawful processing.",
      },
      {
        tr: "Başvurularınızı İletişim sayfamızdaki form üzerinden, talebinizin konusunu (“KVKK başvurusu”) belirterek iletebilirsiniz. Başvurular en geç 30 gün içinde yanıtlanır.",
        en: "You can send your requests through the form on our Contact page, stating the subject (“KVKK request”). Requests are answered within 30 days at the latest.",
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="w-full bg-surface">
      <PageTitle
        title={<L tr="Gizlilik ve Kişisel Verilerin Korunması" en="Privacy and Personal Data Protection" />}
        subtitle={<L tr="KVKK Aydınlatma Metni" en="Personal data protection notice (KVKK)" />}
      />
      <article className="w-full bg-surface px-margin-mobile pt-10 pb-20 md:px-margin md:pb-28">
        <div className="mx-auto max-w-3xl space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title.tr}>
              <h2 className="font-headline-md text-2xl font-extrabold tracking-tight text-on-surface">
                <L tr={s.title.tr} en={s.title.en} />
              </h2>
              {s.paragraphs?.map((p) => (
                <p key={p.tr} className="mt-3 font-body-lg text-lg leading-relaxed text-on-surface-variant">
                  <L tr={p.tr} en={p.en} />
                </p>
              ))}
              {s.items ? (
                <ul className="mt-3 list-disc space-y-3 pl-6 font-body-lg text-lg leading-relaxed text-on-surface-variant">
                  {s.items.map((i) => (
                    <li key={i.tr}>
                      <L tr={i.tr} en={i.en} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
