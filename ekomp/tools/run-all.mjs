// Tüm brief'leri sırayla Gemini'ye gönderir; drafts/ altında olanları atlar. Kullanım: node run-all.mjs [önek]
import fs from "node:fs";
import { spawnSync } from "node:child_process";
const prefix = process.argv[2] ?? "";
for (const f of fs.readdirSync("briefs").filter((f) => f.startsWith(prefix) && f.endsWith(".json") && f !== "ornek.json")) {
  if (fs.existsSync("drafts/" + f)) { console.log("var, atlandı:", f); continue; }
  const r = spawnSync("node", ["gemini-write.mjs", "briefs/" + f], { stdio: "inherit" });
  if (r.status !== 0) { console.log("DURDU:", f); process.exit(1); }
}
