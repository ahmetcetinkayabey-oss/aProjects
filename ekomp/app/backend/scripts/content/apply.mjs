// ADMIN_USERNAME=... ADMIN_PASSWORD=... [API_URL=https://api.alanadi.com/api] node scripts/content/apply.mjs  -> tesis ve haber metinlerini yönetim API'si üzerinden yazar (önce yedek alır).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FACILITIES } from "./facilities.mjs";
import { NEWS } from "./news.mjs";

const API = process.env.API_URL ?? "http://localhost:3001/api";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) throw new Error("ADMIN_USERNAME ve ADMIN_PASSWORD ortam değişkenlerini verin.");
const here = path.dirname(fileURLToPath(import.meta.url));

async function call(method, url, body, token) {
  const res = await fetch(API + url, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status} ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

const { token } = await call("POST", "/admin/login", { username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
const facilities = await call("GET", "/facilities");
const news = await call("GET", "/news");
fs.writeFileSync(path.join(here, "backup-before.json"), JSON.stringify({ facilities, news }, null, 1));
console.log("yedek alındı:", facilities.length, "tesis,", news.length, "haber");

// Tesisler
const extra = {
  "kayak-snowboard": {
    description:
      "Yaklaşık 2.200 metreden 3.176 metreye uzanan rakım farkıyla Palandöken, kayak ve snowboard kampları için kış boyunca antrenman pistleri sunar. Merkez, Erzurum il merkezinin yaklaşık 7 km güneybatısındadır.",
    footerRight: "2.200 – 3.176 m",
  },
};
for (const f of facilities) {
  const c = FACILITIES[f.slug];
  if (!c) { console.log("atlandı (metin yok):", f.slug); continue; }
  await call("PATCH", `/admin/facilities/${f.id}`, { details: c.tr, detailsEn: c.en, ...(extra[f.slug] ?? {}) }, token);
  console.log("tesis güncellendi:", f.slug, c.tr.length, "/", c.en.length, "karakter");
}

// Haberler
for (const n of news) {
  const c = NEWS[n.slug];
  if (!c) { console.log("atlandı (metin yok):", n.slug); continue; }
  const body = { content: c.content, contentEn: c.contentEn, titleEn: c.titleEn, summaryEn: c.summaryEn };
  if (c.summary) body.summary = c.summary;
  await call("PATCH", `/admin/news/${n.id}`, body, token);
  console.log("haber güncellendi:", n.slug);
}
