// Tesis KARTI alanları (kartlarda ve tesis sayfası başlığında görünen kısa metinler). apply.mjs bunları yönetim API'si ile yazar.
// Kurallar: üstünlük iddiaları ("tek", "ana merkez") kaynağa atfedilir veya yumuşatılır; alt satırlar aynı biçimde yazılır
// (Türkçe: "105 × 68 m", "Entegre ...", "5 Bağımsız Pist"); branş adları cümle içinde küçük harfle.
export const CARDS = {
  "yuzme-havuzu": {
    badge: "2.000 M İRTİFA",
    description:
      "Türkiye'de yüksek irtifadaki tek tam olimpik havuz olarak anılan kapalı havuz. 10 kulvar, OMEGA dokunmatik zaman panoları, su altı video-biyomekanik kayıt ve laktat ölçüm iskelesi.",
  },
  "futbol-sahalari": {
    description:
      "Palandöken eteklerinde Süper Lig'den alt liglere ve yabancı kulüplere kadar çok sayıda takıma kamp yaptırmış merkez. Doğal çim sahalar, otomatik drenaj ve LED projektör aydınlatması.",
    footerRight: "105 × 68 m Saha Ölçüsü",
  },
  "buz-curling-arenasi": {
    badge: "TÜRKİYE'NİN İLK CURLING SALONU",
    footerRight: "5 Bağımsız Pist",
  },
  "dovus-sporlari-tohm": {
    description:
      "Güreş (serbest/grekoromen), boks, judo ve tekvando branşları için özel yaylı tatamiler, ring modülleri ve darbe emici zeminler.",
    footerRight: "Entegre Sauna ve Şok Havuzu",
  },
  "atletizm-kros": {
    footerRight: "Ölçümlü Rüzgâr Koridoru",
  },
  "salon-sporlari": {
    description:
      "FIBA ve FIVB standartlarında masif ahşap parke zemin. Voleybol, basketbol ve hentbol milli takımları için kondisyon, skorbord ve canlı yayın donanımı.",
    footerRight: "Entegre Kuvvet ve Ağırlık Salonu",
  },
  "kayak-snowboard": {
    title: "Palandöken Kayak Merkezi EJDER 3200",
    badge: "3.176 M ZİRVE",
    description:
      "Yaklaşık 2.200 metreden 3.176 metreye uzanan rakım farkıyla Palandöken, kayak ve snowboard kampları için kış boyunca antrenman pistleri sunar. Merkez, Erzurum il merkezinin yaklaşık 7 km güneybatısındadır.",
    footerRight: "2.200 – 3.176 m",
  },
};
