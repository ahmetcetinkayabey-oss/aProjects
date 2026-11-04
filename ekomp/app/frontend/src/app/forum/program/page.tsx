"use client";

import { useState } from "react";
import { DataView, Section } from "@/components/forum/forum-ui";
import type { DictKey } from "@/lib/dictionary";
import { FORUM_DAYS, type ForumSession } from "@/lib/forum-api";
import { pick, useLocale } from "@/lib/i18n";
import { useForumData } from "@/lib/use-forum-data";

export default function ProgramPage() {
  const { t, locale } = useLocale();
  const state = useForumData<ForumSession[]>("/forum/program");
  const [day, setDay] = useState<(typeof FORUM_DAYS)[number]>(FORUM_DAYS[0]);
  const dayKeys: DictKey[] = ["program.day1", "program.day2"];

  return (
    <Section title={t("program.title")}>
      <div role="tablist" aria-label={t("program.title")} className="mb-2 flex gap-2">
        {FORUM_DAYS.map((d, i) => (
          <button
            key={d}
            role="tab"
            type="button"
            aria-selected={day === d}
            onClick={() => setDay(d)}
            className={`rounded-full px-6 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
              day === d ? "bg-ink text-white" : "bg-surface-container text-on-surface hover:bg-surface-container-high"
            }`}
          >
            {t(dayKeys[i])}
          </button>
        ))}
      </div>
      <p className="mb-8 text-sm text-on-surface-variant">{t("program.tz")}</p>

      <DataView state={state} isEmpty={(all) => all.every((s) => s.day !== day)} emptyKey="program.empty">
        {(all) => (
          <ol className="grid gap-4">
            {all
              .filter((s) => s.day === day)
              .map((s) => (
                <li key={s.id} className="grid gap-3 rounded-xl border border-surface-container-high p-5 md:grid-cols-[9rem_1fr]">
                  <p className="font-title-md text-lg font-bold tabular-nums">
                    {s.startTime}–{s.endTime}
                  </p>
                  <div>
                    <p className="text-xs font-bold tracking-wide text-primary uppercase">
                      {t(`session.${s.type}` as DictKey)}
                      {s.room ? ` · ${t("program.room")}: ${s.room}` : ""}
                    </p>
                    <h2 className="mt-1 font-title-md text-xl font-bold">{pick(locale, s.titleTr, s.titleEn)}</h2>
                    {pick(locale, s.descriptionTr, s.descriptionEn) ? (
                      <p className="mt-2 text-on-surface-variant">{pick(locale, s.descriptionTr, s.descriptionEn)}</p>
                    ) : null}
                    {s.moderator ? (
                      <p className="mt-2 text-sm">
                        <span className="font-bold">{t("program.moderator")}:</span> {s.moderator}
                      </p>
                    ) : null}
                    {s.speakers.length ? (
                      <p className="mt-1 text-sm text-on-surface-variant">{s.speakers.map((sp) => sp.name).join(", ")}</p>
                    ) : null}
                  </div>
                </li>
              ))}
          </ol>
        )}
      </DataView>
    </Section>
  );
}
