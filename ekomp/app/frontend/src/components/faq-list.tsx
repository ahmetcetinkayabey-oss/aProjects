import type { ReactNode } from "react";

export interface FaqItem {
  q: ReactNode;
  a: ReactNode;
}

/** Açılır-kapanır sık sorulan sorular listesi (JavaScript gerektirmez, klavye ile de kullanılır). */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-surface-container-high overflow-hidden rounded-3xl border border-surface-container-high bg-white">
      {items.map((item, i) => (
        <details key={i} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-bold text-on-surface transition-colors hover:bg-surface-container-low [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <span
              aria-hidden
              className="material-symbols-outlined shrink-0 text-primary transition-transform duration-200 group-open:rotate-180"
            >
              expand_more
            </span>
          </summary>
          <div className="px-6 pb-6 text-on-surface-variant">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
