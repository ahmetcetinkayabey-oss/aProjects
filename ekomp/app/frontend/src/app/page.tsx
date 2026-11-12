import { FacilitiesShowcase } from "@/components/facilities-showcase";
import { FacilityGallery } from "@/components/facility-gallery";
import { WeatherStrip } from "@/components/weather-strip";
import { ForumSection } from "@/components/forum-section";
import { IntroSection } from "@/components/intro-section";
import { NewsList } from "@/components/news-list";
import { StayCta } from "@/components/stay-cta";
import { getFacilities } from "@/lib/api";

export default async function Home() {
  const facilities = await getFacilities();

  return (
    <main className="w-full bg-surface">
      <WeatherStrip />
      <IntroSection />
      <FacilitiesShowcase facilities={facilities} limit={6} />
      <FacilityGallery />
      <ForumSection />
      <NewsList limit={4} />
      <StayCta />
    </main>
  );
}
