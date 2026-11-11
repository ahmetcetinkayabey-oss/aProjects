// Tesis ayrıntı metinleri. Her paragraf bir dizi öğesi; "## " ile başlayan satır ara başlıktır.
// Kaynaklar: Vikipedi (tr/en), FISU, skisprungschanzen.com, Anadolu Ajansı/Habertürk haberleri ve sitenin mevcut tesis verisi.
// Doğrulanamayan sayı ve iddia YAZILMAZ; kesin kapasite ve işletme durumu için tesisle iletişim önerilir.
const j = (a) => a.join("\n");

export const FACILITIES = {
  "yuzme-havuzu": {
    tr: j([
      "Erzurum'un yüksek rakımlı ortamında, tüm yıl kullanılabilen kapalı bir olimpik havuz: 50 metre uzunluğunda ve 10 kulvarlı. Sabah ve akşam antrenmanlarını hava koşullarından bağımsız planlamak isteyen yüzme, su topu ve triatlon ekipleri için aradığı düzeni sunar.",
      "## Antrenman donanımı",
      "Havuzda OMEGA dokunmatik zaman panoları, su altı video-biyomekanik kayıt sistemi ve laktat ölçümü için iskele bulunur. Bu donanım, antrenörün tempo, dönüş ve çıkış analizini aynı seans içinde yapmasına ve sporcuya görüntüyle geri bildirim vermesine olanak tanır.",
      "## Yüksek rakımda yüzme kampı",
      "Yüksek rakım, solunum ve dayanıklılık çalışmalarının planlandığı kamplarda tercih edilir. Vücudun yeni ortama uyumu kişiden kişiye değiştiği için ilk günlerde yükü kademeli artırmak, laktat ve nabız takibini düzenli yapmak yaygın uygulamadır. Kamp süresi ve yük planı, takımın antrenörü ve sağlık ekibiyle birlikte belirlenmelidir.",
      "## Kimler için uygun",
      "Milli takım ve kulüp kampları, dayanıklılık ve VO2 max çalışmaları yapan ekipler, havuz kullanımını Palandöken'deki diğer branşlarla birleştiren çok branşlı kafileler.",
      "Takvim, kulvar tahsisi ve kullanım saatleri için rezervasyon formundan talep oluşturabilirsiniz; ekibimiz sizinle iletişime geçer.",
    ]),
    en: j([
      "A year-round indoor Olympic pool in Erzurum's high-altitude setting: 50 metres long with 10 lanes. It lets swimming, water polo and triathlon squads plan morning and evening sessions regardless of the weather.",
      "## Training equipment",
      "The pool is equipped with OMEGA touch-pad timing boards, an underwater video-biomechanics recording system and a pier for lactate testing. Coaches can analyse pace, turns and starts within the same session and give swimmers visual feedback.",
      "## Swimming camps at altitude",
      "High altitude is chosen for camps built around breathing and endurance work. Because adaptation differs from person to person, it is common to raise the load gradually in the first days and to monitor lactate and heart rate regularly. Camp length and load should be set together with the team's coach and medical staff.",
      "## Who it suits",
      "National-team and club camps, squads doing endurance and VO2 max work, and multi-sport delegations that combine pool time with other disciplines in Palandöken.",
      "Use the reservation form to request dates, lane allocation and session times; our team will get in touch.",
    ]),
  },

  "futbol-sahalari": {
    tr: j([
      "Palandöken'in eteklerindeki Yüksek İrtifa Kamp Merkezi, çok sayıda yerli ve yabancı takıma kamp yaptırmış bir futbol kamp merkezidir. Doğal çim sahalar, otomatik drenaj sistemi ve LED projektörlerle yaz kampından sezon ortası hazırlığa kadar farklı programlara uyum sağlar.",
      "## Sahalar ve işleyiş",
      "Merkezde 11+ FIFA standardında doğal çim sahalar bulunur. Büyükşehir Belediyesi'nin açıklamalarına göre her saha bir günde yalnızca tek takıma tahsis edilir ve saha bakımı yıl boyunca sürer; böylece her kafile kendi antrenman düzenini sahada kimseyle paylaşmadan uygulayabilir. Tesiste doktor, hakem ve masaj odaları ile modern soyunma odaları yer alır.",
      "## Kimler kamp yaptı",
      "Merkezin tarihçesinde Süper Lig, 1., 2. ve 3. Lig takımları ile yabancı kulüpler yer alır. 2015-2016 ve 2016-2017 sezonlarında yerli ve yabancı takımlar kamp yapmış, Türkiye Futbol Federasyonu da Pro Lisans, UEFA A ve UEFA B kurslarını burada düzenlemiştir. Belediye yetkilileri, kuruluşundan bugüne yüzlerce takımın kamp yaptığını belirtmektedir.",
      "## Yüksek rakım ve serin yaz",
      "Yaz aylarındaki serin hava ve yüksek rakım, sezon öncesi kondisyon dönemi için tercih sebebidir. Rakıma uyum kişiden kişiye değişir; takımın sağlık ekibi ilk günlerde yükü kademeli artırmayı planlamalıdır.",
      "Kamp tarihleri, saha tahsisi ve konaklama seçenekleri için talep formunu doldurabilirsiniz.",
    ]),
    en: j([
      "At the foot of Palandöken, the High Altitude Camp Centre is a football camp centre that has hosted a large number of domestic and foreign teams. Natural-grass pitches, automatic drainage and LED floodlights suit programmes from summer camps to mid-season preparation.",
      "## Pitches and how they are run",
      "The centre has natural-grass pitches built to the 11+ FIFA standard. According to the Metropolitan Municipality, each pitch is allocated to a single team per day and maintained all year, so every squad can run its training without sharing the pitch. The site includes doctor, referee and massage rooms and modern changing rooms.",
      "## Who has camped here",
      "The centre's history includes Süper Lig and 1st, 2nd and 3rd League sides as well as foreign clubs. Domestic and foreign teams held camps in the 2015-16 and 2016-17 seasons, and the Turkish Football Federation ran its Pro Licence, UEFA A and UEFA B courses here. Municipal officials say hundreds of teams have camped here since opening.",
      "## High altitude and cool summers",
      "Cool summer weather and altitude are why teams choose it for pre-season conditioning. Adaptation varies by person, so medical staff should plan to raise the load gradually in the first days.",
      "Send a request for dates, pitch allocation and accommodation options through the reservation form.",
    ]),
  },

  "buz-curling-arenasi": {
    tr: j([
      "Erzurum, curling sporunu uluslararası ölçekte ağırlamış bir şehirdir: 2011 Kış Üniversiadı'nda curling (körling) müsabakaları Erzurum'daki salonda oynandı, 2017 Avrupa Gençlik Olimpik Kış Festivali'nde de aynı spor için Milli Piyango Körling Salonu kullanıldı.",
      "## Salon",
      "Palandöken'deki curling salonu 5 bağımsız pist (sheet) ve 1.000 seyirci kapasitesiyle takım kampları, ligler ve turnuvalar için kullanılabilir. Birden fazla pist, aynı anda birden fazla takımın çalışmasına ve maç simülasyonu yapılmasına olanak verir.",
      "## Curling nedir",
      "Dört kişilik iki takımın buz üzerinde granit taşları hedef alana kaydırdığı, strateji ve hassasiyet gerektiren bir kış sporudur. Oyuncular taşın önündeki buzu süpürerek hızını ve yönünü etkiler. Yeni başlayanlar için kısa bir rehberi Haberler bölümümüzde bulabilirsiniz.",
      "## Kamp planı",
      "Curling kampları genellikle teknik atış çalışmaları, süpürme koordinasyonu ve maç taktiğinden oluşur. Buz hazırlığı ve salon saatleri sezona göre değiştiği için tarih ve pist sayısı için talep formundan bize ulaşın.",
    ]),
    en: j([
      "Erzurum has hosted curling at international level: the 2011 Winter Universiade curling events were played in Erzurum, and the Milli Piyango Curling Hall was used for the sport at the 2017 European Youth Olympic Winter Festival.",
      "## The hall",
      "The curling hall in Palandöken offers five independent sheets and a capacity of 1,000 spectators for team camps, leagues and tournaments. Multiple sheets let several teams train at once and run match simulations.",
      "## What is curling",
      "Two teams of four slide granite stones across the ice toward a target area in a sport of strategy and precision. Players sweep the ice in front of the stone to influence its speed and direction. A short beginner's guide is available in our News section.",
      "## Camp planning",
      "Curling camps typically combine delivery technique, sweeping coordination and match tactics. Ice preparation and hall hours change with the season, so contact us through the request form for dates and the number of sheets.",
    ]),
  },

  "dovus-sporlari-tohm": {
    tr: j([
      "Güreş, boks, judo ve tekvando branşlarının milli takım ve kulüp kamplarına ev sahipliği yapan bu arena, farklı dövüş sporlarını tek çatı altında toplar. Özel yaylı tatamiler, ring modülleri ve darbe emici zeminler, yoğun antrenman dönemlerinde sporcunun eklemlerini korumaya yöneliktir.",
      "## Alanlar",
      "Tesiste serbest ve grekoromen güreş için 4 olimpik minder alanı, 2 AIBA onaylı boks ringi ve yaylı tatamiler bulunur. Sauna ve şok havuzu entegre olduğundan antrenman sonrası toparlanma aynı yerde yapılabilir.",
      "## Kamp mantığı",
      "Dövüş sporlarında kamp genellikle iki parçalıdır: sabah teknik ve kondisyon, akşam sparing ve taktik çalışması. Yüksek rakım, dayanıklılık ve kilo yönetimi çalışmalarında kullanılır. Kilo düşürme ve rakıma uyum gibi konular sağlık ekibi gözetiminde planlanmalıdır.",
      "Hazırlık dönemi, kafile büyüklüğü ve alan tahsisi için rezervasyon formundan talepte bulunabilirsiniz.",
    ]),
    en: j([
      "This arena hosts national-team and club camps in wrestling, boxing, judo and taekwondo, bringing several combat sports under one roof. Sprung tatami, ring modules and impact-absorbing floors are designed to protect athletes' joints during heavy training blocks.",
      "## Areas",
      "The venue has 4 Olympic wrestling mat areas, 2 AIBA-approved boxing rings and sprung tatami. A sauna and cold plunge pool are integrated, so post-session recovery can be done on site.",
      "## How camps work",
      "Combat-sport camps are often split in two: technique and conditioning in the morning, sparring and tactics in the evening. Altitude is used for endurance and weight-management work, and topics such as weight cutting and adaptation to altitude should be planned under medical supervision.",
      "Request dates, squad size and area allocation through the reservation form.",
    ]),
  },

  "atletizm-kros": {
    tr: j([
      "Atletizm kampında pist ve doğa bir arada çalışılır: 400 metre, 8 kulvarlı IAAF sertifikalı sentetik tartan pist ile Palandöken'in orman koridorlarından yükselen dağ kros rotaları. Uzun mesafe ve orta mesafe koşucuları için yüksek rakımda hacim çalışması yapmanın klasik yollarından biridir.",
      "## Pist ve rotalar",
      "Pistte engelli koşu çukuru bulunur ve rüzgâr koridoru ölçümlüdür. Dağ kros rotası yaklaşık 15 km'lik parkurla 2.400 metreye kadar tırmanır; böylece sporcular aynı gün hem pist hızı hem de arazi dayanıklılığı çalışabilir.",
      "## Kamplar",
      "Maraton ve orta mesafe kampları, yüksek rakımda aerobik temel döneminin yapıldığı üslerdendir. Rakımda ilk günlerde yükü azaltmak, nabız ve toparlanma takibini sıklaştırmak ve demir ile hidrasyon durumunu sağlık ekibiyle gözden geçirmek yaygın uygulamalardır.",
      "Kafile büyüklüğü, tarih ve pist tahsisi için talep formumuzu kullanabilirsiniz.",
    ]),
    en: j([
      "Athletics camps here combine track and nature: a 400 m, 8-lane IAAF-certified synthetic tartan track and mountain cross-country routes that climb through Palandöken's forest corridors. It is a classic way for distance and middle-distance runners to build volume at altitude.",
      "## Track and routes",
      "The track has a steeplechase water pit and a wind-corridor measurement. The cross-country route runs roughly 15 km and climbs to 2,400 metres, so athletes can work on track speed and terrain endurance on the same day.",
      "## Camps",
      "Marathon and middle-distance camps use it as a base for the aerobic foundation phase at altitude. Common practice is to reduce load in the first days, monitor heart rate and recovery more often, and review iron and hydration status with the medical staff.",
      "Use our request form for squad size, dates and track allocation.",
    ]),
  },

  "salon-sporlari": {
    tr: j([
      "Recep Tayyip Erdoğan ve Atatürk salonları, voleybol, basketbol ve hentbol gibi salon branşlarının milli takım ve kulüp kampları için hazırlanmış 3.000 kişilik çok amaçlı bir tesistir. FIBA ve FIVB standartlarında masif ahşap parke zemin, skorbord ve canlı yayın donanımı sunar.",
      "## Donanım",
      "Zemin ahşap spor parkesidir; kapasite 3.000 koltuktur. Kuvvet ve ağırlık salonu entegre olduğundan sahada taktik çalışması ile salonda kondisyon antrenmanı aynı gün yapılabilir. Canlı yayın altyapısı hazırlık maçlarının yayınlanmasına veya antrenman görüntüsü alınmasına uygundur.",
      "## Kamplar",
      "Voleybol ve basketbol kampları genellikle sabah kondisyon, öğleden sonra taktik ve akşam hazırlık maçı düzeninde ilerler. Bir arada birden fazla takım getiren kafileler için salon saatleri ve yardımcı alanlar önceden planlanmalıdır.",
      "Tarih ve saat tahsisi için rezervasyon formundan talep oluşturabilirsiniz.",
    ]),
    en: j([
      "The Recep Tayyip Erdoğan and Atatürk halls form a 3,000-seat multi-purpose venue for national-team and club camps in indoor sports such as volleyball, basketball and handball. It offers FIBA- and FIVB-standard solid-wood parquet, a scoreboard and live-broadcast equipment.",
      "## Equipment",
      "The floor is wooden sports parquet and capacity is 3,000 seats. With a strength and weight room integrated, tactical work on court and conditioning in the gym can be done on the same day. The broadcast infrastructure suits streaming friendlies or recording training footage.",
      "## Camps",
      "Volleyball and basketball camps usually run conditioning in the morning, tactics in the afternoon and a friendly in the evening. Delegations bringing several teams should plan hall hours and auxiliary spaces in advance.",
      "Request dates and time slots through the reservation form.",
    ]),
  },

  "buz-hokeyi-pateni": {
    tr: j([
      "Erzurum'un kapalı buz salonları, 2011 Kış Üniversiadı ve 2017 Avrupa Gençlik Olimpik Kış Festivali gibi uluslararası organizasyonlarda kullanıldı. Şehirde iki ana salon öne çıkar: buz hokeyi için Cemal Gürsel Spor Kampüsü'ndeki 3.000 seyirci kapasiteli salon ve Palandöken'deki 2.000 seyirci kapasiteli buz pateni salonu.",
      "## Palandöken Buz Pateni Salonu",
      "Vikipedi'ye göre 2008'de açılan salon, kapalı buz pateni ve buz hokeyi pisti olarak tanımlanır ve 2011 Üniversiadı'nda artistik buz pateni müsabakalarına ev sahipliği yapmıştır. Seyirci kapasitesi kaynaklarda yaklaşık 2.000 olarak geçer; kesin sayı için tesisle iletişime geçilmelidir.",
      "## Buz hokeyi salonu",
      "Erzurum'daki buz hokeyi salonlarından biri Yakutiye'dedir; 2009'da hizmete girmiş ve 2017 EYOF'ta buz hokeyi müsabakalarına ev sahipliği yapmıştır. Short track, artistik paten ve hokey kamplarında buz saatleri, takım sayısına göre bölünerek planlanabilir.",
      "## Kamp",
      "Buz sporlarında kamp planı, buz hazırlığı ve salon saatlerine bağlıdır. Sporcuların yüksek rakıma uyumu ve kıyafet/ekipman lojistiği önceden gözden geçirilmelidir. Tarih ve buz saati için talep formunu kullanabilirsiniz.",
    ]),
    en: j([
      "Erzurum's indoor ice halls were used in international events such as the 2011 Winter Universiade and the 2017 European Youth Olympic Winter Festival. Two main halls stand out: the 3,000-seat ice hockey hall at the Cemal Gürsel Sports Campus and the 2,000-seat ice skating hall in Palandöken.",
      "## Palandöken Ice Skating Hall",
      "According to Wikipedia, the hall opened in 2008, is described as an indoor skating and ice hockey rink, and hosted figure skating at the 2011 Universiade. Sources give a capacity of about 2,000; contact the venue for the exact figure.",
      "## Ice hockey hall",
      "One of Erzurum's ice hockey halls is in Yakutiye; it opened in 2009 and hosted the ice hockey events at the 2017 EYOWF. For short track, figure skating and hockey camps, ice time can be split by team count.",
      "## Camps",
      "Camp planning for ice sports depends on ice preparation and hall hours. Athletes' adaptation to altitude and equipment logistics should be reviewed in advance. Use the request form for dates and ice time.",
    ]),
  },

  "judo-salonu": {
    tr: j([
      "Judo kampları için tatami zeminli spor salonlarında çalışma imkânı: tekniğin, ayakta ve yerde mücadelenin ve kondisyonun aynı programda yürütüldüğü milli takım ve kulüp kampları.",
      "## Çalışma düzeni",
      "Tatami üzerinde teknik, randori ve uchi-komi çalışmaları; salon dışında koşu, kuvvet ve dayanıklılık antrenmanları yapılır. Yüksek irtifa ortamı özellikle dayanıklılık temelli çalışmalarda tercih edilir.",
      "## Diğer dövüş sporlarıyla birlikte",
      "Judo kafileleri, aynı merkezde güreş, boks ve tekvando ekipleriyle yan yana kamp yapabilir. Dövüş sporları arenasındaki sauna ve şok havuzu toparlanma için kullanılabilir. Kilo yönetimi ve rakıma uyum gibi konular sağlık ekibi gözetiminde planlanmalıdır.",
      "Kafile büyüklüğü ve tarih için rezervasyon formundan talep oluşturabilirsiniz.",
    ]),
    en: j([
      "Judo camps can train in sports halls with tatami floors, running technique, standing and ground work and conditioning in one programme, for national-team and club camps.",
      "## Training pattern",
      "On the tatami: technique, randori and uchi-komi. Off the mat: running, strength and endurance work. The high-altitude setting is favoured especially for endurance-based training.",
      "## Alongside other combat sports",
      "Judo squads can camp next to wrestling, boxing and taekwondo teams at the same centre, and the combat-sports arena's sauna and cold plunge pool are available for recovery. Weight management and adaptation to altitude should be planned under medical supervision.",
      "Request dates and squad size through the reservation form.",
    ]),
  },

  "kayak-snowboard": {
    tr: j([
      "Palandöken Kayak Merkezi, Erzurum il merkezinin yaklaşık 7 km güneybatısında, Palandöken Dağı'nın eteklerinde yer alır. Vikipedi'ye göre merkezin tabanı 2.200 metre, en üst noktası 3.176 metredir; yani kayakçı yaklaşık bin metrelik bir kot farkı üzerinde pist bulur.",
      "## Pistler ve kapasite",
      "Farklı eğimlerde 22 pist ve toplam yaklaşık 28 km kayak alanı vardır. En uzun pist 12 km uzunluğunda ve 1.100 metrelik kot farkına sahiptir. 'Ejder' ve 'Kapıkaya' pistleri olimpik boyuttadır ve slalom ile dev slalom için uygundur. Bir gondol hattı ve telesiyejler saatte toplam 8.100 kayakçı taşıyabilir; pistler gece kayağı için aydınlatılmıştır.",
      "## Sezon",
      "Kayak sezonu ortalama olarak ekim sonunda başlar, yüksek bölgelerde mayıs ayının ilk haftalarına kadar sürer. Bu uzun süre, kamp planlayan takımlar için erken ve geç sezon antrenman seçenekleri sunar.",
      "## Uluslararası organizasyonlar",
      "Merkez, 2011 Kış Üniversiadı için tamamlanmış; Üniversiadı'nda snowboard ve serbest stil kayak, 2017 Avrupa Gençlik Olimpik Kış Festivali'nde ise alp disiplini ve snowboard müsabakalarına ev sahipliği yapmıştır. İşletme Eylül 2016'dan bu yana Erzurum Büyükşehir Belediyesi'ndedir.",
      "Kamp tarihi, ekipman kiralama ve konaklama için rezervasyon formundan bize ulaşabilirsiniz. Hava ve pist durumu için güncel bilgi almanızı öneririz.",
    ]),
    en: j([
      "Palandöken Ski Resort sits at the foot of Palandöken Mountain, about 7 km south-west of Erzurum city centre. According to Wikipedia, the base is at 2,200 metres and the top at 3,176 metres, giving skiers roughly a thousand metres of vertical drop.",
      "## Slopes and capacity",
      "There are 22 slopes of varying gradients with about 28 km of ski terrain in total. The longest run is 12 km with a 1,100 m vertical drop. The 'Ejder' and 'Kapıkaya' runs are Olympic-size and suit slalom and giant slalom. A gondola line and chairlifts carry up to 8,100 skiers an hour, and slopes are floodlit for night skiing.",
      "## Season",
      "The ski season typically starts in late October and, at higher elevations, runs into the first weeks of May. That length gives camp planners early- and late-season training options.",
      "## International events",
      "The resort was completed for the 2011 Winter Universiade, which used it for snowboard and freestyle skiing; the 2017 European Youth Olympic Winter Festival held alpine skiing and snowboard events here. Since September 2016 it has been operated by the Erzurum Metropolitan Municipality.",
      "Contact us through the reservation form for camp dates, equipment rental and accommodation. We recommend checking current weather and slope conditions.",
    ]),
  },

  "kayakla-atlama": {
    tr: j([
      "Kiremitliktepe Kayakla Atlama Kuleleri, Palandöken Dağı'nın eteğinde, Erzurum'un güneybatısında yer alır. 2010'da yapılan kompleks, 2011 Kış Üniversiadı'nda ve 2017 Avrupa Gençlik Olimpik Kış Festivali'nde kullanılan Erzurum'un sembol kış tesislerinden biridir.",
      "## Tepeler",
      "Kompleks beş atlama tepesinden oluşur: K20, K40 ve K65 küçük çalışma tepeleri ile K95 normal ve K125 büyük tepe. Büyük tepenin hill size değeri HS140, normal tepeninki HS109'dur. Büyük tepede kayıtlı mesafe rekoru 143,5 metredir (29 Ocak 2011, Üniversiadı).",
      "## Heyelan ve yeniden yapım",
      "Temmuz 2014'te kompleks bir heyelanda ağır hasar gördü; beş tepenin iniş bölgeleri ve tribünler büyük ölçüde zarar gördü, yaralanma olmadı. Yeniden yapım kaynaklara göre yaklaşık iki buçuk yıl sürdü ve yeni tepelerde ilk atlayışlar 2018-19 sezonunda yapıldı.",
      "## Kamp için not",
      "Atlama kuleleri nordik branş kampları ve organizasyonları için kullanılır. Tesisin güncel işletme durumu, kullanım saatleri ve açık tepeler zamanla değiştiği için kamp planlamadan önce bizden güncel bilgi alınız; talep formunu kullanabilirsiniz.",
    ]),
    en: j([
      "The Kiremitliktepe Ski Jumping Hills lie at the foot of Palandöken Mountain, south-west of Erzurum. Built in 2010, the complex is one of Erzurum's signature winter venues, used for the 2011 Winter Universiade and the 2017 European Youth Olympic Winter Festival.",
      "## The hills",
      "The complex has five jumps: small K20, K40 and K65 training hills, a K95 normal hill and a K125 large hill. The large hill has a hill size of HS140 and the normal hill HS109. The large-hill record is 143.5 metres (29 January 2011, at the Universiade).",
      "## Landslide and reconstruction",
      "In July 2014 a landslide seriously damaged the complex; the landing areas of all five hills and the stands were largely destroyed, with no injuries. According to sources, reconstruction took about two and a half years and the first jumps on the new hills were made in the 2018-19 season.",
      "## Note for camps",
      "The hills are used for Nordic camps and events. Because the venue's current operating status, hours and open hills change over time, please get current information from us before planning a camp; use the request form.",
    ]),
  },
};
