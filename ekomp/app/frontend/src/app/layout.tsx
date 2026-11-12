import type { Metadata } from "next";
import { Montserrat, Raleway } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import { getContent } from "@/lib/api";
import { LocaleProvider } from "@/lib/i18n";
import { getPlainPath, getRequestLocale } from "@/lib/server-locale";
import { SITE_DESCRIPTION, SITE_DESCRIPTION_EN, SITE_NAME, SITE_NAME_EN, SITE_URL, localizedUrls } from "@/lib/site-url";
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

export async function generateMetadata(): Promise<Metadata> {
  const en = (await getRequestLocale()) === "en";
  const name = en ? SITE_NAME_EN : SITE_NAME;
  const description = en ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION;
  const imageAlt = en ? "Erzurum High Altitude Camp Centre in Palandöken" : "Palandöken'de Yüksek İrtifa Kamp Merkezi";
  return {
    metadataBase: new URL(SITE_URL),
    title: name,
    description,
    openGraph: {
      type: "website",
      locale: en ? "en_US" : "tr_TR",
      alternateLocale: en ? ["tr_TR"] : ["en_US"],
      siteName: name,
      title: name,
      description,
      images: [{ url: "/images/hero-palandoken.jpg", alt: imageAlt }],
    },
    twitter: { card: "summary_large_image", title: name, description, images: ["/images/hero-palandoken.jpg"] },
  };
}

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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [content, locale, plainPath] = await Promise.all([getContent(), getRequestLocale(), getPlainPath()]);
  const urls = plainPath ? localizedUrls(plainPath) : null;
  return (
    <html
      lang={locale}
      className={`${raleway.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        {urls ? (
          <>
            <link rel="canonical" href={locale === "en" ? urls.en : urls.tr} />
            <link rel="alternate" hrefLang="tr" href={urls.tr} />
            <link rel="alternate" hrefLang="en" href={urls.en} />
            <link rel="alternate" hrefLang="x-default" href={urls.tr} />
          </>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
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
        <LocaleProvider content={content} initialLocale={locale}>
          <SiteChrome>{children}</SiteChrome>
        </LocaleProvider>
      </body>
    </html>
  );
}
