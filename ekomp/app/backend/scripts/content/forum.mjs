// ADMIN_USERNAME=... ADMIN_PASSWORD=... [API_URL=...] node scripts/content/forum.mjs -> Forum 2027 yönetim alanlarını taslak/örnek kayıtlarla doldurur.
// KURAL (forum belgesi): gerçek kişi, destekçi veya program teyidi UYDURULMAZ. Oturumlar DRAFT durumundadır
// ve sitede görünmez; konuşmacı/destekçi eklenmedi. Yalnızca doğrulanmış bilgi içeren duyuru ve gerçek
// Palandöken fotoğrafları yayındadır.
const API = process.env.API_URL ?? "http://localhost:3001/api";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) throw new Error("ADMIN_USERNAME ve ADMIN_PASSWORD ortam değişkenlerini verin.");

async function call(method, url, body, token) {
  const res = await fetch(API + url, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

const { token } = await call("POST", "/admin/login", { username: ADMIN_USERNAME, password: ADMIN_PASSWORD });

const D1 = "2027-04-16";
const D2 = "2027-04-17";
const NOTE_TR = "Taslak program: saat, salon ve içerik kesinleşmemiştir.";
const NOTE_EN = "Draft programme: time, room and content are not final.";

const sessions = [
  [D1, "09:30", "10:15", "OPENING", "Açılış töreni", "Opening ceremony", "Forumun açılışı, karşılama ve etkinliğin amacının tanıtımı."],
  [D1, "10:15", "11:00", "KEYNOTE", "Açılış konuşması: Yüksek irtifa ve kış turizminin geleceği", "Keynote: The future of high-altitude and winter tourism", "Yüksek irtifa spor turizmi ile kış turizminin birlikte geliştirilmesi."],
  [D1, "11:00", "11:30", "BREAK", "Kahve arası", "Coffee break", "Katılımcılar arası tanışma ve ağ kurma."],
  [D1, "11:30", "12:45", "PANEL", "Panel: Kış turizminde destinasyon yönetimi", "Panel: Destination management in winter tourism", "Kış destinasyonlarının yönetimi, pazarlaması ve sezon uzatma yaklaşımları."],
  [D1, "12:45", "14:00", "BREAK", "Öğle yemeği", "Lunch", "Öğle arası."],
  [D1, "14:00", "15:30", "WORKSHOP", "Çalıştay: Yüksek irtifa sporcu kampı ürünleri", "Workshop: High-altitude athlete camp products", "Kamp paketleri, tesis kullanımı ve tur operatörü iş birliği modelleri."],
  [D1, "15:45", "18:00", "B2B", "B2B görüşmeleri, 1. oturum", "B2B meetings, session 1", "Önceden onaylanan 20 dakikalık birebir görüşmeler."],
  [D2, "09:30", "10:45", "PANEL", "Panel: Tur operatörleri ve spor turizmi", "Panel: Tour operators and sports tourism", "Spor kamplarının turizm ürünleri ile buluşması."],
  [D2, "11:00", "12:00", "TECHNICAL", "Teknik sunum: Kamp tesislerinin planlama ve işletme modeli", "Technical session: Planning and operating model of camp facilities", "Tesis tahsisi, sezon planı ve kafile yönetimi."],
  [D2, "12:00", "13:30", "BREAK", "Öğle yemeği", "Lunch", "Öğle arası."],
  [D2, "13:30", "16:30", "B2B", "B2B görüşmeleri, 2. oturum", "B2B meetings, session 2", "Önceden onaylanan 20 dakikalık birebir görüşmeler."],
  [D2, "16:30", "17:15", "CLOSING", "Kapanış ve değerlendirme", "Closing and review", "Forumun değerlendirmesi ve sonraki adımlar."],
];

const existing = await call("GET", "/admin/forum/sessions", null, token);
const have = new Set((Array.isArray(existing) ? existing : []).map((s) => `${s.day}|${s.startTime}|${s.titleTr}`));
let order = 0;
for (const [day, start, end, type, tr, en, desc] of sessions) {
  order += 10;
  if (have.has(`${day}|${start}|${tr}`)) continue;
  await call("POST", "/admin/forum/sessions", {
    day, startTime: start, endTime: end, type, status: "DRAFT", sortOrder: order,
    titleTr: tr, titleEn: en, descriptionTr: `${desc} ${NOTE_TR}`, descriptionEn: `${NOTE_EN}`,
  }, token);
}
console.log("oturum (taslak) eklendi:", sessions.length);

// Duyurular
const announcements = [
  {
    titleTr: "Palandöken Uluslararası Yüksek İrtifa ve Kış Turizmi Forumu 16–17 Nisan 2027'de",
    titleEn: "Palandöken International High Altitude & Winter Tourism Forum on 16–17 April 2027",
    contentTr: "Forum, 16–17 Nisan 2027 (Cuma–Cumartesi) tarihlerinde Palandöken / Erzurum'da düzenlenecek. Tur operatörleri, spor federasyonları, kayak ve yüksek irtifa merkezi yöneticileri, yatırımcılar ve sektör profesyonelleri bir araya gelecek.",
    contentEn: "The forum will be held in Palandöken / Erzurum on 16–17 April 2027 (Friday–Saturday). Tour operators, sports federations, ski and high-altitude centre managers, investors and industry professionals will meet.",
    publishedAt: "2026-11-10", published: true,
  },
  {
    titleTr: "Başvuru ve katılımcı dizini nasıl çalışır?",
    titleEn: "How do applications and the participant directory work?",
    contentTr: "Katılımcı kayıt formunu doldurduktan sonra e-posta adresinizi doğrulayın. Başvurular organizasyon ekibi tarafından incelenir; onaylanan katılımcılar katılımcı dizininde görünür ve B2B görüşme talebi gönderebilir. [Taslak duyuru: yayınlamadan önce gözden geçirin.]",
    contentEn: "After filling in the registration form, verify your e-mail address. Applications are reviewed by the organising team; approved participants appear in the participant directory and can send B2B meeting requests. [Draft announcement: review before publishing.]",
    publishedAt: "2026-11-10", published: false,
  },
  {
    titleTr: "Program hazırlanıyor",
    titleEn: "The programme is being prepared",
    contentTr: "Oturum başlıkları, konuşmacılar ve salonlar kesinleştikçe program sayfasında yayınlanacaktır. [Taslak duyuru: yayınlamadan önce gözden geçirin.]",
    contentEn: "Session titles, speakers and rooms will be published on the programme page as they are confirmed. [Draft announcement: review before publishing.]",
    publishedAt: "2026-11-10", published: false,
  },
];
const haveAnn = new Set((await call("GET", "/admin/forum/announcements", null, token)).map((a) => a.titleTr));
for (const a of announcements) {
  if (haveAnn.has(a.titleTr)) continue;
  await call("POST", "/admin/forum/announcements", a, token);
}
console.log("duyuru eklendi:", announcements.length);

// Medya: sitenin gerçek Palandöken fotoğrafları (forum etkinliği fotoğrafı DEĞİL; destinasyon görselleri)
const media = [
  ["/images/hero-palandoken.jpg", "Palandöken", "Palandöken", "Palandöken'in dağ ve tesis manzarası.", "Mountain and facility view of Palandöken."],
  ["/images/kayak-merkezi.jpg", "Palandöken Kayak Merkezi", "Palandöken Ski Resort", "Kayak merkezinin pist ve teleferik manzarası.", "Slopes and gondola at the ski resort."],
  ["/images/kayak-pist.jpg", "Kayak pistleri", "Ski slopes", "Palandöken'in kış sporları pistleri.", "Palandöken's winter sports slopes."],
  ["/images/atlama-kuleleri-kiremitlik.jpg", "Kayakla atlama kuleleri", "Ski jumping hills", "Kiremitliktepe kayakla atlama kuleleri.", "Kiremitliktepe ski jumping hills."],
  ["/images/yuzme-havuzu.jpg", "Olimpik yüzme havuzu", "Olympic swimming pool", "Kapalı 50 metrelik olimpik havuz.", "Indoor 50-metre Olympic pool."],
  ["/images/gallery-drone-closeup.jpg", "Kamp merkezi sahaları", "Camp centre pitches", "Yüksek İrtifa Kamp Merkezi'nin doğal çim sahaları.", "Natural-grass pitches of the High Altitude Camp Centre."],
];
const haveMedia = new Set((await call("GET", "/admin/forum/media", null, token)).map((m) => m.url));
let mo = 0;
for (const [url, tr, en, dtr, den] of media) {
  mo += 10;
  if (haveMedia.has(url)) continue;
  await call("POST", "/admin/forum/media", { kind: "GALLERY", url, titleTr: tr, titleEn: en, descriptionTr: dtr, descriptionEn: den, published: true, sortOrder: mo }, token);
}
console.log("medya eklendi:", media.length);
