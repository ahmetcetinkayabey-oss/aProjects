import type { Metadata } from "next";
import { Montserrat, Raleway } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import { LocaleProvider } from "@/lib/i18n";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-url";
import { ICON_FONT_HREF } from "@/lib/icons";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/hero-palandoken.jpg", alt: "Palandöken'de Yüksek İrtifa Kamp Merkezi" }],
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION, images: ["/images/hero-palandoken.jpg"] },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.jpg`,
  image: `${SITE_URL}/images/hero-palandoken.jpg`,
  address: { "@type": "PostalAddress", addressLocality: "Palandöken, Erzurum", addressCountry: "TR" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${raleway.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href={ICON_FONT_HREF}
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-surface font-body-md text-on-surface selection:bg-primary-container selection:text-on-background">
        <LocaleProvider>
          <SiteChrome>{children}</SiteChrome>
        </LocaleProvider>
      </body>
    </html>
  );
}
