import type { Facility } from "@/lib/types";

const IMAGE_BY_SLUG: Record<string, string> = {
  "yuzme-havuzu":
    "https://images.unsplash.com/photo-1560089168-6516ce03676f?q=80&w=1200&auto=format&fit=crop",
  "futbol-sahalari":
    "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1200&auto=format&fit=crop",
  "buz-curling-arenasi":
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
};

function ImageCard({ facility }: { facility: Facility }) {
  const image = facility.imageUrl ?? IMAGE_BY_SLUG[facility.slug];
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl bg-surface-container shadow-lg transition-all hover:bg-surface-container-high">
      <div className="relative h-60 w-full overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={facility.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-surface-container-high" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded bg-surface-container-lowest/80 px-2 py-1 font-label-caps text-label-caps text-secondary uppercase backdrop-blur">
          <span className="material-symbols-outlined text-xs">{facility.icon}</span>
          {facility.category}
        </div>
        <div className="absolute bottom-3 right-3 rounded bg-secondary-container/90 px-2 py-1 font-label-caps text-label-caps font-bold text-on-secondary-container uppercase">
          {facility.badge}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-space-lg">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface uppercase">
            {facility.title}
          </h3>
          <p className="font-body-md text-body-md mt-space-xs text-on-surface-variant">
            {facility.description}
          </p>
        </div>
        <div className="mt-space-md flex items-center justify-between border-t border-surface-container-high/60 pt-space-sm text-xs">
          <span className="font-semibold text-secondary">{facility.footerLeft}</span>
          <span className="text-on-surface-variant">{facility.footerRight}</span>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ facility }: { facility: Facility }) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-surface-container p-space-lg shadow-lg transition-all hover:bg-surface-container-high">
      <div>
        <div className="mb-space-sm flex items-center justify-between">
          <span className="flex items-center gap-1 rounded bg-surface-container-high px-2 py-1 font-label-caps text-label-caps text-primary uppercase">
            <span className="material-symbols-outlined text-xs">{facility.icon}</span>
            {facility.category}
          </span>
          <span className="text-xs text-on-surface-variant">{facility.badge}</span>
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface uppercase">
          {facility.title}
        </h3>
        <p className="font-body-md text-body-md mt-space-xs text-on-surface-variant">
          {facility.description}
        </p>
        {facility.stats ? (
          <div className="mt-space-md grid grid-cols-2 gap-space-xs text-xs">
            {facility.stats.map((stat) => (
              <div key={stat.label} className="rounded bg-surface-container-low p-space-xs">
                <span className="block text-on-surface-variant">{stat.label}</span>
                <span className="font-bold text-on-surface">{stat.value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-space-lg flex items-center justify-between border-t border-surface-container-high/60 pt-space-sm text-xs">
        <span className="font-semibold text-primary">{facility.footerLeft}</span>
        <span className="text-on-surface-variant">{facility.footerRight}</span>
      </div>
    </div>
  );
}

export function FacilitiesShowcase({ facilities }: { facilities: Facility[] }) {
  return (
    <section id="tesisler" className="w-full bg-surface px-margin-mobile py-space-xl md:px-margin">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-space-lg flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div>
            <div className="mb-space-xs flex items-center gap-space-xs font-label-caps text-label-caps text-primary uppercase">
              <span className="material-symbols-outlined text-sm">domain</span>
              ERZURUM OLYMPIC INFRASTRUCTURE
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface uppercase md:text-headline-lg">
              Branşlar ve Erzurum Tesis Detayları Vitrini
            </h2>
            <p className="font-body-md text-body-md mt-space-xs max-w-2xl text-on-surface-variant">
              Palandöken eteklerindeki olimpik zeminler, biyometrik ölçüm
              olanakları ve spor hekimliği altyapısı.
            </p>
          </div>
          <div className="flex flex-wrap gap-space-xs">
            <span className="rounded bg-surface-container-high px-3 py-1 font-label-caps text-xs text-secondary uppercase">
              {facilities.length} Ana Disiplin
            </span>
            <span className="rounded bg-surface-container-high px-3 py-1 font-label-caps text-xs text-on-surface-variant uppercase">
              2100m Akreditasyon
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility) =>
            facility.stats ? (
              <StatsCard key={facility.id} facility={facility} />
            ) : (
              <ImageCard key={facility.id} facility={facility} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
