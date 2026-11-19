// Kullanım: node gemini-write.mjs briefs/ornek.json   -> drafts/<ad>.json
// Gemini yalnızca brief içindeki "facts" listesinden yazar; listede olmayan bilgi eklemez.
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI, Type } from "@google/genai";

const file = process.argv[2];
if (!file) throw new Error("Brief dosyası verin: node gemini-write.mjs briefs/ornek.json");
if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY yok (tools/.env dosyasına yazın).");
const brief = JSON.parse(fs.readFileSync(file, "utf8"));
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = process.env.GEMINI_MODEL ?? "gemini-2.5-pro";

const system = `Sen Erzurum Yüksek İrtifa Kamp Merkezi web sitesi için Türkçe ve İngilizce metin yazan bir editörsün.
KESİN KURALLAR:
- Yalnızca "FACTS" listesindeki bilgileri kullan. Listede olmayan sayı, tarih, isim, fiyat, ödül, rakım, kapasite, iletişim bilgisi veya iddia ASLA ekleme.
- Bilgi yetersizse uydurma; "needsInput" alanına eksik bilgiyi yaz.
- Abartılı reklam dili, "en iyi", "dünyanın bir numarası" gibi kanıtsız üstünlükler yok. Sade, güvenilir, kurumsal ton.
- Türkçede doğru imla ve Türkçe karakterler (ç ğ ı ö ş ü, â/î gerekirse).
- Uzun metinde ara başlık için satır başında "## " kullan.
- İngilizce metin Türkçenin çevirisi olsun, farklı bilgi içermesin.`;

const schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING }, titleEn: { type: Type.STRING },
    summary: { type: Type.STRING }, summaryEn: { type: Type.STRING },
    content: { type: Type.STRING }, contentEn: { type: Type.STRING },
    needsInput: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["title", "titleEn", "summary", "summaryEn", "content", "contentEn", "needsInput"],
};

const prompt = `GÖREV: ${brief.task}
TÜR: ${brief.type ?? "haber"}
TON: ${brief.tone ?? "sade, güvenilir, kurumsal"}
UZUNLUK: ${brief.length ?? "300-450 kelime"}
FACTS:
${brief.facts.map((f) => "- " + f).join("\n")}`;

const res = await ai.models.generateContent({
  model, contents: prompt,
  config: { systemInstruction: system, responseMimeType: "application/json", responseSchema: schema, temperature: 0.4 },
});
const out = JSON.parse(res.text);
const name = path.basename(file, ".json");
fs.writeFileSync(path.join("drafts", name + ".json"), JSON.stringify({ brief: { task: brief.task, type: brief.type }, model, ...out }, null, 2));
console.log("taslak yazıldı: drafts/" + name + ".json");
if (out.needsInput.length) console.log("Gemini'nin istediği ek bilgi:\n- " + out.needsInput.join("\n- "));
