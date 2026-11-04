export const FACILITIES_SEED = [
  {
    slug: 'yuzme-havuzu',
    category: 'YÜZME & SU SPORLARI',
    icon: 'pool',
    title: '50m Kapalı Olimpik Yüzme Havuzu',
    description:
      "Türkiye'nin tek yüksek irtifa tam olimpik kapalı havuzu. 10 kulvar, OMEGA dokunmatik zaman panoları, su altı video-biyomekanik kayıt ve laktat ölçüm iskelesi.",
    badge: '2.100M İRTİFA',
    footerLeft: 'VO2 Max ve Dayanıklılık Kampı',
    footerRight: '10 Kulvar / 50m',
    stats: null,
    sortOrder: 1,
  },
  {
    slug: 'futbol-sahalari',
    category: 'FUTBOL & ÇİM SAHALAR',
    icon: 'sports_soccer',
    title: '11+ FIFA Doğal Çim Futbol Sahası',
    description:
      'Palandöken eteklerinde Süper Lig ve UEFA takımlarının sezon öncesi ana kamp merkezi. Otomatik drenaj, yüksek irtifa nem tutumu ve LED projektör sistemleri.',
    badge: '11+ FIFA STANDARDI',
    footerLeft: 'Süper Lig & Uluslararası Kamplar',
    footerRight: '68 x 105m Ebat',
    stats: null,
    sortOrder: 2,
  },
  {
    slug: 'buz-curling-arenasi',
    category: 'BUZ SPORLARI & CURLING',
    icon: 'ac_unit',
    title: 'Müstakil Curling & Buz Arenası',
    description:
      "Türkiye'nin ilk 5 bağımsız pistli Curling Salonu ve 3.000 kişilik Short Track & Buz Hokeyi Kompleksi. WCF akrediteli iklimlendirme.",
    badge: "TÜRKİYE'DE TEK",
    footerLeft: 'WCF ve IIHF Şampiyonaları',
    footerRight: '5 Bağımsız Sheet',
    stats: null,
    sortOrder: 3,
  },
  {
    slug: 'dovus-sporlari-tohm',
    category: 'DÖVÜŞ & GÜREŞ MERKEZİ',
    icon: 'sports_mma',
    title: 'Dövüş Sporları & TOHM Arenası',
    description:
      'Güreş (Serbest/Grekoromen), Boks, Judo ve Tekvando branşları için özel yaylı 6 uluslararası tatami, ring modülleri ve darbe emici zeminler.',
    badge: 'TOHM Erzurum',
    footerLeft: 'Milli Takım Kampları',
    footerRight: 'Sauna & Şok Havuzu Entegre',
    stats: [
      { label: 'Güreş Minderi:', value: '4 Olimpik Alan' },
      { label: 'Boks Ringi:', value: '2 AIBA Onaylı' },
    ],
    sortOrder: 4,
  },
  {
    slug: 'atletizm-kros',
    category: 'ATLETİZM & KROS',
    icon: 'sprint',
    title: 'Olimpik Tartan Pist & Kros',
    description:
      '400 metre 8 kulvarlı IAAF sertifikalı sentetik tartan pist, engelli koşu çukuru ve Palandöken orman koridorlarında 2.400 metreye tırmanan doğal dağ kros rotaları.',
    badge: 'Kazım Karabekir Yerleşkesi',
    footerLeft: 'Maraton & Orta Mesafe Üssü',
    footerRight: 'Rüzgar Koridoru Ölçümlü',
    stats: [
      { label: 'Pist Kulvarı:', value: '8 Kulvar IAAF' },
      { label: 'Kros Rotası:', value: '15 km Dağ Parkuru' },
    ],
    sortOrder: 5,
  },
  {
    slug: 'salon-sporlari',
    category: 'SALON SPORLARI',
    icon: 'sports_volleyball',
    title: '3.000 Kişilik Çok Amaçlı Salon',
    description:
      'FIBA ve FIVB standartlarında masif ahşap parke zemin. Voleybol, Basketbol ve Hentbol milli takımları için kondisyon, skorbord ve canlı yayın donanımı.',
    badge: 'Recep Tayyip Erdoğan & Atatürk',
    footerLeft: 'Voleybol / Basketbol Kampları',
    footerRight: 'Kuvvet & Ağırlık Salonu Entegre',
    stats: [
      { label: 'Kapasite:', value: '3.000 Koltuk' },
      { label: 'Zemin:', value: 'Harwood Spor Parkesi' },
    ],
    sortOrder: 6,
  },
];
