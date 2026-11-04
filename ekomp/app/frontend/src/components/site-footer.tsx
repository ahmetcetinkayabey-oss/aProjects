"use client";

import Link from "next/link";
import { L, T, useL } from "./t";
import { NAV_LINKS } from "@/lib/site";
import { OptImg } from "@/components/opt-img";

/**
 * 1440px ve üzeri masaüstü footer'ı. Ölçüler 1840px'lik tasarım değerlerinden, ekran genişliğine göre
 * (clamp) ölçeklenir; 1440px'te sığar, geniş ekranda tasarım boyutlarına ulaşır. Daha dar ekranlarda
 * aşağıdaki mevcut düzen kullanılır.
 */
function DesktopFooter() {
  const l = useL();
  return (
    <div
      className="relative isolate hidden overflow-hidden bg-[#111417] pt-[clamp(75px,5.2vw,100px)] min-[1440px]:block"
    >
      <OptImg
        src="/images/gallery-mountain-backdrop.jpg"
        alt=""
        aria-hidden
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-bottom"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[rgba(17,20,23,0.97)] via-[rgba(17,20,23,0.90)] via-65% to-[rgba(17,20,23,0.75)]"
      />
      <div className="mx-auto grid max-w-[1840px] grid-cols-[auto_1fr_1.5fr_clamp(220px,15.6vw,300px)] items-center gap-[clamp(24px,1.8vw,35px)] px-[clamp(35px,3.9vw,75px)] pb-[clamp(70px,5.2vw,100px)]">
        {/* LOGO */}
        <div className="flex h-[clamp(150px,10.7vw,205px)] items-center justify-start border-r-2 border-[#e0aa00] pr-[clamp(24px,1.8vw,35px)]">
          <OptImg widths={[256, 384]} sizes="230px"
            src="/logo.jpg"
            alt={l("Erzurum Yüksek İrtifa Kamp Merkezi", "Erzurum High Altitude Camp Centre")}
            className="h-[clamp(120px,8.6vw,165px)] w-[clamp(170px,12vw,230px)] rounded-[17px] bg-white object-contain p-[10px]"
          />
        </div>

        {/* KAMP MERKEZİ AÇIKLAMASI */}
        <div className="pr-[25px]">
          <p className="mb-[22px] font-headline-md text-[clamp(25px,1.78vw,34px)] leading-[1.3] font-bold text-white">
            <L tr="Erzurum Yüksek İrtifa" en="Erzurum High Altitude" />
            <br />
            <L tr="Kamp Merkezi" en="Camp Centre" />
          </p>
          <p className="m-0 text-[clamp(17px,1.1vw,21px)] leading-[1.8] text-[#d0d0d0]">
            <L tr="Palandöken'de 2.100 metrede çok branşlı kamp merkezi." en="A multi-sport camp centre at 2,100 metres in Palandöken." />
          </p>
        </div>

        {/* DESTEKLEYENLER */}
        <div className="flex min-h-[clamp(200px,13.3vw,255px)] flex-col justify-center border-x-2 border-[#e0aa00] px-[clamp(30px,2.6vw,50px)]">
          <h2 className="m-0 mb-[25px] text-[clamp(20px,1.3vw,25px)] font-bold tracking-[0.5px] text-[#f5b400] uppercase">
            <L tr="Destekleyenler" en="Supporters" />
          </h2>
          <div className="flex min-h-[clamp(130px,8.9vw,170px)] w-full items-center justify-center rounded-[18px] bg-white p-5">
            <OptImg widths={[640, 828]} sizes="440px"
              src="/images/partner-logos.png"
              alt={l("Ejder 3200 World Ski Center, Erzurum Büyükşehir Belediyesi ve Palandöken", "Ejder 3200 World Ski Center, Erzurum Metropolitan Municipality and Palandöken")}
              className="h-[clamp(95px,6.5vw,125px)] w-full object-contain"
            />
          </div>
        </div>

        {/* SAYFALAR */}
        <nav aria-label={l("Sayfalar", "Pages")} className="pl-[clamp(24px,1.8vw,35px)]">
          <h2 className="m-0 mb-[25px] text-[clamp(20px,1.3vw,25px)] font-bold tracking-[0.5px] text-[#f5b400] uppercase">
            <L tr="Sayfalar" en="Pages" />
          </h2>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mb-5 block text-[clamp(19px,1.25vw,24px)] text-[#ededed] transition duration-300 ease-out hover:translate-x-[7px] hover:text-[#f5b400]"
            >
              › <T k={link.key} />
            </Link>
          ))}
        </nav>
      </div>

      {/* ALT BÖLÜM */}
      <div className="flex min-h-[100px] items-center justify-between border-t-[3px] border-[#e0aa00] bg-[rgba(10,12,14,0.65)] px-[clamp(35px,3.9vw,75px)] py-[25px]">
        <p className="m-0 text-[clamp(16px,1.04vw,20px)] text-[#c4c4c4]">
          © {new Date().getFullYear()} {l("Erzurum Yüksek İrtifa Kamp Merkezi. Tüm hakları saklıdır.", "Erzurum High Altitude Camp Centre. All rights reserved.")}
        </p>
        <Link href="/gizlilik" className="text-[clamp(16px,1.04vw,20px)] text-[#c4c4c4] underline underline-offset-4 transition-colors hover:text-[#f5b400]">
          {l("Gizlilik ve KVKK", "Privacy & data protection")}
        </Link>
        <div aria-hidden className="text-[clamp(35px,2.5vw,48px)] font-bold tracking-[5px] text-[#f5b400]">
          ⌃⌃⌃
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  const l = useL();
  return (
    <footer className="w-full bg-ink text-white">
      <DesktopFooter />

      {/* 1440px altı: mevcut düzen */}
      <div className="mx-auto max-w-[1400px] px-margin-mobile pt-16 pb-10 md:px-margin min-[1440px]:hidden">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_0.7fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <OptImg widths={[128, 256]} sizes="80px"
                src="/logo.jpg"
                alt={l("Erzurum Yüksek İrtifa Kamp Merkezi", "Erzurum High Altitude Camp Centre")}
                className="h-20 w-auto rounded-lg bg-white object-contain p-1"
              />
              <span className="font-headline-md text-lg leading-tight font-bold">
                <L tr="Erzurum Yüksek İrtifa" en="Erzurum High Altitude" />
                <br />
                <L tr="Kamp Merkezi" en="Camp Centre" />
              </span>
            </div>
            <p className="mt-5 max-w-sm font-body-md text-white/60">
              <L tr="Palandöken'de 2.100 metrede çok branşlı kamp merkezi." en="A multi-sport camp centre at 2,100 metres in Palandöken." />
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-label-caps text-label-caps text-primary-container uppercase">
              <L tr="Sayfalar" en="Pages" />
            </span>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body-md text-white/70 transition-colors hover:text-primary-container"
              >
                <T k={link.key} />
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-label-caps text-label-caps text-primary-container uppercase">
              <L tr="Destekleyenler" en="Supporters" />
            </span>
            <OptImg widths={[640, 828]} sizes="320px"
              src="/images/partner-logos.png"
              alt={l("Ejder 3200 World Ski Center, Erzurum Büyükşehir Belediyesi ve Palandöken", "Ejder 3200 World Ski Center, Erzurum Metropolitan Municipality and Palandöken")}
              className="h-auto w-full max-w-xs rounded-xl bg-white/95 object-contain p-3"
            />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {l("Erzurum Yüksek İrtifa Kamp Merkezi. Tüm hakları saklıdır.", "Erzurum High Altitude Camp Centre. All rights reserved.")}</p>
          <Link href="/gizlilik" className="underline underline-offset-4 transition-colors hover:text-primary-container">
            {l("Gizlilik ve KVKK", "Privacy & data protection")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
