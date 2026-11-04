"use client";

import { DataView, Section } from "@/components/forum/forum-ui";
import { assetUrl } from "@/lib/api";
import type { ForumSpeaker } from "@/lib/forum-api";
import { pick, useLocale } from "@/lib/i18n";
import { useForumData } from "@/lib/use-forum-data";

export default function SpeakersPage() {
  const { t, locale } = useLocale();
  const state = useForumData<ForumSpeaker[]>("/forum/speakers");

  return (
    <Section title={t("speakers.title")}>
      <DataView state={state} isEmpty={(d) => d.length === 0} emptyKey="speakers.empty">
        {(speakers) => (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {speakers.map((s) => (
              <li key={s.id} className="rounded-xl border border-surface-container-high p-6">
                <div className="flex items-center gap-4">
                  {s.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={assetUrl(s.photoUrl)} alt={s.name} className="h-20 w-20 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden className="material-symbols-outlined flex h-20 w-20 items-center justify-center rounded-full bg-surface-container text-4xl">
                      person
                    </span>
                  )}
                  <div>
                    <h2 className="font-title-md text-xl font-bold">{s.name}</h2>
                    <p className="text-sm text-on-surface-variant">
                      {[pick(locale, s.titleTr, s.titleEn), s.organization, s.country].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
                <p className="mt-4 inline-block rounded-full bg-surface-container px-3 py-1 text-xs font-bold">
                  {t(`speakers.${s.confirmation}`)}
                </p>
                {pick(locale, s.bioTr, s.bioEn) ? (
                  <p className="mt-3 text-on-surface-variant">{pick(locale, s.bioTr, s.bioEn)}</p>
                ) : null}
                {s.links?.length ? (
                  <p className="mt-3 flex flex-wrap gap-3 text-sm">
                    {s.links.map((href) => (
                      <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="underline">
                        {new URL(href).hostname.replace(/^www\./, "")}
                      </a>
                    ))}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </DataView>
    </Section>
  );
}
