# SERVICE_RESOURCE_MODEL

**Önemli:** Aşağıdaki hizmet/kaynak adları örnektir. Gerçek envanter ve fiyatlar işletmeden gelmeli (`OPEN_QUESTIONS.md` Q5–Q7). Seed verisi açıkça **DEMO** etiketli olacak.

## Hizmet ≠ Kaynak
Hizmet satılan şey, kaynak onu mümkün kılan kapasitedir. İlişki `service_resource_requirements` ile konfigürasyondan gelir, kodda sabit değildir.

## Rezervasyon modelleri
| Model | Müsaitlik hesabı | Örnek |
|---|---|---|
| DURATION | aralık çakışması (`tstzrange`), hazırlık/temizlik payı dahil | oda, saha, salon |
| TIME_SLOT | tanımlı seans üretilir (60/90/120 dk), her seans ayrı tahsis | fitness, antrenman |
| CAPACITY | zaman penceresinde toplam kişi ≤ kapasite (sayaç) | yemekhane, toplu transfer |
| QUANTITY | adet ≤ stok − o aralıktaki tahsisler | ekipman |

## Müsaitlik algoritması (özet)
1. Hizmetin zorunlu kaynak gereksinimlerini oku (alternatif gruplar dahil).
2. Her gereksinim için aday kaynaklar: aktif ∧ bakımda değil ∧ çalışma takviminde ∧ blokajsız.
3. Aralık = [başlangıç − hazırlık, bitiş + temizlik]; mevcut `CONFIRMED` ve süresi dolmamış `HELD` tahsislerle çakışmayanlar kalır.
4. **Tüm** zorunlu gereksinimler karşılanıyorsa uygun; biri yoksa alternatif kaynak önerilir.
5. Sorgu garanti değildir: onayda aynı kontrol **transaction + kilit + DB kısıtı** altında tekrar edilir.

## Kapasite birimi
Her kaynak türünün `capacity_unit` değeri vardır (kişi, yatak, araç, adet, seans).

## Paket
Paket → `package_services`; rezervasyona eklenince her hizmet **ayrı `booking_item`** olur ve ayrı tahsis alır. Paket fiyatı ile kalemlerin toplamı karşılaştırılıp indirim şeffaf gösterilir.

## Mevcut verilerle bağ
`hotels.ts` içindeki otel/oda bilgisi şimdilik yalnız tanıtım içeriğidir. Oda tipi/sayı gerçek envanterle doğrulanmadan kaynak olarak yüklenmeyecek.
