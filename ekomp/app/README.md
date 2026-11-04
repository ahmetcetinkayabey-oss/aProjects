# Erzurum Yüksek İrtifa Kamp Merkezi

Erzurum Palandöken'deki Yüksek İrtifa Kamp Merkezi web sitesi. `../reader/stitch_global_y_ksek_i_rtifa_merkezleri/` altındaki örnek tasarım referans alınarak sıfırdan oluşturulmuştur.

## Yapı

- `frontend/` — Next.js 16 (App Router, TypeScript, Tailwind CSS v4). Ana sayfa, örnek tasarımdaki bölümleri (hero, karşılaştırma matrisi, dijital skor tablosu, tesisler vitrini, irtifa hesaplayıcı, rezervasyon formu) barındırır.
- `backend/` — NestJS (TypeScript, TypeORM, PostgreSQL). `facilities`, `benchmark` ve `reservations` modüllerini içerir; ilk açılışta karşılaştırma/tesis verilerini otomatik olarak veritabanına seed eder.

Frontend, backend'e ulaşamazsa (örn. backend veya veritabanı henüz ayakta değilse) tasarımdaki içerikle aynı statik yedek veriyi (`frontend/src/lib/fallback-data.ts`) gösterir; böylece `npm run dev` / `npm run build` backend olmadan da çalışır.

## Gereksinimler

- Node.js 24+ (kuruldu)
- PostgreSQL (bu ortamda **henüz kurulmadı** — backend kodu hazır, veritabanına bağlanmak için aşağıdaki adımları izleyin)

## Backend'i çalıştırma

```bash
cd backend
cp .env.example .env   # DB_* değerlerini kendi PostgreSQL bilgilerinize göre düzenleyin
npm run start:dev
```

API `http://localhost:3001/api` altında yayınlanır:

- `GET /api/facilities`
- `GET /api/benchmark/centers`
- `GET /api/benchmark/digital-scores`
- `POST /api/reservations`
- `GET /api/reservations`

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
