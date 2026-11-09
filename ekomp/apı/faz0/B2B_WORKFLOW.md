# B2B_WORKFLOW

## Kurum ve kullanıcı yaşam döngüsü
1. Kurum başvurur (web formu) **ya da** yönetim kurum kaydı açar → `Organization` (pasif).
2. Yönetim doğrular, tür/çalışma modeli/bayrakları atar → aktif.
3. Kurum yöneticisi davet e-postası alır (tek kullanımlık, süreli bağlantı; mevcut forum e-posta doğrulama kodu örnek alınır) → parola belirler.
4. Kurum yöneticisi alt kullanıcı davet eder, rol ve takım atar.

## Çalışma modelleri
| ReservationMode | Direct bayrağı | Talep bayrağı | Akış |
|---|---|---|---|
| DirectBooking | açık | kapalı | müsaitlik → fiyat → (onay gerekiyorsa AwaitingAdminApproval) → Confirmed |
| RequestBased | kapalı | açık | Submitted → inceleme → teklif → kabul → onay → Confirmed |
| Hybrid | açık | açık | kullanıcı her seferinde birini seçer |

Doğrudan yetki ≠ otomatik kesinleşme: `RequiresAdminApproval` açıksa veya hizmet `requires_approval` ise onay kuyruğuna girer.

## Kurum ayarları (`organizations`)
`reservation_mode, can_create_direct_booking, can_submit_request, requires_admin_approval, can_view_availability, can_view_prices, can_use_contract_prices, can_manage_teams, can_manage_athletes, can_view_invoices, can_view_financial_records`. Yönetim panelinden değişir; backend her istekte kontrol eder.

## Takım ve sporcu
Kurum → N takım; kullanıcı → N takım (yetkiliyse). Excel içe aktarma: şablon indir → yükle → **sunucuda doğrula** (zorunlu alanlar, tekrar: lisans no / ad+doğum tarihi) → ön izleme (geçerli/hatalı satır ve neden) → onay → tek transaction'da aktar (hatalı satır varsa kullanıcı "yalnızca geçerlileri aktar" seçer; sonuç raporlanır). Dosya türü/boyut sınırı, formül/makro reddi.

## İzolasyon testleri (zorunlu)
A kurumu kullanıcısı B kurumunun rezervasyon, sporcu, belge, finans kaydını liste/detay/düzenleme/indirme ile **göremez** (404). Sızıntı testleri otomatik koşar.

## Fiyat
`can_use_contract_prices` açıksa kurum sözleşme/özel fiyat listesi uygulanır; aksi halde standart/kurumsal liste. Fiyat o anki kopya olarak saklanır.
