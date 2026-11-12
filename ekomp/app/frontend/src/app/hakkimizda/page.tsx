import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import { BestSection } from "@/components/best-section";
import { FactsBand } from "@/components/facts-band";
import { IntroSection } from "@/components/intro-section";
import { PageTitle } from "@/components/page-title";
import { StayCta } from "@/components/stay-cta";
import { C, L } from "@/components/t";

export const generateMetadata = (): Promise<Metadata> => pageMeta({ title: "Hakkımızda" }, { title: "About us" });

export default function AboutPage() {
  return (
    <main className="w-full bg-surface">
      <PageTitle
        title={<L tr="Hakkımızda" en="About us" />}
        subtitle={<C k="about.page.subtitle" />}
      />
      <IntroSection />
      <FactsBand />
      <BestSection />
      <StayCta />
    </main>
  );
}
