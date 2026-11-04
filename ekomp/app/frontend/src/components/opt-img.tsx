"use client";

import type { ImgHTMLAttributes } from "react";
import { pick, useLocale } from "@/lib/i18n";

/** next.config.ts → images.deviceSizes / imageSizes ile uyumlu genişlikler (Next görsel optimizasyonu yalnızca bunları kabul eder). */
const DEFAULT_WIDTHS = [384, 640, 828, 1080, 1200, 1920];

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  src?: string | null;
  /** Üretilecek genişlikler (px). */
  widths?: number[];
  /** Ekranın üstündeki (LCP) görseller için: hemen ve yüksek öncelikle yüklenir. */
  priority?: boolean;
  /** İngilizce alt metin; boşsa alt (Türkçe) kullanılır. */
  altEn?: string | null;
};

/**
 * Yerel (/images/...) görselleri Next'in görsel optimizasyonundan geçirir: ekran boyutuna uygun, küçük WebP.
 * Dış adreslerden gelen görseller (yönetim panelinden yüklenenler) olduğu gibi gösterilir.
 * Düz <img> olduğu için mevcut sınıflar ve davranış değişmez.
 */
export function OptImg({ src, widths = DEFAULT_WIDTHS, sizes = "100vw", priority = false, alt = "", altEn, loading, fetchPriority, ...rest }: Props) {
  const { locale } = useLocale();
  if (!src) return null;
  const altText = altEn ? pick(locale, alt, altEn) : alt;
  const path = src.split("?")[0];
  const local = src.startsWith("/") && !src.startsWith("//") && /\.(jpe?g|png|webp)$/i.test(path);
  const eager = loading ?? (priority ? "eager" : "lazy");
  if (!local) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={altText} loading={eager} decoding="async" fetchPriority={fetchPriority} {...rest} />;
  }
  const sorted = [...widths].sort((a, b) => a - b);
  const url = (w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
  const fallback = sorted[Math.min(2, sorted.length - 1)];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url(fallback)}
      srcSet={sorted.map((w) => `${url(w)} ${w}w`).join(", ")}
      sizes={sizes}
      alt={altText}
      loading={eager}
      decoding="async"
      fetchPriority={priority ? "high" : fetchPriority}
      {...rest}
    />
  );
}
