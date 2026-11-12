import { NextResponse, type NextRequest } from "next/server";
import { buildCsp } from "@/lib/csp";

/**
 * 1) Dil, yalnızca adresten belirlenir: "/en" ile başlayan adresler İngilizce, diğerleri Türkçedir.
 *    Sayfa dosyaları tek yerde durur; "/en/x" isteği içeride "/x" sayfasına yönlendirilir (adres çubuğu değişmez)
 *    ve sayfaya hangi dilde sunulduğu başlıklarla bildirilir. Çerez ya da tarayıcı diline göre otomatik yönlendirme YOKTUR:
 *    arama motorlarının her dil adresini ayrı ve eksiksiz görmesi için.
 * 2) Her yanıta, o isteğe özgü nonce'lu İçerik Güvenlik Politikası (CSP) eklenir (yönetim paneli dahil).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isEn = !isAdmin && (pathname === "/en" || pathname.startsWith("/en/"));
  const plain = isEn ? pathname.slice(3) || "/" : pathname;

  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce);

  // İstemciden gelen aynı adlı başlıklara güvenilmez; her istekte yeniden yazılır (admin'de dil başlıkları hiç konmaz).
  const headers = new Headers(request.headers);
  headers.delete("x-locale");
  headers.delete("x-plain-path");
  headers.set("x-nonce", nonce);
  headers.set("content-security-policy", csp);
  if (!isAdmin) {
    headers.set("x-locale", isEn ? "en" : "tr");
    headers.set("x-plain-path", plain);
  }

  let response: NextResponse;
  if (isEn) {
    const url = request.nextUrl.clone();
    url.pathname = plain;
    response = NextResponse.rewrite(url, { request: { headers } });
  } else {
    response = NextResponse.next({ request: { headers } });
  }
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // API, statik dosyalar ve uzantılı adresler (robots.txt, sitemap.xml, görseller) hariç.
  matcher: ["/((?!api|_next|images|.*\\..*).*)"],
};
