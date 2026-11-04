# Erzurum Yüksek İrtifa Kamp Merkezi

Erzurum Palandöken'deki Yüksek İrtifa Kamp Merkezi web sitesi. `../reader/stitch_global_y_ksek_i_rtifa_merkezleri/` altındaki örnek tasarım referans alınarak sıfırdan oluşturulmuştur.

## Yapı

- `frontend/` — Next.js 16 (App Router, TypeScript, Tailwind CSS v4). Sayfalar: Ana sayfa (hero, tanıtım, tesis vitrini, galeri, haberler, konaklama CTA'sı), `/hakkimizda`, `/tesisler`, `/haberler`, `/iletisim` (rezervasyon formu).
- `backend/` — NestJS (TypeScript, TypeORM; development'ta SQLite, production'da PostgreSQL). `facilities` ve `reservations` modüllerini içerir; ilk açılışta tesis verilerini otomatik olarak veritabanına seed eder.

Frontend, backend'e ulaşamazsa (örn. backend veya veritabanı henüz ayakta değilse) statik yedek veriyi (`frontend/src/lib/fallback-data.ts`) gösterir; böylece `npm run dev` / `npm run build` backend olmadan da çalışır.

## Gereksinimler

- Node.js 24+ (kuruldu)
- Geliştirmede ekstra kurulum gerekmez: backend varsayılan olarak SQLite kullanır (dosya tabanlı, `backend/data/dev.sqlite`). PostgreSQL yalnızca production'da (`NODE_ENV=production`) gereklidir.

## Backend'i çalıştırma

```bash
cd backend
cp .env.example .env
npm run start:dev
```

- **Development:** `NODE_ENV=development` (veya boş) iken backend otomatik olarak SQLite kullanır, `synchronize: true` ile şemayı kendisi oluşturur ve açılışta örnek verileri seed eder. Ekstra kurulum gerekmez.
- **Production:** `NODE_ENV=production` olduğunda backend PostgreSQL'e geçer; `.env` dosyasındaki `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` değerlerini kendi PostgreSQL bilgilerinize göre doldurun ve şema değişikliklerini migration ile yönetin (`synchronize` production'da kapalıdır).

API `http://localhost:3001/api` altında yayınlanır:

- `GET /api/facilities`
- `POST /api/reservations`

## Frontend'i çalıştırma

```bash
cd frontend
cp .env.local.example .env.local   # gerekirse NEXT_PUBLIC_API_URL değerini güncelleyin
npm run dev
```

Varsayılan olarak `http://localhost:3000` adresinde açılır.

## Notlar

- `synchronize: true` sadece geliştirme ortamı içindir (`NODE_ENV !== 'production'`); üretimde TypeORM migration'larına geçilmelidir.
- Rezervasyon formu gerçek bir `POST /api/reservations` çağrısı yapar; backend/veritabanı ayakta değilse kullanıcıya hata mesajı gösterilir.

## Yönetim paneli

Adres: `http://localhost:3000/admin` (arama motorlarına kapalıdır, sitede link yoktur).

- Giriş bilgileri `backend/.env` içindeki `ADMIN_USERNAME` / `ADMIN_PASSWORD` değerleridir. Hesap yalnızca **ilk açılışta** (admin tablosu boşken) bu değerlerle oluşturulur; sonrasında şifre panelden (Hesap Ayarları) değiştirilir ve `.env`'deki şifre artık kullanılmaz.
- `ADMIN_TOKEN_SECRET` oturum anahtarını imzalar; production'da en az 32 karakterlik benzersiz bir değer verin. Değiştirilirse açık oturumlar kapanır.
- Bölümler: Özet, Rezervasyon Talepleri (durum, not, silme), Tesisler, Haberler, Hesap Ayarları.
- Yüklenen görseller `backend/uploads/` altında saklanır ve `/uploads/...` adresinden servis edilir (git'e girmez, yedeklenmelidir).
- Yönetim API'si `/api/admin/*` altındadır ve `Authorization: Bearer <token>` ister. Herkese açık tek yazma ucu `POST /api/reservations`'tır.

## Yayına alma

Önerilen düzen: **frontend → Vercel**, **backend → Node barındıran bir servis (Render, Railway, VPS vb.)**, **veritabanı → Supabase (PostgreSQL)**.

### 1. Veritabanı (Supabase)
1. Supabase'de proje açın, **Connect → Session pooler (IPv4)** bağlantı adresini kopyalayın. Şifredeki özel karakterleri URL-encode edin.
2. İlk dağıtımda tablolar yoktur: backend'e geçici olarak `DB_SYNCHRONIZE=true` verin, açıldıktan ve tablolar oluştuktan sonra bu değişkeni **kaldırın**. Sonraki şema değişiklikleri için TypeORM migration kullanın.

### 2. Backend
Ortam değişkenleri (`backend/.env.example` dosyasındaki açıklamalara bakın):

| Değişken | Açıklama |
| --- | --- |
| `NODE_ENV=production` | PostgreSQL'e geçer, `synchronize` kapanır |
| `DATABASE_URL` | Supabase bağlantı adresi |
| `CORS_ORIGIN` | Yayındaki frontend adresi (virgülle birden fazla olabilir) |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | İlk yönetici hesabı (sonra panelden şifreyi değiştirin) |
| `ADMIN_TOKEN_SECRET` | En az 32 karakterlik benzersiz rastgele değer |
| `FORUM_PUBLIC_URL` | Frontend'in herkese açık adresi |
| `TRUST_PROXY=1` | Proxy arkasındaysa (hız sınırı gerçek IP'yi görsün) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_FROM` | **Forum 2027 için gereklidir:** kayıt sonrası e-posta doğrulama ve şifre sıfırlama bağlantıları bu ayarla kullanıcıya gönderilir. Tanımlı değilse bağlantılar gönderilemez (yönetici panelinden e-posta elle doğrulanabilir) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_BUCKET` | **Yayında zorunlu:** yönetim panelinden yüklenen görseller Supabase Storage'a yazılır (herkese açık bir `uploads` kovası açın). Boşsa yerel `uploads/` klasörü kullanılır; Render gibi servislerde bu klasör her dağıtımda silinir |
| `NOTIFY_TO` | İsteğe bağlı: yeni kamp talebi geldiğinde bu adrese e-posta bildirimi (SMTP ayarlıysa) |

```bash
cd backend
npm ci
npm run build
npm run start:prod
```

Geliştirmede yüklenen görseller `backend/uploads/` altında saklanır. Yayında Supabase Storage kullanılır (yukarıdaki `SUPABASE_*` değişkenleri).

Sağlık kontrolü: `GET /api/health`. Render için hazır tanım: `render.yaml` (Blueprint olarak içe aktarın; `rootDir: backend`).

### 3. Frontend (Vercel)
- Root Directory: `frontend`
- `NEXT_PUBLIC_API_URL` = `https://<backend-adresiniz>/api` (production build'de zorunludur)
- `NEXT_PUBLIC_SITE_URL` = sitenin gerçek adresi (canonical, `sitemap.xml` ve paylaşım önizlemeleri bunu kullanır)

### 4. Alan adı (DNS)
Alan adı sağlayıcınızın panelinde:
- `www` → **CNAME** → Vercel'in verdiği değer (genelde `cname.vercel-dns.com`); Vercel'de alan adını projeye ekleyin
- Çıplak alan adı → Vercel'in verdiği **A** kaydı, Vercel'de `www`'ye yönlendirme
- `api` → backend sağlayıcısının verdiği kayıt (Render: özel alan adı ekleyip gösterdiği CNAME)
- Türkçe harfli (`ı`, `ş` vb.) alan adı yerine ASCII yazımı kullanın, ör. `erzurumyuksekirtifakampmerkezi.com`
- `CORS_ORIGIN` ve `FORUM_PUBLIC_URL` = `https://www.<alan-adı>`, `NEXT_PUBLIC_API_URL` = `https://api.<alan-adı>/api`

DNS yayılması birkaç dakikadan 24 saate kadar sürebilir.

### 5. Yayın sonrası kontrol listesi
- [ ] Yönetim paneline girip şifreyi değiştirin (Hesap Ayarları)
- [ ] `/sitemap.xml` ve `/robots.txt` doğru adresle açılıyor mu
- [ ] İletişim formundan deneme talebi gönderin; panelde (ve SMTP açıksa e-postada) göründüğünü doğrulayın
- [ ] Veritabanı yedeklemesi açık mı (Supabase otomatik yedekleri; görseller Supabase Storage'da)

## Testler ve kalite kontrol

```bash
cd backend  && npm run lint && npm test && npm run build
cd frontend && npm run lint && npx tsc --noEmit && npm run build
```

Backend birim testleri: oturum belirteci, şifre özeti, giriş kilidi, form doğrulamaları, hız sınırlayıcı ve bildirim servisi.

## Güvenlik notları
- Yönetim girişi 5 hatalı denemeden sonra IP başına 15 dakika kilitlenir.
- Herkese açık formlar (`POST /api/reservations`, `POST /api/feedback`) IP başına saatte 10 gönderimle sınırlıdır; alan uzunlukları sınırlandırılmıştır.
- `.env`, veritabanı dosyası ve `uploads/` git'e girmez.

## Performans ve görseller
- Yerel görseller (`/images/...`) `OptImg` bileşeniyle (`frontend/src/components/opt-img.tsx`) Next görsel optimizasyonundan geçer: ekran boyutuna uygun, küçük WebP üretilir. Yeni bir sayfada `<img>` yerine `<OptImg src="/images/..." sizes="..." />` kullanın; ekranın üstündeki ana görsele `priority` verin.
- **Simgeler:** Tam Material Symbols yazı tipi 3,9 MB'tır; bu yüzden yalnızca `frontend/src/lib/icons.ts` içindeki liste (≈25 KB) yüklenir. Koda veya yönetim paneline yeni bir simge adı eklerseniz önce bu listeye ekleyin, aksi halde simge yerine yazısı görünür. Yönetim panelindeki tesis simgesi alanı bu listeden öneri sunar.
- Lighthouse (yerel, production build): masaüstü performans 94, mobil 76; erişilebilirlik 97–100, en iyi uygulamalar 100, SEO 100.

## Gizlilik / KVKK
`/gizlilik` sayfası, sitenin topladığı verilere göre hazırlanmış taslak bir aydınlatma metnidir (forum kayıt onayı, kamp talebi ve geri bildirim formlarından bağlanır). **Yayından önce hukuk danışmanınızın gözden geçirmesi ve resmî unvan, adres, KEP gibi bilgilerle tamamlanması gerekir.**
