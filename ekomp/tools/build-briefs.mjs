// Mevcut, doğrulanmış tesis ve haber metinlerinden Gemini brief'leri üretir (facts = mevcut paragraflar).
import fs from "node:fs";
import { FACILITIES } from "../app/backend/scripts/content/facilities.mjs";
import { NEWS } from "../app/backend/scripts/content/news.mjs";
fs.mkdirSync("briefs", { recursive: true });
const facts = (t) => t.split("\n").filter((l) => l.trim()).map((l) => (l.startsWith("## ") ? "Bölüm başlığı: " + l.slice(3) : l));
let n = 0;
for (const [slug, c] of Object.entries(FACILITIES)) {
  fs.writeFileSync(`briefs/tesis-${slug}.json`, JSON.stringify({ task: `"${slug}" tesisinin site için ayrıntı sayfası metni (ara başlıklı)`, type: "tesis", length: "350-500 kelime", facts: facts(c.tr) }, null, 1)); n++;
}
for (const [slug, c] of Object.entries(NEWS)) {
  fs.writeFileSync(`briefs/haber-${slug}.json`, JSON.stringify({ task: `Haber/yazı: ${c.titleEn} (Türkçe başlığı siz belirleyin)`, type: "haber", length: "300-450 kelime", facts: facts(c.content) }, null, 1)); n++;
}
console.log(n, "brief yazıldı");
