# RESERVATION_WORKFLOW

## Mevcut
Public form → `reservations` (PENDING) → yönetici e-postası + talep sahibine otomatik e-posta → panelde PENDING / CONTACTED / CONFIRMED / CANCELLED, not, Excel'e aktarma. Müsaitlik, fiyat, kaynak ve müşteri takibi yok.

## Hedef durum makinesi (master prompt §6.3)
```
Draft → Submitted → UnderReview → QuotationPrepared → AwaitingCustomerApproval
                                 ↘ AwaitingAdminApproval ↗
      → Confirmed → CheckedIn → InProgress → Completed
Submitted/UnderReview/... → Rejected | Expired
Confirmed/CheckedIn → CancellationRequested → Cancelled
```
| Geçiş | Kim | Koşul / yan etki |
|---|---|---|
| Draft→Submitted | müşteri/B2B | doğrulama, müsaitlik ön kontrolü, geçici blokaj (HELD, süresi var) |
| Submitted→UnderReview | personel | atama |
| UnderReview→QuotationPrepared | rezervasyon sorumlusu | teklif versiyonu oluşur |
| QuotationPrepared→AwaitingCustomerApproval | personel | müşteriye e-posta/bildirim |
| AwaitingCustomerApproval→AwaitingAdminApproval | müşteri kabul | kurum/işlem onay gerektiriyorsa |
| …→Confirmed | personel (veya otomatik) | **yeniden müsaitlik kontrolü + transaction içinde tahsis** |
| Confirmed→CheckedIn→InProgress→Completed | operasyon | tarih kuralları |
| *→CancellationRequested→Cancelled | müşteri talep / personel onay | tahsisler serbest, politika uygulanır |
| *→Rejected / Expired | personel / zamanlayıcı | HELD blokajlar serbest |

Her geçiş: kullanıcı, zaman, açıklama → `booking_status_history`. Geçersiz geçiş `409 INVALID_TRANSITION`.

## Ödeme durumu (bağımsız)
Unpaid → PartiallyPaid → Paid; Refunded / PartiallyRefunded. `financial_transactions` toplamından hesaplanır; rezervasyon durumunu değiştirmez.

## Eski taleple uyum
Eski dört durum yeni modele eşlenir: PENDING→Submitted, CONTACTED→UnderReview, CONFIRMED→Confirmed, CANCELLED→Cancelled. Public form geçiş döneminde `reservations`'a yazmaya devam eder (Q8).
