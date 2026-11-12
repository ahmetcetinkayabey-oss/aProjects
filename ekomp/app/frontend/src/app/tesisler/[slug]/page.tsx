import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FacilityDetails } from "@/components/facility-details";
import { StayCta } from "@/components/stay-cta";
import { L } from "@/components/t";
import { FACILITIES_EN } from "@/lib/content-en";
import { getFacilities } from "@/lib/api";
import { facilityGallery, facilityHeroCaption, facilityImage } from "@/lib/facility-images";
import { FacilityPhotoGrid } from "@/components/facility-photo-grid";
import { OptImg } from "@/components/opt-img";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const facility = (await getFacilities()).find((f) => f.slug === slug);
  if (!facility) return { title: "Tesis bulunamadı" };
  const image = facilityImage(facility);
  return {
    title: `${facility.title} | Erzurum Yüksek İrtifa Kamp Merkezi`,
    description: facility.description,
    alternates: { canonical: `/tesisler/${facility.slug}` },
    openGraph: { title: facility.title, description: facility.description, images: image ? [{ url: image }] : undefined },
  };
}

export default async function FacilityDetailPage({ params }: Props) {
  const { slug } = await params;
  const facilities = await getFacilities();
  const index = facilities.findIndex((f) => f.slug === slug);
  if (index === -1) notFound();

  const facility = facilities[index];
  const image = facilityImage(facility);
  const gallery = facilityGallery(facility);
  const heroCaption = facilityHeroCaption(facility);
  const prev = facilities[(index - 1 + facilities.length) % facilities.length];
  const next = facilities[(index + 1) % facilities.length];
  const others = facilities.filter((f) => f.slug !== slug).slice(0, 3);

  const en = FACILITIES_EN[facility.slug];
  const facts = [
    ...(facility.stats ?? []).map((s, i) => {
      const e = (facility.statsEn?.length === (facility.stats ?? []).length ? facility.statsEn?.[i] : undefined) ?? en?.stats?.[i];
      return {
        label: s.label.replace(/:$/, ""),
        labelEn: e ? e.label.replace(/:$/, "") : undefined,
        value: s.value,
        valueEn: e?.value,
      };
    }),
    { label: "Kamp türü", labelEn: "Camp type", value: facility.footerLeft, valueEn: facility.footerLeftEn ?? en?.footerLeft },
    { label: "Özellik", labelEn: "Feature", value: facility.footerRight, valueEn: facility.footerRightEn ?? en?.footerRight },
  ];

  return (
    <main className="w-full bg-surface">
      <section className="px-margin-mobile pt-10 md:px-margin">
        <div className="mx-auto max-w-[1400px]">
          <Link
            href="/tesisler"
            className="inline-flex items-center gap-1 text-sm font-bold text-on-surface-variant transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <L tr="Tüm tesisler" en="All facilities" />
          </Link>
        </div>
      </section>

      <section className="px-margin-mobile py-10 md:px-margin md:py-14">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div className="reveal-left relative overflow-hidden rounded-3xl bg-surface-container shadow-2xl">
            {image ? (
              <OptImg priority sizes="(min-width:1400px) 1400px, 100vw" src={image} alt={facility.title} altEn={facility.titleEn ?? en?.title} className="h-80 w-full object-cover md:h-[560px]" />
            ) : (
              <div className="h-80 md:h-[560px]" />
            )}
            <span className="absolute top-5 left-5 rounded-full bg-primary-container px-4 py-1.5 font-label-caps text-label-caps text-on-primary-container uppercase">
              <L tr={facility.badge} en={facility.badgeEn ?? en?.badge} />
            </span>
            {heroCaption ? (
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-5 pt-12 pb-4 text-sm font-semibold text-white">
                <L tr={heroCaption.tr} en={heroCaption.en} />
              </p>
            ) : null}
          </div>

          <div className="reveal-right">
            <span className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary uppercase">
              <span className="material-symbols-outlined text-[20px]">{facility.icon}</span>
              <L tr={facility.category} en={facility.categoryEn ?? en?.category} />
            </span>
            <h1 className="mt-3 font-headline-lg text-[32px] leading-tight font-extrabold tracking-tight text-on-surface md:text-5xl">
              <L tr={facility.title} en={facility.titleEn ?? en?.title} />
            </h1>
            <p className="mt-5 font-body-lg text-lg text-on-surface-variant">
              <L tr={facility.description} en={facility.descriptionEn ?? en?.description} />
            </p>

            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-2xl border border-surface-container-high bg-surface-container-low px-5 py-4"
                >
                  <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    <L tr={fact.label} en={fact.labelEn} />
                  </dt>
                  <dd className="mt-1 font-title-md text-lg font-bold text-on-surface">
                    <L tr={fact.value} en={fact.valueEn} />
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href="/rezervasyon#rezervasyon"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-container px-8 py-4 font-label-caps text-label-caps text-on-primary-container uppercase transition-colors hover:bg-ink hover:text-white"
            >
              <L tr="Bu tesis için talep oluştur" en="Request this facility" />
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {facility.details?.trim() ? (
        <section className="px-margin-mobile pb-12 md:px-margin md:pb-16">
          <div className="mx-auto max-w-[900px]">
            <FacilityDetails tr={facility.details} en={facility.detailsEn} />
          </div>
        </section>
      ) : null}

      {gallery.length > 0 ? (
        <section className="px-margin-mobile pb-16 md:px-margin md:pb-24">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="reveal font-headline-lg text-[28px] font-extrabold tracking-tight text-on-surface md:text-4xl">
              <L tr="Fotoğraflar" en="Photos" />
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              <L tr="Büyütmek için bir fotoğrafa tıklayın." en="Click a photo to enlarge it." />
            </p>
            <FacilityPhotoGrid images={gallery} title={facility.title} titleEn={facility.titleEn ?? en?.title} />
          </div>
        </section>
      ) : null}

      <section className="bg-surface-container-low px-margin-mobile py-16 md:px-margin md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="reveal font-headline-lg text-[28px] font-extrabold tracking-tight text-on-surface md:text-4xl">
            <L tr="Diğer tesisler" en="Other facilities" />
          </h2>
          <div className="stagger mt-8 grid gap-6 md:grid-cols-3">
            {others.map((f) => {
              const img = facilityImage(f);
              return (
                <Link
                  key={f.slug}
                  href={`/tesisler/${f.slug}`}
                  className="reveal group overflow-hidden rounded-3xl border border-surface-container-high bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="h-44 overflow-hidden bg-surface-container">
                    {img ? (
                      <OptImg sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                        src={img}
                        alt={f.title}
                        altEn={f.titleEn ?? FACILITIES_EN[f.slug]?.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <div className="font-label-caps text-label-caps text-primary uppercase">
                      <L tr={f.category} en={f.categoryEn ?? FACILITIES_EN[f.slug]?.category} />
                    </div>
                    <h3 className="mt-1 font-headline-md text-lg font-bold text-on-surface">
                      <L tr={f.title} en={f.titleEn ?? FACILITIES_EN[f.slug]?.title} />
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>

          {facilities.length > 2 ? (
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-surface-container-high pt-6">
            <Link
              href={`/tesisler/${prev.slug}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-on-surface transition-colors hover:text-primary"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="hidden sm:inline">
                <L tr={prev.title} en={prev.titleEn ?? FACILITIES_EN[prev.slug]?.title} />
              </span>
              <span className="sm:hidden">
                <L tr="Önceki" en="Previous" />
              </span>
            </Link>
            <Link
              href={`/tesisler/${next.slug}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-on-surface transition-colors hover:text-primary"
            >
              <span className="hidden sm:inline">
                <L tr={next.title} en={next.titleEn ?? FACILITIES_EN[next.slug]?.title} />
              </span>
              <span className="sm:hidden">
                <L tr="Sonraki" en="Next" />
              </span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          ) : null}
        </div>
      </section>

      <StayCta />
    </main>
  );
}
