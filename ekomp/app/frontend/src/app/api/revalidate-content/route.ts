import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api";

/**
 * Yönetim paneli metin kaydedince çağrılır: site önbelleğini hemen yeniler.
 * Yalnızca geçerli bir yönetici oturum anahtarıyla çalışır (backend /admin/me ile doğrulanır).
 */
export async function POST(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  let ok = false;
  try {
    const res = await fetch(`${API_URL}/admin/me`, { headers: { Authorization: auth }, cache: "no-store" });
    ok = res.ok;
  } catch {
    ok = false;
  }
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });
  revalidateTag("content", { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
