"use client";

import { useL } from "@/components/t";

type Pair = [tr: string, en?: string | null];

/** SectionHeading ile aynı çıktı; metinleri TR/EN çift olarak alır (sunucu bileşenlerinden kullanım için). */
export function SectionHeadingL({
  eyebrow,
  title,
  text,
}: {
  eyebrow: Pair;
  title: Pair;
  text?: Pair;
}) {
  const l = useL();
  return (
    <div className="reveal max-w-2xl">
      <span className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary uppercase">
        <span className="h-0.5 w-8 bg-primary-container" />
        {l(...eyebrow)}
      </span>
      <h2 className="mt-3 font-headline-lg text-[32px] leading-tight font-extrabold tracking-tight text-on-surface md:text-5xl">
        {l(...title)}
      </h2>
      {text ? <p className="mt-3 font-body-lg text-lg text-on-surface-variant">{l(...text)}</p> : null}
    </div>
  );
}

/** PageTitle ile aynı çıktı; TR/EN çift alır. */
export function PageTitleL({ title, subtitle }: { title: Pair; subtitle?: Pair }) {
  const l = useL();
  return (
    <section className="w-full bg-surface px-margin-mobile pt-space-xl md:px-margin">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="sr-only">{l(...title)}</h1>
        {subtitle ? (
          <p className="max-w-2xl font-body-lg text-xl text-on-surface-variant">{l(...subtitle)}</p>
        ) : null}
      </div>
    </section>
  );
}
