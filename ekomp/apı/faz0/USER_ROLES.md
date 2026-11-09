# USER_ROLES

## Bugünkü durum
- **Yönetici:** tek hesap (`admin_users`), tüm `/api/admin/*` uçlarına tam yetki; rol/izin yok.
- **Forum katılımcısı:** ayrı kayıt/giriş, yalnızca forum uçları.
- Herkese açık: tesis, haber, içerik, form gönderimi.

## Hedef roller
| Rol | Tür | Kapsam | Ana yetkiler |
|---|---|---|---|
| Sistem yöneticisi | Personel | Tümü | Kullanıcı/rol, sistem ayarı, her şey |
| Tesis yöneticisi | Personel | Tümü (finans hariç yazma isteğe bağlı) | Hizmet/kaynak/fiyat, onay |
| Rezervasyon sorumlusu | Personel | Tümü | Talep, teklif, rezervasyon, onay |
| Operasyon personeli | Personel | Tümü | Takvim, kaynak tahsisi, check-in, not |
| Finans sorumlusu | Personel | Tümü | Tahsilat, iade, finans raporu |
| B2B kurum yöneticisi | B2B | Kendi kurumu | Kullanıcı davet, tüm kurum yetkileri |
| B2B rezervasyon yetkilisi | B2B | Kendi kurumu | Talep/doğrudan rezervasyon (kurum ayarına göre) |
| B2B takım yöneticisi | B2B | Atandığı takımlar | Takım/sporcu yönetimi |
| B2B muhasebe yetkilisi | B2B | Kendi kurumu | Fatura/finans görüntüleme |
| Bireysel müşteri | B2C | Yalnızca kendi kayıtları | Talep, takip, iptal talebi |

## Yetki modeli
`izin = kaynak:eylem` (örn. `booking:approve`, `finance:record_payment`). Rol → izin seti; B2B kullanıcısında ek olarak **kurum bayrakları** (`CanCreateDirectBooking`, `CanViewPrices` …) ve **kapsam** (`organization_id`, isteğe bağlı `team_id`) birlikte değerlendirilir. Kural: *izin VAR ∧ kapsam UYGUN ∧ kurum bayrağı AÇIK*.

## Sunucu tarafı zorunlulukları
- Her uç `AuthGuard` + `PermissionsGuard`; kurum kapsamı repository filtresi.
- Başka kurumun kaynağına erişimde `404` döner (varlığı sızdırmamak için `403` yerine).
- Kritik işlemler `audit_logs`'a yazılır.
- Token iptali için `users.token_version` (parola değişince/kullanıcı kapatılınca eski token geçersiz).
