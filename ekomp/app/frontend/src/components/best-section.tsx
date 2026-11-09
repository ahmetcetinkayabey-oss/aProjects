import { SectionHeading } from "./section-heading";
import { L } from "./t";
import { OptImg } from "@/components/opt-img";

const ITEMS = [
  {
    image: "/images/gallery-golden-hour-action.jpg",
    alt: "Antrenman sahaları",
    icon: "sports_soccer",
    title: <L tr="Antrenman sahaları" en="Training pitches" />,
    text: <L
                tr="Çim saha, tartan pist ve salonlar branşınıza göre hazırlanır."
                en="Grass pitches, tartan tracks and halls are prepared to suit your sport."
              />,
  },
  {
    image: "/images/yuzme-havuzu.jpg",
    alt: "Tesisler",
    icon: "stadium",
    title: <L tr="Tesisler" en="Facilities" />,
    text: <L
                tr="Yüzme, buz sporları ve dövüş sporları aynı merkezde."
                en="Swimming, ice sports and combat sports all in one centre."
              />,
  },
  {
    image: "/images/gallery-mountain-backdrop.jpg",
    alt: "Yüksek irtifa",
    icon: "landscape",
    title: <L tr="Yüksek irtifa" en="High altitude" />,
    text: <L
                tr="Sezon öncesi kondisyon için ideal rakım ve hava."
                en="Ideal altitude and climate for pre-season conditioning."
              />,
  },
];

export function BestSection() {
  return (
    <section className="w-full bg-surface px-margin-mobile py-20 md:px-margin md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading eyebrow={<L tr="Neden biz" en="Why us" />} title={<L tr="Tam donanımlı kamp" en="A fully equipped camp" />} />
        <div className="stagger mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {ITEMS.map((item) => (
            <div
              key={item.image}
              className="reveal group overflow-hidden rounded-3xl border border-surface-container-high bg-white shadow-sm transition-shadow hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <OptImg sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                  src={item.image}
                  alt={item.alt}
                  className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
                  <span className="material-symbols-outlined leading-none">{item.icon}</span>
                </span>
                <h3 className="mt-4 font-headline-md text-xl font-bold text-on-surface">
                  {item.title}
                </h3>
                <p className="mt-2 font-body-md text-on-surface-variant">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
