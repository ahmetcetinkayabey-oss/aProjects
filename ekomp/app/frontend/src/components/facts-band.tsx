import { L } from "./t";

const FACTS = [
  { value: <L tr="2.100 m" en="2,100 m" />, label: <L tr="Rakım" en="Altitude" /> },
  { value: "50 m", label: <L tr="Olimpik havuz" en="Olympic pool" /> },
  { value: "400 m", label: <L tr="Tartan pist" en="Tartan track" /> },
  { value: "5", label: <L tr="Curling pisti" en="Curling rinks" /> },
  { value: <L tr="3.000" en="3,000" />, label: <L tr="Kişilik salon" en="Seat hall" /> },
];

export function FactsBand() {
  return (
    <section className="w-full bg-ink px-margin-mobile py-16 md:px-margin md:py-20">
      <dl className="reveal-zoom mx-auto grid max-w-[1400px] grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/10 md:grid-cols-5">
        {FACTS.map((fact, i) => (
          <div key={i} className="bg-ink-soft px-6 py-8 text-center">
            <dd className="font-metric-display text-4xl leading-none font-extrabold text-primary-container tabular-nums md:text-5xl">
              {fact.value}
            </dd>
            <dt className="mt-3 font-label-caps text-label-caps text-white/70 uppercase">
              {fact.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
