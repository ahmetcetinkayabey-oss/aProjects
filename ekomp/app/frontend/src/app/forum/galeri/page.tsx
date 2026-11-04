"use client";

import { DataView, Section } from "@/components/forum/forum-ui";
import { assetUrl } from "@/lib/api";
import type { ForumMedia } from "@/lib/forum-api";
import { pick, useLocale } from "@/lib/i18n";
import { useForumData } from "@/lib/use-forum-data";

/** YouTube/Vimeo izleme bağlantısını gömme adresine çevirir. */
function embedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (u.hostname === "youtu.be") return `https://www.youtube-nocookie.com/embed${u.pathname}`;
    if (u.hostname.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    // geçersiz adres
  }
  return null;
}

export default function GalleryPage() {
  const { t, locale } = useLocale();
  const state = useForumData<ForumMedia[]>("/forum/media");

  return (
    <Section title={t("gallery.title")}>
      <DataView state={state} isEmpty={(d) => d.filter((m) => m.kind === "GALLERY").length === 0} emptyKey="gallery.empty">
        {(items) => (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items
              .filter((m) => m.kind === "GALLERY")
              .map((m) => {
                const title = pick(locale, m.titleTr, m.titleEn);
                const embed = m.videoUrl ? embedUrl(m.videoUrl) : null;
                return (
                  <li key={m.id} className="overflow-hidden rounded-xl border border-surface-container-high">
                    {embed ? (
                      <iframe
                        src={embed}
                        title={title || "Video"}
                        loading="lazy"
                        allowFullScreen
                        className="aspect-video w-full"
                      />
                    ) : m.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={assetUrl(m.url)} alt={title} loading="lazy" className="aspect-video w-full object-cover" />
                    ) : null}
                    {title || m.descriptionTr || m.descriptionEn ? (
                      <div className="p-4">
                        {title ? <p className="font-bold">{title}</p> : null}
                        <p className="text-sm text-on-surface-variant">{pick(locale, m.descriptionTr, m.descriptionEn)}</p>
                      </div>
                    ) : null}
                  </li>
                );
              })}
          </ul>
        )}
      </DataView>
    </Section>
  );
}
