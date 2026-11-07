"use client";

import { useL, useC } from "@/components/t";

type Pair = [tr: string, en?: string | null];
/** Çift (TR, EN) ya da yönetilebilir metin anahtarı (lib/content-registry.ts). */
type Text = Pair | string;

function useResolve(vars?: Record<string, string | number>): (value: Text) => string {
  const l = useL();
  const c = useC();
  return (value) => (typeof value === "string" ? c(value, vars) : l(...value));
}

/** SectionHeading ile aynı çıktı; metinleri TR/EN çifti veya içerik anahtarı olarak alır (sunucu bileşenlerinden kullanım için). */
export function SectionHeadingL({
  eyebrow,
  title,
  text,
  vars,
}: {
  eyebrow: Text;
  title: Text;
  text?: Text;
  vars?: Record<string, string | number>;
}) {
  const r = useResolve(vars);
  return (
    <div className="reveal max-w-2xl">
      <span className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary uppercase">
        <span className="h-0.5 w-8 bg-primary-container" />
        {r(eyebrow)}
      </span>
      <h2 className="mt-3 font-headline-lg text-[32px] leading-tight font-extrabold tracking-tight text-on-surface md:text-5xl">
        {r(title)}
      </h2>
      {text ? <p className="mt-3 font-body-lg text-lg text-on-surface-variant">{r(text)}</p> : null}
    </div>
  );
}

/** PageTitle ile aynı çıktı; TR/EN çifti veya içerik anahtarı alır. */
export function PageTitleL({ title, subtitle }: { title: Text; subtitle?: Text }) {
  const r = useResolve();
  return (
    <section className="w-full bg-surface px-margin-mobile pt-space-xl md:px-margin">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="sr-only">{r(title)}</h1>
        {subtitle ? (
          <p className="max-w-2xl font-body-lg text-xl text-on-surface-variant">{r(subtitle)}</p>
        ) : null}
      </div>
    </section>
  );
}
