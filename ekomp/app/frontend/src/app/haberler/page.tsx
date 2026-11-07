import type { Metadata } from "next";
import { NewsList } from "@/components/news-list";
import { PageTitleL } from "@/components/i18n-headings";

export const metadata: Metadata = { title: "Haberler | Erzurum Yüksek İrtifa Kamp Merkezi", alternates: { canonical: "/haberler" } };

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
