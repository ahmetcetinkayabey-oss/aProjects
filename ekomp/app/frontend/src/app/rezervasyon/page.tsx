import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { OptImg } from "@/components/opt-img";
import { PageTitle } from "@/components/page-title";
import { ReservationCta } from "@/components/reservation-cta";
import { L } from "@/components/t";

export const metadata: Metadata = {
  title: "Rezervasyon | Erzurum Yüksek İrtifa Kamp Merkezi",
  description: "Anlaşmalı otel, ekipman kiralama, branş bazlı kamp ve masa rezervasyonu için talep oluşturun.",
  alternates: { canonical: "/rezervasyon" },
};

/** Otel fotoğrafı: public/images/oteller/<slug>.jpg varsa o, yoksa Palandöken otelleri panoraması (temsili). */
const FALLBACK_HOTEL_IMAGE = "/images/kayak-merkezi.jpg";
function hotelImage(slug: string): { src: string; own: boolean } {
  const file = path.join(process.cwd(), "public", "images", "oteller", `${slug}.jpg`);
  return fs.existsSync(file)
    ? { src: `/images/oteller/${slug}.jpg`, own: true }
    : { src: FALLBACK_HOTEL_IMAGE, own: false };
}

const HOTELS = [
  {
    slug: "palan-hotel",
    name: "Palan Hotel Palandöken",
    tag: { tr: "Pist çevresi", en: "Near the slopes" },
    tr: "Palandöken Kayak Merkezi çevresinde yer alan, fitness ve antrenman olanakları sunan anlaşmalı otel.",
    en: "A partner hotel in the Palandöken Ski Resort area offering fitness and training facilities.",
  },
  {
    slug: "sway-hotels",
    name: "Sway Hotels Palandöken",
    tag: { tr: "Spa ve rejenerasyon", en: "Spa and recovery" },
    tr: "Spa ve rejenerasyon olanaklarıyla antrenman sonrası toparlanmaya uygun anlaşmalı otel.",
    en: "A partner hotel with spa and recovery facilities, suited to post-training recovery.",
  },
  {
    slug: "polat-erzurum-resort",
    name: "Polat Erzurum Resort Hotel",
    tag: { tr: "Takım kampları", en: "Team camps" },
    tr: "Toplantı salonları ve grup konaklama imkânlarıyla takım kamplarına uygun anlaşmalı otel.",
    en: "A partner hotel with meeting rooms and group accommodation, suited to team camps.",
  },
  {
    slug: "snowdora-hotel",
    name: "Snowdora Hotel Palandöken",
    tag: { tr: "Bireysel sporcular ve küçük gruplar", en: "Individual athletes and small groups" },
    tr: "Pist alanlarına yakın konumuyla bireysel sporcular ve küçük gruplar için uygun anlaşmalı otel.",
    en: "A partner hotel close to the slopes, suited to individual athletes and small groups.",
  },
];

const EQUIPMENT = [
  { icon: "downhill_skiing", tr: "Kayak takımı", en: "Ski set" },
  { icon: "snowboarding", tr: "Snowboard takımı", en: "Snowboard set" },
  { icon: "sports_motorsports", tr: "Kask ve koruyucu ekipman", en: "Helmet and protective gear" },
  { icon: "fitness_center", tr: "Antrenman ekipmanı", en: "Training equipment" },
];

const BRANCHES = [
  { icon: "sports_soccer", value: "Futbol", tr: "Futbol", en: "Football" },
  { icon: "directions_run", value: "Atletizm", tr: "Atletizm", en: "Athletics" },
  { icon: "pool", value: "Yüzme", tr: "Yüzme", en: "Swimming" },
  { icon: "sports_martial_arts", value: "Dövüş Sporları", tr: "Dövüş sporları", en: "Combat sports" },
  { icon: "downhill_skiing", value: "Kış Sporları & Curling", tr: "Kış sporları ve curling", en: "Winter sports and curling" },
  { icon: "sports_volleyball", value: "Salon Sporları", tr: "Salon sporları", en: "Indoor sports" },
];

const DINING = [
  {
    icon: "restaurant",
    tr: "Küre Kafe ve Restoran",
    en: "Küre Café and Restaurant",
    trText: "Palandöken'in yüksek kesimlerinde, manzaralı alanda kafile masası ayırtma ve sporcu beslenmesine uygun menü seçenekleri.",
    enText: "Group table bookings with a view in the upper part of Palandöken, with menu options suited to athlete nutrition.",
  },
  {
    icon: "local_cafe",
    tr: "Seki Kafe ve Sporcu Dinlenme Alanı",
    en: "Seki Café and Athlete Lounge",
    trText: "Antrenman sonrası dinlenme, hafif yiyecek ve takım toplantıları için uygun oturma alanları.",
    enText: "Seating areas for post-training rest, light meals and team meetings.",
  },
];

const ANCHORS = [
  { id: "oteller", icon: "hotel", tr: "Oteller", en: "Hotels" },
  { id: "ekipman", icon: "downhill_skiing", tr: "Ekipman kiralama", en: "Equipment rental" },
  { id: "brans", icon: "sports", tr: "Branş kampı", en: "Sport camp" },
  { id: "masa", icon: "restaurant", tr: "Masa", en: "Tables" },
];

const q = (params: Record<string, string>) => `/rezervasyon?${new URLSearchParams(params).toString()}#rezervasyon`;

function SectionTitle({ title, text }: { title: ReactNode; text: ReactNode }) {
  return (
    <>
      <h2 className="reveal font-headline-lg text-[28px] font-extrabold tracking-tight text-on-surface md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-on-surface-variant">{text}</p>
    </>
  );
}

export default function ReservationPage() {
  return (
    <main className="w-full bg-surface">
      <PageTitle
        title={<L tr="Rezervasyon" en="Reservation" />}
        subtitle={
          <L
            tr="Konaklama, ekipman kiralama, branş kampı ve masa rezervasyonu için talebinizi iletin."
            en="Send your request for accommodation, equipment rental, sport camps and table bookings."
          />
        }
      />

      <nav aria-label="Rezervasyon bölümleri" className="px-margin-mobile pt-8 md:px-margin">
        <ul className="mx-auto flex max-w-[1400px] flex-wrap gap-3">
          {ANCHORS.map((a) => (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-surface-container-high bg-white px-5 py-2.5 text-sm font-bold text-on-surface transition-colors hover:border-primary hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">{a.icon}</span>
                <L tr={a.tr} en={a.en} />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="oteller" className="scroll-mt-6 px-margin-mobile py-12 md:px-margin md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <SectionTitle
            title={<L tr="Anlaşmalı oteller" en="Partner hotels" />}
            text={
              <L
                tr="Palandöken'de bulunan anlaşmalı otellerimizde kafile büyüklüğüne ve branşa uygun konaklama için talep oluşturun."
                en="Request accommodation suited to your group size and sport at our partner hotels in Palandöken."
              />
            }
          />
          <div className="stagger mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {HOTELS.map((h) => {
              const img = hotelImage(h.slug);
              return (
                <article
                  key={h.slug}
                  className="reveal flex flex-col overflow-hidden rounded-3xl border border-surface-container-high bg-white shadow-sm"
                >
                  <div className="relative h-48 overflow-hidden bg-surface-container">
                    <OptImg
                      sizes="(min-width:1280px) 25vw, (min-width:768px) 50vw, 100vw"
                      src={img.src}
                      alt={h.name}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-primary-container px-3 py-1 font-label-caps text-label-caps text-on-primary-container uppercase">
                      <L tr="Anlaşmalı" en="Partner" />
                    </span>
                    {img.own ? null : (
                      <span className="absolute right-3 bottom-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white">
                        <L tr="Temsili görsel" en="Representative image" />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-label-caps text-label-caps text-primary uppercase">
                      <L tr={h.tag.tr} en={h.tag.en} />
                    </span>
                    <h3 className="mt-1 font-headline-md text-lg font-bold text-on-surface">{h.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-on-surface-variant">
                      <L tr={h.tr} en={h.en} />
                    </p>
                    <Link
                      href={q({ brans: "Konaklama", konu: h.name })}
                      className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                    >
                      <L tr="Konaklama talebi" en="Accommodation request" />
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="ekipman" className="scroll-mt-6 bg-surface-container-low px-margin-mobile py-12 md:px-margin md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <SectionTitle
            title={<L tr="Ekipman kiralama" en="Equipment rental" />}
            text={
              <L
                tr="İhtiyaç duyduğunuz ekipmanı ve adedini iletin; uygunluk ve koşullar hakkında size dönüş yapılır."
                en="Tell us which equipment you need and how many; we will get back to you on availability and terms."
              />
            }
          />
          <ul className="stagger mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {EQUIPMENT.map((e) => (
              <li key={e.icon + e.tr}>
                <Link
                  href={q({ brans: "Ekipman kiralama", konu: e.tr })}
                  className="reveal flex h-full flex-col items-center gap-3 rounded-2xl border border-surface-container-high bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="material-symbols-outlined text-[36px] text-primary">{e.icon}</span>
                  <span className="text-sm font-bold text-on-surface">
                    <L tr={e.tr} en={e.en} />
                  </span>
                  <span className="text-xs font-bold text-primary">
                    <L tr="Kiralama talebi" en="Rental request" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="brans" className="scroll-mt-6 px-margin-mobile py-12 md:px-margin md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <SectionTitle
            title={<L tr="Hangi branş için kamp planlıyorsunuz?" en="Which sport are you planning a camp for?" />}
            text={
              <L
                tr="Branşınızı seçin; saha, salon ve fizyoterapi ihtiyaçlarınızı birlikte planlayalım."
                en="Choose your sport and we will plan the pitches, halls and physiotherapy you need together."
              />
            }
          />
          <ul className="stagger mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {BRANCHES.map((b) => (
              <li key={b.value}>
                <Link
                  href={q({ brans: b.value })}
                  className="reveal flex h-full flex-col items-center gap-2 rounded-2xl border border-surface-container-high bg-white p-5 text-center transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="material-symbols-outlined text-[32px] text-primary">{b.icon}</span>
                  <span className="text-sm font-bold text-on-surface">
                    <L tr={b.tr} en={b.en} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="masa" className="scroll-mt-6 bg-surface-container-low px-margin-mobile py-12 md:px-margin md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <SectionTitle
            title={<L tr="Masa rezervasyonu" en="Table bookings" />}
            text={<L tr="Kafileniz için yemek ve dinlenme alanlarında yer ayırtın." en="Reserve a place for your group in our dining and rest areas." />}
          />
          <div className="stagger mt-8 grid gap-6 md:grid-cols-2">
            {DINING.map((d) => (
              <article key={d.tr} className="reveal rounded-3xl border border-surface-container-high bg-white p-6 shadow-sm md:p-8">
                <span className="material-symbols-outlined text-[32px] text-primary">{d.icon}</span>
                <h3 className="mt-3 font-headline-md text-xl font-bold text-on-surface">
                  <L tr={d.tr} en={d.en} />
                </h3>
                <p className="mt-2 text-on-surface-variant">
                  <L tr={d.trText} en={d.enText} />
                </p>
                <Link
                  href={q({ brans: "Konaklama", konu: `Masa rezervasyonu – ${d.tr}` })}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                >
                  <L tr="Masa talebi" en="Table request" />
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ReservationCta />
    </main>
  );
}
