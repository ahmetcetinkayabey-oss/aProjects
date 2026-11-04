import { AltitudeCalculator } from "@/components/altitude-calculator";
import { BenchmarkMatrix } from "@/components/benchmark-matrix";
import { BiometricTicker } from "@/components/biometric-ticker";
import { DigitalScoreboard } from "@/components/digital-scoreboard";
import { FacilitiesShowcase } from "@/components/facilities-showcase";
import { HeroSection } from "@/components/hero-section";
import { ReservationCta } from "@/components/reservation-cta";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getBenchmarkCenters, getDigitalScores, getFacilities } from "@/lib/api";

export default async function Home() {
  const [facilities, benchmarkCenters, digitalScores] = await Promise.all([
    getFacilities(),
    getBenchmarkCenters(),
    getDigitalScores(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-80px)] w-full bg-surface pt-20">
        <div className="flex w-full flex-col">
          <HeroSection />
          <BiometricTicker />
          <BenchmarkMatrix centers={benchmarkCenters} />
          <DigitalScoreboard scores={digitalScores} />
          <FacilitiesShowcase facilities={facilities} />
          <AltitudeCalculator />
          <ReservationCta />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
