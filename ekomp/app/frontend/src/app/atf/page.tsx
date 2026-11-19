import type { Metadata } from "next";
import Link from "@/components/locale-link";
import { OptImg } from "@/components/opt-img";
import { PageTitle } from "@/components/page-title";
import { L } from "@/components/t";
import { pageMeta } from "@/lib/page-meta";

export const generateMetadata = (): Promise<Metadata> =>
  pageMeta(
    {
      title: "Antalya Turizm Fuarı (ATF) ve Spor Turizmi",
      description:
        "Antalya Turizm Fuarı (ATF) hakkında doğrulanmış bilgiler ve Palandöken'in kış ve yüksek irtifa spor turizmi sunumu.",
    },
    {
      title: "Antalya Tourism Fair (ATF) and Sports Tourism",
      description:
        "Verified facts about the Antalya Tourism Fair (ATF) and what Palandöken offers for winter and high-altitude sports tourism.",
    },
  );

const FACTS = [
  { icon: "event", tr: "2019", en: "2019", labelTr: "İlk düzenlenme yılı", labelEn: "First edition" },
  { icon: "groups", tr: "42.758", en: "42,758", labelTr: "ATF25 profesyonel ziyaretçi", labelEn: "ATF25 professional visitors" },
  { icon: "storefront", tr: "1.018", en: "1,018", labelTr: "ATF25 toplam katılımcı", labelEn: "ATF25 total participants" },
  { icon: "public", tr: "109", en: "109", labelTr: "Ülkeden erişim", labelEn: "Countries reached" },
] as const;

const ADVANTAGES = [
  {
    icon: "ac_unit",
    img: "/images/kayak-gondol-manzara.jpg",
    trTitle: "Palandöken kış sporları",
    enTitle: "Palandöken winter sports",
    tr: "Erzurum'un kayak merkezi, kayak ve snowboard için uzun sezon ve geniş pist çeşitliliği sunar. Kayak merkezi bilgileri Tesisler sayfasındaki güncel metinlerle aynıdır.",
    en: "Erzurum's ski centre offers a long season and a wide range of runs for skiing and snowboarding. Details match the current text on the Facilities page.",
  },
  {
    icon: "hotel",
    img: "/images/oteller/snowdora-hotel/kapsul-evler.jpg",
    trTitle: "Snowdora ve anlaşmalı oteller",
    enTitle: "Snowdora and partner hotels",
    tr: "Kamp ekipleri için konaklama, Palan, Sway, Polat Palandöken ve Snowdora otelleriyle talep üzerinden planlanır. Fiyat ve doluluk bilgisi için talep formu kullanılır.",
    en: "Accommodation for camp teams is arranged on request with Palan, Sway, Polat Palandöken and Snowdora hotels. Use the request form for prices and availability.",
  },
  {
    icon: "stadium",
    img: "/images/yuzme-havuzu.jpg",
    trTitle: "Çok branşlı tesisler",
    enTitle: "Multi-sport facilities",
    tr: "Atletizm, yüzme, futbol, buz sporları, salon sporları ve dövüş sporları tesisleri bir arada anılır. Tesis sayfalarında branş bazında ayrıntı bulunur.",
    en: "Athletics, swimming, football, ice sports, indoor sports and combat sports facilities sit in one destination. See the facility pages for each discipline.",
  },
] as const;

/** Yalnızca kaynaklarda doğrulanan edisyon bilgileri. 2027 tarihi açıklanınca buraya eklenir. */
const EDITIONS = [
  {
    trWhen: "2019",
    enWhen: "2019",
    trTitle: "İlk ATF",
    enTitle: "First ATF",
    tr: "GMT Fuarcılık fuarı Antalya'da başlattı.",
    en: "GMT Fairs launched the fair in Antalya.",
  },
  {
    trWhen: "Ekim 2024",
    enWhen: "October 2024",
    trTitle: "ATF24",
    enTitle: "ATF24",
    tr: "Basın, fuarın rekor ziyaretçiyle tamamlandığını bildirdi. Spor ve sağlık turizmi katılımcıları için ayrı bilgilendirme yapıldı.",
    en: "The press reported record attendance. Sports and health tourism exhibitors received separate guidance.",
  },
  {
    trWhen: "22–24 Ekim 2025",
    enWhen: "22–24 October 2025",
    trTitle: "ATF25",
    enTitle: "ATF25",
    tr: "42.758 profesyonel ziyaretçi, 1.018 katılımcı, 109 ülke. UFI üyeliği ve bakanlık desteği öne çıktı.",
    en: "42,758 professional visitors, 1,018 participants, 109 countries. UFI membership and ministerial support stood out.",
  },
  {
    trWhen: "26–28 Ekim 2026",
    enWhen: "26–28 October 2026",
    trTitle: "ATF26 (8. edisyon)",
    enTitle: "ATF26 (8th edition)",
    tr: "ANFAŞ'ta düzenlendi. Kesinleşmiş sonuç raporu henüz bulunamadı.",
    en: "Held at ANFAŞ. A final results report has not been found yet.",
  },
] as const;

export default function AtfPage() {
  return (
    <main className="w-full bg-surface">
      <PageTitle
        title={<L tr="Antalya Turizm Fuarı (ATF)" en="Antalya Tourism Fair (ATF)" />}
        subtitle={
          <L
            tr="Türkiye'nin turizm profesyonellerini bir araya getiren fuarda spor turizminin yeri ve Palandöken'in sunabilecekleri."
            en="The place of sports tourism at the fair that brings Türkiye's tourism professionals together, and what Palandöken can offer."
          />
        }
      />

      <section className="px-margin-mobile py-10 md:px-margin md:py-14">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <h2 className="font-headline-lg text-3xl font-extrabold tracking-tight">
              <L tr="ATF nedir?" en="What is ATF?" />
            </h2>
            <div className="mt-5 space-y-4 font-body-lg text-lg text-on-surface-variant">
              <p>
                <L
                  tr="Antalya Turizm Fuarı (ATF), 2019'dan beri GMT Fuarcılık tarafından Antalya'da, ANFAŞ Fuar Merkezi'nde düzenlenen bir turizm iş fuarıdır. Seyahat acentelerini, otelleri, destinasyon yönetimlerini ve tur operatörlerini aynı çatı altında buluşturur."
                  en="The Antalya Tourism Fair (ATF) is a tourism trade fair held since 2019 by GMT Fairs at the ANFAŞ Fair Centre in Antalya. It brings travel agencies, hotels, destination bodies and tour operators together under one roof."
                />
              </p>
              <p>
                <L
                  tr="Fuarın spor ve sağlık turizmine ayrılmış bir bölümü ve ayrı bir sahnesi bulunur. Ticaret Bakanlığı, ATF25'te sağlık ve spor turizmi firmaları için stant katılımına %60 destek verilen etkinlikler listesine fuarı almıştır."
                  en="The fair has a section and a stage dedicated to sports and health tourism. For ATF25 the Ministry of Trade listed it among supported events, with 60% booth support for health and sports tourism companies."
                />
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink">
            <OptImg
              src="/images/hero-palandoken.jpg"
              alt="Palandöken kayak merkezi"
              altEn="Palandöken ski centre"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-ink px-margin-mobile py-12 text-white md:px-margin md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-headline-lg text-3xl font-extrabold tracking-tight">
            <L tr="Rakamlarla ATF" en="ATF in numbers" />
          </h2>
          <dl className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.labelTr} className="rounded-2xl bg-white/5 p-6">
                <span className="material-symbols-outlined text-primary-container" aria-hidden>
                  {f.icon}
                </span>
                <dd className="mt-3 text-4xl font-extrabold">
                  <L tr={f.tr} en={f.en} />
                </dd>
                <dt className="mt-1 text-sm text-white/75">
                  <L tr={f.labelTr} en={f.labelEn} />
                </dt>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-white/65">
            <L
              tr="Rakamlar organizatörün ve basının açıkladığı ATF25 verileridir. 2026 edisyonu 26–28 Ekim 2026'da yapıldı; kesinleşmiş sonuç raporu bu sayfa hazırlanırken bulunamadı, bu yüzden yazılmadı."
              en="Figures are the ATF25 data published by the organiser and the press. The 2026 edition ran on 26–28 October 2026; no final results report was found when this page was prepared, so none is quoted."
            />
          </p>
        </div>
      </section>

      <section className="px-margin-mobile py-12 md:px-margin md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-headline-lg text-3xl font-extrabold tracking-tight">
            <L tr="Spor turizminde Palandöken" en="Palandöken in sports tourism" />
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {ADVANTAGES.map((a) => (
              <article key={a.trTitle} className="overflow-hidden rounded-3xl bg-surface-container">
                <div className="aspect-[16/10] overflow-hidden bg-ink">
                  <OptImg src={a.img} alt={a.trTitle} altEn={a.enTitle} sizes="(min-width: 768px) 33vw, 100vw" className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <span className="material-symbols-outlined text-primary" aria-hidden>
                    {a.icon}
                  </span>
                  <h3 className="mt-2 text-xl font-extrabold">
                    <L tr={a.trTitle} en={a.enTitle} />
                  </h3>
                  <p className="mt-3 text-on-surface-variant">
                    <L tr={a.tr} en={a.en} />
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-margin-mobile pb-12 md:px-margin md:pb-16">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-headline-lg text-3xl font-extrabold tracking-tight">
            <L tr="ATF geçmişi" en="ATF timeline" />
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {EDITIONS.map((e) => (
              <li key={e.trWhen} className="rounded-2xl bg-surface-container p-6">
                <p className="font-label-caps text-label-caps text-primary uppercase">
                  <L tr={e.trWhen} en={e.enWhen} />
                </p>
                <h3 className="mt-2 text-lg font-extrabold">
                  <L tr={e.trTitle} en={e.enTitle} />
                </h3>
                <p className="mt-2 text-sm text-on-surface-variant">
                  <L tr={e.tr} en={e.en} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="kayit" className="scroll-mt-6 px-margin-mobile pb-12 md:px-margin md:pb-16">
        <div className="mx-auto grid max-w-[1400px] gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-ink p-8 text-white md:p-10">
            <span className="material-symbols-outlined text-primary-container" aria-hidden>
              edit_calendar
            </span>
            <h2 className="mt-3 text-2xl font-extrabold">
              <L tr="Ön görüşme ve kayıt" en="Pre-meeting and registration" />
            </h2>
            <p className="mt-3 text-white/80">
              <L
                tr="Fuar kapsamında kamp, konaklama ve tesis kullanımı hakkında görüşmek isteyen kurumlar için talep formunu kullanın. Talebiniz yönetim paneline düşer ve ekibimiz e-postayla dönüş yapar."
                en="If you want to discuss camps, accommodation and facility use in the context of the fair, use the request form. Your request goes to our admin panel and our team replies by email."
              />
            </p>
            <Link
              href={`/rezervasyon?${new URLSearchParams({ konu: "ATF – ön görüşme / kamp talebi" }).toString()}#rezervasyon`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-container px-8 py-4 font-label-caps text-label-caps text-on-primary-container uppercase"
            >
              <L tr="Talep formuna git" en="Go to the request form" />
              <span className="material-symbols-outlined text-[18px]" aria-hidden>
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="rounded-3xl bg-surface-container p-8 md:p-10">
            <span className="material-symbols-outlined text-primary" aria-hidden>
              how_to_reg
            </span>
            <h2 className="mt-3 text-2xl font-extrabold">
              <L tr="Forum 2027 kaydı ve görüşleriniz" en="Forum 2027 registration and your feedback" />
            </h2>
            <p className="mt-3 text-on-surface-variant">
              <L
                tr="Palandöken Uluslararası Yüksek İrtifa ve Kış Turizmi Forumu 16–17 Nisan 2027'de yapılır. Foruma kayıt olabilir, sayfa altındaki formla ATF ve fuarlarla ilgili görüş ve önerilerinizi iletebilirsiniz."
                en="The Palandöken International High Altitude & Winter Tourism Forum takes place on 16–17 April 2027. You can register for the forum and send your views and suggestions about ATF and trade fairs using the form at the bottom of the page."
              />
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/forum/kayit"
                className="inline-flex items-center rounded-full bg-ink px-8 py-4 font-label-caps text-label-caps text-white uppercase"
              >
                <L tr="Foruma kayıt ol" en="Register for the forum" />
              </Link>
              <a
                href="#geri-bildirim"
                className="inline-flex items-center rounded-full border border-ink px-8 py-4 font-label-caps text-label-caps uppercase"
              >
                <L tr="Görüş bildir" en="Send feedback" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-margin-mobile pb-12 md:px-margin md:pb-20">
        <div className="mx-auto max-w-[1400px] rounded-3xl bg-surface-container p-8 md:p-12">
          <h2 className="font-headline-lg text-3xl font-extrabold tracking-tight">
            <L tr="Bir sonraki ATF" en="The next ATF" />
          </h2>
          <p className="mt-4 max-w-3xl font-body-lg text-lg text-on-surface-variant">
            <L
              tr="2027 edisyonunun tarihi resmî olarak açıklandığında burada duyurulur. Güncel tarih, stant ve katılım koşulları için fuarın resmî sitesine bakın."
              en="The date of the 2027 edition will be announced here once it is officially published. For current dates, booths and participation terms, see the fair's official website."
            />
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://antalyaturizmfuari.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 font-label-caps text-label-caps text-white uppercase"
            >
              <L tr="ATF resmî sitesi" en="Official ATF website" />
              <span className="material-symbols-outlined text-[18px]" aria-hidden>
                arrow_forward
              </span>
            </a>
            <Link
              href="/rezervasyon"
              className="inline-flex items-center rounded-full border border-ink px-8 py-4 font-label-caps text-label-caps uppercase"
            >
              <L tr="Kamp talebi oluştur" en="Request a camp" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
