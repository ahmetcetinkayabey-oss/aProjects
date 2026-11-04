import Link from "next/link";
import { SectionHeading } from "./section-heading";
import { L } from "./t";
import { OptImg } from "@/components/opt-img";

const POINTS = [
  { icon: "hotel", label: <L tr="Konaklama" en="Accommodation" /> },
  { icon: "restaurant", label: <L tr="Beslenme" en="Nutrition" /> },
  { icon: "healing", label: <L tr="Fizyoterapi" en="Physiotherapy" /> },
  { icon: "stadium", label: <L tr="Sahalar" en="Pitches" /> },
];

export function IntroSection() {
  return (
    <section className="w-full bg-surface px-margin-mobile py-20 md:px-margin md:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-2 lg:items-center">
        <div className="reveal-left relative">
          <OptImg sizes="(min-width:1024px) 50vw, 100vw"
            loading="lazy"
            decoding="async"
            src="/images/gallery-drone-closeup.jpg"
            alt="Kamp merkezi hava görüntüsü"
            className="h-80 w-full rounded-3xl object-cover shadow-2xl md:h-[500px]"
          />
          <div className="absolute -right-3 -bottom-6 rounded-2xl bg-primary-container px-6 py-5 shadow-xl md:right-8">
            <div className="font-display-xl text-4xl leading-none font-extrabold text-on-primary-container">
              <L tr="2.100 m" en="2,100 m" />
            </div>
            <div className="mt-1 font-label-caps text-label-caps text-on-primary-container uppercase">
              <L tr="Yüksek irtifa" en="High altitude" />
            </div>
          </div>
        </div>

        <div className="reveal-right">
          <SectionHeading
            eyebrow={<L tr="Hakkımızda" en="About us" />}
            title={<L tr="Tek merkez, çok branş" en="One centre, many sports" />}
            text={<L
                tr="Palandöken eteklerinde kurulu merkezimiz; kulüplere ve milli takımlara futbol, yüzme, kış sporları ve dövüş sporlarında kamp imkânı sunar."
                en="Set on the slopes of Palandöken, our centre offers clubs and national teams camp facilities for football, swimming, winter sports and combat sports."
              />}
          />
          <ul className="mt-8 grid grid-cols-2 gap-3">
            {POINTS.map((p) => (
              <li
                key={p.icon}
                className="flex items-center gap-3 rounded-2xl border border-surface-container-high bg-surface-container-low px-4 py-4 font-semibold text-on-surface"
              >
                <span className="material-symbols-outlined text-primary">{p.icon}</span>
                {p.label}
              </li>
            ))}
          </ul>
          <Link
            href="/tesisler"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-container hover:text-on-primary-container"
          >
            <L tr="Tesisleri gör" en="View facilities" />
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
