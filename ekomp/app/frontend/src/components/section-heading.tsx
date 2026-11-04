import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  text?: ReactNode;
  light?: boolean;
}) {
  return (
    <div className="reveal max-w-2xl">
      <span className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary uppercase">
        <span className="h-0.5 w-8 bg-primary-container" />
        {eyebrow}
      </span>
      <h2
        className={`mt-3 font-headline-lg text-[32px] leading-tight font-extrabold tracking-tight md:text-5xl ${
          light ? "text-white" : "text-on-surface"
        }`}
      >
        {title}
      </h2>
      {text ? (
        <p className={`mt-3 font-body-lg text-lg ${light ? "text-white/75" : "text-on-surface-variant"}`}>
          {text}
        </p>
      ) : null}
    </div>
  );
}
