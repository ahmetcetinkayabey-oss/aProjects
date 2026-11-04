import Link from "next/link";
import { getNews } from "@/lib/api";
import type { NewsItem } from "@/lib/site";
import type { ReactNode } from "react";
import { NEWS_EN } from "@/lib/content-en";
import { SectionHeadingL } from "./i18n-headings";
import { L } from "./t";
import { OptImg } from "@/components/opt-img";

/** İçerik uzunluğundan tahmini okuma süresi (dakika). İçerik yoksa özetten hesaplanır. */
function readingMinutes(item: NewsItem): number {
  const words = `${item.content ?? ""} ${item.summary}`.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Basın haberleri kaynağın sayfasını yeni sekmede açar; site içi haberler kendi sayfasına gider. */
function NewsLink({ item, className, children }: { item: NewsItem; className: string; children: ReactNode }) {
  if (item.sourceUrl) {
    return (
      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={`/haberler/${item.slug}`} className={className}>
      {children}
    </Link>
  );
}

function Meta({ item, light = false }: { item: NewsItem; light?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 text-sm font-semibold ${light ? "text-white/80" : "text-on-surface-variant"}`}
    >
      <time className="inline-flex items-center gap-1">
        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
        <L tr={item.dateLabel ?? item.date} en={item.dateLabel ? item.dateLabelEn ?? NEWS_EN[item.slug]?.dateLabel : null} />
      </time>
      <span aria-hidden className="h-1 w-1 rounded-full bg-current opacity-60" />
      {item.sourceName ? (
        <span className="inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">newspaper</span>
          <L tr={item.sourceName} en={item.sourceNameEn ?? NEWS_EN[item.slug]?.sourceName} />
        </span>
      ) : (
        <span className="inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          <L tr={`${readingMinutes(item)} dk okuma`} en={`${readingMinutes(item)} min read`} />
        </span>
      )}
    </div>
  );
}

export async function NewsList({ limit }: { limit?: number }) {
  const all = await getNews();
  // Ana sayfada (limit verilince) basın haberleri öne çıkar; yoksa en yeni haberler gösterilir.
  const press = all.filter((n) => n.sourceUrl);
  const items = limit ? (press.length ? press : all).slice(0, limit) : all;
  // Tam 3 haber varsa büyük kart yerine üç eşit kart gösterilir (boş sütun kalmasın).
  const flat = items.length === 3;
  const featured: NewsItem | undefined = flat ? undefined : items[0];
  const rest: NewsItem[] = flat ? items : items.slice(1);

  return (
    <section className="w-full bg-surface-container-low px-margin-mobile py-20 md:px-margin md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeadingL
            eyebrow={["Haberler", "News"]}
            title={["Güncel gelişmeler", "Latest developments"]}
            text={[
              "Kamp merkezinden, Erzurum'un kış ve yaz sporlarından haberler ve rehberler.",
              "News and guides from the camp centre and from winter and summer sports in Erzurum.",
            ]}
          />
          {limit ? (
            <Link
              href="/haberler"
              className="inline-flex items-center gap-1 rounded-full border border-on-surface px-5 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-on-surface hover:text-white"
            >
              <L tr="Tümü" en="View all" />
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          ) : null}
        </div>

        {featured ? (
          <NewsLink
            item={featured}
            className="reveal group relative mt-12 block overflow-hidden rounded-3xl bg-ink shadow-xl"
          >
            <OptImg sizes="100vw"
              loading="lazy"
              decoding="async"
              src={featured.image}
              alt={featured.title}
              altEn={featured.titleEn ?? NEWS_EN[featured.slug]?.title}
              className="h-[380px] w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 md:h-[480px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 max-w-3xl p-6 md:p-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-container px-3 py-1 font-label-caps text-label-caps text-on-primary-container uppercase">
                <span className="material-symbols-outlined text-[16px]">star</span>
                {featured.category ? (
                  <L tr={featured.category} en={featured.categoryEn ?? NEWS_EN[featured.slug]?.category} />
                ) : (
                  <L tr="Öne çıkan" en="Featured" />
                )}
              </span>
              <h3 className="mt-4 font-headline-lg text-3xl leading-tight font-extrabold text-white md:text-5xl">
                <L tr={featured.title} en={featured.titleEn ?? NEWS_EN[featured.slug]?.title} />
              </h3>
              <p className="mt-3 line-clamp-2 font-body-lg text-lg text-white/85">
                <L tr={featured.summary} en={featured.summaryEn ?? NEWS_EN[featured.slug]?.summary} />
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <Meta item={featured} light />
                <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-container transition-all group-hover:gap-2">
                  <L tr="Haberi oku" en="Read the story" />
                  <span className="material-symbols-outlined text-[18px]">
                    {featured.sourceUrl ? "north_east" : "arrow_forward"}
                  </span>
                </span>
              </div>
            </div>
          </NewsLink>
        ) : null}

        <div className="stagger mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((item) => (
            <NewsLink
              key={item.slug}
              item={item}
              className="reveal group flex flex-col overflow-hidden rounded-3xl border border-surface-container-high bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative overflow-hidden">
                <OptImg sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                  loading="lazy"
                  decoding="async"
                  src={item.image}
                  alt={item.title}
                  altEn={item.titleEn ?? NEWS_EN[item.slug]?.title}
                  className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 max-w-[85%] truncate rounded-full bg-primary-container px-3 py-1 font-label-caps text-label-caps text-on-primary-container uppercase shadow">
                  {item.category ? (
                    <L tr={item.category} en={item.categoryEn ?? NEWS_EN[item.slug]?.category} />
                  ) : (
                    <L tr={item.dateLabel ?? item.date} en={item.dateLabel ? item.dateLabelEn ?? NEWS_EN[item.slug]?.dateLabel : null} />
                  )}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-headline-md text-xl leading-snug font-bold text-on-surface">
                  <L tr={item.title} en={item.titleEn ?? NEWS_EN[item.slug]?.title} />
                </h3>
                <p className="mt-2 line-clamp-3 font-body-md text-on-surface-variant">
                  <L tr={item.summary} en={item.summaryEn ?? NEWS_EN[item.slug]?.summary} />
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-5">
                  <span className="min-w-0 text-sm font-semibold text-on-surface-variant">
                    {item.sourceName ? (
                      <>
                        <L tr={item.dateLabel ?? item.date} en={item.dateLabel ? item.dateLabelEn ?? NEWS_EN[item.slug]?.dateLabel : null} />
                        {" · "}
                        <L tr={item.sourceName} en={item.sourceNameEn ?? NEWS_EN[item.slug]?.sourceName} />
                      </>
                    ) : (
                      <L tr={`${readingMinutes(item)} dk okuma`} en={`${readingMinutes(item)} min read`} />
                    )}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary transition-all group-hover:gap-2">
                    {item.sourceUrl ? <L tr="Haberi oku" en="Read the story" /> : <L tr="Devamı" en="Read more" />}
                    <span className="material-symbols-outlined text-[18px]">
                      {item.sourceUrl ? "north_east" : "arrow_forward"}
                    </span>
                  </span>
                </div>
              </div>
            </NewsLink>
          ))}
        </div>
      </div>
    </section>
  );
}
