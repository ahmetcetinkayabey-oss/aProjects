import { headers } from "next/headers";
import type { Locale } from "./dictionary";

/** İstek dili: proxy.ts "x-locale" başlığını koyar. Başlık yoksa (yönetim paneli, derleme zamanı) Türkçe. */
export async function getRequestLocale(): Promise<Locale> {
  try {
    return (await headers()).get("x-locale") === "en" ? "en" : "tr";
  } catch {
    return "tr";
  }
}

/** "/en" öneki çıkarılmış istek yolu ("/tesisler/x"); yönetim paneli gibi proxy'nin işlemediği isteklerde null. */
export async function getPlainPath(): Promise<string | null> {
  try {
    return (await headers()).get("x-plain-path");
  } catch {
    return null;
  }
}
