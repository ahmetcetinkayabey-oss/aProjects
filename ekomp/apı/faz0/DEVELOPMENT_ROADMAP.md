# DEVELOPMENT_ROADMAP

Her faz: inceleme → plan → küçük adımlar → migration + test → çalışır doğrulama → teslim raporu. Aşağıdaki sıra master prompt §23'e dayanır; Faz 1 öncesinde **iki ön koşul** eklenir.

| Faz | İçerik | Bağımlılık / not |
|---|---|---|
| 0 | Analiz (bu belgeler) | **Tamamlandı, onay bekliyor** |
| 1-ön | Migration altyapısı (TypeORM migrations, `synchronize` prod'da kapalı), PostgreSQL test ortamı | Zorunlu; veri güvenliği |
| 1 | Foundation: `users`, roller/izinler, `organizations`, `customers`, `locations`, `seasons`, audit log, ortak guard/DTO | Mevcut admin girişi çalışmaya devam eder |
| 2 | Hizmet kategorileri/kartları, kaynak türleri/kartları, gereksinimler, takvim, blokaj + admin ekranları | Gerçek envanter gerekir (Q5) |
| 3 | Müsaitlik + rezervasyon motoru, workflow, numara üretimi, çakışma/eşzamanlılık testleri, B2C akışı | Public form ile birlikte yaşar |
| 4 | B2B portal: kurum/kullanıcı davet, takım, sporcu, Excel içe aktarma, hibrit yetkiler, izolasyon testleri | |
| 5 | Fiyat listeleri, paket, teklif + versiyon + PDF | Fiyatlar işletmeden (Q6) |
| 6 | Yönetim paneli: dashboard (gerçek sorgular), rezervasyon/kaynak takvimi, operasyon | Mevcut `/admin` kabuğu genişler |
| 7 | Finans: manuel tahsilat, ön ödeme, bakiye, iade, ters kayıt | Online ödeme yok |
| 8 | Sistem içi bildirim, e-posta olayları, belge yönetimi, Excel/PDF rapor | Belgeler Supabase Storage (özel) |
| 9 | Güvenlik/yetki/izolasyon/çakışma/performans testleri, yedek-geri yükleme, canlıya geçiş listesi | |

## Önerilen ilk dilim (Faz 1 sonrası hızlı değer)
Faz 1 → Faz 2'nin yalnız hizmet/kaynak yönetimi → Faz 3'ün B2C talep + yönetici onayı. Böylece mevcut talep formu "gerçek rezervasyona" evrilir, B2B daha sonra eklenir.

## Tahmini büyüklük (kaba, kesin değil)
Faz 1–3 çekirdek ve en riskli kısım; Faz 4–8 daha öngörülebilir. Süre tahmini vermiyorum: kapsam kararları (Q1–Q10) netleşmeden güvenilir olmaz.
