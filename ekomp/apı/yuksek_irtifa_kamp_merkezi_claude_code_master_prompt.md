# YÜKSEK İRTİFA KAMP MERKEZİ

# REZERVASYON, B2B VE YÖNETİM PLATFORMU

## Claude Code --- Vibe Coding Master Prompt

> **Proje amacı:** Mevcut Yüksek İrtifa Kamp Merkezi web sitesini
> koruyarak; bireysel ve kurumsal rezervasyon, hibrit B2B iş ortaklığı,
> tüm tesis hizmetlerinin rezervasyonu, kaynak/kapasite yönetimi, teklif
> ve finansal takip özelliklerine sahip bütünleşik bir platform
> geliştirmek.

------------------------------------------------------------------------

# 1. KESİNLEŞMİŞ İŞLETME KARARLARI

Bu kararları proje boyunca esas al. İşletme açıkça değiştirmedikçe
farklı varsayımda bulunma.

1.  **Rezervasyon kullanıcıları:** Hem bireysel kullanıcılar hem de
    takımlar, kulüpler, federasyonlar ve diğer kurumlar.
2.  **B2B çalışma modeli:** Hibrit. Yetkili kurumlar doğrudan
    rezervasyon oluşturabilir; diğer kurumlar rezervasyon talebi
    gönderir. Kurum ve işlem bazında yönetici onayı zorunlu tutulabilir.
3.  **Ödeme:** İlk sürümde online ödeme entegrasyonu yoktur. Sistem
    teklif, rezervasyon tutarı, manuel tahsilat, ön ödeme ve bakiye
    takibini destekler. Online ödeme daha sonraki fazda eklenebilir.
4.  **Hizmet kapsamı:** Tesisin sunduğu bütün hizmetler rezervasyon
    sistemine dahil olacaktır. Sistem yalnızca konaklama rezervasyonu
    olarak tasarlanmayacaktır.
5.  **Mevcut web sitesi:** Hazırdır. Yeniden yazılmayacak; mevcut
    tasarım, sayfalar ve teknoloji korunarak yeni modüller entegre
    edilecektir.

# 2. ÇALIŞMA ŞEKLİ VE VIBE CODING KURALLARI

Kıdemli yazılım mimarı, full-stack geliştirici, ürün tasarımcısı ve test
mühendisi gibi hareket et.

-   İlk iş olarak mevcut proje klasörünü, kaynak kodları, veritabanını,
    kullanılan teknolojileri ve çalışma talimatlarını incele.
-   Mevcut teknolojileri tespit etmeden yeni framework, veritabanı veya
    mimari dayatma.
-   Mevcut çalışan siteyi bozma ve gereksiz yeniden yazımdan kaçın.
-   Önce analiz et, sonra planla, ardından küçük ve doğrulanabilir
    adımlarla geliştir.
-   Her adımda çalışan uygulamayı mümkün olduğunca çalışır durumda tut.
-   Büyük değişiklikleri küçük görevlere böl.
-   İşletme tarafından belirtilmeyen hizmetleri, fiyatları, kapasite
    değerlerini veya tesis özelliklerini gerçek bilgi gibi varsayma.
-   Örnek verileri açıkça demo/test verisi olarak işaretle.
-   Gerçek entegrasyon bilgileri yoksa sahte entegrasyon varmış gibi
    gösterme.
-   Güvenlik ve yetkilendirmeyi yalnızca arayüzde değil sunucu tarafında
    da uygula.
-   Hata durumlarını kullanıcıya anlaşılır biçimde göster; teknik
    ayrıntıları logla.
-   Test, migration ve geri alma stratejisi olmadan kritik veritabanı
    değişiklikleri yapma.
-   Tamamlanmayan özellikleri tamamlanmış gibi raporlama.

## İlk analiz teslimatları

İlk aşamada uygulama kodunu değiştirmeden aşağıdaki belgeleri oluştur:

-   `PROJECT_ANALYSIS.md`
-   `SYSTEM_ARCHITECTURE.md`
-   `DATABASE_DESIGN.md`
-   `USER_ROLES.md`
-   `RESERVATION_WORKFLOW.md`
-   `B2B_WORKFLOW.md`
-   `SERVICE_RESOURCE_MODEL.md`
-   `DEVELOPMENT_ROADMAP.md`
-   `API_DESIGN.md`
-   `OPEN_QUESTIONS.md`

Belgeleri mevcut projeye göre hazırla. Bilinmeyenleri
`OPEN_QUESTIONS.md` içinde listele. Analiz tamamlandığında bulguları ve
önerilen geliştirme sırasını özetle; belirsiz ve yüksek etkili kararları
uygulamadan önce sor.

------------------------------------------------------------------------

# 3. ÜRÜN VE MODÜL MİMARİSİ

Sistem aşağıdaki modülleri kapsar:

1.  Mevcut Public Website entegrasyonu
2.  Bireysel rezervasyon (B2C)
3.  Kurumsal rezervasyon
4.  B2B iş ortağı portalı
5.  Merkezi rezervasyon motoru
6.  Hizmet yönetimi
7.  Kaynak ve kapasite yönetimi
8.  Müsaitlik motoru
9.  Fiyatlandırma ve teklif yönetimi
10. Takım ve sporcu yönetimi
11. Müşteri ve kurum yönetimi
12. Sözleşme ve belge yönetimi
13. Finansal takip
14. Yönetim ve operasyon paneli
15. Bildirim ve mesajlaşma
16. Raporlama ve analiz
17. Kullanıcı, rol ve yetki yönetimi
18. Audit log ve sistem ayarları

Bireysel portal, B2B portalı ve yönetim paneli farklı kullanıcı
deneyimlerine sahip olabilir; ancak rezervasyon, hizmet, kaynak,
müsaitlik ve fiyatlandırma kuralları ortak servisler üzerinden
çalışmalıdır.

## Önerilen mantıksal mimari

``` text
MEVCUT WEB SİTESİ
    |
    +-- Bireysel Rezervasyon Portalı (B2C)
    |
    +-- B2B İş Ortağı Portalı
    |
    +-- Yönetim ve Operasyon Paneli
             |
             v
      UYGULAMA / API KATMANI
             |
    +--------+---------+------------------+
    |        |         |                  |
    v        v         v                  v
Reservation Service  Service Catalog  Customer/Org  Identity/RBAC
    |                  |
    v                  v
Availability Engine  Resource Engine
    |                  |
    +--------+---------+
             |
        Pricing Engine
             |
       Quote/Offer Flow
             |
       Financial Tracking
             |
       Notifications / Reports
             |
         DATABASE
```

Bu bir mantıksal modeldir. Mevcut projenin teknik yapısına göre modül
sınırlarını ve dağıtım modelini belirle. İhtiyaç olmadan mikroservis
mimarisine geçme; modüler monolit yaklaşımı mevcut projeye uygunsa
önceliklendir.

------------------------------------------------------------------------

# 4. KULLANICI TİPLERİ VE KİMLİK

## 4.1 Bireysel kullanıcılar

-   Sporcu
-   Ziyaretçi
-   Bireysel kamp katılımcısı

Bireysel kullanıcı: - Üyelik oluşturabilmeli veya izin verilen akışlarda
misafir talebi gönderebilmeli. - Kişisel bilgilerini yönetebilmeli. -
Rezervasyon talebi oluşturabilmeli. - Tarih, kişi sayısı ve hizmet
seçebilmeli. - Teklifini ve rezervasyon durumunu takip edebilmeli. -
Değişiklik veya iptal talebi gönderebilmeli. - Geçmiş rezervasyonlarını
görebilmeli.

## 4.2 Kurumsal müşteriler

Kurum türleri yönetimden tanımlanabilir olmalıdır. Örnekler:

-   Spor kulübü
-   Federasyon
-   Milli takım
-   Spor akademisi
-   Üniversite
-   Spor acentesi
-   Tur operatörü
-   Kamu kurumu
-   Özel şirket
-   Diğer

Her kurumun ayrı bir `Organization` kaydı ve kurum kapsamındaki
kullanıcıları olmalıdır.

## 4.3 B2B kullanıcı hiyerarşisi

Örnek kurum kullanıcıları:

-   Kurum yöneticisi
-   Genel koordinatör
-   Rezervasyon sorumlusu
-   Takım yöneticisi
-   Antrenör
-   Muhasebe yetkilisi

Bir kurumda birden fazla kullanıcı, takım ve organizasyon
bulunabilmelidir. Kullanıcıların yetkileri birbirinden bağımsız
yönetilebilmelidir. Bir kullanıcı, yetkisi varsa birden fazla takım veya
organizasyonla ilişkilendirilebilmelidir.

## 4.4 Kurum kartı

Önerilen alanlar:

-   Kurum kodu ve adı
-   Kurum türü
-   Vergi numarası ve vergi dairesi (gerekiyorsa)
-   Ülke, şehir ve adres
-   Yetkili kişiler
-   Telefon ve e-posta
-   Fatura bilgileri
-   Sözleşmeler
-   Fiyat anlaşmaları
-   B2B çalışma modeli
-   Rezervasyon yetkileri
-   Ödeme koşulları ve kredi limiti (ileride kullanılacaksa)
-   Aktif/pasif durumu

------------------------------------------------------------------------

# 5. B2B HİBRİT REZERVASYON MODELİ

Her B2B kurumu için rezervasyon modeli ve yetkileri tanımlanabilmelidir.

### A. Direct Booking

Yetkili kurum doğrudan rezervasyon oluşturabilir.

-   Müsaitlik ve kapasite kontrolü yapılır.
-   Fiyatlandırma hesaplanır.
-   İş kuralları uygunsa rezervasyon oluşturulur.
-   Kurum veya rezervasyon için yönetici onayı gerekiyorsa onay akışına
    girer.
-   Doğrudan rezervasyon yetkisi, her işlemin otomatik kesinleşeceği
    anlamına gelmez.

### B. Request Based

Kurum yalnızca rezervasyon talebi gönderir.

-   Talep yönetim paneline düşer.
-   Yönetim müsaitlik ve fiyat kontrolü yapar.
-   Teklif hazırlar ve müşteriye iletir.
-   Müşteri teklifi kabul veya reddeder.
-   Kabul edilen teklif, gerekli onaylardan sonra rezervasyona
    dönüştürülür.

### C. Hybrid

Kurum hem doğrudan rezervasyon hem de talep oluşturma yetkisine sahip
olabilir.

Kurum bazında aşağıdaki ayarları yönet:

-   `ReservationMode`
-   `CanCreateDirectBooking`
-   `CanSubmitReservationRequest`
-   `RequiresAdminApproval`
-   `CanViewAvailability`
-   `CanViewPrices`
-   `CanUseContractPrices`
-   `CanManageTeams`
-   `CanManageAthletes`
-   `CanViewInvoices`
-   `CanViewFinancialRecords`

Bu yetkiler yönetim panelinden değiştirilebilmeli; backend tarafında her
istekte doğrulanmalıdır. Yetki modelini gerektiğinde rol, kurum ve işlem
kapsamıyla birlikte değerlendir.

------------------------------------------------------------------------

# 6. MERKEZİ REZERVASYON MOTORU

Bireysel, kurumsal ve yönetici tarafından girilen rezervasyonlar aynı
merkezi rezervasyon motorunu kullanmalıdır.

Rezervasyon kaynağını ayrıca sakla:

-   `B2CWebsite`
-   `B2BPortal`
-   `AdminPanel`
-   `ManualEntry`

## 6.1 Rezervasyon türleri

Örnek türler:

-   Individual
-   TeamCamp
-   FederationCamp
-   NationalTeamCamp
-   CorporateEvent
-   TrainingCamp
-   Other

Rezervasyon türleri dinamik yönetilebilmelidir.

## 6.2 Rezervasyon oluşturma akışı

1.  Rezervasyon türünü seç.
2.  Geliş ve ayrılış tarihlerini belirle.
3.  Katılımcı sayısını belirle.
4.  Bireysel müşteri veya kurum bilgilerini gir.
5.  Takım ve katılımcıları seç.
6.  Konaklama ihtiyacını belirt.
7.  Tesis ve hizmetleri seç.
8.  Hizmet tarihlerini ve saatlerini belirle.
9.  Ek talepleri belirt.
10. Müsaitlik ve kapasite kontrolü yap.
11. Fiyatı hesapla.
12. Talep veya doğrudan rezervasyon işlemini tamamla.

Her rezervasyona benzersiz ve okunabilir bir numara üret. Örnek:
`HIC-2026-000001`. Yıl ve numara üretimi çakışmaya dayanıklı olmalıdır.

## 6.3 Rezervasyon durumları

Önerilen durumlar:

-   Draft
-   Submitted
-   UnderReview
-   QuotationPrepared
-   AwaitingCustomerApproval
-   AwaitingAdminApproval
-   Confirmed
-   CheckedIn
-   InProgress
-   Completed
-   CancellationRequested
-   Cancelled
-   Rejected
-   Expired

Durum geçişleri merkezi bir workflow üzerinden yönetilmelidir. Geçersiz
geçişler engellenmeli; her geçiş kullanıcı, zaman ve açıklamayla geçmişe
kaydedilmelidir. Durum isimleri kullanıcı arayüzünde Türkçe
gösterilebilir.

------------------------------------------------------------------------

# 7. TÜM HİZMETLER İÇİN HİZMET YÖNETİMİ

Sistem yalnızca oda veya yatak rezervasyonu olarak tasarlanmamalıdır.
Tesisin sunduğu bütün hizmetler tanımlanabilir ve rezerve edilebilir
olmalıdır.

## 7.1 Hizmet ve kaynak ayrımı

-   **Hizmet:** Müşterinin satın aldığı veya rezervasyonuna eklediği
    şey.
-   **Kaynak:** Hizmetin sunulabilmesi için kullanılan fiziksel veya
    operasyonel kapasite.

Örnek:

  Hizmet             Kullanılan kaynak
  ------------------ --------------------------------------------
  Konaklama          Oda, yatak
  Antrenman          Saha, ekipman, gerekiyorsa personel
  Fitness            Fitness salonu, ekipman
  Yemek              Yemekhane, servis kapasitesi
  Toplantı           Toplantı salonu
  Araç tahsisi       Araç, koltuk kapasitesi, gerekiyorsa şoför
  Ekipman kiralama   Spor ekipmanı
  Transfer           Araç ve koltuk kapasitesi

Bu örnekler tesisin gerçekten sunduğu hizmetlerin listesi değildir.
Gerçek envanter ve hizmetler yönetim tarafından tanımlanmalıdır.

## 7.2 Dinamik hizmet kategorileri

Örnek kategoriler:

-   Konaklama
-   Spor ve antrenman
-   Fitness
-   Yeme ve içme
-   Toplantı ve organizasyon
-   Ulaşım ve transfer
-   Spor ekipmanı
-   Sağlık ve destek hizmetleri
-   Diğer

Kategori ve hizmetler kod değişikliği gerektirmeden yönetim panelinden
eklenebilmelidir.

## 7.3 Hizmet kartı

Her hizmet için aşağıdaki alanları değerlendir:

-   ServiceCode
-   ServiceName
-   CategoryId
-   Description
-   UnitOfMeasure
-   BookingModel
-   MinimumDuration
-   MaximumDuration
-   TimeSlotDuration
-   Capacity
-   AdvanceBookingPeriod
-   CancellationPolicy
-   RequiresApproval
-   RequiresResource
-   PricingModel
-   TaxRate
-   ActiveStatus

Gerekli alanları hizmet modeline göre zorunlu veya opsiyonel yap. Her
hizmet için anlamı olmayan alanları zorunlu kılma.

## 7.4 Hizmet rezervasyon modelleri

Her hizmet aşağıdaki modellerden biriyle veya uygun olduğunda birden
fazlasıyla çalışabilmelidir:

1.  `DurationBased`: Başlangıç ve bitiş zamanı veya tarihi üzerinden
    rezervasyon. Örnek: oda, toplantı salonu, saha.
2.  `TimeSlotBased`: Tanımlı seanslar üzerinden rezervasyon. Örnek: 60,
    90 veya 120 dakikalık fitness/antrenman seansı.
3.  `CapacityBased`: Belirli zaman aralığında kişi veya grup kapasitesi.
    Örnek: yemek ve toplu transfer.
4.  `QuantityBased`: Adet veya miktar üzerinden rezervasyon. Örnek:
    ekipman kiralama.

Rezervasyon modeli hizmet kartından yönetilebilmelidir.

------------------------------------------------------------------------

# 8. KAYNAK YÖNETİMİ VE HİZMET-KAYNAK İLİŞKİSİ

## 8.1 Kaynak türleri

Örnek kaynaklar:

-   Oda
-   Yatak
-   Spor sahası
-   Fitness salonu
-   Yemekhane
-   Toplantı salonu
-   Araç
-   Spor ekipmanı
-   Personel
-   Diğer kaynaklar

Kaynak türleri ve kaynaklar dinamik yönetilmelidir.

## 8.2 Kaynak kartı

Önerilen alanlar:

-   ResourceCode
-   ResourceName
-   ResourceTypeId
-   LocationId
-   Capacity
-   Quantity
-   WorkingHours
-   Availability
-   MaintenanceStatus
-   ActiveStatus

Kaynağın kapasite birimi açıkça belirtilmelidir: kişi, yatak, araç,
adet, seans veya ilgili başka bir birim.

## 8.3 Hizmet-kaynak gereksinimleri

Bir hizmet bir veya birden fazla kaynak gerektirebilir. Örneğin
antrenman hizmeti saha ve ekipman gerektirebilir.

`ServiceResourceRequirements` benzeri bir ilişki modeli oluştur.
Gereksinimler şunları desteklemeli:

-   Zorunlu kaynak
-   Opsiyonel kaynak
-   Alternatif kaynak
-   Gerekli miktar
-   Gerekli kapasite
-   Kullanım süresi
-   Hazırlık/temizlik süresi
-   Kaynak tahsis kuralı

Bir hizmetin hangi kaynakları ne miktarda kullandığı konfigürasyonla
belirlenmeli; kod içine sabitlenmemelidir.

## 8.4 Kaynak takvimi ve blokajlar

Her kaynak için:

-   Çalışma saatleri
-   Çalışmadığı günler
-   Bakım zamanları
-   Geçici kapatma
-   Rezervasyon tahsisleri
-   Hazırlık ve temizlik aralıkları

yönetilebilmelidir.

Bakımda veya kapalı olan kaynak için rezervasyon yapılamamalıdır.

------------------------------------------------------------------------

# 9. MERKEZİ MÜSAİTLİK VE KAPASİTE MOTORU

Müsaitlik hesabında aşağıdakileri dikkate al:

-   Kaynağın çalışma takvimi
-   Mevcut onaylı rezervasyonlar
-   Geçici rezervasyon blokajları
-   Kaynak tahsisleri
-   Bakım ve kapalı zamanlar
-   Hizmet süresi
-   Hazırlık ve temizlik süresi
-   Kişi sayısı
-   Kullanılan miktar
-   Kaynağın toplam kapasitesi
-   Hizmete özgü kurallar

Bir hizmet birden fazla zorunlu kaynak gerektiriyorsa hepsinin uygunluğu
birlikte kontrol edilmelidir.

Müsaitlik sorgusu tek başına rezervasyon garantisi değildir.
Kesinleştirme öncesinde yeniden kontrol yapılmalıdır.

Eşzamanlı taleplerde kapasite aşımı ve çakışma engellenmelidir. Bunun
için mevcut veritabanına uygun transaction, kilitleme, unique/exclusion
constraint veya eşdeğer güvenli yöntemleri değerlendir. Yalnızca
frontend kontrolüne güvenme.

Bir kaynak uygun değilse, işletme kuralları izin veriyorsa alternatif
kaynak önerilebilmelidir.

Rezervasyon onaylandığında ilgili tahsisler güvenli biçimde
oluşturulmalı; iptal veya hizmet çıkarma durumunda yalnızca ilgili
tahsisler serbest bırakılmalıdır.

Bekleyen taleplerin kapasiteyi ne kadar süre tutacağı işletme kuralı
olarak tanımlanmalıdır. Süresi dolan geçici blokajlar otomatik serbest
bırakılabilmelidir.

------------------------------------------------------------------------

# 10. PAKET YÖNETİMİ

Kamp paketleri oluşturulabilmelidir.

Örnek futbol kamp paketi:

-   Konaklama
-   Kahvaltı
-   Öğle yemeği
-   Akşam yemeği
-   Günlük antrenman sahası
-   Fitness kullanımı

Paket özellikleri:

-   Paket adı ve açıklaması
-   Dahil hizmetler
-   Opsiyonel hizmetler
-   Paket fiyatı
-   Kişi başı fiyat
-   Geçerlilik dönemi
-   Minimum/maksimum kişi sayısı
-   Kuruma veya müşteri türüne özel fiyat
-   Paket aktif/pasif durumu

Paket içindeki her hizmetin kaynak tahsisi ayrı ayrı yapılmalıdır. Paket
tek bir rezervasyon/organizasyon altında yönetilmeli; hizmet kalemleri
ayrı izlenebilmelidir.

Paketin fiyatı ile tekil hizmet fiyatlarının toplamı
karşılaştırılabilmelidir. İndirim ve paket avantajı şeffaf
gösterilmelidir.

------------------------------------------------------------------------

# 11. REZERVASYON HİZMET KALEMLERİ

Bir rezervasyon birden fazla hizmet kalemi içerebilmelidir.

Her kalem için uygun alanlar:

-   ServiceId
-   Quantity
-   ParticipantCount
-   StartDateTime
-   EndDateTime
-   UnitPrice
-   Discount
-   Tax
-   TotalPrice
-   AllocationStatus

Rezervasyona sonradan hizmet eklenebilmeli veya çıkarılabilmelidir.

Değişiklikte müsaitlik ve fiyat yeniden hesaplanmalıdır. Onaylanmış
önceki tutarlar ve değişiklik geçmişi korunmalıdır. Revizyonlar
izlenebilir olmalıdır.

------------------------------------------------------------------------

# 12. FİYATLANDIRMA VE TEKLİF MOTORU

Fiyatlandırma merkezi bir servis üzerinden yapılmalıdır.

Desteklenecek fiyatlama yöntemleri:

-   Kişi başı
-   Saatlik
-   Günlük
-   Gecelik
-   Seans başı
-   Adet başı
-   Paket fiyatı
-   Sözleşme fiyatı
-   Sezonluk fiyat

Fiyat parametreleri:

-   Tarih ve sezon
-   Kişi sayısı
-   Konaklama süresi
-   Hizmet ve kaynak türü
-   Kurum türü
-   Sözleşme
-   İndirim
-   Vergi

Fiyat türleri:

-   Standart
-   Bireysel
-   Kurumsal
-   Kulüp
-   Federasyon
-   Sözleşmeli
-   Kampanya
-   Özel anlaşma

Fiyatlar kod içerisinde sabit tutulmamalıdır. Fiyat kuralları yönetim
panelinden tanımlanabilmelidir.

Rezervasyon veya teklif oluşturulurken fiyat kalemlerinin o anki kopyası
saklanmalıdır. Sonraki fiyat değişiklikleri geçmişte onaylanmış teklif
ve rezervasyonları değiştirmemelidir.

## Teklif yönetimi

-   Teklif oluşturma
-   Teklif revizyonu ve versiyonlama
-   Geçerlilik tarihi
-   Teklif PDF çıktısı
-   Müşteriye gönderim
-   Kabul/ret
-   Tekliften rezervasyon oluşturma

desteklenmelidir.

------------------------------------------------------------------------

# 13. TAKIM VE SPORCU YÖNETİMİ

B2B kurumları birden fazla takım oluşturabilmelidir.

Takım kartında:

-   Takım adı
-   Branş
-   Yaş kategorisi
-   Gerekliyse kategori/cinsiyet bilgisi
-   Takım yöneticisi
-   Antrenör
-   Sporcu sayısı
-   Bağlı kurum
-   Aktif/pasif durumu

bulunmalıdır.

Sporcu kartında yalnızca iş süreci için gerekli bilgiler tutulmalıdır:

-   Ad
-   Soyad
-   Doğum tarihi (gerekiyorsa)
-   Uyruk (gerekiyorsa)
-   Lisans numarası (gerekiyorsa)
-   Branş
-   Takım
-   Gerekli iletişim bilgileri

Hassas kişisel verileri gereksiz yere toplama. Erişimi ve saklama
süresini veri koruma ilkelerine göre sınırla.

## Excel aktarımı

B2B müşterileri:

-   Standart Excel şablonu indirebilmeli.
-   Sporcu listesini yükleyebilmeli.
-   Yükleme öncesi ön izleme görebilmeli.
-   Hatalı satırları ve hata nedenlerini görebilmeli.
-   Tekrarlı kayıtları kontrol edebilmeli.
-   Onaydan sonra toplu aktarım yapabilmeli.

Toplu aktarım mümkün olduğunca atomik veya açıkça raporlanan kısmi
sonuçlarla yürütülmelidir.

------------------------------------------------------------------------

# 14. FİNANSAL TAKİP --- ONLINE ÖDEME OLMADAN

İlk sürümde online ödeme alınmayacaktır.

Yapılmayacaklar:

-   Kredi kartı bilgisi toplama
-   Online ödeme sayfası
-   Ödeme sağlayıcısı API entegrasyonu
-   Otomatik kart tahsilatı

Ancak ileride entegrasyon eklenebilmesi için finansal veri modeli
genişletilebilir tasarlanmalıdır.

Yönetim tarafından manuel kaydedilebilecek işlemler:

-   Rezervasyon toplam tutarı
-   İndirim
-   Ön ödeme
-   Havale/EFT tahsilatı
-   Nakit tahsilat
-   Kalan bakiye
-   İade
-   Tahsilat tarihi
-   Tahsilatı kaydeden kullanıcı
-   Açıklama ve belge

Ödeme durumları:

-   Unpaid
-   PartiallyPaid
-   Paid
-   Refunded
-   PartiallyRefunded

Ödeme durumu ile rezervasyon durumu birbirinden bağımsız olmalıdır.
Finansal hareketler silinmek yerine uygun ters kayıt/iptal
mekanizmasıyla düzeltilmeli ve audit log tutulmalıdır.

------------------------------------------------------------------------

# 15. YÖNETİM VE OPERASYON PANELİ

## 15.1 Dashboard

-   Bugünkü rezervasyonlar
-   Gelen rezervasyon talepleri
-   Onay bekleyen rezervasyonlar
-   Aktif konaklamalar
-   Yaklaşan kamp organizasyonları
-   Tesis doluluk oranı
-   Kaynak kullanım oranı
-   Bireysel müşteri sayısı
-   Kurumsal müşteri sayısı
-   B2B rezervasyonları
-   Bekleyen teklifler
-   Tahsilat durumu

Gösterge değerleri gerçek veritabanı sorgularından gelmelidir. Demo
değerleri gerçekmiş gibi gösterilmemelidir.

## 15.2 Rezervasyon takvimi

Günlük, haftalık ve aylık görünümler bulunmalıdır.

Filtreler:

-   Tarih
-   Kurum
-   Takım
-   Hizmet
-   Kaynak
-   Rezervasyon durumu

## 15.3 Merkezi kaynak takvimi

Aynı takvim veya ilişkili görünümler üzerinden:

-   Konaklama dolulukları
-   Spor sahası rezervasyonları
-   Fitness seansları
-   Yemek kapasitesi
-   Araç tahsisleri
-   Ekipman kullanımları
-   Bakım ve kapalı zamanlar

görülebilmelidir.

## 15.4 Yönetim işlemleri

-   Rezervasyon oluşturma/düzenleme
-   Onaylama/reddetme
-   Teklif oluşturma
-   Kaynak tahsis etme
-   Hizmet ekleme/çıkarma
-   İptal işlemi
-   Müşteri ve operasyon notları
-   Manuel tahsilat kaydı
-   Kurum yetkisi ve fiyat kuralı düzenleme

------------------------------------------------------------------------

# 16. MÜŞTERİ, SÖZLEŞME VE BELGE YÖNETİMİ

Bireysel ve kurumsal müşteri kayıtları ortak müşteri altyapısıyla
ilişkilendirilmeli; farklı alanlar ayrı profillerde tutulabilmelidir.

Müşteri kartında:

-   İletişim bilgileri
-   Adres ve fatura bilgileri
-   İletişim geçmişi
-   Rezervasyon geçmişi
-   Müşteri notları
-   Belgeler
-   Sözleşmeler
-   Fiyat anlaşmaları
-   Finansal özet
-   Aktif/pasif durumu

bulunmalıdır.

Belge türleri dinamik tanımlanmalıdır. Dosya erişimi kullanıcı rolü,
kurum ve kayıt ilişkisine göre kontrol edilmelidir. Dosya yüklemelerinde
tür, boyut ve içerik kontrolleri uygulanmalıdır.

------------------------------------------------------------------------

# 17. BİLDİRİM VE MESAJLAŞMA

İlk sürümde sistem içi bildirim ve e-posta altyapısı oluştur.

Bildirim olayları:

-   Yeni rezervasyon talebi
-   Rezervasyon onayı/reddi
-   Teklif oluşturulması
-   Teklifin kabul/ret edilmesi
-   Rezervasyon değişikliği
-   İptal talebi
-   Yaklaşan kamp tarihi
-   Yeni mesaj

SMS entegrasyonu daha sonraki faza bırakılabilir. Sağlayıcı bilgisi
yoksa sahte entegrasyon yazma.

B2B müşteri ve yönetim arasında rezervasyona bağlı mesajlaşma
desteklenebilir. Mesajlar ilgili kurum ve rezervasyon kapsamı dışında
görünmemelidir.

------------------------------------------------------------------------

# 18. RAPORLAMA

Raporlar:

-   Bireysel rezervasyon
-   Kurumsal rezervasyon
-   B2B müşteri
-   Takım bazlı rezervasyon
-   Sezonluk kamp
-   Tesis doluluk
-   Kaynak kullanım
-   Hizmet kullanım
-   Gelir
-   Tahsilat
-   İptal
-   Teklif dönüşüm
-   Müşteri geçmişi

Tarih, müşteri, kurum, hizmet, kaynak ve durum filtreleri bulunmalıdır.
Excel ve PDF çıktıları desteklenmelidir. Rapor toplamları ile işlem
kayıtları tutarlı olmalıdır.

------------------------------------------------------------------------

# 19. KULLANICI, ROL VE GÜVENLİK

RBAC yaklaşımını temel al; ihtiyaç duyulan yerlerde kurum, kayıt ve
işlem kapsamını dikkate alan ek kontroller uygula.

Örnek roller:

-   Sistem yöneticisi
-   Tesis yöneticisi
-   Rezervasyon sorumlusu
-   Operasyon personeli
-   Finans sorumlusu
-   B2B kurum yöneticisi
-   B2B rezervasyon yetkilisi
-   B2B takım yöneticisi
-   B2B muhasebe yetkilisi
-   Bireysel müşteri

Zorunlu güvenlik ilkeleri:

-   B2B kurumlar arası veri izolasyonu
-   Backend tarafında yetki kontrolü
-   Güvenli kimlik doğrulama ve oturum yönetimi
-   Parola güvenliği
-   API doğrulaması
-   Dosya yükleme güvenliği
-   Hassas veri minimizasyonu
-   Audit log
-   Kritik işlemlerde kullanıcı ve zaman kaydı

Bir kurumun kullanıcısı başka kurumun rezervasyonunu, sporcu
bilgilerini, belgelerini veya finansal kayıtlarını görememelidir. Bu
kural API ve veritabanı erişim katmanında da korunmalıdır.

------------------------------------------------------------------------

# 20. VERİTABANI TASARIMI

Aşağıdaki varlıkları mevcut veritabanı ve teknolojiye göre değerlendir.
İsimler öneridir; mevcut proje standartlarına uygun hale getir.

## Identity

-   Users
-   Roles
-   Permissions
-   UserRoles
-   RolePermissions

## Organization

-   Organizations
-   OrganizationUsers
-   OrganizationTeams
-   OrganizationContracts
-   OrganizationPricingRules

## Customer

-   Customers
-   CustomerContacts
-   CustomerAddresses

## Sports

-   Teams
-   Athletes
-   TeamAthletes
-   Coaches

## Reservation

-   Reservations
-   ReservationParticipants
-   ReservationTeams
-   ReservationItems
-   ReservationServiceItems
-   ReservationResources
-   ReservationStatusHistory
-   ReservationNotes
-   ReservationPackages

## Service Catalog

-   ServiceCategories
-   Services
-   ServiceVariants
-   ServiceAvailability
-   ServicePricing
-   ServiceResourceRequirements

## Facility and Resource

-   Facilities
-   Locations
-   ResourceTypes
-   Resources
-   ResourceSchedules
-   ResourceCapacity
-   ResourceBlocks
-   ResourceAllocations
-   ResourceMaintenance

## Pricing and Offers

-   PriceLists
-   PriceListItems
-   PricingRules
-   Quotations
-   QuotationVersions
-   QuotationItems
-   PackageServices

## Finance

-   FinancialTransactions
-   PaymentRecords
-   RefundRecords

## Documents

-   Documents
-   DocumentTypes
-   Contracts

## System

-   Notifications
-   Messages
-   AuditLogs
-   SystemSettings

Veritabanı tasarımında:

-   Primary Key
-   Foreign Key
-   Unique Constraint
-   Uygun Index
-   CreatedAt / UpdatedAt
-   CreatedBy / UpdatedBy
-   Gerekli yerlerde soft delete
-   İşlem geçmişi

kullan.

Gereksiz tablo veya alan üretme. Normalizasyon, sorgu performansı, veri
bütünlüğü ve geçmiş kayıtların korunması arasında dengeli tasarım yap.

Rezervasyon ve kaynak tahsisi ilişkilerini çoktan çoğa ilişkiyi
destekleyecek biçimde kur. Bir rezervasyon birden fazla hizmet
içerebilir; bir hizmet birden fazla kaynak gerektirebilir; kaynaklar
farklı hizmetler tarafından kullanılabilir.

------------------------------------------------------------------------

# 21. API TASARIMI

Mevcut backend mimarisine uygun modüler API tasarla.

Örnek kaynak grupları:

-   `/api/auth`
-   `/api/customers`
-   `/api/organizations`
-   `/api/teams`
-   `/api/athletes`
-   `/api/reservations`
-   `/api/availability`
-   `/api/services`
-   `/api/resources`
-   `/api/pricing`
-   `/api/quotations`
-   `/api/contracts`
-   `/api/finance`
-   `/api/documents`
-   `/api/notifications`
-   `/api/reports`

API'lerde:

-   Request validation
-   Standart response/error yapısı
-   Pagination
-   Filtering
-   Sorting
-   Authorization
-   Logging
-   Transaction güvenliği

uygulanmalıdır.

Gerçek API sözleşmelerini mevcut projeye göre belgele. Kullanılmayan
veya uygulanmamış endpointleri varmış gibi gösterme.

------------------------------------------------------------------------

# 22. UI/UX TASARIM PRENSİPLERİ

Mevcut web sitesinin logosunu, renklerini, tipografisini, görsel
kimliğini ve çalışan sayfalarını koru.

Bireysel portal, B2B portalı ve yönetim paneli aynı tasarım sistemini
kullanmalı; ancak hedef kullanıcıya göre farklı navigasyon ve ekranlara
sahip olmalıdır.

Yönetim ve B2B ekranlarında:

-   Sol navigasyon
-   Üst kullanıcı menüsü
-   Dashboard kartları
-   Filtrelenebilir tablolar
-   Takvim ve kaynak planlama görünümleri
-   Detay sayfaları
-   Formlar ve modal pencereler
-   Durum göstergeleri
-   Responsive tasarım

kullan.

Arayüz sade, hızlı ve anlaşılır olmalı. Kullanıcı gereksiz sayfa
geçişleri yapmadan işlemlerini tamamlayabilmelidir.

------------------------------------------------------------------------

# 23. GELİŞTİRME FAZLARI

## Faz 0 --- Mevcut proje analizi

-   Kaynak kod ve teknoloji analizi
-   Mevcut sayfaların analizi
-   Veritabanı ve API analizi
-   Entegrasyon planı
-   Açık kararların listesi

## Faz 1 --- Foundation Layer

-   Kimlik
-   Rol ve yetki
-   Kurum
-   Müşteri
-   Lokasyon
-   Sezon
-   Temel kart mimarisi

## Faz 2 --- Hizmet ve kaynak yönetimi

-   Hizmet kategorileri
-   Hizmet kartları
-   Kaynak türleri
-   Kaynak kartları
-   Hizmet-kaynak gereksinimleri
-   Çalışma takvimleri
-   Kapasite ve blokajlar

## Faz 3 --- Müsaitlik ve rezervasyon motoru

-   Bireysel rezervasyon
-   Kurumsal rezervasyon
-   Müsaitlik kontrolü
-   Kapasite kontrolü
-   Kaynak tahsisi
-   Rezervasyon workflow
-   Çakışma ve eşzamanlılık testleri

## Faz 4 --- B2B portalı

-   Kurum yönetimi
-   Kurum kullanıcıları
-   Takım ve sporcu yönetimi
-   Excel aktarımı
-   Hibrit rezervasyon yetkileri
-   Kurum veri izolasyonu

## Faz 5 --- Fiyatlandırma, paket ve teklif

-   Fiyat listeleri
-   Özel fiyatlar
-   Paket yönetimi
-   Teklif oluşturma
-   Teklif versiyonları
-   PDF çıktısı

## Faz 6 --- Yönetim ve operasyon paneli

-   Dashboard
-   Rezervasyon takvimi
-   Kaynak takvimi
-   Müşteri yönetimi
-   Hizmet yönetimi
-   Rezervasyon operasyonları

## Faz 7 --- Finansal takip

-   Manuel tahsilat
-   Ön ödeme
-   Bakiye
-   İade kayıtları
-   Finans raporları

## Faz 8 --- Bildirim, belge ve raporlama

-   Sistem içi bildirim
-   E-posta
-   Belge yönetimi
-   Excel/PDF raporları

## Faz 9 --- Test ve canlıya geçiş

-   Güvenlik testleri
-   Yetki testleri
-   Veri izolasyonu testleri
-   Rezervasyon çakışma testleri
-   Performans testleri
-   Yedekleme ve geri yükleme kontrolü
-   Canlıya geçiş kontrol listesi

Online ödeme entegrasyonu ayrı ve sonraki bir fazdır. İlk sürümde online
ödeme geliştirme.

------------------------------------------------------------------------

# 24. ZORUNLU KABUL TESTLERİ

Aşağıdaki senaryolar otomatik testlerle mümkün olduğunca
doğrulanmalıdır:

1.  Bireysel kullanıcı rezervasyon talebi oluşturabilir.
2.  Bireysel kullanıcı rezervasyon durumunu takip edebilir.
3.  Kurumsal kullanıcı hesap ve kurum profili oluşturabilir.
4.  Kurum yöneticisi alt kullanıcı davet edebilir.
5.  Yetkili B2B müşterisi doğrudan rezervasyon oluşturabilir.
6.  Talep modeliyle çalışan B2B müşterisi yalnızca talep gönderebilir.
7.  Hibrit yetkili müşteri iki yöntemi de kullanabilir.
8.  Bir kurum başka kurumun verilerini göremez.
9.  Bir kurum birden fazla takım yönetebilir.
10. Sporcu listesi Excel ile ön izleme ve doğrulama sonrası
    aktarılabilir.
11. Kaynak kapasitesi aşılamaz.
12. Aynı kaynakta çakışan tahsis yapılamaz.
13. Bakımda olan kaynak rezerve edilemez.
14. Bir rezervasyon birden fazla hizmet içerebilir.
15. Bir hizmet birden fazla kaynak gerektirebilir.
16. Paket rezervasyonu içindeki her hizmet ayrı tahsis edilir.
17. Hizmet ekleme/çıkarma kapasiteyi yeniden kontrol eder.
18. Yönetim rezervasyon onayı verebilir.
19. Teklif oluşturulabilir ve kabul/ret edilebilir.
20. Fiyat değişikliği geçmişte onaylanmış tutarları değiştirmez.
21. Manuel tahsilat kaydedilebilir.
22. Ödeme ve rezervasyon durumları bağımsız çalışır.
23. İptal edilen hizmetin ilgili kaynak tahsisi serbest bırakılır.
24. Kritik işlemler audit log içinde bulunur.
25. Tüm paneller mobil cihazlarda kullanılabilir.

------------------------------------------------------------------------

# 25. CLAUDE CODE İÇİN UYGULAMA TALİMATI

Projeyi tek seferde kontrolsüz biçimde geliştirme.

Her fazda şu döngüyü uygula:

1.  İlgili modülün mevcut durumunu incele.
2.  Gereksinimi ve etkilenecek dosyaları açıkla.
3.  Veri modeli ve API etkisini belirt.
4.  Küçük geliştirme adımlarını uygula.
5.  Migration ve testleri çalıştır.
6.  Çalışan uygulamayı doğrula.
7.  Değişen dosyaları ve sonuçları raporla.
8.  Açık kalan işleri belirt.

Her faz sonunda kısa bir teslim raporu oluştur:

-   Tamamlanan işler
-   Değiştirilen dosyalar
-   Veritabanı değişiklikleri
-   Eklenen API ve ekranlar
-   Test sonuçları
-   Bilinen sorunlar
-   Sonraki faz

Bir test başarısızsa sebebini araştırmadan başarısızlığı gizleme veya
testi devre dışı bırakma.

## İlk çalıştırma talimatı

Şimdi yalnızca Faz 0'ı gerçekleştir:

1.  Proje klasörünü incele.
2.  Mevcut uygulamanın nasıl çalıştırıldığını belirle.
3.  Teknoloji ve mimari analizini yap.
4.  Yukarıda listelenen analiz belgelerini oluştur.
5.  Mevcut kodu değiştirme.
6.  Mimari riskleri ve açık işletme sorularını listele.
7.  Bana analiz raporunu sun ve Faz 1'e geçmeden önce onay bekle.

------------------------------------------------------------------------

# 26. NİHAİ ÜRÜN HEDEFİ

Yüksek İrtifa Kamp Merkezi'nin mevcut internet sitesiyle bütünleşik
çalışan;

-   Bireysel ve kurumsal rezervasyon alınabilen,
-   B2B kurumların kendi organizasyonlarını yönetebildiği,
-   Kurum bazlı doğrudan rezervasyon ve talep yetkileri bulunan,
-   Tesisin bütün hizmetlerinin rezerve edilebildiği,
-   Hizmet ve fiziksel kaynakların ayrı yönetildiği,
-   Kapasite ve müsaitliğin merkezi olarak kontrol edildiği,
-   Paket, fiyat ve teklif yönetimi yapılabilen,
-   Online ödeme olmadan finansal takibin yapılabildiği,
-   Yönetim ve operasyonun tek merkezden yürütülebildiği

profesyonel, güvenli, modüler ve geliştirilebilir bir dijital platform
oluştur.
