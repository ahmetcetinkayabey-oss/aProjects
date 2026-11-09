import { SectionHeading } from "./section-heading";
import { C, L } from "./t";
import { OptImg } from "@/components/opt-img";

const GALLERY_ITEMS = [
  { src: "/images/gallery-drone-closeup.jpg", title: "Kamp merkezi", en: "Camp centre", span: "col-span-2 row-span-2" },
  { src: "/images/yuzme-havuzu.jpg", title: "Olimpik yüzme havuzu", en: "Olympic swimming pool", span: "" },
  { src: "/images/buz-arenasi-erzurum.jpg", title: "Buz arenası", en: "Ice arena", span: "" },
  { src: "/images/gallery-mountain-backdrop.jpg", title: "Palandöken zirveleri", en: "Palandöken peaks", span: "col-span-2" },
  { src: "/images/gallery-antreman.jpg", title: "Takım antrenmanı", en: "Team training", span: "col-span-2" },
  { src: "/images/kayakla-atlama.jpg", title: "Kayakla atlama kuleleri", en: "Ski jumping hills", span: "col-span-2" },
];

export function FacilityGallery() {
  return (
    <section id="galeri" className="w-full bg-surface px-margin-mobile py-20 md:px-margin md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading eyebrow={<C k="gallery.eyebrow" />} title={<C k="gallery.title" />} />
        <div className="mt-12 grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4 md:gap-4">
          {GALLERY_ITEMS.map((item) => (
            <figure
              key={item.src}
              className={`reveal-zoom relative overflow-hidden rounded-2xl bg-surface-container ${item.span}`}
            >
              <OptImg sizes="(min-width:768px) 50vw, 100vw"
                loading="lazy"
                decoding="async"
                src={item.src}
                alt={item.title}
                className="parallax-img h-full w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-4 pt-10 pb-3 text-sm font-semibold text-white">
                <L tr={item.title} en={item.en} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
