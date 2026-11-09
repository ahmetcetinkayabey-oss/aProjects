# SYSTEM_ARCHITECTURE — önerilen mimari

## Karar: modüler monolit (mevcut NestJS'in içinde)
Mevcut backend zaten modül başına klasör kullanıyor. Mikroservise gerek yok. Yeni modüller aynı uygulama ve aynı veritabanı içinde, her biri kendi klasöründe, yalnızca servisleri üzerinden birbirine bağımlı olur.

```
frontend (Next.js)
  ├─ public site (mevcut)
  ├─ /hesabim        → B2C portal
  ├─ /kurum          → B2B portal
  └─ /admin          → yönetim (mevcut kabuk genişler)
            │  HTTPS, Bearer token
backend (NestJS, /api)
  identity ─ organizations ─ customers
  catalog (services) ─ resources ─ availability ─ pricing ─ quotations
  reservations (workflow) ─ finance ─ documents ─ notifications ─ reports ─ audit
  [mevcut: facilities, news, feedback, content, forum, admin]
            │
  PostgreSQL (prod) / SQLite (dev)
```

## Bağımlılık yönü
`reservations` → `availability` → `resources`/`catalog`; `reservations` → `pricing` → `quotations`; `finance`, `reservations`'a bağlı (tersi yok). `audit` ve `notifications` olay (event) ile beslenir; iş modülleri onlara doğrudan bağımlı olmaz (Nest `EventEmitter`).

## Temel tasarım kuralları
- **Tek rezervasyon motoru:** B2C, B2B, admin ve manuel giriş aynı `ReservationsService`'i çağırır; `source` alanı kaynağı tutar.
- **Workflow merkezi:** durum geçiş tablosu tek dosyada; geçersiz geçiş `409`; her geçiş `reservation_status_history`'ye yazılır.
- **Yetki:** `AuthGuard` (kimlik) + `PermissionsGuard` (rol izni) + servis içinde **kurum kapsamı** kontrolü. Kurum kapsamı repository katmanında zorunlu filtre olarak uygulanır (`organizationId` olmadan sorgu yok).
- **Eşzamanlılık:** onay anında transaction + `SELECT … FOR UPDATE` (kaynak satırı) + PostgreSQL `EXCLUDE USING gist` ile zaman aralığı çakışma engeli (`btree_gist`). Kapasite (sayı) tabanlı kaynaklarda sayaç satırı kilidi.
- **Fiyat anlık kopyası:** teklif/rezervasyon kalemleri fiyatı kendi satırında saklar.
- **Para:** `numeric(12,2)` (mevcut `decimal.transformer.ts` kullanılabilir), para birimi sütunu (TRY varsayılan).
- **Zaman:** UTC saklanır, `Europe/Istanbul` ile gösterilir.
- **Migration:** TypeORM migration; production'da `synchronize` kapatılır. Her migration geri alma (`down`) içerir.
- **Hata modeli:** `{ statusCode, code, message, details? }`; teknik ayrıntı sunucu logunda.
- **Sayfalama:** `?page&pageSize&sort&q` ortak DTO.

## Kimlik birleştirme önerisi
Yeni `users` tablosu (B2C, B2B, personel) + `roles/permissions`. Mevcut `admin_users` ve `forum_participants` **dokunulmadan** kalır; yönetici girişi ilk fazda çalışmaya devam eder, sonra `users`'a taşınır (açık soru Q3).

## Dağıtım
Aynı: Vercel + Render + Supabase. Yeni gereksinimler: Supabase'de `btree_gist` eklentisi, Storage kovası (belgeler özel kova), zamanlanmış iş (bekleyen blokaj süresi dolması) için Nest `@nestjs/schedule` ya da Render cron.

## Test stratejisi
vitest birim testleri (iş kuralları, workflow, fiyat), PostgreSQL ile entegrasyon testleri (çakışma, izolasyon), mevcut e2e yapılandırması (`vitest.config.e2e.ts`) kullanılır.
