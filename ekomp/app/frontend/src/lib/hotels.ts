/**
 * Anlaşmalı otellerin detay bilgileri (Rezervasyon > Oteller > Detay sayfası).
 * Bilgiler otellerin kendi internet sitelerinden derlenmiştir (Kasım 2026); fotoğraflar otellerin izniyle kullanılır.
 * Fiyat ve doluluk yayınlanmaz: kart ve detay sayfası "talep oluştur" bağlantısına yönlendirir.
 */
export interface Bi {
  tr: string;
  en: string;
}

export interface HotelRoom {
  name: Bi;
  /** Örn. "32 m²" */
  size?: string;
  /** Örn. "2+1 kişi" */
  capacity?: Bi;
  text: Bi;
  /** Odaya özgü kısa maddeler. */
  features?: Bi[];
  image: string;
}

export interface HotelSection {
  id: string;
  icon: string;
  title: Bi;
  text: Bi;
  items?: Bi[];
  images?: string[];
}

export interface Hotel {
  slug: string;
  name: string;
  url: string;
  phone: string;
  phoneDisplay: string;
  whatsapp?: string;
  email?: string;
  address: Bi;
  /** Google Haritalar araması için. */
  mapQuery: string;
  /** Panoramik kapak fotoğrafında odaklanılacak nokta. */
  focus?: string;
  tagline: Bi;
  about: Bi[];
  facts: { icon: string; label: Bi; value: Bi }[];
  amenities: { icon: string; label: Bi }[];
  rooms: HotelRoom[];
  sections: HotelSection[];
  gallery: string[];
}

const img = (slug: string, name: string) => `/images/oteller/${slug}/${name}.jpg`;
const b = (tr: string, en: string): Bi => ({ tr, en });

const PALAN = "palan-hotel";
const POLAT = "polat-erzurum-resort";
const SWAY = "sway-hotels";
const SNOW = "snowdora-hotel";

export const HOTELS: Hotel[] = [
  // ───────────────────────── PALAN ─────────────────────────
  {
    slug: PALAN,
    name: "Palan Hotel Palandöken",
    url: "https://www.palanotel.com/tr",
    phone: "+904423170699",
    phoneDisplay: "+90 (442) 317 06 99",
    whatsapp: "905496350202",
    address: b("Yunus Emre Mah. Kayak Tesisleri Sokak No:3, Palandöken / Erzurum", "Yunus Emre Mah. Kayak Tesisleri Sokak No:3, Palandöken / Erzurum"),
    mapQuery: "Palan Hotel Ski & Convention Resort Palandöken Erzurum",
    tagline: b("Palandöken Dağı'nın eteklerinde, pistlere 3 dakika yürüme mesafesinde kayak ve kongre oteli.", "A ski and convention hotel at the foot of Mount Palandöken, a 3-minute walk from the slopes."),
    about: [
      b(
        "Palan Hotel Ski & Convention Resort, Erzurum–Palandöken'de Palandöken Dağı'nın eteklerinde yer alır. Otel, dağa ve kayak pistlerine yalnızca 3 dakikalık yürüme mesafesindedir; bu sayede kış sporlarına ve açık hava aktivitelerine kolay erişim sağlar.",
        "Palan Hotel Ski & Convention Resort stands at the foot of Mount Palandöken in Erzurum. It is only a 3-minute walk from the mountain and the ski slopes, giving easy access to winter sports and outdoor activities.",
      ),
      b(
        "1998'de hizmete açılan otel 2015'te tamamen yenilenmiştir. 7.500 m²'lik alan üzerine kurulu tesiste 158 oda bulunur. Şehir merkezine kısa bir mesafede olduğu için Erzurum'un tarihî ve kültürel noktalarına da kolayca ulaşılır.",
        "Opened in 1998 and completely renovated in 2015, the hotel is built on 7,500 m² and has 158 rooms. Being close to the city centre, it also offers easy access to Erzurum's historic and cultural sights.",
      ),
    ],
    facts: [
      { icon: "bed", label: b("Oda sayısı", "Rooms"), value: b("158 oda", "158 rooms") },
      { icon: "directions_walk", label: b("Pistlere uzaklık", "Distance to slopes"), value: b("3 dk yürüyüş", "3 min walk") },
      { icon: "square_foot", label: b("Tesis alanı", "Site area"), value: b("7.500 m²", "7,500 m²") },
      { icon: "schedule", label: b("Giriş / çıkış", "Check-in / out"), value: b("14:00 / 12:00", "14:00 / 12:00") },
    ],
    amenities: [
      { icon: "schedule", label: b("7/24 resepsiyon", "24/7 reception") },
      { icon: "pool", label: b("Kapalı yüzme havuzu (09:00–22:00)", "Indoor pool (09:00–22:00)") },
      { icon: "fitness_center", label: b("Fitness salonu (09:00–22:00)", "Fitness room (09:00–22:00)") },
      { icon: "spa", label: b("Spa ve masaj", "Spa and massage") },
      { icon: "child_care", label: b("Çocuk kulübü", "Kids club") },
      { icon: "medical_services", label: b("Doktor", "Doctor") },
      { icon: "directions_car", label: b("Araç kiralama", "Car rental") },
      { icon: "shopping_cart", label: b("Market", "Market") },
      { icon: "content_cut", label: b("Kuaför", "Hairdresser") },
      { icon: "sports_esports", label: b("Oyun salonu", "Game room") },
      { icon: "local_parking", label: b("Otopark", "Car park") },
      { icon: "airport_shuttle", label: b("Havalimanı transferi (ek ücretli)", "Airport transfer (extra charge)") },
    ],
    rooms: [
      {
        name: b("Standart Oda", "Standard Room"),
        text: b(
          "Palandöken Dağı manzaralı, modern ve işlevsel odalar. Sigara içilen / içilmeyen seçeneklerin yanında engelli misafirler için özel düzenlenmiş odalar da vardır.",
          "Modern, functional rooms with views of Mount Palandöken. Smoking and non-smoking options are available, as well as rooms adapted for guests with disabilities.",
        ),
        features: [b("Tek ve çift kişilik yatak", "Single and double beds"), b("Klima", "Air conditioning"), b("Ücretsiz Wi-Fi", "Free Wi-Fi"), b("Ücretsiz kahve ve çay seti", "Free coffee and tea set"), b("Duş", "Shower"), b("Su ısıtıcısı", "Kettle")],
        image: img(PALAN, "standart-oda"),
      },
      {
        name: b("Suite Oda", "Suite"),
        text: b(
          "Şehir ve Palandöken Dağı manzarası sunan, ayrı yatak odası ve oturma alanına sahip geniş yaşam alanları.",
          "Spacious suites with city and mountain views, a separate bedroom and a sitting area.",
        ),
        features: [b("Ayrı yatak odası ve oturma alanı", "Separate bedroom and sitting area"), b("Klima", "Air conditioning"), b("Ücretsiz Wi-Fi", "Free Wi-Fi"), b("Günlük oda temizliği", "Daily room cleaning")],
        image: img(PALAN, "suite-oda"),
      },
      {
        name: b("King Suite Oda", "King Suite"),
        text: b(
          "Ayrı oturma ve yemek alanıyla üst düzey konfor ve mahremiyet arayan misafirler için; çam ağaçları ve şehir manzarası eşliğinde.",
          "For guests seeking top comfort and privacy, with a separate living and dining area and views of pine trees and the city.",
        ),
        features: [b("Ayrı oturma ve yemek alanı", "Separate living and dining area"), b("Oda servisi (ekstra)", "Room service (extra)"), b("Banyo ürünleri", "Bathroom amenities"), b("Ücretsiz Wi-Fi", "Free Wi-Fi")],
        image: img(PALAN, "king-suite"),
      },
    ],
    sections: [
      {
        id: "yeme-icme",
        icon: "restaurant",
        title: b("Restoran ve barlar", "Dining and bars"),
        text: b(
          "500 kişilik ana restoran; Tam Pansiyon Plus, Yarım Pansiyon ve Oda & Kahvaltı konseptlerinde uluslararası ve yöresel lezzetler sunar. Lobi Bar, Teras Bar ve ana bina dışındaki Palan Cafe de misafirlere açıktır.",
          "The 500-seat main restaurant serves international and regional dishes on full board plus, half board and bed & breakfast plans. The Lobby Bar, Terrace Bar and the Palan Cafe outside the main building are also open to guests.",
        ),
        items: [
          b("Kahvaltı 07:00–10:00", "Breakfast 07:00–10:00"),
          b("Öğle yemeği 12:30–14:30 (tam pansiyon)", "Lunch 12:30–14:30 (full board)"),
          b("Çay saati 16:30–17:30 (tam pansiyon)", "Tea time 16:30–17:30 (full board)"),
          b("Akşam yemeği 19:00–22:00", "Dinner 19:00–22:00"),
        ],
        images: [img(PALAN, "ana-restoran"), img(PALAN, "lobi")],
      },
      {
        id: "spa",
        icon: "spa",
        title: b("Fitness ve spa", "Fitness and spa"),
        text: b(
          "Kayak sonrası toparlanmak için sauna, Türk hamamı, modern ekipmanlı fitness merkezi, masaj hizmetleri ve yıl boyu kullanılabilen kapalı havuz.",
          "A sauna, Turkish bath, modern fitness centre, massage services and a year-round indoor pool for recovering after skiing.",
        ),
        items: [b("Sauna", "Sauna"), b("Türk hamamı", "Turkish bath"), b("Fitness merkezi", "Fitness centre"), b("Masaj", "Massage"), b("Kapalı havuz", "Indoor pool")],
        images: [img(PALAN, "kapali-havuz"), img(PALAN, "sauna"), img(PALAN, "hamam"), img(PALAN, "fitness")],
      },
      {
        id: "kis-sporlari",
        icon: "downhill_skiing",
        title: b("Kış sporları", "Winter sports"),
        text: b(
          "Kayak ekipmanı kiralama ve ekipmanlar için kayak dolapları sunulur. Otel binasından 50 metre uzaklıkta Snow-tube ve Baby-lift adlı iki pist bulunur; kayak dersi için eğitmenlerle iletişime geçilebilir. Kayak liftlerinin çalışması hava koşullarına bağlıdır.",
          "Ski equipment rental and ski lockers are available. Two slopes, Snow-tube and Baby-lift, are 50 metres from the hotel building, and ski lessons can be arranged with instructors. Lift operation depends on weather conditions.",
        ),
        images: [img(PALAN, "cocuk-kulubu")],
      },
      {
        id: "toplanti",
        icon: "meeting_room",
        title: b("Toplantı ve kongre", "Meetings and conventions"),
        text: b(
          "“Ski & Convention Resort” adıyla toplantı, kongre ve organizasyonlara uygun salonlar sunar. Kapasite ve düzen için talep oluşturun.",
          "As a “Ski & Convention Resort” the hotel offers halls suited to meetings, conventions and events. Send a request for capacity and layout details.",
        ),
        images: [img(PALAN, "toplanti-salonu")],
      },
    ],
    gallery: [
      img(PALAN, "standart-oda-2"),
      img(PALAN, "ana-restoran"),
      img(PALAN, "kapali-havuz"),
      img(PALAN, "sauna"),
      img(PALAN, "hamam"),
      img(PALAN, "fitness"),
      img(PALAN, "lobi"),
      img(PALAN, "cocuk-kulubu"),
      img(PALAN, "toplanti-salonu"),
    ],
  },

  // ───────────────────────── SWAY ─────────────────────────
  {
    slug: SWAY,
    name: "Sway Hotels Palandöken",
    url: "https://www.swayhotels.com/tr",
    phone: "+904422303030",
    phoneDisplay: "+90 (442) 230 30 30",
    whatsapp: "905301596016",
    address: b("Palandöken Kayak Merkezi, Erzurum", "Palandöken Ski Resort, Erzurum"),
    mapQuery: "Sway Hotels Palandöken Erzurum",
    focus: "55% 50%",
    tagline: b("Pistlere doğrudan çıkışı, geniş spa ve fitness alanıyla Snowplus markalı kayak oteli.", "A ski hotel under the Snowplus brand with direct slope access and a large spa and fitness area."),
    about: [
      b(
        "Sway Hotels, Türkiye'nin kristal kar cenneti Palandöken'de spor, adrenalin ve eğlenceyi bir araya getirir. Tesis, ski odasından doğrudan pistlere çıkış imkânı sunar; amatör ve profesyonel kış sporcularına hizmet veren Snowplus markasıyla çalışır.",
        "Sway Hotels brings sport, adrenaline and fun together in Palandöken, Turkey's crystal-snow paradise. The hotel offers direct access to the slopes from its ski room and operates under the Snowplus brand, serving amateur and professional winter athletes.",
      ),
      b(
        "Geniş oda tipleri, 450 m²'yi aşan fitness alanı, açılır tavanlı ısıtmalı kapalı havuz, hamam, sauna ve 11 masaj odasıyla antrenman sonrası toparlanma için kapsamlı olanaklar bulunur.",
        "A range of spacious rooms, a fitness area of over 450 m², a heated indoor pool with an openable ceiling, a Turkish bath, saunas and 11 massage rooms provide comprehensive recovery facilities.",
      ),
    ],
    facts: [
      { icon: "bed", label: b("Oda sayısı", "Rooms"), value: b("215 oda ve süit", "215 rooms and suites") },
      { icon: "downhill_skiing", label: b("Pistler", "Slopes"), value: b("Doğrudan çıkış", "Direct access") },
      { icon: "pool", label: b("Kapalı havuz", "Indoor pool"), value: b("240 m², ısıtmalı", "240 m², heated") },
      { icon: "fitness_center", label: b("Fitness alanı", "Fitness area"), value: b("450 m² üzeri", "Over 450 m²") },
    ],
    amenities: [
      { icon: "downhill_skiing", label: b("Pistlere doğrudan çıkış", "Direct slope access") },
      { icon: "luggage", label: b("Kayak ve snowboard kiralama", "Ski and snowboard rental") },
      { icon: "ac_unit", label: b("Odalarda ısıtmalı ekipman dolabı", "Heated equipment locker in every room") },
      { icon: "pool", label: b("Isıtmalı kapalı havuz", "Heated indoor pool") },
      { icon: "hot_tub", label: b("Hamam, sauna ve buhar odası", "Turkish bath, sauna and steam room") },
      { icon: "spa", label: b("11 masaj terapi odası", "11 massage therapy rooms") },
      { icon: "fitness_center", label: b("Fitness, cardio ve crossfit", "Fitness, cardio and crossfit") },
      { icon: "meeting_room", label: b("Kongre merkezi ve toplantı salonları", "Convention centre and meeting halls") },
      { icon: "child_care", label: b("Çocuklar için kayak alanı", "Ski area for children") },
      { icon: "wifi", label: b("Kablosuz internet", "Wireless internet") },
    ],
    rooms: [
      {
        name: b("Standart Oda", "Standard Room"),
        size: "34 m²",
        capacity: b("2+1 kişi", "2+1 persons"),
        text: b("Standart ölçülerden geniş ve donanımlı odalar; 160 oda.", "Rooms larger than standard and well equipped; 160 rooms."),
        features: [b("Dağ ve şehir manzarası", "Mountain and city view"), b("LCD TV, minibar", "LCD TV, minibar"), b("Çalışma masası, kablosuz internet", "Work desk, wireless internet"), b("Kasa, merkezi ısıtma-soğutma", "Safe, central heating and cooling")],
        image: img(SWAY, "standart-oda"),
      },
      {
        name: b("Bağlantılı Oda", "Connection Room"),
        size: "2×34 m²",
        capacity: b("4+2 kişi", "4+2 persons"),
        text: b("İki standart odanın bağlantı kapısıyla birleştiği, aileler ve gruplar için uygun odalar; 36 oda.", "Two standard rooms joined by a connecting door, suited to families and groups; 36 rooms."),
        image: img(SWAY, "standart-oda-2"),
      },
      {
        name: b("Delüks Oda", "Deluxe Room"),
        size: "52 m²",
        capacity: b("2+1 kişi", "2+1 persons"),
        text: b("Özel balkonlu; pist ve dağ manzaralı odalar; 14 oda.", "Rooms with private balconies and views of the slope and the mountain; 14 rooms."),
        image: img(SWAY, "deluxe-oda"),
      },
      {
        name: b("Junior Süit", "Junior Suite"),
        size: "55 m²",
        capacity: b("2+1 kişi", "2+1 persons"),
        text: b("Özel oturma grubu ve Erzurum'un tarihî dokusuna bakan şehir manzarası; 3 oda.", "A dedicated sofa group and city views toward Erzurum's historic quarter; 3 rooms."),
        image: img(SWAY, "junior-suit"),
      },
      {
        name: b("Başkanlık Suiti", "Presidential Suite"),
        size: "104 m²",
        capacity: b("4+2 kişi", "4+2 persons"),
        text: b("Bir büyük yatak odası ve bir standart odadan oluşan; özel balkonlu, geniş oturma odalı süit; 2 adet.", "A suite with one master bedroom and one standard room, a private balcony and a large living room; 2 units."),
        image: img(SWAY, "baskanlik-suiti"),
      },
    ],
    sections: [
      {
        id: "spa",
        icon: "spa",
        title: b("Sağlık ve spa", "Wellness and spa"),
        text: b(
          "450 m²'yi aşan fitness alanı, cardio ve crossfit bölümleri; 240 m² açılır tavanlı ısıtmalı kapalı havuz; hamam, sauna ve buhar odasından oluşan Zen Zone ile 11 masaj terapi odası.",
          "A fitness area of over 450 m² with cardio and crossfit zones; a 240 m² heated indoor pool with an openable ceiling; the Zen Zone with Turkish bath, sauna and steam room; and 11 massage therapy rooms.",
        ),
        items: [b("Fitness, cardio, crossfit", "Fitness, cardio, crossfit"), b("Isıtmalı kapalı havuz", "Heated indoor pool"), b("Hamam, sauna, buhar odası", "Turkish bath, sauna, steam room"), b("Masaj ve terapi odaları", "Massage and therapy rooms")],
        images: [img(SWAY, "kapali-havuz"), img(SWAY, "havuz-cam-tavan"), img(SWAY, "fitness"), img(SWAY, "sauna"), img(SWAY, "hamam"), img(SWAY, "masaj")],
      },
      {
        id: "kayak",
        icon: "downhill_skiing",
        title: b("Kayak ve ekipman", "Skiing and equipment"),
        text: b(
          "Tesisin pistlerinde toplam 2 km'lik uluslararası standartlarda parkur bulunur; pistlerin %80'i suni karlama sistemine sahiptir ve gece yarışları için aydınlatılmıştır. Kayak odasından doğrudan pistlere çıkılır; kayak, snowboard ve ek ekipman (kızak, kask, telemark) kiralanabilir. Her odada, ekipmanı ertesi güne kurutan ısıtmalı bir dolap bulunur.",
          "The hotel's slopes offer 2 km of tracks to international standards; 80% are covered by artificial snow and lit for night races. Guests step from the ski room straight onto the slopes and can rent skis, snowboards and extra equipment (sledges, helmets, telemark skis). Every room has a heated locker that dries equipment for the next day.",
        ),
        images: [img(SWAY, "kayak-odasi"), img(SWAY, "cocuk-pisti")],
      },
      {
        id: "toplanti",
        icon: "meeting_room",
        title: b("Kongre merkezi", "Convention centre"),
        text: b(
          "Tümü gün ışığı alan, birinci sınıf donanımlı toplantı salonları: Erzen I-II-III, Astrilla, Kalikala ve VIP salonu.",
          "Meeting halls with first-class equipment, all with daylight: Erzen I-II-III, Astrilla, Kalikala and the VIP lounge.",
        ),
        items: [b("Erzen I-II-III", "Erzen I-II-III"), b("Astrilla", "Astrilla"), b("Kalikala", "Kalikala"), b("VIP salonu", "VIP lounge")],
      },
    ],
    gallery: [img(SWAY, "banyo"), img(SWAY, "kapali-havuz"), img(SWAY, "havuz-cam-tavan"), img(SWAY, "fitness"), img(SWAY, "sauna"), img(SWAY, "hamam"), img(SWAY, "masaj"), img(SWAY, "kayak-odasi")],
  },

  // ───────────────────────── POLAT ─────────────────────────
  {
    slug: POLAT,
    name: "Polat Erzurum Resort Hotel",
    url: "https://polatpalandoken.com/tr/",
    phone: "+904422320010",
    phoneDisplay: "(0442) 232 00 10",
    address: b("Yunusemre, Kayak Yolu Üzeri, 25070 Palandöken / Erzurum", "Yunusemre, Kayak Yolu Üzeri, 25070 Palandöken / Erzurum"),
    mapQuery: "Polat Palandöken Resort Hotel Erzurum",
    focus: "72% 60%",
    tagline: b("Kayak pistlerine yakın, 950 kişiye kadar toplantı kapasitesi ve yüksek irtifa kamplarına yönelik olanaklarla resort otel.", "A resort hotel close to the slopes, with meeting space for up to 950 people and facilities for high-altitude camps."),
    about: [
      b(
        "Polat Palandöken, Palandöken'in yüksek rakımı ve doğal koşullarının sunduğu antrenman ortamını konforlu konaklama ve sporcu odaklı hizmetlerle birleştirir. Sezon hazırlıklarını yüksek irtifada yapmak isteyen yurt içi ve yurt dışı profesyonel futbol takımlarına ev sahipliği yapar.",
        "Polat Palandöken combines the training environment of Palandöken's high altitude and natural conditions with comfortable accommodation and athlete-focused services. It hosts professional football teams from Turkey and abroad that want to prepare for the season at altitude.",
      ),
      b(
        "Erzurum Havalimanı'na yaklaşık 15, şehir merkezine 7 dakika mesafededir. İstanbul, Ankara ve İzmir'den direkt uçuşlarla ulaşım kolaydır.",
        "The hotel is about 15 minutes from Erzurum Airport and 7 minutes from the city centre. Direct flights from Istanbul, Ankara and Izmir make it easy to reach.",
      ),
    ],
    facts: [
      { icon: "flight_takeoff", label: b("Havalimanına", "To the airport"), value: b("yaklaşık 15 dk", "about 15 min") },
      { icon: "location_on", label: b("Şehir merkezine", "To the city centre"), value: b("7 dk", "7 min") },
      { icon: "groups", label: b("Toplantı kapasitesi", "Meeting capacity"), value: b("950 kişiye kadar", "Up to 950 people") },
      { icon: "bed", label: b("Oda tipleri", "Room types"), value: b("7 tip, 32–110 m²", "7 types, 32–110 m²") },
    ],
    amenities: [
      { icon: "downhill_skiing", label: b("Zirveye doğrudan telesiyej erişimi", "Direct chairlift to the summit") },
      { icon: "ac_unit", label: b("500 m² kayak odası, kilitli ve ısıtmalı dolaplar", "500 m² ski room with locked, heated lockers") },
      { icon: "nightlife", label: b("400 m'lik aydınlatılmış gece pisti", "400 m floodlit night slope") },
      { icon: "pool", label: b("Kapalı yüzme havuzu", "Indoor swimming pool") },
      { icon: "fitness_center", label: b("PLNDKN Sports Club fitness", "PLNDKN Sports Club fitness") },
      { icon: "hot_tub", label: b("Türk hamamı, sauna, buhar odası", "Turkish bath, sauna, steam room") },
      { icon: "spa", label: b("Masaj", "Massage") },
      { icon: "child_care", label: b("GYMY Kids Club (4–12 yaş)", "GYMY Kids Club (ages 4–12)") },
      { icon: "meeting_room", label: b("Toplantı ve organizasyon salonları", "Meeting and event halls") },
      { icon: "work", label: b("Han Spaces çalışma alanı", "Han Spaces co-working area") },
    ],
    rooms: [
      {
        name: b("Comfort Oda", "Comfort Room"),
        size: "32 m²",
        text: b("Sıcak ve rahat tasarımlı, dağ ve şehir manzaralı odalar.", "Warm, comfortable rooms with mountain and city views."),
        features: [b("1 yatak odası + 1 banyo", "1 bedroom + 1 bathroom")],
        image: img(POLAT, "comfort-oda"),
      },
      {
        name: b("Deluxe Oda", "Deluxe Room"),
        size: "32 m²",
        text: b("Şık detaylı ve işlevsel tasarımlı, dağ ve şehir manzaralı odalar.", "Stylish, functional rooms with mountain and city views."),
        features: [b("1 yatak odası + 1 banyo", "1 bedroom + 1 bathroom")],
        image: img(POLAT, "deluxe-oda"),
      },
      {
        name: b("Corner Oda", "Corner Room"),
        size: "36 m²",
        capacity: b("3 kişiye kadar", "Up to 3 persons"),
        text: b("Esnek kullanım alanıyla üç kişinin konaklaması için ideal geniş oda.", "A spacious room with flexible space, ideal for three guests."),
        features: [b("1 yatak odası + 1 banyo", "1 bedroom + 1 bathroom")],
        image: img(POLAT, "corner-oda"),
      },
      {
        name: b("Junior Dubleks Suit", "Junior Duplex Suite"),
        size: "75 m²",
        text: b("Şehir manzarasına hâkim; yatak odası, salon ve banyodan oluşan suit.", "A suite overlooking the city, with a bedroom, living room and bathroom."),
        features: [b("1 yatak odası + salon + 1 banyo", "1 bedroom + living room + 1 bathroom")],
        image: img(POLAT, "junior-dubleks-suit"),
      },
      {
        name: b("King Suit", "King Suite"),
        size: "70 m²",
        text: b("Konforlu ve lüks konaklama arayanlar için dağ ve şehir manzaralı suit.", "A suite with mountain and city views for guests seeking comfort and luxury."),
        features: [b("1 yatak odası + 1 salon + 2 banyo", "1 bedroom + 1 living room + 2 bathrooms")],
        image: img(POLAT, "king-suit"),
      },
      {
        name: b("Dubleks Suit", "Duplex Suite"),
        size: "110 m²",
        text: b("Giriş katında şık salon, üst katta yatak odası ve banyo bulunan iki katlı suit.", "A two-storey suite with a stylish living room downstairs and the bedroom and bathroom upstairs."),
        features: [b("1 yatak odası + 1 banyo + salon", "1 bedroom + 1 bathroom + living room")],
        image: img(POLAT, "dubleks-suit"),
      },
      {
        name: b("Family Suit", "Family Suite"),
        size: "96 m²",
        capacity: b("4 kişiye kadar", "Up to 4 persons"),
        text: b("İki yatak odası, geniş salon ve iki banyoyla aileler için.", "Two bedrooms, a large living room and two bathrooms for families."),
        features: [b("2 yatak odası + 2 banyo + 1 salon", "2 bedrooms + 2 bathrooms + 1 living room")],
        image: img(POLAT, "family-suit"),
      },
    ],
    sections: [
      {
        id: "yeme-icme",
        icon: "restaurant",
        title: b("Restoran ve barlar", "Dining and bars"),
        text: b(
          "Kestane Restaurant zengin açık büfesiyle Türk ve dünya mutfaklarını sunar. Palandöken'in 2.500 m'sindeki Peak barbekü menüsüyle, MOMO Après-Ski ise pist molaları için buluşma noktasıdır. Lobby'de Starbucks kahveleri, yetişkinlere özel Secret Bar'da akşam içecekleri servis edilir.",
          "Kestane Restaurant serves Turkish and international cuisine from a rich buffet. Peak, at 2,500 m on Palandöken, offers a barbecue menu, and MOMO Après-Ski is the meeting point for breaks on the slopes. The Lobby serves Starbucks coffee and the adults-only Secret Bar serves evening drinks.",
        ),
        items: [
          b("Kestane Restaurant: kahvaltı 07:00–10:00, öğle 12:00–14:00, akşam 19:00–22:00", "Kestane Restaurant: breakfast 07:00–10:00, lunch 12:00–14:00, dinner 19:00–22:00"),
          b("MOMO Après-Ski", "MOMO Après-Ski"),
          b("Peak (2.500 m)", "Peak (2,500 m)"),
          b("Lobby ve Secret Bar", "Lobby and Secret Bar"),
        ],
        images: [img(POLAT, "kestane-restaurant"), img(POLAT, "secret-bar")],
      },
      {
        id: "spor",
        icon: "fitness_center",
        title: b("Spor ve spa", "Sports and spa"),
        text: b(
          "PLNDKN Sports Club'ta fitness alanı ve kapalı yüzme havuzu; Türk hamamı, sauna, buhar odası ve masaj seçenekleri bulunur. 4–12 yaş çocuklar için GYMY Kids Club, ruh-zihin-beden atölyeleri için The Studio vardır.",
          "PLNDKN Sports Club has a fitness area and an indoor pool, plus a Turkish bath, sauna, steam room and massage options. GYMY Kids Club is for children aged 4–12, and The Studio hosts mind-body workshops.",
        ),
        images: [img(POLAT, "kapali-havuz"), img(POLAT, "spa-odasi")],
      },
      {
        id: "kayak",
        icon: "downhill_skiing",
        title: b("Kayak", "Skiing"),
        text: b(
          "Palandöken'in zirvesi Ejder Tepesi'ne telesiyejle doğrudan erişim, ortalama 70 km'ye varan pistler ve karlama sistemi sunulur. Otelin 400 metrelik aydınlatılmış pistinde gece kayağı yapılabilir; 500 m²'lik kayak odasında kilitli ve ısıtmalı dolaplar bulunur.",
          "A chairlift gives direct access to Ejder Tepesi, the summit of Palandöken, with around 70 km of slopes and a snowmaking system. Night skiing is possible on the hotel's 400 m floodlit slope, and the 500 m² ski room has locked, heated lockers.",
        ),
      },
      {
        id: "kamp",
        icon: "groups",
        title: b("Yüksek irtifa kampları", "High-altitude camps"),
        text: b(
          "Yaklaşık 2.000 m rakımdaki Yüksek İrtifa Kamp Merkezi'nin doğal çim sahaları ve sporcu altyapısıyla takımların sezon öncesi hazırlıkları için kapsamlı olanaklar sunulur.",
          "The natural-grass pitches and athlete infrastructure of the High Altitude Camp Centre at around 2,000 m offer comprehensive facilities for teams' pre-season preparation.",
        ),
      },
      {
        id: "toplanti",
        icon: "meeting_room",
        title: b("Toplantı ve organizasyon", "Meetings and events"),
        text: b(
          "Chapter 1-2, Big Room ve Workshop alanları farklı düzenlerde kullanılabilir; toplam kapasite 950 kişiye ulaşır. Big Room A+B 739 m² alanıyla 700 kişiye kadar tiyatro düzeni sunar.",
          "The Chapter 1-2, Big Room and Workshop spaces can be arranged in different layouts, for up to 950 people in total. Big Room A+B covers 739 m² and seats up to 700 in theatre layout.",
        ),
        images: [img(POLAT, "lobi")],
      },
    ],
    gallery: [img(POLAT, "banyo"), img(POLAT, "kestane-restaurant"), img(POLAT, "secret-bar"), img(POLAT, "kapali-havuz"), img(POLAT, "lobi"), img(POLAT, "spa-odasi")],
  },

  // ───────────────────────── SNOWDORA ─────────────────────────
  {
    slug: SNOW,
    name: "Snowdora Hotel Palandöken",
    url: "https://www.snowdora.com",
    phone: "+904423170804",
    phoneDisplay: "+90 (442) 317 08 04",
    email: "info@snowdora.com",
    address: b("Yunus Emre Mah. Palandöken Kayak Merkezi, Snowdora Hotel, Erzurum", "Yunus Emre Mah. Palandöken Ski Resort, Snowdora Hotel, Erzurum"),
    mapQuery: "Snowdora Hotel Palandöken Erzurum",
    tagline: b("Pistlere 100 metre mesafede; standart oda, suit ve ahşap bungalovlarıyla aile dostu kayak oteli.", "A family-friendly ski hotel 100 metres from the slopes, with standard rooms, suites and wooden bungalows."),
    about: [
      b(
        "2016'dan beri hizmet veren Snowdora Otel 2023'te yenilenmiştir. Palandöken kayak merkezinin başlangıç noktasında, pistlere yalnızca 100 metre mesafededir; Erzurum şehir merkezine ise yaklaşık 5 dakikadır. Otel, Erzurum Büyükşehir Belediyesi'nin hizmet vizyonuyla işletilir.",
        "Serving guests since 2016 and renovated in 2023, Snowdora Hotel stands at the start of the Palandöken ski area, only 100 metres from the slopes and about 5 minutes from Erzurum city centre. It is run in line with the service vision of Erzurum Metropolitan Municipality.",
      ),
      b(
        "71 standart oda, 8 suit ve 8 bungalovdan oluşan toplam 87 odası ve 140 yatak kapasitesi vardır. Konaklamanın yanında düğün, nişan, kına, mezuniyet, balo ve toplantı salonlarıyla organizasyonlara da ev sahipliği yapar.",
        "With 71 standard rooms, 8 suites and 8 bungalows, it has 87 rooms and 140 beds in total. Besides accommodation, it hosts weddings, engagements, graduations, balls and meetings in its halls.",
      ),
    ],
    facts: [
      { icon: "bed", label: b("Oda sayısı", "Rooms"), value: b("87 oda, 140 yatak", "87 rooms, 140 beds") },
      { icon: "directions_walk", label: b("Pistlere uzaklık", "Distance to slopes"), value: b("100 m", "100 m") },
      { icon: "location_on", label: b("Şehir merkezine", "To the city centre"), value: b("yaklaşık 5 dk", "about 5 min") },
      { icon: "restaurant", label: b("Kahvaltı", "Breakfast"), value: b("Dahil", "Included") },
    ],
    amenities: [
      { icon: "bathtub", label: b("Duşlu banyo ve saç kurutma makinesi", "Shower and hairdryer") },
      { icon: "tv", label: b("LCD TV ve uydu kanalları", "LCD TV and satellite channels") },
      { icon: "wifi", label: b("Ücretsiz kablosuz internet", "Free wireless internet") },
      { icon: "coffee_maker", label: b("Minibar ve telefon", "Minibar and telephone") },
      { icon: "restaurant", label: b("Kahvaltı dahil", "Breakfast included") },
      { icon: "local_parking", label: b("Otopark", "Car park") },
      { icon: "local_cafe", label: b("Lobide şömine ve snack bar", "Lobby fireplace and snack bar") },
      { icon: "celebration", label: b("Organizasyon ve toplantı salonları", "Event and meeting halls") },
    ],
    rooms: [
      {
        name: b("Standart Oda", "Standard Room"),
        capacity: b("Tek veya iki kişilik", "Single or double"),
        text: b("Palandöken manzaralı, tek ve iki kişilik seçeneklerle sunulan konforlu odalar; 71 oda.", "Comfortable rooms with Palandöken views, available as single or double; 71 rooms."),
        image: img(SNOW, "standart-oda"),
      },
      {
        name: b("Suit Oda", "Suite"),
        text: b("Oturma ve yatak odası olmak üzere iki ayrı alan; 8 suit.", "Two separate areas, a sitting room and a bedroom; 8 suites."),
        image: img(SNOW, "suit-oda"),
      },
      {
        name: b("Family Suit Oda", "Family Suite"),
        text: b("Oturma ve yatak odasından oluşur; bağlantı kapısıyla bir standart oda eklenerek aileler ve kalabalık gruplar için geniş bir alan elde edilir.", "Made up of a sitting room and a bedroom; a standard room can be added through a connecting door to create a large space for families and groups."),
        image: img(SNOW, "family-suit"),
      },
      {
        name: b("Bungalov / Villa", "Bungalow / Villa"),
        capacity: b("4 kişilik", "4 persons"),
        text: b("Doğayla iç içe, gökyüzünü görebilen açık tavanlı 4 kişilik ahşap evler; 8 bungalov.", "Wooden houses for four, close to nature, with an open ceiling to see the sky; 8 bungalows."),
        image: img(SNOW, "bungalov"),
      },
    ],
    sections: [
      {
        id: "yeme-icme",
        icon: "restaurant",
        title: b("Restoran ve kafeler", "Dining and cafés"),
        text: b(
          "Deneyimli mutfak ekibi dünya ve yöresel mutfakların lezzetlerini sunar. Restoran ve kafe alanları Palandöken manzarası eşliğinde hizmet verir.",
          "An experienced kitchen team serves international and regional dishes. The restaurant and café areas look out over Palandöken.",
        ),
        items: [b("Küre Kafe & Restorant", "Küre Café & Restaurant"), b("Sultan Sekisi", "Sultan Sekisi"), b("Kapsül Cafe", "Kapsül Cafe"), b("Fanus Cafe", "Fanus Cafe")],
        images: [img(SNOW, "restoran"), img(SNOW, "kafe"), img(SNOW, "cam-koridor")],
      },
      {
        id: "organizasyon",
        icon: "celebration",
        title: b("Organizasyon ve toplantı", "Events and meetings"),
        text: b(
          "Ejder Salon ve VIP Salon; düğün, nişan, kına, mezuniyet, balo ve toplantılar için kullanılabilir.",
          "Ejder Hall and VIP Hall can be used for weddings, engagements, graduations, balls and meetings.",
        ),
        items: [b("Ejder Salon", "Ejder Hall"), b("VIP Salon", "VIP Hall")],
        images: [img(SNOW, "balo-salonu"), img(SNOW, "toplanti-salonu")],
      },
    ],
    gallery: [img(SNOW, "standart-oda-2"), img(SNOW, "restoran"), img(SNOW, "kafe"), img(SNOW, "cam-koridor"), img(SNOW, "balo-salonu"), img(SNOW, "toplanti-salonu")],
  },
];

export function getHotel(slug: string): Hotel | undefined {
  return HOTELS.find((h) => h.slug === slug);
}

/** Otel kartında kullanılan kapak fotoğrafı. */
export const hotelCover = (slug: string) => `/images/oteller/${slug}.jpg`;
