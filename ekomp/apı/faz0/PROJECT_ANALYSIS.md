# PROJECT_ANALYSIS — Faz 0 (mevcut durum)

Tarih: 2026-11-09 · Dal: `feature/palandoken-forum-2027` · Kapsam: yalnızca analiz, kod değişmedi.

## 1. Çalıştırma
| Parça | Konum | Komut | Port |
|---|---|---|---|
| Frontend | `ekomp/app/frontend` | `npm run build` + `npx next start -p 3000` (geliştirme: `npm run dev`) | 3000 |
| Backend | `ekomp/app/backend` | `npm run start` / `start:dev` (test: `npm test` = vitest) | 3001, önek `/api` |
| Veritabanı (dev) | `backend/data/dev.sqlite` | `synchronize: true` ile otomatik şema | — |
| Veritabanı (prod) | Supabase PostgreSQL | `NODE_ENV=production`, `DATABASE_URL`, ilk kurulumda `DB_SYNCHRONIZE=true` | — |
| Yayın planı | Vercel (frontend) + Render (backend, `render.yaml`) + Supabase | henüz yayında değil | — |

## 2. Teknoloji
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind v4 (token'lar `globals.css @theme`), TR/EN çift dil (`i18n.tsx`, `dictionary.ts`), CMS metinleri (`content-registry.ts`), simge alt kümesi (`icons.ts`).
- **Backend:** NestJS 12, TypeORM 1.x, class-validator (`ValidationPipe whitelist`), nodemailer, vitest. ESM (`type: module`).
- **Kimlik:** Kendi yazılmış HMAC imzalı token (12 sa) + scrypt parola özeti (`admin-token.ts`). Tek yönetici tablosu (`admin_users`), ayrı forum katılımcı girişi.
- **Güvenlik:** bellek içi IP hız sınırı (`rate-limit.guard.ts`), nosniff/referrer başlıkları, CORS beyaz liste, SMTP anahtarı AES-256-GCM ile şifreli.

## 3. Mevcut modüller (backend)
| Modül | Tablolar | İşlev |
|---|---|---|
| facilities | `facilities` | Tesis vitrini (seed'li, TR/EN) |
| news | `news` | Haberler |
| reservations | `reservations` | **Tek düzlem kamp talebi formu** (kurum adı, kişi, e-posta, branş, kafile, tarih aralığı, mesaj; durum PENDING/CONTACTED/CONFIRMED/CANCELLED; yönetici notu) |
| feedback | `feedback` | Geri bildirim/şikâyet |
| content | `site_content` | Düzenlenebilir sayfa metinleri |
| notifications | `app_settings` | SMTP ayarları, yönetici ve talep sahibi e-postası |
| forum | `forum_participants/tokens/speakers/sessions/media/announcements/sponsors` | Forum 2027 kayıt, program, konuşmacı, medya |
| admin | `admin_users` | Giriş, şifre, panel uçları |

## 4. Mevcut ekranlar
Genel site: ana sayfa, hakkımızda, tesisler (+12 detay), haberler, forum (program, kayıt…), rezervasyon merkezi (`/rezervasyon`, otel detayları `/rezervasyon/oteller/[slug]`; veriler `hotels.ts`'te **kod içinde sabit**), gizlilik.
Yönetim: `/admin` (özet, rezervasyon talepleri, geri bildirim, sayfa içerikleri, tesisler, haberler, ayarlar).

## 5. Ana bulgu — boşluk analizi
Master prompt'taki platform (kaynak/kapasite, müsaitlik, fiyat, teklif, B2B portal, finans…) **bugün yok**. Mevcut `reservations` tablosu bir *talep formu*; rezervasyon motoru değil. Bu iyi bir başlangıç noktasıdır: yeni modüller mevcut tabloya dokunmadan **yanına** eklenebilir.

| Master prompt modülü | Mevcut durum | Boşluk |
|---|---|---|
| Public site | Var, korunacak | Yok |
| B2C / kurumsal rezervasyon | Yalnızca talep formu | Müşteri hesabı, durum takibi, hizmet kalemleri |
| B2B portal | Yok | Kurum, kullanıcı, takım, sporcu, yetkiler |
| Hizmet / kaynak / müsaitlik | Yok (oteller `hotels.ts`'te statik) | Tüm model |
| Fiyat / paket / teklif | Yok (fiyat gösterilmiyor) | Tüm model |
| Finans | Yok | Tüm model |
| Bildirim | SMTP + 2 e-posta var | Sistem içi bildirim, olay tabanı |
| Rapor | Excel dışa aktarma (talepler) | Raporlar |
| RBAC | Tek admin, ayrı forum kullanıcısı | Rol/izin, kurum kapsamı |
| Audit log | Yok | Tüm model |

## 6. Mimari riskler (özet; ayrıntı `SYSTEM_ARCHITECTURE.md`)
1. **Migration yok.** Production `synchronize`'a dayanıyor; rezervasyon/finans verisi için TypeORM migration şart.
2. **Tek admin hesabı, rol yok.** `AdminGuard` token'daki kullanıcı adına bakar; izin kontrolü yok.
3. **Kimlik iki ayrı sistemde** (admin, forum katılımcısı). B2C/B2B için üçüncü bir kullanıcı tipi eklemek yerine birleşik `users` gerekir.
4. **Hız sınırı bellek içi**: Render'da çok örnekte/yeniden başlatmada sıfırlanır.
5. **Oturum token'ı iptal edilemiyor** (durumsuz HMAC); B2B'de kullanıcı devre dışı bırakma için sunucu tarafı kontrol gerekir.
6. **Dosya depolama:** yüklemeler Render diskinde → yayında Supabase Storage zorunlu; belge yönetimi için erişim denetimi (imzalı URL) gerekecek.
7. **Eşzamanlılık:** SQLite (dev) ile PostgreSQL (prod) farklı davranır; çakışma önleme (exclusion constraint) yalnızca PostgreSQL'de var → çakışma testleri PostgreSQL'de koşmalı.
8. **Küçük kusur:** `admin.guard.ts` içinde `request.adminUser = payload.sub;` iki kez yazılı (zararsız).
9. **Mevcut `reservations` adı** yeni "Reservation" varlığıyla çakışır → mevcut tablo `camp_requests` anlamına gelecek şekilde ele alınmalı (bkz. `DATABASE_DESIGN.md`).

## 7. Korunacaklar
Logo, renkler (lacivert + şampanya altını), tipografi, mevcut sayfalar, TR/EN altyapısı, CMS, forum modülü, panel kabuğu (`app/admin/layout.tsx`).
