import { NextResponse, type NextRequest } from "next/server";

/**
 * Dil, yalnızca adresten belirlenir: "/en" ile başlayan adresler İngilizce, diğerleri Türkçedir.
 * Sayfa dosyaları tek yerde durur; "/en/x" isteği içeride "/x" sayfasına yönlendirilir (adres çubuğu değişmez)
 * ve sayfaya hangi dilde sunulduğu başlıklarla bildirilir. Çerez ya da tarayıcı diline göre otomatik yönlendirme YOKTUR:
 * arama motorlarının her dil adresini ayrı ve eksiksiz görmesi için.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const plain = isEn ? pathname.slice(3) || "/" : pathname;

  // İstemciden gelen aynı adlı başlıklara güvenilmez; her istekte yeniden yazılır.
  const headers = new Headers(request.headers);
  headers.set("x-locale", isEn ? "en" : "tr");
  headers.set("x-plain-path", plain);

  if (isEn) {
    const url = request.nextUrl.clone();
    url.pathname = plain;
    return NextResponse.rewrite(url, { request: { headers } });
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Yönetim paneli, API, statik dosyalar ve uzantılı adresler (robots.txt, sitemap.xml, görseller) hariç.
  matcher: ["/((?!admin|api|_next|images|.*\\..*).*)"],
};
