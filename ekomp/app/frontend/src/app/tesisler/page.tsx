import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import { FacilitiesShowcase } from "@/components/facilities-showcase";
import { FacilityGallery } from "@/components/facility-gallery";
import { PageTitleL } from "@/components/i18n-headings";
import { StayCta } from "@/components/stay-cta";
import { getFacilities } from "@/lib/api";

export const generateMetadata = (): Promise<Metadata> =>
  pageMeta(
    {
      title: "Tesisler",
      description: "Olimpik kapalı yüzme havuzu, FIFA standardında futbol sahaları, curling ve buz salonları, atletizm pisti, judo ve güreş salonları, kayak ve kayakla atlama tesisleri: Palandöken'de 2.000 m rakımda tek merkez.",
    },
    {
      title: "Facilities",
      description: "An Olympic indoor swimming pool, FIFA-standard football pitches, curling and ice halls, an athletics track, judo and wrestling halls, ski and ski-jumping facilities: one centre at 2,000 m in Palandöken.",
    },
  );

export default async function FacilitiesPage() {
  const facilities = await getFacilities();
  return (
    <main className="w-full bg-surface">
      <PageTitleL
        title={["Tesisler", "Facilities"]}
        subtitle="facilities.page.subtitle"
      />
      <FacilitiesShowcase facilities={facilities} />
      <FacilityGallery />
      <StayCta />
    </main>
  );
}
