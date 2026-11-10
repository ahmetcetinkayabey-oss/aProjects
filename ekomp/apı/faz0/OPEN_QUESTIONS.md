# OPEN_QUESTIONS

Yüksek etkililer önce. "Öneri" benim varsayımım; onayınız olmadan uygulanmaz.

| # | Soru | Etki | Öneri |
|---|---|---|---|
| Q1 | Tesisin **gerçek hizmet listesi** nedir (konaklama, yemek, saha, fitness, havuz, buz, transfer…)? | Yüksek | Tablo/Excel ile verin; seed buna göre |
| Q2 | Hangi **kaynaklar ve kapasiteler** (oda tipi/sayı, yatak, saha, salon, araç)? Konaklama tek tesis mi, yoksa Snowdora/Polat/Sway gibi **dış oteller** de sistemde mi yönetilecek? | Yüksek | Dış oteller yalnız talep yönlendirme (mevcut), kendi envanter sistemin dışında kalsın |
| Q3 | Mevcut `admin` hesabı yeni `users/roles` sistemine taşınsın mı? | Orta | Faz 1'de taşı, eski tablo bir süre yedek kalsın |
| Q4 | Rezervasyon numarası biçimi: `HIC-2026-000001` onaylı mı? | Düşük | Evet |
| Q5 | Fiyat bilgisi kim girecek, sezonlar/fiyat türleri (kulüp, federasyon…) hangi değerlerle? | Yüksek | Fiyatlar işletmeden; demo veri açıkça işaretli |
| Q6 | KDV oranları, para birimi (yalnız TRY mı, EUR/USD teklif de gerekli mi)? | Orta | TRY + teklifte isteğe bağlı döviz notu |
| Q7 | **İptal/iade politikası** ve bekleyen talebin kapasiteyi **kaç saat/gün** tutacağı? | Yüksek | Politika kartı tanımlanabilir olsun; varsayılan yok |
| Q8 | Mevcut public talep formu geçiş sürecinde ne olsun: eski `reservations`'a yazmaya devam mı, yeni `bookings`'e mi? | Yüksek | İlk dilimde eskiye devam, sonra yönlendir |
| Q9 | Geliştirme ortamında PostgreSQL (Docker/Supabase) kurulabilir mi? Çakışma garantisi için gerekli | Yüksek | Evet, yoksa SQLite'ta yalnız uygulama kilidi (zayıf) |
| Q10 | B2B kurum kaydı: serbest başvuru mu, yalnız yönetimin açtığı hesap mı? | Orta | Başvuru + yönetim onayı |
| Q11 | Hangi belgeler yüklenecek (sözleşme, lisans, pasaport?) ve **KVKK** saklama süresi? Sporcu doğum tarihi/uyruk gerçekten gerekli mi? | Yüksek | Minimum veri; saklama süresi hukuk onayıyla |
| Q12 | E-posta sağlayıcısı: Brevo bilgileri hâlâ girilmedi; SMS/WhatsApp isteniyor mu? | Orta | E-posta + sistem içi; SMS sonraya |
| Q13 | PDF teklif şablonu (logo, adres, banka IBAN, koşullar) | Orta | Kurumsal şablonu siz verin |
| Q14 | Yönetim paneli ve portallarda dil: yalnız TR mi, TR/EN mi? | Orta | TR/EN (B2B yabancı kulüpler için) |
| Q15 | Hosting ve alan adı hesapları (Vercel/Render/Supabase) ve yedekleme sorumlusu | Orta | Faz 9 öncesi netleşsin |
| Q16 | Yayın öncesi bekleyen eski işler: SMTP bilgileri, zayıf admin şifresi (herkese açık indirilebilen forum .docx dosyası 2026-11-10’da silindi) | Yüksek (güvenlik) | Faz 1'den önce temizlensin |
