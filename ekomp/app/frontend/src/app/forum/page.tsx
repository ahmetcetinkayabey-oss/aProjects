"use client";

import Link from "@/components/locale-link";
import { assetUrl } from "@/lib/api";
import { pick, useLocale } from "@/lib/i18n";
import type { DictKey } from "@/lib/dictionary";
import { buttonClass } from "@/components/forum/forum-ui";
import type { ForumAnnouncement, ForumSpeaker, ForumSponsor } from "@/lib/forum-api";
import { useForumData } from "@/lib/use-forum-data";

const THEMES: DictKey[] = [
  "forum.theme.winter",
  "forum.theme.altitude",
  "forum.theme.destination",
  "forum.theme.camp",
  "forum.theme.operators",
  "forum.theme.b2b",
];

export default function ForumHomePage() {
  const { t, locale } = useLocale();
  const announcements = useForumData<ForumAnnouncement[]>("/forum/announcements");
  const speakers = useForumData<ForumSpeaker[]>("/forum/speakers");
  const sponsors = useForumData<ForumSponsor[]>("/forum/sponsors");

  return (
    <div>
      <section className="bg-ink px-margin-mobile py-16 text-white md:px-margin md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-label-caps text-label-caps text-primary-container uppercase">
            {t("forum.dates")} · {t("forum.place")}
          </p>
          <h1 className="mt-4 max-w-4xl font-display-xl text-4xl leading-tight font-extrabold tracking-tight md:text-6xl">
            {t("forum.name")}
          </h1>
          <p className="mt-6 max-w-2xl font-body-lg text-lg text-white/80">{t("forum.about.text")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/forum/kayit" className={buttonClass}>
              {t("forum.register")}
            </Link>
            <Link
              href="/forum/program"
              className="inline-flex items-center rounded-full border border-white/60 px-8 py-4 font-label-caps text-label-caps text-white uppercase transition-colors hover:bg-white hover:text-ink"
            >
              {t("forum.programme")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-margin-mobile py-12 md:px-margin md:py-16">
        <h2 className="font-headline-lg text-3xl font-extrabold tracking-tight">{t("forum.themes")}</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {THEMES.map((key) => (
            <li key={key} className="rounded-full bg-surface-container px-5 py-2 text-sm font-bold">
              {t(key)}
            </li>
          ))}
        </ul>
      </section>

      {announcements.status === "ready" && announcements.data.length > 0 ? (
        <section className="mx-auto max-w-[1400px] px-margin-mobile pb-12 md:px-margin">
          <h2 className="font-headline-lg text-3xl font-extrabold tracking-tight">{t("forum.announcements")}</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {announcements.data.slice(0, 4).map((a) => (
              <li key={a.id} className="rounded-xl border border-surface-container-high p-6">
                <time dateTime={a.publishedAt} className="text-xs text-on-surface-variant">
                  {new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", { dateStyle: "long" }).format(new Date(a.publishedAt))}
                </time>
                <h3 className="mt-1 font-title-md text-xl font-bold">{pick(locale, a.titleTr, a.titleEn)}</h3>
                <p className="mt-2 text-on-surface-variant">{pick(locale, a.contentTr, a.contentEn)}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {speakers.status === "ready" && speakers.data.length > 0 ? (
        <section className="mx-auto max-w-[1400px] px-margin-mobile pb-12 md:px-margin">
          <div className="flex items-end justify-between">
            <h2 className="font-headline-lg text-3xl font-extrabold tracking-tight">{t("forum.featuredSpeakers")}</h2>
            <Link href="/forum/konusmacilar" className="text-sm font-bold underline">
              {t("forum.seeAll")}
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {speakers.data.slice(0, 4).map((s) => (
              <li key={s.id} className="rounded-xl bg-surface-container-low p-5">
                <p className="font-title-md text-lg font-bold">{s.name}</p>
                <p className="text-sm text-on-surface-variant">
                  {pick(locale, s.titleTr, s.titleEn)}
                  {s.organization ? ` · ${s.organization}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {sponsors.status === "ready" && sponsors.data.length > 0 ? (
        <section className="mx-auto max-w-[1400px] px-margin-mobile pb-12 md:px-margin">
          <h2 className="font-headline-lg text-3xl font-extrabold tracking-tight">{t("forum.sponsors")}</h2>
          <ul className="mt-6 flex flex-wrap items-center gap-6">
            {sponsors.data.map((s) => (
              <li key={s.id} className="flex h-20 items-center rounded-xl border border-surface-container-high px-6">
                {s.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assetUrl(s.logoUrl)} alt={s.name} className="max-h-12 w-auto" />
                ) : (
                  <span className="font-bold">{s.name}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mx-auto max-w-[1400px] px-margin-mobile pb-16 md:px-margin">
        <div className="rounded-2xl bg-surface-container-low p-8 md:p-12">
          <h2 className="font-headline-lg text-3xl font-extrabold tracking-tight">{t("forum.b2b.title")}</h2>
          <p className="mt-3 max-w-2xl text-on-surface-variant">{t("forum.b2b.text")}</p>
        </div>
      </section>
    </div>
  );
}
