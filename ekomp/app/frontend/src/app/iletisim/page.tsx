import type { Metadata } from "next";
import { PageTitle } from "@/components/page-title";
import { LocationSection } from "@/components/location-section";
import { ReservationCta } from "@/components/reservation-cta";
import { L } from "@/components/t";

export const metadata: Metadata = { title: "İletişim | Erzurum Yüksek İrtifa Kamp Merkezi", alternates: { canonical: "/iletisim" } };

export default function ContactPage() {
  return (
    <main className="w-full bg-surface">
      <PageTitle
        title={<L tr="İletişim" en="Contact" />}
        subtitle={<L tr="Kamp talebinizi aşağıdaki formla iletin." en="Send us your camp request using the form below." />}
      />
      <ReservationCta />
      <LocationSection />
    </main>
  );
}
