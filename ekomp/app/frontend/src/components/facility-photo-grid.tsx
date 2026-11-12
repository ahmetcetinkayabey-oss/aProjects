"use client";

import { useCallback, useEffect, useState } from "react";
import { OptImg } from "@/components/opt-img";
import { pick, useLocale } from "@/lib/i18n";
import type { GalleryImage } from "@/lib/facility-images";

type Props = { images: GalleryImage[]; title: string; titleEn?: string };

/** Tesis fotoğrafları: açıklamalı kartlar, tıklayınca büyüyen görünüm (ok tuşları / Esc ile gezilir). */
export function FacilityPhotoGrid({ images, title, titleEn }: Props) {
  const { locale } = useLocale();
  const [open, setOpen] = useState<number | null>(null);
  const count = images.length;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + count) % count)), [count]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const current = open === null ? null : images[open];
  const en = locale === "en";

  return (
    <>
      <div className="stagger mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((g, i) => {
          const caption = pick(locale, g.tr, g.en);
          return (
            <figure key={g.src} className="reveal-zoom overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={en ? `Enlarge photo: ${caption}` : `Fotoğrafı büyüt: ${caption}`}
                className="group relative block w-full cursor-zoom-in overflow-hidden bg-surface-container"
              >
                <OptImg
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  src={g.src}
                  alt={`${title} – ${g.tr}`}
                  altEn={`${titleEn ?? title} – ${g.en}`}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                </span>
              </button>
              <figcaption className="px-4 py-3 text-sm text-on-surface-variant">{caption}</figcaption>
            </figure>
          );
        })}
      </div>

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={en ? "Photo viewer" : "Fotoğraf görüntüleyici"}
          className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
          onClick={close}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white">
            <span className="text-sm font-bold">
              {(open ?? 0) + 1} / {count}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label={en ? "Close" : "Kapat"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-16">
            {count > 1 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label={en ? "Previous photo" : "Önceki fotoğraf"}
                className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 md:left-5"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={pick(locale, current.tr, current.en)}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />
            {count > 1 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label={en ? "Next photo" : "Sonraki fotoğraf"}
                className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 md:right-5"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            ) : null}
          </div>

          <p className="px-5 py-5 text-center text-sm text-white/85" onClick={(e) => e.stopPropagation()}>
            {pick(locale, current.tr, current.en)}
          </p>
        </div>
      ) : null}
    </>
  );
}
