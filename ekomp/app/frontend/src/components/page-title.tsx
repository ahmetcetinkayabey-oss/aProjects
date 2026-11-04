import type { ReactNode } from "react";

export function PageTitle({ title, subtitle }: { title: ReactNode; subtitle?: ReactNode }) {
  return (
    <section className="w-full bg-surface px-margin-mobile pt-space-xl md:px-margin">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="sr-only">{title}</h1>
        {subtitle ? (
          <p className="max-w-2xl font-body-lg text-xl text-on-surface-variant">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
