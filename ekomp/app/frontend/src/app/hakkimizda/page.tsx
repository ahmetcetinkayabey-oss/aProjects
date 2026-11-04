import type { Metadata } from "next";
import { BestSection } from "@/components/best-section";
import { FactsBand } from "@/components/facts-band";
import { IntroSection } from "@/components/intro-section";
import { PageTitle } from "@/components/page-title";
import { StayCta } from "@/components/stay-cta";
import { L } from "@/components/t";

export const metadata: Metadata = { title: "Hakkımızda | Erzurum Yüksek İrtifa Kamp Merkezi", alternates: { canonical: "/hakkimizda" } };

export default function AboutPage() {
  return (
    <main className="w-full bg-surface">
      <PageTitle
        title={<L tr="Hakkımızda" en="About us" />}
        subtitle={<L tr="Merkezimiz hakkında kısaca." en="A brief introduction to our centre." />}
      />
      <IntroSection />
      <FactsBand />
      <BestSection />
      <StayCta />
    </main>
  );
}
