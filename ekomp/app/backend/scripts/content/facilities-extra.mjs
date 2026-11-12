// Tesis ayrıntı metinlerine EKLENEN bölümler (facilities.mjs'teki metnin kapanış cümlesinden önce yerleştirilir).
// Kaynaklar: Vikipedi (Palandöken Dağı, 2011 Kış Üniversiadı), FISU, havalimanı/ulaşım rehberleri, TRT/DHA/Fanatik/Cumhuriyet haber başlıkları.
// Kurallar: doğrulanamayan sayı yazılmaz; kaynakların farklı verdiği değerler aralık olarak yazılır;
// genel spor bilgisi "genellikle/yaygın" diye temkinli verilir; tesise özgü kesin iddia sitenin mevcut verisiyle sınırlıdır.

const j = (a) => a.join("\n");

// Birçok tesiste ortak: ulaşım ve rakım (kaynaklar mesafeleri farklı veriyor, bu yüzden aralık).
const ULASIM_TR = [
  "## Ulaşım ve rakım",
  "Erzurum il merkezi deniz seviyesinden yaklaşık 1.900-2.000 metre yüksekliktedir; Palandöken Kayak Merkezi şehir merkezinin yaklaşık 7 km güneybatısındadır. Erzurum Havalimanı kaynaklara göre şehir merkezine yaklaşık 11-16 km, Palandöken'e yaklaşık 10 km mesafededir; rakamlar ölçüm noktasına göre değiştiği için kafile transferi planlanırken güncel süre bizden teyit edilmelidir.",
];
const ULASIM_EN = [
  "## Getting here and altitude",
  "Erzurum city centre lies at roughly 1,900-2,000 metres above sea level; Palandöken Ski Resort is about 7 km south-west of the centre. Depending on the source, Erzurum Airport is roughly 11-16 km from the city centre and about 10 km from Palandöken; since figures depend on where they are measured, please confirm current transfer times with us when planning a squad transfer.",
];

// Rakıma uyum: genel, temkinli bilgi (tıbbi tavsiye değildir).
const RAKIM_TR = [
  "## Rakıma uyum için genel notlar",
  "Yüksek rakımda ilk günlerde nefes darlığı, uyku düzeninde bozulma ve çabuk yorulma görülebilir; bu yüzden kamplar genellikle iki-üç hafta gibi sürelerle ve yükü kademeli artıran bir planla kurulur. Havanın kuru olması sıvı kaybını artırabilir, düzenli sıvı alımı ve toparlanma takibi önemlidir. Bunlar genel bilgidir; her sporcunun planı antrenör ve sağlık ekibiyle birlikte belirlenmelidir.",
];
const RAKIM_EN = [
  "## General notes on adapting to altitude",
  "In the first days at altitude athletes can notice breathlessness, disturbed sleep and quicker fatigue, so camps are usually built over two to three weeks with a plan that raises the load gradually. Dry air can increase fluid loss, so regular drinking and recovery monitoring matter. This is general information; each athlete's plan should be set with their coach and medical staff.",
];

export const EXTRA = {
  "yuzme-havuzu": {
    tr: [
      "## Basına yansıyan kamplar",
      "Türkiye Yüzme Federasyonu'nun yüksek irtifa kampı, Bosna Hersekli genç yüzücülerin Avrupa Şampiyonası hazırlığı ve Maltalı milli yüzücülerin Erzurum kampı gibi örnekler TRT ve DHA gibi haber kaynaklarında yer aldı. Kamp takvimleri her sezon değişir; güncel doluluk için talep formunu kullanın.",
      "## Örnek günlük akış",
      "Yüzme kamplarında sık görülen düzen şöyledir: sabah havuz seansı (teknik ve tempo), öğleden sonra kuru saha ya da kuvvet çalışması, akşam ikinci havuz seansı ya da toparlanma. Bu yalnızca bir örnektir; seans sayısı ve yük, takımın antrenörü tarafından belirlenir.",
      ...ULASIM_TR,
      ...RAKIM_TR,
    ],
    en: [
      "## Camps in the news",
      "Examples such as the Turkish Swimming Federation's high-altitude camp, young Bosnia and Herzegovina swimmers preparing for a European Championship, and Malta's national swimmers' camp in Erzurum have been reported by outlets like TRT and DHA. Camp calendars change every season; use the request form to check current availability.",
      "## A typical day",
      "A common swimming-camp rhythm is: a morning pool session (technique and pace), dry-land or strength work in the afternoon, and a second pool session or recovery in the evening. This is only an example; the number of sessions and the load are set by the team's coach.",
      ...ULASIM_EN,
      ...RAKIM_EN,
    ],
  },

  "futbol-sahalari": {
    tr: [
      "## Yüksek rakımda iki kot",
      "Basında yer alan bilgilere göre merkezde yaklaşık 2.000 metre rakımda 4, yaklaşık 2.800 metre rakımda ise 16 antrenman sahası bulunur ve toplam 20 sahanın hizmet verdiği belirtilir. İki farklı kot, takımın aynı kamp içinde farklı rakımlarda çalışmasına imkân tanır; hangi sahaların kullanılacağı doluluğa göre netleşir.",
      "## Örnek günlük akış",
      "Sezon öncesi futbol kamplarında sık görülen düzen: sabah kondisyon ve teknik çalışma, öğleden sonra taktik ve oyun, akşam toparlanma ve analiz. Hazırlık maçı için rakip ayarlamak isteyen takımlar bunu talep formunda belirtebilir.",
      ...ULASIM_TR,
      ...RAKIM_TR,
    ],
    en: [
      "## Two altitude levels",
      "According to press reports, the centre has 4 training pitches at about 2,000 metres and 16 at about 2,800 metres, for 20 pitches in total. Two altitudes let a team work at different levels within the same camp; which pitches are used is settled according to availability.",
      "## A typical day",
      "A common pre-season football rhythm: conditioning and technical work in the morning, tactics and match play in the afternoon, recovery and analysis in the evening. Teams that want a friendly opponent arranged can say so on the request form.",
      ...ULASIM_EN,
      ...RAKIM_EN,
    ],
  },

  "buz-curling-arenasi": {
    tr: [
      "## Pist sayısına göre planlama",
      "Birden fazla pist olduğu için kafile büyüklüğüne göre buz saatleri bölünebilir: bir grup teknik atış çalışırken diğeri süpürme koordinasyonu ya da oyun simülasyonu yapabilir. Karma çift ve dört kişilik takım kampları için pist sayısı ve saatler talep sırasında netleştirilir.",
      "## Ekipman",
      "Taş, süpürge ve kaydırıcı ayakkabı gibi ekipmanın salonda hazır bulunup bulunmadığı kafileye göre değişebilir; kendi ekipmanınızı getirecekseniz ya da kullanım istiyorsanız bunu talep formunda belirtmeniz planlamayı kolaylaştırır.",
      ...ULASIM_TR,
    ],
    en: [
      "## Planning around the number of sheets",
      "With several sheets, ice time can be split according to squad size: one group can work on delivery while another practises sweeping coordination or plays a match simulation. For mixed-doubles and four-person team camps, the number of sheets and the hours are settled when you request.",
      "## Equipment",
      "Whether stones, brooms and sliders are available at the hall can vary by group; if you will bring your own or want to use hall equipment, say so on the request form to make planning easier.",
      ...ULASIM_EN,
    ],
  },

  "dovus-sporlari-tohm": {
    tr: [
      "## Toparlanma",
      "Antrenman sonrası sauna ve şok havuzu aynı alanda olduğundan seanslar arasında toparlanma programlanabilir. Sıcak-soğuk uygulamalarının süresi ve sıklığı sporcunun sağlık durumuna göre ayarlanmalıdır.",
      "## Örnek günlük akış",
      "Dövüş sporlarında sık görülen düzen: sabah ayakta teknik ve kondisyon, öğleden sonra yerde çalışma ya da ring/minder taktiği, akşam sparing ve toparlanma. Birden fazla branş aynı alanı paylaşacaksa saatler önceden bölünür.",
      ...ULASIM_TR,
      ...RAKIM_TR,
    ],
    en: [
      "## Recovery",
      "With a sauna and a cold-plunge pool in the same area, recovery can be scheduled between sessions. The length and frequency of hot-cold treatments should be set according to the athlete's health.",
      "## A typical day",
      "A common combat-sports rhythm: stand-up technique and conditioning in the morning, ground work or ring/mat tactics in the afternoon, sparring and recovery in the evening. If several disciplines share the area, hours are split in advance.",
      ...ULASIM_EN,
      ...RAKIM_EN,
    ],
  },

  "atletizm-kros": {
    tr: [
      "## Milli takım kampları",
      "Atletizm Milli Takımı'nın Erzurum'daki yüksek irtifa kampı TRT gibi haber kaynaklarında yer aldı; Palandöken Kayak Merkezi'ndeki kampta yaklaşık 30 sporcudan söz edilmişti. Pist ve kros rotası kullanımı kamp dönemine göre planlanır.",
      "## Örnek haftalık düzen",
      "Dayanıklılık odaklı kamplarda sık görülen düzen: sabah uzun ya da tempo koşusu, öğleden sonra pist hız çalışması ya da kuvvet, haftada bir uzun kros. Kros rotasında tırmanış yükünü sporcunun uyum düzeyine göre ayarlamak yaygındır.",
      ...ULASIM_TR,
      ...RAKIM_TR,
    ],
    en: [
      "## National-team camps",
      "The Turkish national athletics team's high-altitude camp in Erzurum has been covered by outlets such as TRT; reports mentioned around 30 athletes at the camp at Palandöken Ski Resort. Track and cross-country route use is planned according to the camp period.",
      "## A typical week",
      "A common endurance-camp pattern: a long or tempo run in the morning, track speed work or strength in the afternoon, and a long cross-country session once a week. It is usual to adjust the climbing load on the cross-country route to the athlete's level of adaptation.",
      ...ULASIM_EN,
      ...RAKIM_EN,
    ],
  },

  "salon-sporlari": {
    tr: [
      "## Örnek günlük akış",
      "Voleybol ve basketbol kamplarında sık görülen düzen: sabah kuvvet ve kondisyon, öğleden sonra taktik ve set oyunları, akşam hazırlık maçı ya da video analizi. Birden fazla takım için saatler ve yardımcı alanlar önceden bölünür.",
      "## Kafile için planlama",
      "Salonun farklı bölümlerinin aynı anda kullanılabilmesi, kapasite ve işletme düzenine bağlıdır; kafile büyüklüğünü, branşı ve istediğiniz saat aralığını talep formunda belirtmeniz yeterlidir.",
      ...ULASIM_TR,
      ...RAKIM_TR,
    ],
    en: [
      "## A typical day",
      "A common volleyball and basketball camp rhythm: strength and conditioning in the morning, tactics and set plays in the afternoon, a friendly match or video analysis in the evening. For several teams, hours and support areas are divided in advance.",
      "## Planning for your group",
      "Whether different parts of the hall can be used at the same time depends on capacity and operations; just state your group size, sport and preferred hours on the request form.",
      ...ULASIM_EN,
      ...RAKIM_EN,
    ],
  },

  "buz-hokeyi-pateni": {
    tr: [
      "## 2011'de hangi branşlar",
      "FISU ve Vikipedi kaynaklarına göre Palandöken'deki Erzurum Buz Pateni Salonu 2011 Kış Üniversiadı'nda short track ve artistik buz pateni müsabakalarına ev sahipliği yapmıştır. Salon kaynaklarda yaklaşık 2.000 seyirci kapasiteli ve 30 x 60 metrelik buz alanlı olarak geçer.",
      "## Basına yansıyan kamplar",
      "Kazakistan short track milli takımının dünya kupası öncesi Erzurum'daki hazırlığı ve uluslararası short track kampları haber kaynaklarında yer aldı. Buz saatleri sezona göre değiştiği için güncel takvim için bizimle iletişime geçin.",
      ...ULASIM_TR,
      ...RAKIM_TR,
    ],
    en: [
      "## Which sports in 2011",
      "According to FISU and Wikipedia, the Erzurum Ice Skating Arena in Palandöken hosted short track speed skating and figure skating at the 2011 Winter Universiade. Sources describe it as seating about 2,000 with a 30 x 60 metre ice surface.",
      "## Camps in the news",
      "The Kazakhstan short track national team's preparation in Erzurum before a World Cup and international short track camps have been reported in the press. Ice hours change with the season, so please contact us for the current schedule.",
      ...ULASIM_EN,
      ...RAKIM_EN,
    ],
  },

  "judo-salonu": {
    tr: [
      "## Örnek günlük akış",
      "Judo kamplarında sık görülen düzen: sabah koşu ve kuvvet, öğleden sonra tatamide teknik ve uchi-komi, akşam randori ve toparlanma. Ağırlık sınıfı ve yarışma takvimi, çalışma yükünü belirleyen en önemli unsurlardır.",
      "## Toparlanma ve hazırlık",
      "Sauna ve şok havuzu gibi toparlanma olanakları dövüş sporları arenasındadır. Kendi tatamisini ya da özel ekipmanını getirecek kafileler bunu talep formunda belirtmelidir.",
      ...ULASIM_TR,
      ...RAKIM_TR,
    ],
    en: [
      "## A typical day",
      "A common judo-camp rhythm: running and strength in the morning, technique and uchi-komi on the tatami in the afternoon, randori and recovery in the evening. Weight class and the competition calendar are the main factors that set the training load.",
      "## Recovery and preparation",
      "Recovery options such as the sauna and cold-plunge pool are in the combat sports arena. Groups bringing their own tatami or special equipment should say so on the request form.",
      ...ULASIM_EN,
      ...RAKIM_EN,
    ],
  },

  "kayak-snowboard": {
    tr: [
      "## Konaklı ve Palandöken",
      "2011 Kış Üniversiadı'nda alp disiplini yarışları yeni yapılan Konaklı Kayak Merkezi'nde, snowboard ve serbest stil kayak yarışları ise Palandöken'de yapıldı. İki bölge birbirine komşudur; kamp planlarken hangi pistlerin açık olduğu sezona ve hava durumuna göre değişir.",
      "## Kamp için notlar",
      "Kış kampları genellikle sabah pist antrenmanı, öğleden sonra video analizi ve kuru saha çalışmasıyla yürür. Yüksek kotta (3.000 metre civarı) hava ve görüş koşulları hızla değişebilir; takımlar kıyafet ve güneş koruması için hazırlıklı gelmelidir.",
      ...ULASIM_TR,
    ],
    en: [
      "## Konaklı and Palandöken",
      "At the 2011 Winter Universiade the alpine events were held at the newly built Konaklı Ski Resort, while snowboard and freestyle skiing took place at Palandöken. The two areas are neighbours; which slopes are open when you plan a camp depends on season and weather.",
      "## Notes for camps",
      "Winter camps usually run on morning slope training, then video analysis and dry-land work in the afternoon. At high elevation (around 3,000 metres) weather and visibility can change quickly, so teams should come prepared with clothing and sun protection.",
      ...ULASIM_EN,
    ],
  },

  "kayakla-atlama": {
    tr: [
      "## Tepe boyutları ne demek",
      "K noktası, tepenin 'kritik noktası'nı, yani iniş bölgesinde normal bir atlayışın hedeflendiği mesafeyi gösterir; HS (hill size) ise atlayışlar için esas alınan tepe büyüklüğüdür. Küçük K20, K40 ve K65 tepeler öğrenme ve çalışma içindir, K95 normal ve K125 büyük tepe ise yarışma düzeyindedir.",
      "## Kullanım dönemi",
      "Hangi tepenin hangi dönemde ve hangi yüzeyle kullanılabileceği işletme durumuna göre değişir. Bu nedenle tarih seçmeden önce güncel durumu bizden teyit edin.",
      ...ULASIM_TR,
    ],
    en: [
      "## What the hill sizes mean",
      "The K-point marks the hill's 'critical point', the distance in the landing area at which a normal jump is aimed; HS (hill size) is the size used as the basis for jumps. The small K20, K40 and K65 hills are for learning and practice, while the K95 normal hill and K125 large hill are competition level.",
      "## When the hills can be used",
      "Which hill can be used when, and on which surface, depends on operating status. So please confirm the current situation with us before choosing dates.",
      ...ULASIM_EN,
    ],
  },
};

/** Ana metnin kapanış satırından (talep cümlesi) önce ek bölümleri yerleştirir. */
export function mergeExtra(base) {
  const out = {};
  for (const [slug, v] of Object.entries(base)) {
    const x = EXTRA[slug];
    if (!x) { out[slug] = v; continue; }
    const ins = (text, add) => {
      const lines = text.split("\n");
      // Son satır bir "## " başlığının gövdesiyse (kapanış cümlesi değil) bölümü bölmemek için sona ekle.
      if (lines.length > 1 && lines[lines.length - 2].startsWith("## ")) return j([...lines, ...add]);
      const last = lines.pop();
      return j([...lines, ...add, last]);
    };
    out[slug] = { tr: ins(v.tr, x.tr), en: ins(v.en, x.en) };
  }
  return out;
}
