import type { Metadata } from "next";
import { FacilitiesShowcase } from "@/components/facilities-showcase";
import { FacilityGallery } from "@/components/facility-gallery";
import { PageTitleL } from "@/components/i18n-headings";
import { StayCta } from "@/components/stay-cta";
import { getFacilities } from "@/lib/api";

export const metadata: Metadata = { title: "Tesisler | Erzurum Yüksek İrtifa Kamp Merkezi", alternates: { canonical: "/tesisler" } };

export default async function FacilitiesPage() {
  const facilities = await getFacilities();
  return (
    <main className="w-full bg-surface">
      <PageTitleL
        title={["Tesisler", "Facilities"]}
        subtitle={["Branşlara göre kamp tesislerimiz.", "Our camp facilities by discipline."]}
      />
      <FacilitiesShowcase facilities={facilities} />
      <FacilityGallery />
      <StayCta />
    </main>
  );
}
