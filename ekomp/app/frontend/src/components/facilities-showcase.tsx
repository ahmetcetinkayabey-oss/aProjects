import Link from "@/components/locale-link";
import { facilityImage } from "@/lib/facility-images";
import type { Facility } from "@/lib/types";
import { FACILITIES_EN } from "@/lib/content-en";
import { SectionHeadingL } from "./i18n-headings";
import { L } from "./t";
import { OptImg } from "@/components/opt-img";

function FacilityCard({ facility }: { facility: Facility }) {
  const image = facilityImage(facility);
  const en = FACILITIES_EN[facility.slug];
  return (
    <Link
      href={`/tesisler/${facility.slug}`}
      className="reveal group flex flex-col overflow-hidden rounded-3xl border border-surface-container-high bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative h-60 w-full overflow-hidden bg-surface-container">
        {image ? (
          <OptImg sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
            loading="lazy"
            decoding="async"
            src={image}
            alt={facility.title}
            altEn={facility.titleEn ?? en?.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <span className="material-symbols-outlined flex h-full w-full items-center justify-center text-[72px] text-on-surface-variant/50">
            {facility.icon}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        {facility.badge ? (
          <span className="absolute top-4 left-4 max-w-[80%] truncate rounded-full bg-primary-container px-3 py-1 font-label-caps text-label-caps text-on-primary-container uppercase">
            <L tr={facility.badge} en={facility.badgeEn ?? en?.badge} />
          </span>
        ) : null}
        <span className="absolute right-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink">
          <span className="material-symbols-outlined leading-none">{facility.icon}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="font-label-caps text-label-caps text-primary uppercase">
          <L tr={facility.category} en={facility.categoryEn ?? en?.category} />
        </div>
        <h3 className="mt-2 line-clamp-2 font-headline-md text-xl leading-snug font-bold text-on-surface">
          <L tr={facility.title} en={facility.titleEn ?? en?.title} />
        </h3>
        <p className="mt-2 line-clamp-3 font-body-md text-on-surface-variant">
          <L tr={facility.description} en={facility.descriptionEn ?? en?.description} />
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          {facility.footerLeft ? (
            <span className="rounded-full bg-surface-container px-3 py-1.5 text-[13px] font-semibold text-on-surface">
              <L tr={facility.footerLeft} en={facility.footerLeftEn ?? en?.footerLeft} />
            </span>
          ) : null}
          {facility.footerRight ? (
            <span className="rounded-full border border-surface-container-high px-3 py-1.5 text-[13px] text-on-surface-variant">
              <L tr={facility.footerRight} en={facility.footerRightEn ?? en?.footerRight} />
            </span>
          ) : null}
          <span className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-primary transition-all group-hover:gap-2">
            <L tr="Detay" en="Details" />
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FacilitiesShowcase({
  facilities,
  limit,
}: {
  facilities: Facility[];
  limit?: number;
}) {
  const shown = limit ? facilities.slice(0, limit) : facilities;
  return (
    <section
      id="tesisler"
      className="w-full bg-surface-container-low px-margin-mobile py-20 md:px-margin md:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeadingL eyebrow="facilities.eyebrow" title="facilities.title" text="facilities.text" vars={{ count: facilities.length }} />
        <div className="stagger mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((facility) => (
            <FacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
        {limit && facilities.length > limit ? (
          <div className="mt-10 text-center">
            <Link
              href="/tesisler"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 font-label-caps text-label-caps text-white uppercase transition-colors hover:bg-primary-container hover:text-on-primary-container"
            >
              <L tr={`Tüm tesisler (${facilities.length})`} en={`All facilities (${facilities.length})`} />
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
