import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OptImg } from "@/components/opt-img";
import { C, L } from "@/components/t";
import { hotelKey } from "@/lib/content-hotels";
import { HOTELS, getHotel, hotelCover, type Hotel } from "@/lib/hotels";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return HOTELS.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hotel = getHotel(slug);
  if (!hotel) return { title: "Otel bulunamadı" };
  return {
    title: `${hotel.name} | Anlaşmalı oteller | Erzurum Yüksek İrtifa Kamp Merkezi`,
    description: hotel.tagline.tr,
    alternates: { canonical: `/rezervasyon/oteller/${hotel.slug}` },
    openGraph: { title: hotel.name, description: hotel.tagline.tr, images: [{ url: hotelCover(hotel.slug) }] },
  };
}

const requestLink = (hotel: Hotel) =>
  `/rezervasyon?${new URLSearchParams({ brans: "Konaklama", konu: `${hotel.name} – fiyat ve doluluk bilgisi` }).toString()}#rezervasyon`;

const mapLink = (hotel: Hotel) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.mapQuery)}`;

const H2 = "reveal font-headline-lg text-[28px] font-extrabold tracking-tight text-on-surface md:text-4xl";

function SectionImages({ images, name }: { images: string[]; name: string }) {
  if (images.length === 0) return null;
  const many = images.length > 2;
  return (
    <div className={`grid gap-3 ${many ? "grid-cols-2" : "grid-cols-1"}`}>
      {images.map((src, i) => (
        <OptImg
          key={src}
          src={src}
          alt={name}
          loading="lazy"
          sizes="(min-width:1024px) 40vw, 100vw"
          className={`w-full rounded-2xl object-cover ${images.length === 1 || (many && i === 0 && images.length % 2 === 1) ? "col-span-full h-64 md:h-80" : "h-44 md:h-52"}`}
        />
      ))}
    </div>
  );
}

export default async function HotelDetailPage({ params }: Props) {
  const { slug } = await params;
  const hotel = getHotel(slug);
  if (!hotel) notFound();

  const others = HOTELS.filter((h) => h.slug !== hotel.slug);
  const anchors = [
    { id: "odalar", tr: "Odalar", en: "Rooms" },
    { id: "olanaklar", tr: "Olanaklar", en: "Facilities" },
    ...hotel.sections.map((s) => ({ id: s.id, tr: s.title.tr, en: s.title.en })),
    { id: "galeri", tr: "Galeri", en: "Gallery" },
    { id: "iletisim", tr: "İletişim", en: "Contact" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    url: hotel.url,
    image: hotelCover(hotel.slug),
    description: hotel.tagline.tr,
    telephone: hotel.phoneDisplay,
    address: { "@type": "PostalAddress", streetAddress: hotel.address.tr, addressLocality: "Palandöken, Erzurum", addressCountry: "TR" },
  };

  return (
    <main className="w-full bg-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="px-margin-mobile pt-8 md:px-margin">
        <div className="mx-auto max-w-[1400px]">
          <Link href="/rezervasyon#oteller" className="inline-flex items-center gap-1 text-sm font-bold text-on-surface-variant transition-colors hover:text-primary">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <L tr="Tüm anlaşmalı oteller" en="All partner hotels" />
          </Link>

          <div className="reveal-zoom relative mt-5 overflow-hidden rounded-3xl bg-ink shadow-2xl">
            <OptImg
              priority
              src={hotelCover(hotel.slug)}
              alt={hotel.name}
              sizes="(min-width:1400px) 1400px, 100vw"
              className="h-[320px] w-full object-cover md:h-[480px]"
              style={hotel.focus ? { objectPosition: hotel.focus } : undefined}
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-container px-3 py-1 font-label-caps text-label-caps text-on-primary-container uppercase">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <L tr="Anlaşmalı otel" en="Partner hotel" />
              </span>
              <h1 className="mt-3 font-display-xl text-3xl leading-tight font-extrabold tracking-tight text-white md:text-5xl">{hotel.name}</h1>
              <p className="mt-2 max-w-3xl text-base text-white/85 md:text-lg">
                <C k={hotelKey.tagline(hotel.slug)} fallback={hotel.tagline} />
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Otel bölümleri" className="sticky top-[108px] z-30 mt-6 px-margin-mobile md:top-[120px] md:px-margin">
        <ul className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto rounded-full border border-surface-container-high bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
          {anchors.map((a) => (
            <li key={a.id} className="shrink-0">
              <a href={`#${a.id}`} className="inline-flex rounded-full px-4 py-2 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container hover:text-primary">
                <L tr={a.tr} en={a.en} />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="px-margin-mobile py-12 md:px-margin md:py-16">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className={H2}>
              <L tr="Otel hakkında" en="About the hotel" />
            </h2>
            <div className="mt-5 space-y-4 text-lg text-on-surface-variant">
              {hotel.about.map((p, i) => (
                <p key={p.tr}>
                  <C k={hotelKey.about(hotel.slug, i)} fallback={p} />
                </p>
              ))}
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {hotel.facts.map((f) => (
                <div key={f.value.tr} className="rounded-2xl border border-surface-container-high bg-surface-container-low p-4">
                  <span className="material-symbols-outlined text-primary">{f.icon}</span>
                  <dt className="mt-2 font-label-caps text-label-caps text-on-surface-variant uppercase">
                    <L tr={f.label.tr} en={f.label.en} />
                  </dt>
                  <dd className="mt-1 font-title-md text-lg font-bold text-on-surface">
                    <L tr={f.value.tr} en={f.value.en} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="h-fit rounded-3xl bg-ink p-6 text-white shadow-xl md:p-8 lg:sticky lg:top-[250px]">
            <h2 className="font-headline-md text-xl font-extrabold">
              <L tr="Rezervasyon ve bilgi" en="Booking and information" />
            </h2>
            <p className="mt-2 text-sm text-white/70">
              <L tr="Güncel fiyat ve doluluk bilgisi için talep oluşturun; ekibimiz size dönüş yapar." en="Send a request for current prices and availability and our team will get back to you." />
            </p>
            <Link
              href={requestLink(hotel)}
              className="mt-5 flex items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-3.5 text-sm font-bold text-on-primary-container transition-colors hover:bg-white"
            >
              <span className="material-symbols-outlined text-[18px]">event_available</span>
              <L tr="Rezervasyon talebi oluştur" en="Request a booking" />
            </Link>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href={`tel:${hotel.phone}`} className="flex items-center gap-3 text-white/90 hover:text-primary-container">
                  <span className="material-symbols-outlined text-[20px] text-primary-container">call</span>
                  {hotel.phoneDisplay}
                </a>
              </li>
              {hotel.whatsapp ? (
                <li>
                  <a href={`https://wa.me/${hotel.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/90 hover:text-primary-container">
                    <span className="material-symbols-outlined text-[20px] text-primary-container">chat</span>
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {hotel.email ? (
                <li>
                  <a href={`mailto:${hotel.email}`} className="flex items-center gap-3 text-white/90 hover:text-primary-container">
                    <span className="material-symbols-outlined text-[20px] text-primary-container">mail</span>
                    {hotel.email}
                  </a>
                </li>
              ) : null}
              <li>
                <a href={hotel.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/90 hover:text-primary-container">
                  <span className="material-symbols-outlined text-[20px] text-primary-container">language</span>
                  <L tr="Otelin resmî sitesi" en="Official hotel website" />
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section id="odalar" className="scroll-mt-48 bg-surface-container-low px-margin-mobile py-12 md:px-margin md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <h2 className={H2}>
            <L tr="Odalar ve süitler" en="Rooms and suites" />
          </h2>
          <div className="stagger mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {hotel.rooms.map((room) => (
              <article key={room.name.tr} className="reveal flex flex-col overflow-hidden rounded-3xl border border-surface-container-high bg-white shadow-sm">
                <OptImg src={room.image} alt={`${hotel.name} – ${room.name.tr}`} altEn={`${hotel.name} – ${room.name.en}`} loading="lazy" sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw" className="h-56 w-full object-cover" />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-headline-md text-xl font-bold text-on-surface">
                    <L tr={room.name.tr} en={room.name.en} />
                  </h3>
                  {room.size || room.capacity ? (
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold text-primary">
                      {room.size ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">square_foot</span>
                          {room.size}
                        </span>
                      ) : null}
                      {room.capacity ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">groups</span>
                          <L tr={room.capacity.tr} en={room.capacity.en} />
                        </span>
                      ) : null}
                    </p>
                  ) : null}
                  <p className="mt-3 text-on-surface-variant">
                    <L tr={room.text.tr} en={room.text.en} />
                  </p>
                  {room.features ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {room.features.map((f) => (
                        <li key={f.tr} className="rounded-full bg-surface-container px-3 py-1 text-xs font-bold text-on-surface-variant">
                          <L tr={f.tr} en={f.en} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="olanaklar" className="scroll-mt-48 px-margin-mobile py-12 md:px-margin md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <h2 className={H2}>
            <L tr="Otel olanakları" en="Hotel facilities" />
          </h2>
          <ul className="stagger mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {hotel.amenities.map((a) => (
              <li key={a.label.tr} className="reveal flex items-center gap-3 rounded-2xl border border-surface-container-high bg-surface-container-low px-4 py-4 font-semibold text-on-surface">
                <span className="material-symbols-outlined text-primary">{a.icon}</span>
                <L tr={a.label.tr} en={a.label.en} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {hotel.sections.map((s, i) => (
        <section key={s.id} id={s.id} className={`scroll-mt-48 px-margin-mobile py-12 md:px-margin md:py-16 ${i % 2 === 0 ? "bg-surface-container-low" : ""}`}>
          <div className={`mx-auto grid max-w-[1400px] gap-8 ${s.images?.length ? "lg:grid-cols-2 lg:items-center" : ""}`}>
            <div className={i % 2 === 1 && s.images?.length ? "lg:order-2" : ""}>
              <span className="material-symbols-outlined text-[36px] text-primary">{s.icon}</span>
              <h2 className={`${H2} mt-2`}>
                <L tr={s.title.tr} en={s.title.en} />
              </h2>
              <p className="mt-4 text-lg text-on-surface-variant">
                <C k={hotelKey.section(hotel.slug, s.id)} fallback={s.text} />
              </p>
              {s.items ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.items.map((it) => (
                    <li key={it.tr} className="rounded-full border border-surface-container-high bg-white px-4 py-2 text-sm font-semibold text-on-surface">
                      <L tr={it.tr} en={it.en} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {s.images?.length ? <SectionImages images={s.images} name={`${hotel.name} – ${s.title.tr}`} /> : null}
          </div>
        </section>
      ))}

      <section id="galeri" className="scroll-mt-48 px-margin-mobile py-12 md:px-margin md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <h2 className={H2}>
            <L tr="Fotoğraf galerisi" en="Photo gallery" />
          </h2>
          <div className="stagger mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {hotel.gallery.map((src, i) => (
              <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="reveal-zoom group block overflow-hidden rounded-2xl bg-surface-container">
                <OptImg
                  src={src}
                  alt={`${hotel.name} – ${i + 1}`}
                  loading="lazy"
                  sizes="(min-width:768px) 33vw, 50vw"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="iletisim" className="scroll-mt-48 bg-surface-container-low px-margin-mobile py-12 md:px-margin md:py-16">
        <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-surface-container-high bg-white p-6 md:p-8">
            <h2 className="font-headline-md text-2xl font-extrabold text-on-surface">
              <L tr="Konum ve iletişim" en="Location and contact" />
            </h2>
            <ul className="mt-5 space-y-3 text-on-surface-variant">
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <L tr={hotel.address.tr} en={hotel.address.en} />
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-primary">call</span>
                <a href={`tel:${hotel.phone}`} className="font-semibold text-on-surface hover:text-primary">
                  {hotel.phoneDisplay}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={mapLink(hotel)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-container hover:text-on-primary-container"
              >
                <span className="material-symbols-outlined text-[18px]">directions</span>
                <L tr="Haritada aç" en="Open in maps" />
              </a>
              <Link
                href={requestLink(hotel)}
                className="inline-flex items-center gap-2 rounded-full border border-on-surface px-6 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-on-surface hover:text-white"
              >
                <L tr="Rezervasyon talebi" en="Request a booking" />
              </Link>
            </div>
            <p className="mt-6 text-xs text-on-surface-variant">
              <L
                tr="Bu sayfadaki bilgiler otelin resmî internet sitesinden derlenmiştir ve zamanla değişebilir. Güncel fiyat, doluluk ve koşullar için talep oluşturun veya otelle iletişime geçin."
                en="The information on this page is compiled from the hotel's official website and may change over time. For current prices, availability and terms, send a request or contact the hotel."
              />
            </p>
          </div>

          <div className="rounded-3xl border border-surface-container-high bg-white p-6 md:p-8">
            <h2 className="font-headline-md text-2xl font-extrabold text-on-surface">
              <L tr="Diğer anlaşmalı oteller" en="Other partner hotels" />
            </h2>
            <ul className="mt-5 grid gap-3">
              {others.map((h) => (
                <li key={h.slug}>
                  <Link href={`/rezervasyon/oteller/${h.slug}`} className="group flex items-center gap-4 rounded-2xl border border-surface-container-high p-3 transition-colors hover:bg-surface-container-low">
                    <OptImg src={hotelCover(h.slug)} alt={h.name} loading="lazy" sizes="120px" className="h-16 w-24 shrink-0 rounded-xl object-cover" style={h.focus ? { objectPosition: h.focus } : undefined} />
                    <span className="font-bold text-on-surface">{h.name}</span>
                    <span className="material-symbols-outlined ml-auto text-primary transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
