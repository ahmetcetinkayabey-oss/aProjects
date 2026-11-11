# İçerik betikleri

Tesis ayrıntı metinleri, haber metinleri ve Forum 2027 taslak kayıtlarını yönetim API'si üzerinden yazar.
Çalışan veritabanına (yerel ya da canlı) yönetici hesabıyla bağlanır; şifre koda yazılmaz.

```
ADMIN_USERNAME=admin ADMIN_PASSWORD=*** API_URL=https://api.alanadi.com/api node scripts/content/apply.mjs
ADMIN_USERNAME=admin ADMIN_PASSWORD=*** API_URL=https://api.alanadi.com/api node scripts/content/forum.mjs
```

- `apply.mjs`: önce mevcut tesis ve haberlerin yedeğini `backup-before.json` olarak alır (git'e girmez), sonra yazar.
- `forum.mjs`: tekrar çalıştırılırsa aynı kayıtları çoğaltmaz. Oturumlar TASLAK durumundadır; konuşmacı ve destekçi eklemez.
- Metinler Vikipedi, FISU, Anadolu Ajansı/Habertürk ve sitenin mevcut tesis verisine dayanır. Doğrulanamayan sayı yazılmamıştır;
  kapasite ve işletme durumu için tesisle teyit edin.
