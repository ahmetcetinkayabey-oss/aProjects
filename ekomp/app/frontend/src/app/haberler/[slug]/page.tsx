import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StayCta } from "@/components/stay-cta";
import { L } from "@/components/t";
import { NEWS_EN } from "@/lib/content-en";
import { getNews } from "@/lib/api";
import { OptImg } from "@/components/opt-img";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = (await getNews()).find((n) => n.slug === slug);
  return {
    title: item ? `${item.title} | Erzurum Yüksek İrtifa Kamp Merkezi` : "Haber bulunamadı",
    description: item?.summary,
    alternates: item ? { canonical: `/haberler/${item.slug}` } : undefined,
    openGraph: item ? { title: item.title, description: item.summary, images: [{ url: item.image }] } : undefined,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const all = await getNews();
  const item = all.find((n) => n.slug === slug);
  if (!item) notFound();

  const paragraphs = (item.content ?? "")
    .split(/\n{1,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const en = NEWS_EN[item.slug];
  const enParagraphs = (item.contentEn ?? en?.content ?? "")
    .split(/\n{1,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const others = all.filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <main className="w-full bg-surface">
      <article className="px-margin-mobile pt-10 pb-16 md:px-margin md:pb-24">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/haberler"
            className="inline-flex items-center gap-1 text-sm font-bold text-on-surface-variant transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <L tr="Tüm haberler" en="All news" />
          </Link>

          <time className="reveal mt-8 inline-block rounded-full bg-primary-container px-4 py-1.5 font-label-caps text-label-caps text-on-primary-container">
            <L tr={item.date} en={item.dateLabel ? (item.dateLabelEn ?? en?.dateLabel) : null} />
          </time>
          <h1 className="reveal mt-4 font-headline-lg text-[32px] leading-tight font-extrabold tracking-tight text-on-surface md:text-5xl">
            <L tr={item.title} en={item.titleEn ?? en?.title} />
          </h1>
          <p className="reveal mt-5 font-body-lg text-xl text-on-surface-variant">
            <L tr={item.summary} en={item.summaryEn ?? en?.summary} />
          </p>
        </div>

        <div className="reveal-zoom mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
          <OptImg priority sizes="(min-width:1400px) 1400px, 100vw" src={item.image} alt={item.title} altEn={item.titleEn ?? en?.title} className="h-72 w-full object-cover md:h-[480px]" />
        </div>

        {paragraphs.length > 0 ? (
          <div className="mx-auto mt-10 max-w-3xl space-y-5">
            {paragraphs.map((p, i) => {
              // "## " ile başlayan satır ara başlıktır (İngilizce karşılığı aynı sırada).
              const isHeading = p.startsWith("## ");
              const en = enParagraphs.length === paragraphs.length ? enParagraphs[i] : null;
              const clean = (t: string | null) => (t && t.startsWith("## ") ? t.slice(3) : t);
              return isHeading ? (
                <h2 key={i} className="reveal pt-4 font-headline-lg text-2xl font-extrabold tracking-tight text-on-surface">
                  <L tr={clean(p) ?? ""} en={clean(en)} />
                </h2>
              ) : (
                <p key={i} className="reveal font-body-lg text-lg leading-8 text-on-surface">
                  <L tr={p} en={en} />
                </p>
              );
            })}
          </div>
        ) : null}
      </article>

      {others.length > 0 ? (
        <section className="bg-surface-container-low px-margin-mobile py-16 md:px-margin md:py-24">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="reveal font-headline-lg text-[28px] font-extrabold tracking-tight text-on-surface md:text-4xl">
              <L tr="Diğer haberler" en="Other news" />
            </h2>
            <div className="stagger mt-8 grid gap-6 md:grid-cols-3">
              {others.map((n) => (
                <Link
                  key={n.slug}
                  href={`/haberler/${n.slug}`}
                  className="reveal group overflow-hidden rounded-3xl border border-surface-container-high bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="h-44 overflow-hidden">
                    <OptImg sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                      src={n.image}
                      alt={n.title}
                      altEn={n.titleEn ?? NEWS_EN[n.slug]?.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <time className="font-label-caps text-label-caps text-primary"><L tr={n.date} en={n.dateLabel ? (n.dateLabelEn ?? NEWS_EN[n.slug]?.dateLabel) : null} />
                    </time>
                    <h3 className="mt-1 font-headline-md text-lg font-bold text-on-surface">
                      <L tr={n.title} en={n.titleEn ?? NEWS_EN[n.slug]?.title} />
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <StayCta />
    </main>
  );
}
