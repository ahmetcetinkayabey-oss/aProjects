/** İngilizce içerik çevirileri (slug anahtarlı). Yöneticinin eklediği ve burada karşılığı olmayan içerik Türkçe kalır. */

export interface FacilityEn {
  category?: string;
  title?: string;
  description?: string;
  badge?: string;
  footerLeft?: string;
  footerRight?: string;
  stats?: { label: string; value: string }[];
}

export const FACILITIES_EN: Record<string, FacilityEn> = {
  "yuzme-havuzu": {
    category: "SWIMMING & WATER SPORTS",
    title: "50m Indoor Olympic Swimming Pool",
    description:
      "Turkey's only full-size indoor Olympic pool at high altitude. 10 lanes, OMEGA touchpad timing boards, underwater video-biomechanics recording and a lactate testing platform.",
    badge: "2,100 M ALTITUDE",
    footerLeft: "VO2 Max & Endurance Camp",
    footerRight: "10 Lanes / 50m",
  },
  "futbol-sahalari": {
    category: "FOOTBALL & GRASS PITCHES",
    title: "11+ FIFA Natural Grass Football Pitch",
    description:
      "The main pre-season camp base for Süper Lig and UEFA teams at the foot of Palandöken. Automatic drainage, high-altitude moisture retention and LED floodlight systems.",
    badge: "11+ FIFA STANDARD",
    footerLeft: "Süper Lig & International Camps",
    footerRight: "105 x 68 m Pitch Size",
  },
  "buz-curling-arenasi": {
    category: "CURLING",
    title: "Curling Hall",
    description:
      "The curling hall in Palandöken: with 5 independent sheets and a capacity of 1,000 spectators, it is ready for curling camps and tournaments.",
    badge: "ONLY ONE IN TURKEY",
    footerLeft: "Curling Camps & Tournaments",
    footerRight: "5 Independent Sheets",
  },
  "dovus-sporlari-tohm": {
    category: "COMBAT & WRESTLING CENTRE",
    title: "Combat Sports & TOHM Arena",
    description:
      "6 international sprung tatami mats, ring modules and shock-absorbing floors for Wrestling (Freestyle/Greco-Roman), Boxing, Judo and Taekwondo.",
    badge: "TOHM Erzurum",
    footerLeft: "National Team Camps",
    footerRight: "Integrated Sauna & Cold Plunge Pool",
    stats: [
      { label: "Wrestling Mat:", value: "4 Olympic Areas" },
      { label: "Boxing Ring:", value: "2 AIBA Approved" },
    ],
  },
  "atletizm-kros": {
    category: "ATHLETICS & CROSS-COUNTRY",
    title: "Olympic Tartan Track & Cross-Country",
    description:
      "A 400-metre, 8-lane IAAF-certified synthetic tartan track, a steeplechase pit and natural mountain cross-country routes climbing to 2,400 metres through the Palandöken forest corridors.",
    badge: "Kazım Karabekir Campus",
    footerLeft: "Marathon & Middle-Distance Base",
    footerRight: "Wind Corridor Measured",
    stats: [
      { label: "Track Lanes:", value: "8 Lanes IAAF" },
      { label: "Cross-Country Route:", value: "15 km Mountain Trail" },
    ],
  },
  "salon-sporlari": {
    category: "INDOOR SPORTS",
    title: "3,000-Seat Multi-Purpose Hall",
    description:
      "Solid hardwood parquet flooring to FIBA and FIVB standards. Conditioning, scoreboard and live broadcast equipment for Volleyball, Basketball and Handball national teams.",
    badge: "Recep Tayyip Erdoğan & Atatürk",
    footerLeft: "Volleyball / Basketball Camps",
    footerRight: "Integrated Strength & Weight Room",
    stats: [
      { label: "Capacity:", value: "3,000 Seats" },
      { label: "Floor:", value: "Wooden Sports Parquet" },
    ],
  },
  "buz-hokeyi-pateni": {
    category: "ICE HOCKEY & SKATING",
    title: "Ice Hockey & Ice Skating Halls",
    description:
      "Indoor ice halls in Erzurum: a 3,000-spectator ice hockey hall at the Cemal Gürsel Sports Campus and a 2,000-spectator ice skating hall in Palandöken. Suitable for short track, figure skating and hockey camps.",
    badge: "INDOOR ICE HALL",
    footerLeft: "Short Track & Ice Hockey Camps",
    footerRight: "3,000 / 2,000 Spectators",
  },
  "judo-salonu": {
    category: "JUDO",
    title: "Judo Hall",
    description:
      "Judo camps on tatami flooring in Erzurum's sports halls. The high-altitude environment combines endurance and conditioning work in a single centre.",
    badge: "NATIONAL TEAM CAMPS",
    footerLeft: "Judo Camps",
    footerRight: "Tatami Flooring",
  },
  "kayak-snowboard": {
    category: "SKIING & SNOWBOARD",
    title: "Palandöken Ski Centre",
    description:
      "With an altitude range from 2,000 metres to 3,176 metres, Palandöken offers training slopes for ski and snowboard camps throughout the winter. It is just a few minutes from the camp centre.",
    badge: "3,176 M SUMMIT",
    footerLeft: "Ski & Snowboard Camps",
    footerRight: "2,000 – 3,176 m",
  },
  "kayakla-atlama": {
    category: "SKI JUMPING",
    title: "Ski Jumping Towers",
    description:
      "The jumping towers in Palandöken are among the landmark facilities used in Erzurum's international winter events. Camp opportunities for ski jumping and Nordic disciplines.",
    badge: "WINTER GAMES FACILITY",
    footerLeft: "Nordic Discipline Camps",
    footerRight: "Palandöken",
  },
};

export interface NewsEn {
  title?: string;
  summary?: string;
  content?: string;
  category?: string;
  sourceName?: string;
  dateLabel?: string;
}

export const NEWS_EN: Record<string, NewsEn> = {
  "yuksek-irtifa-kampi-nasil-planlanir": {
    title: "How to plan a high-altitude camp",
    summary:
      "Camp duration, training load and recovery: the key steps for an effective preparation period at 2,100 metres.",
    content:
      "High-altitude camps are a preparation method used worldwide to improve athletes' aerobic capacity. The generally accepted approach is to stay at moderate altitude (roughly 2,000–2,500 metres) for several weeks and to increase the training load gradually.\nKeeping intensity low in the first days helps the body adapt to the environment. Sleep, fluid intake and nutrition are as important as training during this period.\nThe Erzurum High Altitude Camp Centre is located at 2,100 metres. You can contact us through the reservation form about camp dates, discipline and group size, and we can build the plan together.",
  },
  "curling-nedir": {
    title: "What is curling? A short guide for beginners",
    summary:
      "Get to know the winter sport in which stones are slid across the ice, demanding strategy and precision.",
    content:
      "Curling is a winter sport in which two teams slide granite stones across the ice towards a target area (the house). Teams consist of four players, and each team throws its stones in turn. The closer a stone is to the target, the more valuable the point.\nPlayers influence the stone's speed and direction by sweeping the ice in front of it. This is why curling demands both technique and team communication.\nThe curling hall in Palandöken can be used for curling camps and tournaments.",
  },
  "erzurum-2011-kis-universiadi": {
    title: "Erzurum hosted the 2011 Winter Universiade",
    summary: "The 25th Winter Universiade was held in Erzurum from 27 January to 6 February 2011.",
    content:
      "Erzurum hosted the 25th Winter Universiade in January–February 2011. The event helped bring the city's winter sports infrastructure to international prominence.\nDuring this period, facilities for disciplines such as skiing, ice hockey, ice skating, curling and ski jumping were opened or renovated in Erzurum. These facilities are still used today for camps and competitions.",
  },
  "erzurum-2017-avrupa-genclik-olimpik-kis-festivali": {
    title: "Erzurum hosted the 2017 European Youth Olympic Winter Festival",
    summary: "Europe's young winter athletes came together in Erzurum in February 2017.",
    content:
      "Erzurum hosted the European Youth Olympic Winter Festival (EYOF) held in February 2017. The festival was the second major international test for the city's winter sports facilities.\nPalandöken's ski slopes and jumping towers were used as preparation and competition venues by young athletes from different countries.",
  },
  "palandoken-kis-sporlari-kamplari": {
    title: "Winter sports camps in Palandöken",
    summary: "A long season for skiing and snowboarding, with an altitude range between 2,000 and 3,176 metres.",
    content:
      "With an altitude range from 2,000 metres to 3,176 metres, Palandöken offers training opportunities for ski and snowboard camps throughout the winter. Being only a few minutes from the camp centre makes the daily schedule easier for groups.\nIf you would like to plan a camp for skiing, snowboarding, ski jumping or Nordic disciplines, you can use the reservation form.",
  },
  "erzurumspor-hazirlik-maci": {
    title: "Erzurumspor Friendly Match",
    summary: "A friendly match played on the pitch of the High Altitude Camp Centre.",
  },
  "birinci-lig-takim-antrenmanlari": {
    title: "1st League Team Training Sessions",
    summary: "Pre-season training sessions at sunset, with the pitch and mountain scenery as a backdrop.",
  },
  "erzurum-kamp-sezonunda-avrupa-kuluplerini-agirlamaya-hazirlaniyor": {
    category: "CAMP SEASON",
    sourceName: "Anadolu Agency",
    title: "Erzurum prepares to host European clubs in the camp season",
    summary:
      "With its high altitude, modern facilities and football pitches, Erzurum is getting ready for the new camp season.",
  },
  "erzurum-yuksek-irtifada-guc-depolamak-isteyen-takimlarin-gozdesi": {
    category: "SPORTS ACTIVITIES",
    sourceName: "Anadolu Agency",
    title: "Erzurum is the favourite of teams looking to build strength at high altitude",
    summary: "Domestic and foreign football clubs carried out their new-season preparations in Erzurum.",
  },
  "yuksek-irtifa-kamp-merkezinde-ikinci-etap": {
    category: "FACILITY INVESTMENTS",
    sourceName: "Erzurum Metropolitan Municipality",
    dateLabel: "Archive news",
    title: "The second phase at the High Altitude Camp Centre",
    summary: "Second-phase works for the development of the camp centre.",
  },
};

/** IMAGE_CREDITS (facility-images.ts) ile aynı sırada İngilizce karşılıkları. */
export const IMAGE_CREDITS_EN: string[] = [
  "Swimming pool: WikiFix2007, Melbourne Sports and Aquatic Centre (CC BY-SA 4.0)",
  "Wrestling: Gastón Cuello, Youth Olympic Games 2018 (CC BY-SA 4.0)",
  "Athletics track: Neukoln (CC BY-SA 3.0)",
  "Universiade statue: Zeynel Cebeci (CC BY-SA 4.0)",
  "Indoor sports: Aysinpir, Bilkent Erzurum Sports Hall (CC BY-SA 3.0)",
  "Skiing: hüseyin yeşil, Palandöken Ski Centre (CC BY 3.0)",
  "Ski slope (news image): Eric Miller (CC0)",
  "Curling Hall, Ski Jumping Towers: Eğitmen Mahmut (CC BY-SA 3.0)",
  "Ice arena: Kkr1122, GSIM Ice Arena, Erzurum (CC BY-SA 4.0)",
  "Judo: Korea.net / Korean Culture and Information Service (CC BY-SA 2.0)",
  "Swimming pool building: E-92, DPÜ Olympic Swimming Pool (CC BY-SA 4.0)",
  "Palandöken landscape: Bjørn Christian Tørrissen (CC BY-SA 3.0)",
  "Ski jumping towers: Mehrdad Sarhangi (CC BY 3.0)",
  "Football pitches: Erzurum High Altitude Camp Centre archive",
  "Photographs are taken from Wikimedia Commons; facility images are representative.",
];
