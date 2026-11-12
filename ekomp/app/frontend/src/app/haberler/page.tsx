import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import { NewsList } from "@/components/news-list";
import { PageTitleL } from "@/components/i18n-headings";

export const generateMetadata = (): Promise<Metadata> => pageMeta({ title: "Haberler" }, { title: "News" });

export default function NewsPage() {
  return (
    <main className="w-full bg-surface">
      <PageTitleL
        title={["Haberler", "News"]}
        subtitle="news.page.subtitle"
      />
      <NewsList />
    </main>
  );
}
