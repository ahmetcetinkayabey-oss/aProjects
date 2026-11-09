# API_DESIGN

## A. Gerçekte var olan uçlar (`/api` önekli, kodda doğrulandı)
**Herkese açık:** `GET /health`, `GET /facilities`, `GET /news`, `GET /content`, `POST /reservations` (hız sınırlı), `POST /feedback`, `GET /forum/{program,speakers,media,announcements,sponsors,organizations}`, `POST /forum/auth/{register,verify-email,login,forgot-password,reset-password}`; katılımcı oturumlu: `GET|PATCH /forum/me`, `GET /forum/directory`.
**Yönetici (Bearer, `AdminGuard`):** `POST /admin/login`, `POST /admin/password`, `GET /admin/{me,stats}`, `GET|PATCH|DELETE /admin/reservations[/:id]`, `GET|PATCH|DELETE /admin/feedback[/:id]`, mail ayarları (`mail-status`, `mail-settings`, `mail-test`), `content` (liste/PUT/DELETE), haber/tesis yönetimi, `admin/forum/*` (stats, participants, sessions, speakers, media, announcements, sponsors).

## B. Planlanan uçlar (henüz YOK — varmış gibi sunulmaz)
Kaynak grupları master prompt §21 ile aynı: `/auth`, `/customers`, `/organizations`, `/teams`, `/athletes`, `/reservations` (yeni motor, mevcut public `POST /reservations` ile **çakışmamak için** yeni uçlar `/bookings` altında), `/availability`, `/services`, `/resources`, `/pricing`, `/quotations`, `/contracts`, `/finance`, `/documents`, `/notifications`, `/reports`.

## Ortak kurallar
- Doğrulama: class-validator DTO (`whitelist`, mevcut kalıp).
- Hata: `{statusCode, code, message, details?}`.
- Liste: `page, pageSize (≤100), sort, q` + modül filtreleri; yanıt `{items, total, page, pageSize}`.
- Yetki: her uçta `@RequirePermission('kaynak:eylem')`; B2B uçlarında kurum kapsamı zorunlu.
- Idempotency: rezervasyon oluşturma/tahsilat uçları `Idempotency-Key` başlığını destekler.
- Günlük: istek kimliği + kullanıcı; hassas alanlar maskelenir.

## Uyumluluk notu
Frontend `lib/api.ts`/`admin-api.ts` mevcut uçlara bağlı; bunlar değiştirilmeyecek, yenileri eklenecek.
