import React, { useState } from "react";

// ── Geo & sunset logic ──────────────────────────────────────────────────────
const TZ={"America/New_York":[40.7,-74.0],"America/Chicago":[41.9,-87.6],"America/Denver":[39.7,-104.9],"America/Los_Angeles":[34.1,-118.2],"America/Phoenix":[33.4,-112.1],"America/Anchorage":[61.2,-149.9],"America/Honolulu":[21.3,-157.8],"America/Toronto":[43.7,-79.4],"America/Montreal":[45.5,-73.6],"America/Vancouver":[49.2,-123.1],"America/Sao_Paulo":[-23.5,-46.6],"America/Argentina/Buenos_Aires":[-34.6,-58.4],"Europe/London":[51.5,-0.1],"Europe/Paris":[48.9,2.3],"Europe/Berlin":[52.5,13.4],"Europe/Amsterdam":[52.4,4.9],"Europe/Zurich":[47.4,8.5],"Europe/Brussels":[50.8,4.4],"Europe/Rome":[41.9,12.5],"Europe/Madrid":[40.4,-3.7],"Europe/Moscow":[55.8,37.6],"Asia/Jerusalem":[31.8,35.2],"Asia/Tel_Aviv":[32.1,34.8],"Asia/Kolkata":[28.6,77.2],"Asia/Tokyo":[35.7,139.7],"Asia/Shanghai":[31.2,121.5],"Asia/Dubai":[25.2,55.3],"Asia/Hong_Kong":[22.3,114.2],"Asia/Singapore":[1.4,103.8],"Australia/Sydney":[-33.9,151.2],"Australia/Melbourne":[-37.8,145.0],"Australia/Perth":[-31.9,115.9],"Africa/Johannesburg":[-26.2,28.0],"Africa/Cairo":[30.0,31.2],"Pacific/Auckland":[-36.9,174.8]};

function getCoords(){
  const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||"";
  if(TZ[tz])return TZ[tz];
  const key=Object.keys(TZ).find(k=>tz.startsWith(k.split("/")[0]));
  return key?TZ[key]:[31.8,35.2];
}

function getTodayOmer(){
  const[lat,lon]=getCoords();
  const now=new Date();
  const nowMs=now.getTime();

  // Get the user's local calendar date via UTC offset (works in any iframe/sandbox)
  // getTimezoneOffset() is always available and reflects the user's actual browser timezone
  const localOffsetMs = -now.getTimezoneOffset() * 60000; // convert minutes to ms, flip sign
  const localMs = nowMs + localOffsetMs;
  const localD = new Date(localMs);
  // Local calendar date parts
  const y = localD.getUTCFullYear();
  const m = localD.getUTCMonth();
  const d = localD.getUTCDate();

  // Calculate sunset UTC for this local calendar date
  // Use noon UTC of that local calendar date as the JD reference point
  const noonUTC = Date.UTC(y, m, d, 12, 0, 0);
  const ss = sunsetUTC_ms(lat, lon, noonUTC);
  // Nightfall = sunset + 42 minutes
  const nightfall = ss ? ss + 42*60000 : null;
  // If past nightfall, we are in the next Hebrew day
  const bump = nightfall && nowMs > nightfall ? 1 : 0;
  const calDate = new Date(Date.UTC(y, m, d + bump));
  const day1 = Date.UTC(2026, 3, 3); // April 3, 2026
  const dayNum = Math.floor((calDate.getTime() - day1) / 86400000) + 1;
  return dayNum >= 1 && dayNum <= 49 ? dayNum : null;
}

function sunsetUTC_ms(lat, lon, noonUTCms){
  const rad=Math.PI/180;
  const JD = noonUTCms/86400000 + 2440587.5;
  const n = JD - 2451545.0;
  const M = (357.5291 + 0.98560028*n) % 360;
  const C = 1.9148*Math.sin(M*rad) + 0.02*Math.sin(2*M*rad) + 0.0003*Math.sin(3*M*rad);
  const lam = (M + C + 180 + 102.9372) % 360;
  const dec = Math.asin(Math.sin(lam*rad) * Math.sin(23.45*rad)) / rad;
  const cosH = (Math.sin(-0.833*rad) - Math.sin(lat*rad)*Math.sin(dec*rad)) / (Math.cos(lat*rad)*Math.cos(dec*rad));
  if(cosH < -1 || cosH > 1) return null;
  const H = Math.acos(cosH) / rad;
  const Jtr = 2451545.0 + 0.0009 + ((-lon/360)%1) + n + 0.0053*Math.sin(M*rad) - 0.0069*Math.sin(2*lam*rad);
  const Jset = Jtr + H/360;
  return (Jset - 2440587.5) * 86400000;
}

// ── Sefirot ─────────────────────────────────────────────────────────────────
const SEFIROT=[
  {name:"Chesed",   heb:"חֶסֶד",    color:"#B8924A", bg:"#FDF6EC", quality:"Loving-Kindness"},
  {name:"Gevurah",  heb:"גְבוּרָה", color:"#7A4E8A", bg:"#F7F0FA", quality:"Discipline"},
  {name:"Tiferet",  heb:"תִפְאֶרֶת",color:"#2E7A58", bg:"#EFF7F3", quality:"Beauty & Truth"},
  {name:"Netzach",  heb:"נֶצַח",    color:"#B04A2A", bg:"#FBF1EE", quality:"Endurance"},
  {name:"Hod",      heb:"הוֹד",     color:"#2A6A9E", bg:"#EEF4FA", quality:"Gratitude"},
  {name:"Yesod",    heb:"יְסוֹד",   color:"#9A7A08", bg:"#FAF6E8", quality:"Connection"},
  {name:"Malchut",  heb:"מַלְכוּת", color:"#5A5A8A", bg:"#F2F2F8", quality:"Presence"},
];

// ── Hebrew number arrays ─────────────────────────────────────────────────────
const OH=["","אֶחָד","שְׁנַיִם","שְׁלֹשָׁה","אַרְבָּעָה","חֲמִשָּׁה","שִׁשָּׁה","שִׁבְעָה","שְׁמוֹנָה","תִּשְׁעָה","עֲשָׂרָה","אַחַד עָשָׂר","שְׁנֵים עָשָׂר","שְׁלֹשָׁה עָשָׂר","אַרְבָּעָה עָשָׂר","חֲמִשָּׁה עָשָׂר","שִׁשָּׁה עָשָׂר","שִׁבְעָה עָשָׂר","שְׁמוֹנָה עָשָׂר","תִּשְׁעָה עָשָׂר","עֶשְׂרִים","עֶשְׂרִים וְאֶחָד","עֶשְׂרִים וּשְׁנַיִם","עֶשְׂרִים וּשְׁלֹשָׁה","עֶשְׂרִים וְאַרְבָּעָה","עֶשְׂרִים וַחֲמִשָּׁה","עֶשְׂרִים וְשִׁשָּׁה","עֶשְׂרִים וְשִׁבְעָה","עֶשְׂרִים וּשְׁמוֹנָה","עֶשְׂרִים וְתִשְׁעָה","שְׁלֹשִׁים","שְׁלֹשִׁים וְאֶחָד","שְׁלֹשִׁים וּשְׁנַיִם","שְׁלֹשִׁים וּשְׁלֹשָׁה","שְׁלֹשִׁים וְאַרְבָּעָה","שְׁלֹשִׁים וַחֲמִשָּׁה","שְׁלֹשִׁים וְשִׁשָּׁה","שְׁלֹשִׁים וְשִׁבְעָה","שְׁלֹשִׁים וּשְׁמוֹנָה","שְׁלֹשִׁים וְתִשְׁעָה","אַרְבָּעִים","אַרְבָּעִים וְאֶחָד","אַרְבָּעִים וּשְׁנַיִם","אַרְבָּעִים וּשְׁלֹשָׁה","אַרְבָּעִים וְאַרְבָּעָה","אַרְבָּעִים וַחֲמִשָּׁה","אַרְבָּעִים וְשִׁשָּׁה","אַרְבָּעִים וְשִׁבְעָה","אַרְבָּעִים וּשְׁמוֹנָה","תִּשְׁעָה וְאַרְבָּעִים"];
const WK=["","שֶׁהֵם שָׁבוּעַ אֶחָד","שֶׁהֵם שְׁנֵי שָׁבוּעוֹת","שֶׁהֵם שְׁלֹשָׁה שָׁבוּעוֹת","שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת","שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת","שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת","שֶׁהֵם שִׁבְעָה שָׁבוּעוֹת"];
const WD=["","וְיוֹם אֶחָד","וּשְׁנֵי יָמִים","וּשְׁלֹשָׁה יָמִים","וְאַרְבָּעָה יָמִים","וַחֲמִשָּׁה יָמִים","וְשִׁשָּׁה יָמִים"];
function omerCount(day){
  const w=Math.floor(day/7);
  const r=day%7;
  let t="הַיּוֹם "+OH[day]+(day===1?" יוֹם":" יָמִים");
  if(w>0){t+=" "+WK[w];}
  if(w>0&&r>0){t+=" "+WD[r];}
  return t+" לָעֹמֶר";
}

// ── Practice data (49 days) ──────────────────────────────────────────────────
const PRACTICE=[
{special:null,hashem:"Contemplate on the love of Hashem. How much good He does with all of His creations in general and specifically with you. Bring to your heart awareness that according to your actions, you aren't deserving of all this good Hashem gives you. Yet Hashem has abundant love for all of us and gives us undeserved gifts. From contemplating the love of Hashem you will come to a greater love for Hashem.",friends:"Look at the actions of others with a good eye, and with love. By way of seeing their good points, you'll elevate them to a higher place.",body:{part:"right_arm",text:"Use your right arm to do a Chesed (Act of Kindness), such as giving charity to the poor. Give food to a guest with your right arm. If you pull someone close for a hug, use your right arm."},time:"Try to do a Chesed (Act of Kindness) in the Day, precisely the morning.",intention:"Try to have extra Kavanah (focus) in Shaharit that was made by Avraham. Specifically in the blessing of Ahava Rabbah before the Shema, and during the blessing of Selach Lanu in the Shemoneh Esrei. Have extra intention when saying the name E-l during Shaharit.",torah:"By study"},
{special:null,hashem:"Contemplate the acts of might and fear that Hashem does in the world in general and with you specifically. How the intention behind all of them is to do good to the people and wake them up. Similar to the tests and pain in life we experience that comes to clean our sins, or to wake us up to Teshuva. It is all for the ultimate good. From contemplating the might of Hashem and how it is His love, you will come to a greater love for Hashem.",friends:"Think about the acts of Chesed you do with others. Try to focus your mind and think well, what is truly good for them and what isn't? What is only good for them temporarily but harmful afterwards? This focus will bring you to true chesed. When doing an act of chesed, do it quickly.",body:{part:"right_arm",text:"Use your right arm to do an act of strength or limitation. For example, close a door with your right arm."},time:"Try to have awe of Hashem, and to overcome your evil inclination in the Day, specifically the morning.",intention:"Try to have extra Kavanah (focus) in Shaharit that was made by Avraham. Specifically in the blessing of Re'eh Na in the Shemoneh Esrei. Have extra intention when saying the name Elokim during Shaharit.",torah:"By Attentive listening"},
{special:null,hashem:"Contemplate the acts of mercy that Hashem does in the world in general and with you specifically. How the mercy is made up of chesed and gevurah but the chesed is the dominant side. How the foundation of the world is chesed and from that you will come to a greater love for Hashem. Seeing how all the acts of Hashem's mercy have judgments in them but the chesed is the main part. Understand that the Torah is the way to loving Hashem.",friends:"Any chesed that you do with others, if you receive praise or glory for it, whether from your own ego or from other people, try to make sure it doesn't blemish the act of chesed. Understand that the praise is made up of chesed and leans towards chesed. You take the praise to yourself only to fuel you to do more chesed. Try to glorify your friend's good actions.",body:{part:"right_arm",text:"When doing an act of mercy in the world, or when learning the Written Torah use your right arm. For example, give charity with your right hand, or use your finger of your right hand on the page while learning."},time:"Try to glorify Hashem's name, and to have mercy on His creations in the Day, specifically the morning.",intention:"Try to have extra Kavanah (focus) in Shaharit that was made by Avraham. Specifically in the blessing of Refaenu in the Shemoneh Esrei. Have extra intention when saying the name Havaya during Shaharit.",torah:"By Proper speech"},
{special:null,hashem:"Contemplate how Hashem is eternal, Hashem out lives His actions/creations and not the other way around. If so then Hashem's abundance and chesed for the world and for me is also eternal and consistent. By way of this come to a greater love of Hashem. Realize that in order to love Hashem you have to overcome your evil inclination. For example, don't say: 'I can't eat pig, I can't break Shabbat.' Rather say, 'I can, but I love Hashem too much to ever do that.' That way you will be using your overcoming and perseverance to grow in love of Hashem.",friends:"Any chesed that you do with others, see that you should do it consistently if needed. Instead of doing a one-time chesed, try to help in an established and permanent way.",body:{part:"right_arm",text:"When doing an act of victory/overcoming or an act that will last for a while in the world, use your right arm. For example, use your right hand to push something open or plant a seed of a tree."},time:"Try to overcome your evil inclination and to establish acts of chesed in the Day, specifically the morning.",intention:"Try to have extra Kavanah (focus) in Shaharit that was made by Avraham. Specifically in the blessing of Mevarech Hashanim in the Shemoneh Esrei. Have extra intention when saying the name Havaya Tzvaot during Shaharit or while reading from the Prophets or any verse about Moshe Rabeinu.",torah:"By an understanding heart"},
{special:null,hashem:"Contemplate how in order to get the chesed and good of Hashem, you need to increase your gratitude and praise. Like King David, whether I'm experiencing a tough time, or everything is good, I need to give thanks and praise to Hashem. When you merit to do chesed with the blessing Hashem has given you, that should arouse gratitude towards Hashem, leading to greater love of Hashem.",friends:"When you see a friend that made a mistake, and he admits to it, and recognizes his mistake. Now he wants to do Teshuva. You need to judge him favourably and make sure you love him and do chesed with them. Now that this person recognizes Hashem, they are loved and dear up above. Be careful to not bring up previous mistakes they had.",body:{part:"right_arm",text:"When thanking a friend for something they did, use your right arm."},time:"Try to express gratitude to Hashem and a friend or family member in the Day, specifically the morning.",intention:"Try to have extra Kavanah (focus) in Shaharit that was made by Avraham. Specifically in the blessing of Mekabetz Nidhe Amo Israel in the Shemoneh Esrei. Have extra intention when saying the name Elokim Tzvaot during Shaharit or while reading from the Prophets or any verse about Aharon HaKohen.",torah:"By fear"},
{special:"There is a special segulah on this day to connect your mind and yourself strongly to the tzadikim and holy people. This is a true help to growing in spirituality since on this day we were taught, The people of Israel believed in Hashem and Moshe His servant. Our Emunah in Hashem is completed by way of the Tzadikim.",hashem:"Contemplate that in order to receive the chesed and love of Hashem, you need to guard your brit. Meaning you need to engage in this world in a holy way and with connection to Hashem. When you need to do something needed for this world, such as eating or drinking, try to do it with the intention of holiness and connection to Hashem.",friends:"When you do an act of chesed with others, try to remember to do it for the inner intention, for the sake of heaven and for Hashem.",body:{part:"right_arm",text:"When doing good for a friend, or something that bears fruit or an act of peace, use your right arm."},time:"Try to bring good to those around you, try to do actions that will bear fruit, and to increase peace in the Day, specifically the morning.",intention:"Try to have extra Kavanah (focus) in Shaharit that was made by Avraham. Specifically in the blessing of Sim Shalom in the Shemoneh Esrei. Have extra intention when saying the name Shadai during Shaharit or while reading from the Prophets or any verse about Aharon HaKohen.",torah:"By awe"},
{special:null,hashem:"Contemplate that in order to receive the chesed and love of Hashem, you need to take upon yourself the Yoke of Heaven meaning to keep all the mitzvot. To have intention in all your actions in general and specifically the acts of chesed should be as Avodat Hashem.",friends:"When someone does a chesed for you, pray for them. Try to honor, and donate to people that are Lovers of Hashem and try to see the good in others.",body:{part:"right_arm",text:"When giving charity to the poor, or for the Beit Knesset (synagogue) use your right arm."},time:"Try to do chesed with the poor, learn the Oral Torah, to honor people that learn Halacha in the Day, specifically in the morning.",intention:"Try to have extra Kavanah (focus) in all of Shaharit that was made by Avraham. Especially places that speak of the Kingship of Hashem in general and the Kingship of David specifically. Specifically in the blessing of Sim Shalom in the Shemoneh Esrei. Have extra intention when saying the name Adonai during Shaharit.",torah:"By humility"},
{special:null,hashem:"Contemplate that in order to receive the awe of Hashem, you need to think about the love of Hashem towards you for every good action you do. Meaning in order to overcome my evil inclination and to become quicker in my service of Hashem, I need to explain to myself the reward I'll receive for that effort/quickness in this world and the world to come. Contemplating the chesed of Hashem will help me rectify my Gevurah and overcome my tests and be quicker to do what I need to.",friends:"Before any act of might/discipline/rebuke make sure to first sit with yourself and come to a place of love for that person. You will be able to increase more gevurah in the other person by way of you first arousing chesed. Any act of chesed that you do, have in mind to do it for the sake of the mitzvah/commandment of Hashem and not just because you felt like helping someone or it was the right thing to do.",body:{part:"left_arm",text:"When giving charity or doing an act of chesed use your left hand."},time:"Try to feel love for Hashem and to do an act of kindness in the afternoon.",intention:"Try to have extra Kavanah (focus) in all of Mincha that was made by Yitzhak. Especially in the blessing of Selach Lanu during the Shemoneh Esrei. Have extra intention when saying the name E-l during Mincha.",torah:"By joy"},
{special:null,hashem:"Meditate on all the acts of might and fear that Hashem does in the world and with you, how the intention behind all of them is to wake people up to have more awareness of Hashem, like the Sages taught us, lighting and thunder were created to straighten out the crookedness of the heart. That will bring you to a general level of awe of Hashem. Then, think about all the fallen fears you've had in life and how Hashem sent them to you as opportunities to have awe of Hashem, not just to stay in the lower realms but to be elevated back to the source, respect and awe of Hashem.",friends:"Overcome any urge to answer back to people disrespecting or disgracing you. The sages say the world only exists by way of those people who stay quiet in a fight. Add more to the fight against the evil inclination by praying for the good of that person, that they should do Teshuva.",body:{part:"left_arm",text:"When doing an act of Gevurah, use your left hand. For example, closing a door, tying or cutting something."},time:"Try to feel awe for Hashem and to do an act of gevurah in the afternoon.",intention:"Try to have extra Kavanah (focus) in all of Mincha that was made by Yitzhak. Especially in the blessing of Re'eh Na during the Shemoneh Esrei. Have extra intention when saying the name Eloh-im during Mincha.",torah:"By attending to the sages (helping wise Torah scholars)"},
{special:null,hashem:"Meditate on all the acts of harmony/completion that Hashem does in the world. How fire and water are opposites and Hashem completed the heavens using both of them. More specifically Hashem takes a man and a woman and brings them together in harmony and shalom to bring children into the world. From contemplating on the magnificent acts of Hashem you'll come to have more awe of Hashem.",friends:"When you need to rebuke/say something to someone make sure to do it with tiferet/mercy/honor. Don't say to them, you did such and such and your punishment is such and such. That would bring more din/judgments/gevura on them. It would be better to cover up the rebuke in a story and from that they'll understand.",body:{part:"left_arm",text:"When doing an act of mercy in the world, or when reading the TaNach/Written Torah use your left hand."},time:"Try to glorify for Hashem and to do an act of mercy in the afternoon.",intention:"Try to have extra Kavanah (focus) in all of Mincha that was made by Yitzhak. Especially in the blessing of Refaenu during the Shemoneh Esrei. Have extra intention when saying the name Havaya during Mincha.",torah:"By critical give and take with friends"},
{special:null,hashem:"Meditate on all the acts of Hashem in the world that have a revelation and proof of the foundations of emunah. How the intention behind all of them is to come to more awe of Hashem. To have a strong heart that can help you overcome your tests and blockages stopping you from doing the will of Hashem. Like Nachson ben Aminadav who was the first person to jump into the sea. Go deeper and look at this process inside you, the fact that Hashem gave you a Neshama and keeps you alive and no creation has the power to do that. This is a fundamental part of emunah that Hashem runs the world and watches over everything in it constantly. By way of meditating on the dominance and perseverance you will come to more awe.",friends:"When engaging in business or anything that has permanence try to do it with emunah. In Heaven one of the first questions they ask you is if you did business with emunah. Parnassa/Sustenance is rooted in Gevurah and Emunah in Netzah.",body:{part:"left_arm",text:"When doing an act of dominance/perseverance/permanence, use your left hand. For example, planting a seed, pulling something, finishing a project."},time:"Try to overcome your evil inclination, and do an act of permanence specifically from your strengths in the afternoon.",intention:"Try to have extra Kavanah (focus) in all of Mincha that was made by Yitzhak. Especially in the blessing of Birkat HaShanim during the Shemoneh Esrei. Have extra intention when saying the name Havaya Tzvaot during Mincha.",torah:"By fine argumentation with disciples"},
{special:null,hashem:"Bring to your heart that in order to overcome your Evil Inclination you need to first reject it and push it away, then your gevurah will be beautiful and splendid. Anytime you manage to overcome your inclinations and do the desired will of Hashem, make sure to express gratitude quickly to Hashem. Keep in mind what the Sages taught, if it wasn't for Hashem's help you wouldn't be able to overcome them. When you manage to have discipline or to be quick to do something, don't give yourself the credit, say Thank You Hashem always!",friends:"When you see a friend trying to overcome his inclinations and be quicker in Avodat Hashem, make sure to offer help and strengthen them with expressed words of acknowledgment of their straight actions, try to use words from the Neviim (prophets).",body:{part:"left_arm",text:"When expressing gratitude to friends for acts of kindness, use your left hand."},time:"Try to thank Hashem and to a friend for something good they did for you in the afternoon.",intention:"Try to have extra Kavanah (focus) in all of Mincha that was made by Yitzhak. Especially in the blessing of Mekabetz Nidhe Amo Israel during the Shemoneh Esrei. Have extra intention when saying the name Eloh-im Tzva-ot during Mincha or reading a verse from the Neviim or anything about Aharon HaKohen.",torah:"By clear thinking"},
{special:null,hashem:"Bring to your heart that in order to acquire Irat Shamayim (Awe of Heaven), you need to hold on to the level of Tzadik and guard your brit (covenant) with Hashem. The brit of the tongue and the reproductive organs. Like we find with Yosef haTzadik that after he got through the test of Potifar's wife, he earned the title Tzadik, then he testified in front of his brothers that he had awe of Hashem. In order to do this you need gevurah to overcome all the other worldly lusts in general and sexuality specifically. Think about where in life you need more fences to help guard your brit.",friends:"When you need to rebuke a friend try to do it for the sake of heaven and not to get anything out of it for yourself. When you merit to bring guests into your house, try to talk to them about Irat Hashem.",body:{part:"left_arm",text:"When making fences for holiness in the world or actions that bear fruit, use your left hand."},time:"Try to establish continuous outcomes in your actions of gevurah during the afternoon.",intention:"Try to have extra Kavanah (focus) in all of Mincha that was made by Yitzhak. Especially in the blessing of Sim Shalom during the Shemoneh Esrei. Have extra intention when saying the name Shad-dai, especially during Mincha.",torah:"By studying Mikra (TaNaCH)"},
{special:null,hashem:"Bring to your heart that in order to overcome and rule over your inclinations, you need to act like a king and ruler over your inclinations. Use your good inclinations and desires to rule over the bad habits and thoughts we have. Make the good the king over the bad without any room for negotiation. Also bring to your heart that in order to do that you need to increase your prayers to Hashem about this. Specifically to pray for the level of Irat haHlet (fear of sinning). Like the rabbis teach, a person who is afraid of sin will run away from one hundred permitted gates just to make sure he doesn't go into one forbidden gate by mistake.",friends:"When your friend helps you, or you see someone having a hard time in Avodat Hashem — make sure to pray for them to be successful and to have siyata dishmaya (heavenly assistance).",body:{part:"left_arm",text:"When giving tzedaka (charity), to the poor, or for the needs of a synagogue use your left hand."},time:"Try to give tzedaka and learn Oral Torah and honor those who learn and keep halacha during the afternoon.",intention:"Try to have extra Kavanah (focus) in all of Mincha that was made by Yitzhak. Especially in places that mention the Kingdom of Heaven and the Kingdom of David. Have extra intention when saying the name Adon-ai, especially during Mincha.",torah:"By studying Mishna in purity"},
{special:null,hashem:"Contemplate and bring to your consciousness the acts of love that Hashem does in the world as a whole and with you specifically, and how the entire intention is to arouse the creations to take glory and splendor in Hashem. Like the story brought from Masechet Eruvin on the pasuk in Tehillim 147 — how the raven's chicks are fed from their own waste because Hashem has mercy even when the parent does not. See how everything Hashem does is to bring us closer to Him, specifically contemplate on the acts of chesed Hashem does with your body — breathing, heartbeat, brain functions — and from that come to take more glory into Hashem, and by this you rectify your Tiferet.",friends:"Bring to your mind that when you are glorified and praised by others for the chesed you do, it should push you to do even more chesed and good for others. That by your chesed, you cause more people to glorify Hashem and see His wonders in the world. Try to do a chesed for your friends, specifically with a male, and even more specifically with a firstborn of Israel, until the one who receives it is startled and praises Hashem. Try to do a chesed by teaching Torah to others. Try to have mercy on people and do it with love — the way you do the chesed matters. When teaching Torah, do it calmly and lovingly, remembering that a quick-tempered teacher cannot teach properly.",body:{part:"torso",text:"Use your body when doing chesed — the torso specifically, but the whole body is rooted in Tiferet."},time:"Try to have love for Hashem Yitbarach and do an act of chesed in the day, especially on Tuesday.",intention:"Have extra kavana in Shemoneh Esrei in the blessing of forgiveness, which is rooted in chesed. In Arvit prayer (which is rooted in Tiferet through Yaakov), have extra focus. When mentioning the Name E-l in Arvit, have more kavana.",torah:"By less possessions"},
{special:null,hashem:"Contemplate all of the acts of fear and might that Hashem does in the world as a whole and with you specifically, and how the intention behind all of them is to arouse the creations to take more glory and splendor in Hashem. Like when Hashem split the sea and drowned the Egyptians, and Bnei Yisrael immediately opened in song. Contemplate the mighty acts Hashem does with you personally, like the Baal Shem Tov explained — even something small like putting your hand in your pocket and pulling out the wrong amount of coins is a hardship meant to arouse you to recognize Hashem's immense mercy and providence — a little hardship to awaken you to come closer to Hashem.",friends:"Even though it's permissible to receive a little bit of praise and glory from friends, use it only to push yourself to do more good acts and to bring more glory to Hashem. Strengthen yourself greatly not to allow your heart to become haughty or prideful. By constricting your pride and using the praise only to serve Hashem more, you rectify Tiferet through Gevurah. When you reach any leadership or influence over others and naturally receive honor, you must overcome your yetzer hara not to fall into pride. Rectify the glory and leadership you are given by humbling yourself and staying pure.",body:{part:"whole_body",text:"When you do an act of Gevurah (might), use your whole body consciously."},time:"In time, you should try to have awe of Hashem and to do an act of Gevurah in the day, and specifically on Tuesday, on the third day.",intention:"Try to have extra Kavanah (focus) in Arvit that was made by Yaakov. Especially in the blessing of Re'eh Na during the Shemoneh Esrei. Have extra intention when saying the name Eloh-im during Arvit.",torah:"By less sleep"},
{special:null,hashem:"Contemplate in your mind all of the acts of glory that Hashem does with the nation of Israel as a whole and specifically with every single Jew, like it says in Isaiah 49 and in the daily blessing 'crowns Israel with glory.' By doing so, you come to take glory in Hashem, recognizing that He chose you to glorify Him. Also contemplate how Hashem's actions contain both chesed and din — this balance is Tiferet. When Hashem gives you something good in life, don't hold on to the glory — use it to praise and glorify Him. This keeps the goodness alive and whole, and rectifies Tiferet through giving over the glory you received. When you reach a certain level of spiritual perfection or refine a certain middah, don't be satisfied — continue to seek more perfection. Like Rabbi Saadia Gaon, who each day would do teshuvah for the level he was on the day before because his understanding of Hashem had deepened.",friends:"Have mercy on the creations and give them praise for their good actions. Teach them the written Torah so they too can grow in praise, compassion, and sharing Torah with others. Seek truth in all your actions. The sages taught that even if you only said something in your heart, don't go back on it.",body:{part:"whole_body",text:"When a person does an action of Rachamim — of mercy — with people, so too when you're learning the written Torah — try to use your whole entire body, and you'll be rectifying Tiferet by way of Tiferet."},time:"Try to take glory in Hashem and to have mercy on the creation specifically during the day, and even more specifically on the third day, which is Tuesday.",intention:"Try to have extra kavanah on the blessing of healing in Shemoneh Esrei, specifically in Arvit, which is rectified by Yaakov Avinu. And when you mention the Name Havaya — have extra kavanah on it, specifically during Arvit.",torah:"By minimizing pleasures"},
{special:null,hashem:"Contemplate the glory of Hashem revealed in the written Torah, and the need to overcome your yetzer hara. Even if you don't succeed, keep trying — Hashem has mercy on those who strive. As Chazal say, the King shows mercy to the one trying to do His will, not to the one who sits passively. But if you're fighting, even unsuccessfully, eventually the light in the Torah will return you to the good. The glory of Hashem in the written Torah will be revealed through your effort and desire to overcome the yetzer hara and push it away eternally.",friends:"Your actions can inspire lasting actions in your friends. When what you do stands the test of time, you're rectifying Tiferet (compassion for others) through Netzach (permanence and repetition). Teach others the written Torah in a way that awakens glory and honor for it, revealing its inner life and connection to the eternal world.",body:{part:"whole_body",text:"Use your entire body — rooted in Tiferet — when doing acts of perseverance, overcoming, or establishing long-lasting actions."},time:"Overcome your yetzer and bring continuity to acts of mercy — especially on Tuesday, the third day, which is Tiferet.",intention:"Have extra kavanah in Shemoneh Esrei during the blessing of Barchenu (blessing of the year), especially in Arvit, which is rectified by Yaakov Avinu. When saying Hashem's name Havaya Tzva'ot in Arvit, have extra kavana.",torah:"By minimizing idle chatter and joking"},
{special:null,hashem:"To preserve the wholeness of your Tiferet, you must express gratitude to Hashem. Gratitude reveals that you do not attribute success to yourself, but recognize Hashem as the sole giver of strength and blessing. Through this, the gifts you've received gain lasting existence, and you use them to fulfill Hashem's will — completing the beauty and splendor of Tiferet through Hod, the quality of truth and gratitude. Even when Hashem answers your prayers and grants you a portion in the written Torah, and others praise you for your wisdom or novel Torah ideas, don't hold the credit. Acknowledge the Source of all goodness and give thanks to Hashem.",friends:"Recognize and express gratitude to anyone who helped you learn Torah — friends, rabbis, students, even your children. This appreciation gives continuity and completion to your Torah learning. In discussions of business or Torah, if your friend reveals the truth, admit it immediately. Don't cling to your own opinion — acknowledge that your friend enlightened you. Support those learning Torah — especially the oral Torah — with your actions and finances.",body:{part:"whole_body",text:"When expressing gratitude to others, use your entire body, rooted in Tiferet, to give thanks wholeheartedly and fully."},time:"Give thanks to Hashem and express appreciation to a friend during the day — especially on Tuesday, the day associated with Tiferet.",intention:"Have extra kavana in the blessing of 'Mekabetz Nidchei Amo Yisrael' in Shemoneh Esrei, especially during Arvit. When mentioning the Name Elohi'm Tzvako't, focus more, especially during verses from the Prophets or those mentioning Aharon HaKohen.",torah:"By reducing worldly involvement"},
{special:"Today is 30 days before the holiday of Shavuot, and it is fitting to start learning the halachot of Shavuot, 30 days before the holiday.",hashem:"To maintain your Tiferet — the beauty and glory Hashem has granted you through wisdom, wealth, or good actions — you must act with holiness and purity. Even if you've merited glory and splendor, you're not considered complete until you hold onto one mitzvah with consistent strength. That one mitzvah becomes the foundation — the Yesod — which upholds and stabilizes your Tiferet. Like a tree or building stands only as tall as its foundation, so too your spiritual beauty depends on the strength of your inner core. Constantly review and internalize the fundamental principles of Judaism, such as the 13 Principles of Faith and the observance of Shabbat.",friends:"Strive to learn and teach the written Torah with deep understanding, aiming to produce chiddushim (new insights). To complete both yourself and those around you in Torah, you must purify yourself — in thought, body, and action. This includes keeping hands clean, not learning when needing the bathroom, immersing in the mikveh regularly, guarding speech, and upholding purity in both speech and sexuality — since the covenant of the mouth and of reproduction are spiritually linked.",body:{part:"whole_body",text:"When doing mitzvot rooted in the fundamentals of Judaism, such as teaching about Shabbat, Mashiach, Moshe Rabbeinu, or Hashem's unity, use your entire body."},time:"During the day, especially on Tuesday (linked to Tiferet), create practical Torah insights from your study of the written Torah or Zohar.",intention:"In Shemoneh Esrei, have extra kavana in the blessing of Sim Shalom (peace), especially during Arvit, which is linked to Yaakov Avinu and Tiferet. When saying the Divine Name Shadd'ai, focus with added awareness, particularly in Arvit.",torah:"By patience"},
{special:null,hashem:"To truly complete your Avodat Hashem, strive to perform every action and mitzvah with awe and love of Hashem. Learn Musar texts that arouse Yirat Shamayim, and study them prayerfully, as requests to improve yourself. By this, you will rectify your Tiferet — your beautiful actions — through Malchut, which is awe and acceptance of Hashem's kingship. To reach the truth of the written Torah — which is the source of the oral Torah — increase your prayer (rooted in Malchut) to avoid mistakes and distorted interpretations. Pray also for balance in your character traits and especially for divine help in refining your mercy.",friends:"Honor, support, and give tzedakah to those who engage in and teach the written Torah. Uplift and praise children and teens learning the written Torah. Help friends reach spiritual completion in their Avodat Hashem by valuing and pointing out the small, often-overlooked actions they do — such as putting a siddur back properly, making a blessing with intention, or showing care for minor mitzvot.",body:{part:"whole_body",text:"When honoring the Beit Knesset — especially for prayer, which is rooted in Malchut — engage your entire body. This rectifies Tiferet through acts of Malchut."},time:"Give tzedakah, learn oral Torah, and honor those who teach halacha — especially during the day and even more so on Tuesday (Tiferet's day).",intention:"In prayer, focus deeply on phrases mentioning Hashem's kingship and the kingship of the house of David. In Arvit, which is associated with Tiferet and Yaakov Avinu, have kavana when saying Adon'ai.",torah:"By a good heart"},
{special:null,hashem:"Meditate on all on the acts of chesed Hashem does for the Am Israel and for you specifically. How the intention behind them is to help those who want to overcome their evil inclination and stay loyal to do the will of Hashem. Like what the sages teach us in Pirkei Avot: Hashem wanted to give Israel merit (chesed), therefore He gave them a lot of Torah and Mitzvot, so that we have them to overcome our Yetzer HaRaa. Hashem created the Yetzer Hara and He created a spice/remedy for it called the Torah.",friends:"When you are victorious or overcome a friend in a permissible way, for example in a Torah discussion in order to reveal the truth behind what's being taught — make sure to do it with love, and yearn for that victory to be loved by Hashem. When doing business with someone try to make sure the scales are for the good and merit of your friend.",body:{part:"right_leg",text:"When doing an act of chesed (loving kindness), use your right leg."},time:"Try to feel love for Hashem and to do an act of chesed at dawn, specifically on a Wednesday.",intention:"Try to have extra Kavanah (focus) in the blessing of Selach Lanu during the Shemoneh Esrei, specifically on the times you fought/overcame someone in a forbidden/improper way. Have extra intention when saying the name E'l while reading anything from the Prophets or something that mentions Moshe Rabeinu the greatest of Prophets.",torah:"By Emunat Hachamim (faith in the sages/tzadikim)"},
{special:null,hashem:"Meditate on all the acts of might (gevurah) Hashem does in the world, how the intention behind all of them is for the world to come to a deeper level of Emunah in Hashem. For example all the plagues and wonders and miracles Hashem did while bringing us out of Egypt. Specifically in your life think about all the times you were stuck and maybe in danger physically or spiritually and Hashem with his might took you out — that should strengthen your bitachon in Hashem.",friends:"When someone comes to take you away from God consciousness be strong in your mind and don't move from what you know to be true. If you start to even argue you have a higher chance to lose. Like the Sages taught us about Eve and the Snake in the Garden — the only reason she sinned is because she entertained the conversation at all instead of having Gevurah in her mind. When doing an act of kindness, try to add more might (gevurah) to it and make sure that it will last for longer.",body:{part:"right_leg",text:"When doing an act of gevurah, use your right leg."},time:"Try to feel awe for Hashem at the time of Dawn, specifically on Wednesday.",intention:"Try to have extra Kavanah (focus) in the blessing of Re'eh Na during the Shemoneh Esrei, think about all the times you didn't have full emunah in Hashem and during your tests you were filled with doubts. Have extra intention when saying the name Eloh-im while reading anything from the Prophets or something that mentions Moshe Rabeinu.",torah:"By acceptance of suffering"},
{special:null,hashem:"Meditate on the fact that in order to be better at defeating your inclinations and desires you need to know and be aware of the wisdom of your Master. You can reach that by way of learning the written Torah. The more Torah you know, the more you know of Hashem, the more power you'll have to persevere against the inclinations and lusts of this world. An additional practice is to always try to walk the 'Path of the King' — meaning the balance of Tiferet that blends both sides of life in harmony.",friends:"Try to have mercy on the world in such a way that people are blown away and come to greater emunah in Hashem through your merciful actions. For example, when you see someone who is sick or poor, help them and speak to them in a way that makes them realize Hashem is good, with them, and taking care of them — until they might even ask Him forgiveness for ever thinking they were abandoned.",body:{part:"right_leg",text:"When doing an act of mercy, also when learning the Written Torah use your right leg."},time:"Try to have mercy on a being (human, animal, plant) and to teach someone the Written Torah at Dawn, specifically on Wednesday.",intention:"Try to have extra Kavanah (focus) in prayer especially in the blessing of Refaeinu (Healing) during the Shemoneh Esrei — all the times you didn't defeat your Evil Inclination which made your body weak and sick. Have extra intention when saying the name Havaya while reading anything from the Prophets or something that mentions Moshe Rabeinu.",torah:"By knowing your place"},
{special:null,hashem:"Contemplate and meditate in your mind on the 13 Principles of Faith, and recognize that within them lie powerful strategies and advice to overcome the yetzer hara. The belief that Hashem is always present, watching, rewarding the righteous — this awareness strengthens your Netzach. Bring to your heart the absolute and uncompromising truth of all the prophets' teachings. Even if you've already succeeded in overcoming the yetzer hara for a time, there is still more work — to conquer pride and ego. Make sure you are always in a place of submission to Hashem's word.",friends:"Try to teach or learn with your friends the fundamental keys of Emunah — specifically teach them about the eternal afterlife and how to get there. It allows them to do teshuvah and choose to live a life of eternity in the world to come. When doing business with others and measuring anything on the scales, do it with emunah.",body:{part:"right_leg",text:"When doing an act of dominance/perseverance/permanence, use your right leg."},time:"Try to overcome your Yetzer Hara and to find ways to make your actions have a lasting impression, specifically at dawn.",intention:"Try to have extra Kavanah (focus) in prayer especially in the blessing of Barech Alenu/Barchenu (Parnassa) during the Shemoneh Esrei — all the times you've blemished your Parnassa when you were in a constricted mindset and lacking in emunah. Also any blemishes you've ever done in business. Have extra intention when saying the name Havaya Tzvakot while reading anything from the Prophets or something that mentions Moshe Rabeinu.",torah:"By being happy with your portion"},
{special:null,hashem:"When you merit to defeat the Yetzer Hara and to guard and fulfill the will of Hashem — whether it's keeping a positive commandment or refraining from a negative one — immediately show gratitude to the Creator. Bring to your heart that every day in our prayers, we express gratitude when we say: 'Blessed are You, Hashem our God, who created us for Your honor, separated us from those who go astray, and gave us a true Torah and eternal life.' When you merit to be consistent in your learning and good deeds every day, don't take all the credit — every day the yetzer hara renews its attack, and if you're still doing the right thing, it's a clear sign that HaKadosh Baruch Hu is helping you.",friends:"When you see your friend overcoming their yetzer hara, or succeeding against someone who opposed them, and they don't express gratitude to Hashem, you should gently teach them how to be grateful. It's even better if you can bring proof from the words of the prophets, which are rooted in Netzach. Publicize their merit — for example, those who donate to synagogues, Batei Midrash, or the printing of holy books — and your gratitude brings kiddush Hashem.",body:{part:"right_leg",text:"When you express gratitude to a friend for something good they did for you, use your right leg, which is associated with Netzach."},time:"Try to show gratitude to Hashem and/or to someone at dawn, specifically on a Wednesday.",intention:"Try to have extra Kavanah (focus) in prayer, especially in the blessing of Nidchei Amo Yisrael during the Shemoneh Esrei. Reflect on all the times you blemished your spiritual strength — when you didn't overcome your yetzer hara, when you stopped praying or learning for meaningless things, or when you lacked consistency and perseverance in your set times of Torah and Tefillah. Have extra intention when saying the name Eloh'im Tzva'ot while reading anything from the Prophets or something that mentions Moshe Rabeinu.",torah:"By making a fence for your speech"},
{special:null,hashem:"Meditate and bring to your heart that in order to truly succeed in conquering your traits, becoming better, and standing strong for the long term, you need to keep defeating your inclination — especially in the areas of kedushah and taharah, sanctity and purity. This includes everything connected to the trait of Yesod, like Shabbat, Tefillin, and the Brit, which are all called signs. The more you succeed in overcoming your inclination in these areas, the more you'll be able to understand how to face and organize the inner battle in all of your other traits. To keep winning that battle, you need to know where to get strength and guidance — that happens when you place yourself under the influence of tzaddikim, the truly righteous people.",friends:"Any time you need to challenge or correct a friend in a permitted and necessary way — whether it's to rebuke them, teach them a halacha, or guide them — you must be careful to guard the sanctity and holiness of your entire body, and especially your tongue. Don't fall into impurity by letting yourself speak from a place that isn't clean, because if that zeal isn't grounded in holiness and humility, it can backfire.",body:{part:"right_leg",text:"When you go to connect with the righteous of the generation — and likewise when you seek to establish lasting fruit from your actions and uphold the foundational principles of emunah — lead with your right leg."},time:"Make an effort to invite guests and to help establish places of sanctity and purity, such as mikvahs. Be a voice for the importance of guarding modesty among our people — especially at dawn or on Wednesdays.",intention:"Try to have extra Kavanah (focus) in prayer, especially in the blessing of Sim Shalom Tova uVeracha during the Shemoneh Esrei. Reflect on all the times you dealt disloyally in business with a friend or fell into conflict with them. Have extra intention when saying the name Shadda'y while reading anything from the Prophets or something that mentions Moshe Rabeinu.",torah:"By not taking credit for oneself"},
{special:null,hashem:"Bring to your heart and meditate on the idea that in order to stand on the level of a Menatze'ach — a person who conquers and overcomes his Yetzer Hara constantly — you have to receive upon yourself the yoke of the kingship of Heaven in all of your actions. This means striving to rectify all of your middot in the way a servant serves his King. That is the path of Malchut. Also, remember that in order to receive true guidance and strategies to succeed in life, you must learn much Torah, especially the Oral Torah and Halacha, in which Hashem hid the original light that allowed Adam to see from one end of the world to the other.",friends:"Try very hard to honor and give tzedakah to those who engage with the words of the prophets and teach them to others. When you see a friend who is not in a state of happiness and joy and is close to being overcome by his Yetzer Hara, do your best to uplift him in any way possible — until his sadness is lifted and his mind opens.",body:{part:"right_leg",text:"When you go to the synagogue in order to pray or to learn the Oral Torah, use your right leg."},time:"Try to give tzedakah and to learn Torah, specifically the Oral Torah/Halacha, and to honor those who deal with halacha, specifically at dawn and if possible on a Wednesday.",intention:"Try to get up out of bed early in the morning, before dawn rises, so that by the time dawn comes, you're already prepared to pray — and you've already spoken words acknowledging the kingship of Heaven and the kingship of the House of David. Have extra intention when saying the name Adona'i while reading anything from the Prophets or something that mentions Moshe Rabeinu.",torah:"By being loved"},
{special:"The week of Sefirat Hahod is deeply holy, especially Pesach Sheni, the 'second Passover,' given as a second chance to those unable to bring the first Korban Pesach. It's also the yahrzeit of Rebbe Meir Ba'al HaNes. According to the Zohar, the light of the first Pesach lasts for 30 days — after which the light of Pesach Sheni begins, opening another seven days of spiritual opportunity. This week culminates with Lag BaOmer, the Hilulah of Rabbi Shimon Bar Yochai, when the gates for growth, joy, and second chances remain wide open.",hashem:"Contemplate in your mind all of the acts of chesed that Hashem performs — both with the nation of Israel as a whole and with you personally — and how the intention behind all of them is to bring creation to recognize, thank, and praise Hashem. As King David writes in Tehillim 118, Hodu l'Hashem — give thanks to Hashem — why? Ki tov, because He is good. He has done good for us in the past, He does good for us in the present, and He will continue to do good in the future. Also contemplate the power of giving thanks for what Hashem has not yet given you — for through this kind of gratitude, you awaken kindness and merit to receive the good that is still missing.",friends:"Try to increase your acts of chesed, and have the intention that your kindness should awaken gratitude in others toward Hashem. When a friend is going through a hard time and begins to speak to you from the depths of their heart, and you hold their hand and tell them 'It's going to be okay,' that moment can lead them to feel relief and eventually give thanks to the Creator. True gratitude for the good someone has done for you should lead you to increase your love for them and to do chesed in return.",body:{part:"left_leg",text:"When doing an act of chesed, use your left leg."},time:"Try to have love for Hashem and to do an act of chesed at the time of dawn, specifically on a Thursday.",intention:"Try to have extra Kavanah (focus) in prayer especially in the blessing of Selach Lanu (Forgiveness) during the Shemoneh Esrei. Have in mind any time you made a blemish by receiving kindness from the Creator and giving the credit to yourself. Have extra intention when saying the name E'l while reading anything from the Prophets or something that mentions Aharon HaKohen.",torah:"By loving Hashem"},
{special:null,hashem:"Contemplate all the acts of gevurah (might) that Hashem performs in the world, and how His creations are so quick to thank and praise Him. Reflect on the countless mighty acts Hashem has done to save the nation of Israel, and to save you personally. Haman and his friends in every generation that rise up against us — Hashem's gevurah stands behind the scenes, protecting and redeeming us. For your gratitude to be complete, you must guard your mouth — from impure foods and from unclean speech — so that there is no opening for the Sitra Achra to corrupt your words of thanks and prayer.",friends:"When making blessings of thanks or praise to Hashem, try to do so with might and energy — so that others are inspired to join you. When you see wicked people experiencing success or even seeming miracles, use all your strength not to be seduced or misled. Remember that Hashem has commanded us to follow the Torah alone. Take inspiration from Rebbe Shimon Bar Yochai, who refused to acknowledge the accomplishments of the Romans.",body:{part:"left_leg",text:"When doing an act of might, use your left leg."},time:"Try to feel awe for Hashem and at dawn especially on a Thursday.",intention:"Try to have extra Kavanah (focus) in prayer especially in the blessing of Re'eh Na (Redemption) during the Shemoneh Esrei. Have in mind any time you were in a hard place and you gave thanks/recognition to the might of the wicked people and their miracles — that gave them more power and delayed the full geulah. Have extra intention when saying the name E'lohim while reading anything from the Prophets or something that mentions Aharon HaKohen.",torah:"By loving people and righteousness"},
{special:null,hashem:"Contemplate how the angels and the legions of the heavens are constantly singing Hashem's praise. All of creation is in a state of harmony, glorifying the Creator without pause. And yet, when Am Yisrael opens their mouths in hallel and praise to Hashem, the angels immediately stop their own songs to listen. They declare: 'Fortunate is the King who has such a nation!' The more you internalize this truth — that your praise has such power and beauty in the eyes of heaven — the more you'll be inspired to thank and glorify your Creator with sincerity and joy.",friends:"When offering praise to Hashem, whether through blessings of gratitude or Hallel — try to do so with dignity and beauty, for example by wearing fine clothes as if standing before a king. Be especially careful with this during Birkat HaMazon. Bring to your heart that in order to truly thank your friends, one of the greatest gifts you can offer is helping them learn the Written Torah. When you praise or thank your friends, be careful to speak truthfully — honor them with sincerity, but don't exaggerate or flatter to the point where your words lose their honesty.",body:{part:"left_leg",text:"When learning the Written Torah, use your left leg."},time:"Try to learn the Written Torah, and to teach it to others at Dawn specifically on a Thursday.",intention:"Try to have extra Kavanah (focus) in prayer especially in the blessing of Refaeinu (Healing) during the Shemoneh Esrei. Have in mind any time you thought your health was dependent on a human of flesh and blood, and because of that you didn't give gratitude to Hashem. Have extra intention when saying the name Havaya while reading anything from the Prophets or something that mentions Aharon HaKohen.",torah:"By making Hashem and people happy!"},
{special:null,hashem:"Meditate on the fact that even during hard times, or when you're in a state of katnut (constriction or spiritual smallness), you still have the responsibility to overcome your Yetzer Hara, which tries to block your gratitude to Hashem. Even in those moments of pain or confusion, Hashem is still giving you life, sustaining you, and providing everything you truly need. And it is all, without a doubt, for your ultimate good. By striving to straighten your heart and stay aligned with the truth — by choosing gratitude even when it's difficult — you activate the power of netzach, and through it, you uplift and elevate your hod.",friends:"When thanking a friend or acknowledging someone who helped you, bring to your heart the foundation of emunah that everything comes from Hashem, and your friend is simply a messenger. When you hold this truth, even if that friend later acts in a negative way, you won't feel tied to them emotionally, because deep down you know it was Hashem who did the act, not them. And if you want to help your family or friends grow in gratitude, you must first overcome your own Yetzer Hara by thanking others constantly.",body:{part:"left_leg",text:"When doing an act of dominance/perseverance/permanence, use your left leg."},time:"Try to overcome your evil inclination, at Dawn specifically on a Thursday.",intention:"Try to have extra Kavanah (focus) in prayer especially in the blessing of Barchenu/Barech Aleinu (Parnassa) during the Shemoneh Esrei. Have in mind any time you took credit for your successes and didn't bring to your heart that Hashem gifted you that success. Have extra intention when saying the name Havaya Tzva'ot while reading anything from the Prophets or something that mentions Aharon HaKohen.",torah:"By loving rebuke"},
{special:"The Hilula of Rebbe Shimon bar Yochai who ascended to heaven on this day in the year 3881.",hashem:"When thanking Hashem, complete your gratitude with an additional layer — by recognizing the sheer privilege of even being able to stand before Him and express thanks. Reflect on all the times He fought for us in every generation, especially in Egypt, where He struck the Egyptians with ten plagues and brought us out with His mighty power. He gave us the Torah amidst thunder, lightning, and the voice of Hashem that splits flames of fire. He increased His kindness by revealing to us the secrets of the Torah, through which the highest light of His wisdom is made known. Through the holy Tanna, Rabbi Shimon Bar Yochai, who with his holiness could transform a hill into a plain, Hashem opened the gates of His deepest light.",friends:"When you see your friend master a particular middah with strength and consistency, give the recognition to Hashem and say, 'Fortunate is the King who has such people in His world!' When a desire arises within you to learn the inner dimensions of Torah, make sure to seek out a proper, kosher teacher — one who keeps halacha and most importantly takes no credit for himself but lives in full bittul to Hashem through sincere gratitude. This was the way of Rashbi. Be careful that your gratitude and praise to Hashem remain pure — avoid environments where immodesty or improper behavior is present while offering thanks.",body:{part:"left_leg",text:"When thanking a friend, use your left leg."},time:"Try to thank Hashem and a friend at Dawn and specifically on a Thursday.",intention:"Try to have extra Kavanah (focus) in prayer especially in the blessing of Mekabetz Nidhei Israel during the Shemoneh Esrei. Have in mind any time you took credit to yourself and not Hashem, also on being slow to give thanks, as well as any time you learned the inner aspects of the Torah in an impure way, delaying the ultimate redemption. Have extra intention when saying the name E'lohim Tzva'ot while reading anything from the Prophets or something that mentions Aharon HaKohen.",torah:"By loving uprightness"},
{special:null,hashem:"Meditate on the prayer Nishmat Kol Chai, which says, 'In the midst of the holy, You will be praised.' This teaches that those who are truly fit to praise and thank Hashem are the holy ones — those who have realized and attained genuine purity and holiness. Learn from this that for your own praise and gratitude to ascend properly before Hashem, you must increase your personal holiness and purity in all aspects — your limbs, organs, thoughts, speech, and actions. Only through becoming a clean and refined vessel can you truly honor the King of Kings.",friends:"When thanking a friend, try to express it with hitpa'alut — genuine emotional excitement and admiration — and do so publicly (without embarrassing them), in a way that inspires others to also feel and express gratitude. Strive to be a lover and pursuer of peace, like Aharon HaKohen. When making peace between others, bring proof from Hashem Himself — like the Sotah waters, where Hashem was willing for His Name to be erased to make peace between a husband and wife.",body:{part:"left_leg",text:"When traveling to the Tzadikei Hador (the righteous of the generation), and also when going to make peace, use your left leg."},time:"Try to host guests and establish holy places, to guard the rules of modesty, at Dawn, specifically on a Thursday.",intention:"Try to have extra Kavanah (focus) in prayer especially in the blessing of Sim Shalom (Peace) during the Shemoneh Esrei. Have in mind any time you didn't immediately thank Hashem and because of that you weren't happy with your portion and started to pursue with fights the money of others, distancing peace from yourself and others. Have extra intention when saying the name Shadda'y while reading anything from the Prophets or something that mentions Aharon HaKohen.",torah:"By avoiding honor, and not pursuing honor"},
{special:null,hashem:"Contemplate that in order to give true and proper thanks to Hashem, you must first make Him King over both your body and soul. Accept upon yourself the yoke of His kingship — meaning, commit to following His Torah — until your mouth naturally longs to pray, praise, and thank Him. Whether He has blessed you with leadership and wealth, or your path is one of poverty and limitation — either way, you must say thank You to Hashem and pray to Him. As we say, 'V'chol hachayim yoducha selah' — 'All living beings will thank You forever.'",friends:"When you merit to learn, or to teach others, the parts of the Oral Torah that contain deep wisdom — such as gematria or the calculations of astrological patterns — allow yourself to be awestruck by the depth of Hashem's wisdom. Give thanks that He has shown you such wonders. When you see a friend in a state of joy, especially after success in business, try to awaken within them a sense of gratitude to Hashem, so they don't take the credit for themselves.",body:{part:"left_leg",text:"When going to synagogue or learning the Oral Torah use your left leg."},time:"Try to give tzedakah and learn Oral Torah, and to honor those who learn Halacha, at Dawn, specifically on a Thursday.",intention:"Try to be up before dawn in order to be in a position where you're in the middle of a prayer on the Kingship of Hashem and the Kingship of David by the time dawn hits. Have extra intention when saying the name Adon'ai while reading anything from the Prophets or something that mentions Aharon HaKohen.",torah:"By not letting your heart become swelled on account of your learning"},
{special:null,hashem:"Meditate on the power of Yesod — the covenant and connection that binds all the higher attributes to their expression in the world. Contemplate how your every action either strengthens or weakens this channel of divine flow.",friends:"Seek to deepen your bonds with those around you. Invest in relationships that bear lasting fruit and reflect holiness.",body:{part:"whole_body",text:"Use your entire body with awareness, connecting each action to its source in Hashem."},time:"Try to establish connections of holiness in the morning.",intention:"Have extra kavana in the blessing of Sim Shalom, focusing on the peace that flows from holy connection.",torah:"By holy connection"},
{special:null,hashem:"Meditate on the strength required to guard the covenant — both the covenant of the tongue and of the body. Contemplate how Yosef HaTzaddik earned the title Tzaddik through his guarding of the brit in the house of Potifar.",friends:"When you need to correct or guide a friend, do so from a place of inner holiness. Guard your words so that even your correction comes from a clean and pure place.",body:{part:"right_leg",text:"Lead with your right leg when establishing acts of holiness and connection."},time:"Try to guard your speech and establish acts of purity in the morning.",intention:"Have extra kavana in the blessing of Sim Shalom. Focus on guarding the covenant of the tongue.",torah:"By guarding the covenant"},
{special:null,hashem:"Meditate on the beauty of true connection — when Chesed and Gevurah are unified in perfect harmony through Tiferet, and that union flows through Yesod to become real in the world.",friends:"Try to bring beauty and truth into your relationships. Connect with others not through function but through genuine inner meeting.",body:{part:"whole_body",text:"Use your whole body when doing acts of connection and harmony."},time:"Establish moments of genuine connection in the morning.",intention:"Have extra kavana in the blessing of Shema Koleinu, focusing on the beauty of connection with Hashem.",torah:"By truth and beauty"},
{special:null,hashem:"Meditate on the persistence of Yosef — who maintained his connection to Hashem even in the depths of Egypt, even in prison, even when forgotten. His endurance was Netzach flowing through Yesod.",friends:"Support those who persist in holiness even when it is difficult. Your recognition of their endurance strengthens them.",body:{part:"right_leg",text:"Use your right leg when going toward acts of endurance and holy persistence."},time:"Try to persist in one act of holy connection today, especially in the morning.",intention:"Have extra kavana in the blessing of Barech Aleinu, reflecting on the persistence of emunah.",torah:"By persistence in holiness"},
{special:null,hashem:"Bring to your heart this truth: in order to ascend the spiritual ladder in holiness and purity, you must deepen your gratitude to Hashem for every level you've already merited. Whether small or great, each step forward is a gift — acknowledge it. Make it a conscious habit to thank Hashem, especially after overcoming a test, particularly in the areas of holiness and purity. This gratitude invites more divine assistance, as our sages teach, 'In the path a person chooses to go, he is led.' By expressing thanks, you show that you desire the path of kedushah, and Hashem responds.",friends:"When you see that your friend has succeeded in purifying and sanctifying themselves, strengthen them by acknowledging and celebrating their growth and holy actions. Make sure to educate your family and students to always give thanks and express gratitude to Hashem for everything — every detail, every breath, every moment. For those who are of age, regularly review and teach the halachot and laws of blessings, so that giving thanks becomes not only a feeling but a consistent act of divine service.",body:{part:"tongue",text:"When thanking Hashem or a friend make sure to use your tongue."},time:"Try to thank Hashem and to strengthen a friend to serve Hashem and sanctify himself, in the day, in the morning, specifically on Friday or Shabbat day.",intention:"Try to have extra Kavanah (focus) in the blessing of Mekabetz Nidhei Amo Israel during the Shemoneh Esrei, think of all the blemishes caused on the Yesod, spreading of holy sparks from their proper place, any blemishes of the tongue when you didn't remember to thank Hashem. Have extra intention when saying the name Eloh-im Tzvao't during Friday and Shabbat day.",torah:"By leading on to peace"},
{special:null,hashem:"Contemplate how, in order to merit holy children, one must strive to be holy both before and during their creation. Bring to your heart that in order to preserve the purity you've already reached, you must 'sanctify yourself with what is permitted to you.' This means that even when engaging in mundane activities — eating, drinking, sleeping — they should be done with the intention to connect to Hashem, not merely for physical pleasure. Overindulgence opens the door to the yetzer hara. Do all you can to connect yourself to holy tzadikim — true tzadikim who fight with their entire being to protect Am Yisrael spiritually, who care deeply about modesty and purity.",friends:"Strive to increase modesty and purity both in yourself and in others, doing so calmly but effectively. Work to bring more peace into the world — especially between husband and wife. At the Shabbat table, at a brit milah, or at a wedding, make an effort to fill the atmosphere with singing, joy, and holiness. Uplift others into a state of holy joy — because a person who is sad or depressed is vulnerable and close to stumbling in matters of purity.",body:{part:"tongue",text:"When you're happy or singing songs of yearning for the geulah (redemption), also when telling stories of Tzadikim that increase modesty and purity in the world, use your tongue."},time:"Try to host guests and increase the holiness of the brit — which includes both the brit milah and the brit of the tongue — especially during the day, and specifically on Friday and Shabbat mornings.",intention:"Try to have extra Kavanah (focus) in the blessing of Sim Shalom, during the Shemoneh Esrei. Have in mind that Hashem should forgive you for all the times you were depressed and down and didn't smile at others, which caused you to not guard your tongue in purity — leading to arguments that delayed the Geulah. Have extra intention when saying the name Shadd'ay especially during the day, and specifically on Friday and Shabbat mornings.",torah:"By heart being settled in your learning"},
{special:null,hashem:"Contemplate on the fact that you need to crown Hashem over every facet of your life in order to really complete your holiness and purity. Crowning Hashem means accepting His will and Torah guidance over every action, thought, and word, making sure they are aligned with halacha and with the inner truth of what it means to be connected to Hashem. All your speech, thoughts, and actions should be for the sake of Heaven and for no other reason. You also need to be connected to the true tzadikim and not to others — we must constantly pray to Hashem to help us connect to the real tzadikim. Also, in order to hasten the final redemption, we need to give more tzedakah to the poor and needy, as well as comfort them with words of hope and inspiration.",friends:"In order to merit holy children who are talmidei chachamim, you need to honor talmidei chachamim and support them — especially those who are learning and teaching the Oral Torah and halacha. Try to light the candles that will be used on Shabbat and pray for your children to be holy and learned in Torah. If you see a friend not being careful with guarding their brit, make sure to say something in a loving way — explain the pain and blemishes that such actions cause to the Shechinah. Speak from a place of compassion and clarity, not judgment.",body:{part:"tongue",text:"When crowning Hashem over you, make sure to use your tongue and not just rely on your mind and heart."},time:"Try to increase tzedaka (charity) with the poor and needy during the day, specifically the morning, best on a Friday and for the needs of Shabbat.",intention:"Try to have extra Kavanah (focus) in all of your prayers. Especially in the prayers of the Kingship of Hashem, and Kingship of David. Have extra intention when saying the name Adon'ai specifically the morning, best on a Friday and Shabbat.",torah:"By questions and answers"},
{special:null,hashem:"Bring to your heart that in order to crown the Creator over you, and to receive the yoke of Heaven upon yourself, you must act in the way of the middah of Malchut — the way and will to cling to the middah of chesed and bring good to the world. For you to truly crown Hashem over every part of your life in a consistent and lasting way, and for the light of your neshama to influence your mind and body, you need to do acts of chesed with your body. This means giving your body what it needs — time, care, and attention — and not looking down on its needs or treating it with disregard. When you stand in prayer before Hashem, pray for an increase of chesed in the world.",friends:"Try to increase love and kindness in the world, especially toward the poor and needy — even more so toward those who are homeless, pursued, and without a settled place to rest. Through your chesed, try to help them find shelter, bread for satiation, and a bed for sleep. When doing business with a friend, make sure all your actions are for the sake of avodat Hashem, and prove it by calculating your profits honestly and separating maaser.",body:{part:"tongue",text:"Before doing a positive mitzvah (one of the 248 commandments) say with your mouth that you are fulfilling this mitzvah from a place of love for Hashem. When doing a chesed with a friend use your mouth — console and comfort them."},time:"Try to feel love for Hashem, at night, and specifically at midnight.",intention:"Try to have extra Kavanah (focus) especially in the blessing of Selach Na during the Shemoneh Esrei. Ask Hashem to forgive you for not wanting the Kingship of Hashem, Kingship of David, and the building of the Beit HaMikdash. Not wanting them made a lack in the Shechinah. Have extra intention when saying the name E'l in your prayers and learning, even more so at night, and specifically at midnight.",torah:"By hearing and adding"},
{special:null,hashem:"Contemplate all the acts of might, fear, and gevurah that Hashem performs in the world — both on a global scale and in your personal life. From seeing the gevurah of Hashem, you will come to crown Him as King over the world and over yourself. To do this properly, you must act like Malchut, which operates according to din — the attribute of strict judgment. You need to be strong and firm in the face of wicked people, false ideas, and the evil inclination within you. Just as Malchut does not compromise with evil, you too must not give in, but rather stand with strength and discipline for the sake of Hashem's honor.",friends:"You need to protest — as much as you can — against those who act against Hashem and reject the yoke of His kingship. When you speak out against such actions, you give some nachat ruach to the Shechinah and bring honor to Hashem by showing that there are still those who desire true Malchut. At the same time, when you stand in prayer before Hashem, beg Him to have mercy on those who anger Him — ask Hashem to place thoughts of teshuvah in their hearts.",body:{part:"tongue",text:"Before keeping yourself from one of the 365 negative commandments, say that you are not going to do this negative act out of Irat Hashem (awe of Hashem). So too when doing an act of might/gevurah with a friend, use your mouth."},time:"Try to feel awe for Hashem in the night, specifically midnight.",intention:"Try to have extra Kavanah (focus) in prayer. Especially in the blessing of Re'eh Na during the Shemoneh Esrei. Have extra intention when saying the name Eloh-im during prayer and learning Oral Torah, at night, more so at midnight.",torah:"By learning in order to teach"},
{special:null,hashem:"Meditate on the fact that Hashem's kingship over the heavens depends on your willingness to let Him reign over you. In order for His presence to dwell in the world, you must first allow Him to dwell within your own heart. That means honoring Him not only in thought, but in how you speak, act, and carry yourself. When you refine your traits — when you become more patient, humble, and truthful — you increase the kavod of Heaven on earth. Let your body become a throne for your soul, and your soul a throne for the Shechinah. Rule over your instincts so that Hashem can rule through you. Walk with composure. Respond with wisdom. Return to your Source again and again.",friends:"Meditate on the way you speak and do business with others. Hashem is present not only in your prayer but in every word and exchange between you and your fellow. When you speak truth with honesty, when you choose fairness even when it costs you — you are allowing the light of Hashem to shine into the world. When you give charity, or tithe your earnings, don't just do it to fulfill a command — do it with beauty and compassion. Give with warmth. Give with honor. This is the way of the chachamim, who gave with humility and dignity.",body:{part:"tongue",text:"Before learning the Written Torah, say with your mouth that you are doing this learning out of love and awe of the Creator. So too when having mercy on others, use your mouth."},time:"Try to arouse yourself to glorify Hashem at night and specifically at midnight.",intention:"Try to have extra Kavanah (focus) in prayer. Especially in the blessing of Refaeinu during the Shemoneh Esrei. Ask for forgiveness for any time you took honor to yourself instead of for Hashem. Have extra intention when saying the name Havaya during your prayers, and while learning the oral Torah.",torah:"By learning in order to do"},
{special:null,hashem:"Contemplate deeply that the final redemption — both for yourself and for the Shechinah — depends on your ability to endure and persist in overcoming the yetzer hara. The yetzer hara never rests — it constantly tries to seduce, distract, and pull you away from your purpose. To walk with the Shechinah into salvation at the end of days, you must begin now to live with a victorious will, a Netzach spirit that never gives up. Every time you rise above a fall, every time you resist even a small temptation, you strengthen the kingship of Hashem in the world. A key area to master is your eating — begin by eating only what you need in the moment, with joy, awareness, and gratitude.",friends:"Arouse in yourself and in those around you a desire to learn the laws of Shabbat consistently. Shabbat is a taste of the World to Come — a revelation of Netzach, the eternal realm. Strengthen yourself and those around you not to be swayed by the apparent success of the wicked. Their fantasies of wealth and influence through sin are illusions — temporary shadows with no root in eternity. True Netzach is inherited through emunah, through loyalty to Hashem and His Torah.",body:{part:"tongue",text:"When coming to learn the books of the prophets, say with your mouth that you are learning it to reach emunah in the Creator."},time:"Try to defeat your yetzer hara for Hashem and to do an act of netzach in the night, specifically at midnight.",intention:"Try to have extra Kavanah (focus) in all of tefillah, especially in the blessing of Barech Aleinu during the Shemoneh Esrei. Ask to be forgiven for believing in the success of the wicked and not having emunah in the right path, blocking shefa from the Shechinah. Have extra intention when saying the name Havaya Tza'ot during prayer, learning Oral Torah, at night, midnight.",torah:"By making your teacher wiser"},
{special:null,hashem:"Meditate on the completion of the Omer. You are approaching the ultimate destination — the receiving of Torah at Sinai. The Shechina rests only where there is truth and humility. Prepare your vessel.",friends:"Bring those around you into the joy and anticipation of Shavuot. Share the excitement of returning to Sinai.",body:{part:"whole_body",text:"Engage your entire being in preparation for Matan Torah."},time:"Learn Torah and prepare for Shavuot in the morning.",intention:"Have extra kavana in all of tefillah — you are standing before the King on the eve of the greatest gift.",torah:"By wholeness and completion"},
{special:null,hashem:"Meditate on Malchut — the full expression of divine sovereignty. All 48 days of refining have been building to this: making yourself a complete vessel for the receiving of Torah.",friends:"Connect with community and loved ones in the spirit of unity before Shavuot. All of Israel stood together at Sinai — as one person with one heart.",body:{part:"whole_body",text:"Your whole body has been refined over 49 days. Dedicate it completely to Hashem today."},time:"Prepare for Shavuot in the morning — learn, pray, give tzedakah.",intention:"Have kavana in all of tefillah. Focus on the Kingship of Hashem and the unity of Israel.",torah:"By complete dedication"},
{special:"The counting is complete. The vessel is ready. Tonight — stand at Sinai.",hashem:"Malchut of Malchut. Every sefirah, every day, every moment of inner work has been preparing for this night. The Torah was not given to angels — it was given to human beings who did 49 days of inner work. You are that vessel. Open your heart completely.",friends:"Stay up tonight and learn Torah with others. Share what has opened in you over these 49 days.",body:{part:"whole_body",text:"Tonight your whole body, your whole being, stands at Sinai. Receive the Torah with every part of yourself."},time:"Stay up through the night — learning, praying, singing. Greet the dawn of Shavuot as a new person.",intention:"Have kavana in all of tefillah and learning tonight. You are standing before Hashem receiving the Torah.",torah:"By complete love and awe"},
];

// ── Inner Work data (49 days) ────────────────────────────────────────────────
const D=[
{e:"Pure love with no strings attached. Chesed begins here — the raw capacity to give simply because it is in your nature.",li:["You smile at a stranger with no reason","You give more time than asked and feel good doing it","You offer help before anyone asks","You genuinely enjoy making others feel welcome"],sh:["You give but quietly keep score of who reciprocates","Your generosity comes with invisible strings","You're kind to people who can help you, less so to those who can't","You feel resentful when your giving isn't noticed"],wo:["Do one act of giving today that nobody will ever know about","Give something and consciously release any expectation","Notice when a generous impulse is really about being seen","Ask: would I still give this if they'd never thank me?"],p:"Who in your life receives your love freely — and who receives a version that has conditions?"},
{e:"Love that knows its own limits. Chesed through Gevurah — generosity with a spine.",li:["You say no to someone with warmth — and it actually helps them","You give in a way that empowers rather than creates dependency","Your love is honest: you tell people what they need to hear","You hold a boundary and still feel genuine care"],sh:["You can't say no without guilt, so you say yes and resent it","Your kindness enables people","You withhold love as a form of control","You're strict with those closest and generous with strangers"],wo:["Say no to one request today — kindly, without over-explaining","Notice where your helping might be keeping someone stuck","Find the line between support and enabling in one relationship","Tell someone a truth they need to hear — from love, not judgment"],p:"Where is your generosity protecting you from having to make a harder choice?"},
{e:"Love that is beautiful — balanced, truthful, full-hearted. Chesed through Tiferet.",li:["You give and the other person feels seen, not just helped","Your presence itself is the gift","You balance giving with receiving — it feels like flow","Your kindness matches what you feel inside"],sh:["You perform generosity — the gesture looks good but the heart isn't in it","You give to feel good about yourself","You're kind in public, less so at home","You give in ways that make you look generous rather than ways that serve"],wo:["Do one act of kindness that serves the other person's actual need","Be as kind to someone in private as you would be if the world were watching","Check: is there a gap between how generous you feel and how you actually are?","Sit with someone in their difficulty instead of rushing to fix it"],p:"If your loved ones described how you give — would it match how you see yourself?"},
{e:"Love that shows up even when you don't feel it. Chesed through Netzach — the commitment that outlasts mood.",li:["You call someone when you're tired — because you said you would","Your love doesn't depend on people being at their best","You show up consistently, quietly, without needing recognition","You build others up over time — small gestures, steady presence"],sh:["You're generous in bursts but disappear when life gets busy","Your love is intense at first and then fades","You keep giving to people who drain you without reassessing","You confuse intensity with love"],wo:["Reach out to someone you've been meaning to check on — do it today","Make one small commitment and keep it, even though inconvenient","Ask: am I showing up for people in ways that actually sustain?","Notice if your giving is seasonal"],p:"Who in your life needed you consistently — and got you inconsistently?"},
{e:"Love expressed through acknowledgment. Chesed through Hod — seeing someone fully and saying so.",li:["You tell someone specifically what you appreciate about them","You notice the effort behind what someone did","You make people feel seen without needing anything in return","Your words of recognition land because they're true and specific"],sh:["You take the people who love you for granted","You give compliments strategically","You notice what's wrong more quickly than what's right","You're generous with strangers and stingy with acknowledgment at home"],wo:["Tell someone today specifically what they mean to you and why","Write a message of genuine appreciation to someone who helped you","Catch yourself noticing something good about someone — and say it out loud","Ask: when did I last make someone feel truly seen?"],p:"Who has been giving to you quietly, consistently — and hasn't heard you notice?"},
{e:"Love that creates real bonds. Chesed through Yesod — giving that goes deep, not just wide.",li:["You invest real time in one relationship instead of spreading yourself thin","You're vulnerable with someone — and it brings you closer","You give in a way that creates lasting trust","You let someone into your real life"],sh:["You're everyone's friend and nobody's close friend","You give attention and warmth but never real access","You're emotionally available to acquaintances and distant from family","You confuse being pleasant with being genuinely present"],wo:["Have one real conversation today — not small talk","Let someone see you when you're not at your best","Ask a friend or family member a real question and listen to the full answer","Notice: who do you keep at arm's length while calling them close?"],p:"In your most important relationships — are you truly present, or performing presence?"},
{e:"A week of Chesed complete. Malchut asks: did love actually reach anyone?",li:["Your love left a mark on someone this week — they felt it","You moved from intention to action at least once","Someone experienced you differently this week","You gave something real — not just energy, but yourself"],sh:["The week passed with good intentions that stayed intentions","Your loving feelings never made it into words or actions","You were kinder to the idea of people than to actual people","You waited for the right moment — and it never came"],wo:["Look back: name one person who concretely experienced your Chesed","If nobody comes to mind — do one real act today","Write down one thing you will do differently in Week 2","Acknowledge yourself for what you did — and be honest about what you didn't"],p:"What did love look like in your life this week — not in theory, but in practice?"},
{e:"The courage to hold a line. Gevurah is the force that makes love sustainable.",li:["You keep a commitment even when breaking it would be easier","You hold a boundary and feel at peace rather than guilty","Your no comes from values, not fear","You confront something difficult instead of going around it"],sh:["You mistake harshness for strength","Your inner critic is louder than your inner coach","You judge others quickly and forgive yourself slowly","You call your rigidity having standards"],wo:["Keep one commitment today that you'd normally quietly let slide","Notice when your inner voice disciplines vs. destroys — and shift","Set one clear expectation where things have been vague","Say something difficult but necessary — without cruelty"],p:"Where in your life do you need more strength — and where do you need to soften what you call strength?"},
{e:"Discipline within discipline. Gevurah of Gevurah — the peak of inner structure.",li:["You can be strict with yourself without being punishing","You hold high standards AND give yourself room to be human","Your discipline is consistent — it doesn't depend on who's watching","You make hard decisions clearly"],sh:["Your standards for yourself are impossible — you're always falling short","You've confused rigidity with discipline","You're hard on yourself in ways that prevent growth","You control your environment to avoid feeling out of control"],wo:["Name one rule you live by — and ask if it serves you or just controls you","Be as compassionate with your own failure as you'd be with a friend's","Do one thing that requires real self-discipline — and note how it feels","Drop one self-critical thought the moment you notice it"],p:"Is your inner discipline building you up or wearing you down?"},
{e:"Strength softened by truth. Gevurah through Tiferet — the courage to be both honest and kind.",li:["You tell the truth — and tell it with care","You can disagree and still leave the person feeling respected","Your feedback builds rather than breaks","You stand firm on what's right without needing to win"],sh:["You use honesty as a license to be blunt","You hold back real feedback because conflict feels too risky","You're right but in a way that damages the relationship","You confuse being direct with being harsh"],wo:["Give one piece of honest feedback today — for the person's benefit","Disagree with someone today — clearly, without attacking","Notice where you're withholding truth to keep the peace","Ask: when I'm being honest, who is it really for?"],p:"Think of a truth you've been holding back. What would it take to say it with both honesty and love?"},
{e:"The staying power of discipline. Gevurah through Netzach — commitment that holds when motivation evaporates.",li:["You show up for your commitments on the hard days","Your word means something — people count on it","You finish what you start even when the energy is gone","You've built something through quiet, consistent effort"],sh:["You burn yourself out because you can't say this is enough for today","You quit exactly when things start to require real effort","You're motivated by emotion — inspired one day, gone the next","You keep rules that no longer serve you out of stubbornness"],wo:["Do the thing you've been putting off — start it","Honor one commitment that felt optional — treat it as non-negotiable","Notice the moment you want to quit today — and stay five more minutes","Ask: what am I sustaining that deserves more, and what am I just grinding through?"],p:"Where does your commitment run deep — and where does it run out the moment things get uncomfortable?"},
{e:"The strength of honest acknowledgment. Gevurah through Hod — the courage to say I was wrong.",li:["You admit a mistake without over-explaining","You say I was wrong and mean it — and nothing collapses","You can receive criticism without becoming defensive","Your apologies are clean — no but, no deflection"],sh:["You apologize constantly without changing anything","You defend your position long after you privately know you're wrong","Your pride disguises itself as principle","You accept blame for things that aren't yours to avoid conflict"],wo:["Find one place today where you owe someone an acknowledgment — and give it","Receive one piece of criticism today without defending yourself","Notice the moment you shift from explaining to justifying — and stop","Say you were right about that to someone, and mean it"],p:"Is there an acknowledgment you've been withholding — and what are you protecting by holding it back?"},
{e:"The strength that makes you reliable. Gevurah through Yesod — discipline in service of real connection.",li:["People know what to expect from you — you're steady","Your commitments in relationships are as strong as your commitments to work","You protect relationships with the same care you protect your time","You're as disciplined showing up for others as in how you perform"],sh:["You're extremely disciplined professionally and careless with the people who matter most","You hold others to standards you don't apply to yourself","Your reliability is transactional","You use I'm busy as a shield from emotional accountability"],wo:["Be as reliable in a personal commitment today as you are in a professional one","Keep one relational promise you might normally reschedule","Ask someone close: do they experience you as dependable?","Notice where your discipline protects you from intimacy"],p:"Does the person who knows you best experience you as someone they can count on?"},
{e:"Two weeks complete. Gevurah of Malchut — strength made visible in the world.",li:["Your discipline this week changed something real","Someone experienced you as stronger, steadier, more honest","You held something this week that you would have let go before","Your inner work showed up in your outer behavior"],sh:["The discipline stayed internal — nothing actually changed","Your strength this week may have just been stubbornness","You were hard on yourself and soft on what actually needed confronting","Gevurah without Malchut is just private suffering"],wo:["Name one concrete thing that is different because of this week's work","If nothing changed — what was the obstacle?","Write down one commitment you will carry into Week 3","Acknowledge one way you showed real strength — and one way you avoided it"],p:"What did strength look like in your actual life this week — not as an idea, but as an action?"},
{e:"The heart of the Tree of Life. Tiferet is truth, compassion, and beauty all at once.",li:["You see another person fully — not just their role","You respond to complexity with nuance","You find beauty in ordinary moments","You're moved by something today — and you let yourself be"],sh:["You tell yourself a beautiful story about who you are that doesn't match how you act","You pursue an ideal version of your life while neglecting the actual one","You perform depth but avoid real vulnerability","You value beauty in art and ignore ugliness in your own character"],wo:["Look at someone close and really see them","Let one moment of beauty today fully land","Find where your self-image is more flattering than the truth","Have one conversation where you're genuinely curious"],p:"Where is there a gap between the person you believe yourself to be and the person your actions reveal?"},
{e:"Compassion with strength. Tiferet through Gevurah — the heart that holds its shape under pressure.",li:["You stay emotionally present without shutting down or exploding","You feel someone's pain AND maintain your own groundedness","Your empathy is honest — you don't just validate everything","You can hold space for someone without losing yourself"],sh:["You armor your heart with analysis","You're emotionally available in theory but checked out when needed","You collapse into other people's emotions and call it empathy","Your compassion has a shorter limit than you think"],wo:["Stay present in one uncomfortable conversation today","Notice when you go analytical to avoid feeling — and stay in the feeling","Ask someone how they're really doing — and just listen","Find the line between healthy boundaries and emotional unavailability"],p:"Think of someone who is struggling. Are you truly present with them — or managing them from a safe distance?"},
{e:"The radiant center. Tiferet of Tiferet — the heart fully open, truth fully spoken.",li:["You're fully yourself today — no performance, no mask","Your inner and outer life feel aligned","You speak from your actual experience","You let yourself be moved — by music, by nature, by another person"],sh:["You curate your self-presentation so carefully you've lost track of what's real","You're more comfortable with the idea of openness than actual openness","You pursue perfection as a way to avoid showing up as you are","You wait until you're ready before letting anyone really see you"],wo:["Say something true today that you usually keep to yourself","Let yourself receive something without deflecting","Notice where you're performing rather than being","Find one place where what you say and what you feel don't match — and close the gap"],p:"Who in your life sees the real you — and who sees only the version you've decided is safe to show?"},
{e:"Compassion that endures. Tiferet through Netzach — the heart that keeps showing up.",li:["You love people at their worst, not just their best","Your care doesn't fluctuate with how they're treating you","You've stayed in a difficult relationship because it matters","Your compassion is a practice, not just a feeling"],sh:["Your empathy burns bright and then burns out","You stay in situations that harm you and call it loyalty","You give compassion endlessly to others and none to yourself","You've become numb"],wo:["Extend compassion today to someone who is being difficult","Give yourself the same kindness you'd give a friend","Notice if numbness has replaced your sensitivity somewhere","Ask: where am I staying out of habit rather than genuine love?"],p:"Where have you closed your heart to protect yourself — and what would it cost you to open it again?"},
{e:"Beauty seen through gratitude. Tiferet through Hod — compassion that makes you thankful.",li:["You find something genuinely beautiful in an ordinary day","You feel grateful — not forced, not performed","You notice what you have rather than what you lack","You receive your life as a gift"],sh:["You intellectually know you have a lot but emotionally feel empty","Your gratitude is situational","You've stopped noticing the good because it became familiar","You perform positivity while privately carrying a different reality"],wo:["Find one thing today you've completely stopped noticing — and really look at it","Write down three things you are genuinely grateful for — and say why","Tell someone that their presence in your life is a gift — mean it","Sit for two minutes with the fact that you are alive today"],p:"If you looked at your life through the eyes of someone who wanted what you have — what would they see?"},
{e:"The heart that creates real bonds. Tiferet through Yesod — compassion at the soul level.",li:["You're genuinely interested in the inner life of someone close to you","You create safety — people tell you things they don't tell others","Your care makes people feel less alone","You love in a way that gives people room to be themselves"],sh:["You connect through roles and functions","Your love comes with an unspoken vision of who the person should be","You need people to be okay so you can feel okay","You confuse closeness with control"],wo:["Ask someone close a question about their inner world","Notice if your love allows the other person to be themselves","Create one moment of real connection today — not transactional","Be with someone in a way that has no agenda"],p:"Do the people closest to you feel truly seen and free — or managed and loved conditionally?"},
{e:"Three weeks. Tiferet of Malchut — beauty and truth made real in the world.",li:["Your inner work this week showed up in how you treated people","Something in the world is more beautiful because you were in it","You brought truth AND compassion together in at least one real moment","The heart you opened this week stayed open"],sh:["Tiferet stayed theoretical","You were moved emotionally but unmoved practically","You recognized the gap between who you are and who you want to be — and did nothing","Another week of insight without change"],wo:["Name one relationship that is genuinely better because of this week's work","Name one truth that you brought into your life","What opened in your heart this week that you want to protect?","Write one intention for the week ahead"],p:"What is one concrete thing that is more beautiful, more true, or more loving in your life because of this week?"},
{e:"Endurance, passion, and the will that keeps going. Netzach is the force beneath all sustained effort.",li:["You know what you're fighting for","Your energy comes from genuine passion, not just habit or fear","You've built something real through sustained effort","You have a deep well — and you know how to draw from it"],sh:["You're driven by desire but not sure which desires are actually yours","You have passion but no direction","You can't rest — busyness has become your identity","You keep going out of stubbornness and call it perseverance"],wo:["Name the deepest why behind your main effort right now — say it out loud","Notice what you're doing from genuine desire vs. compulsion","Give yourself permission to stop today — real rest","Ask: what am I really chasing, and is it worth chasing?"],p:"Underneath the busyness — what do you actually want? And is your life currently moving toward it?"},
{e:"Discipline in service of endurance. Gevurah of Netzach — the structure that sustains your passion.",li:["You pace yourself — showing up tomorrow matters as much as today","Your habits are in service of what you love","You finish things — even when the excitement is long gone","You've learned the rhythm of effort and rest"],sh:["You sprint until you crash","Your discipline is brittle — one disruption and the whole structure falls","You've disciplined the passion out of what you love","You rest only when forced to"],wo:["Build in one deliberate pause today — before you need it","Look at one area where your all-or-nothing pattern is costing you","Do less today than you could — as a conscious choice","Ask: what would sustainable look like where I currently burn bright and crash?"],p:"Is your current pace one you could maintain for a year? If not — what needs to change?"},
{e:"Passion aligned with heart. Tiferet of Netzach — when your energy comes from love, not just drive.",li:["You work on something and it feels like it matters","Your motivation is connected to your values, not just your ambitions","You feel the difference between effort from love and effort from fear","What you're working toward has meaning — and you know why"],sh:["You've optimized for success and lost track of why you wanted it","You're excellent at things you no longer love","You confuse intensity with passion","You're chasing someone else's definition of winning"],wo:["Reconnect with why you started something you're currently grinding through","Ask: if I succeeded completely at this — would my life feel meaningful?","Find one thing you do purely for love — and make time for it today","Notice when effort comes from joy vs. from anxiety"],p:"When did you last do something just because you loved it — not because it served a goal?"},
{e:"Pure endurance. Netzach of Netzach — the unbreakable will.",li:["You've survived something that would have stopped many people","Your resilience has been tested — and it held","You don't need external motivation to keep going","You know what you're made of because situations have shown you"],sh:["You keep going when you should stop","You don't know how to receive help","Your endurance is actually avoidance","You've mistaken suffering for virtue"],wo:["Acknowledge something you've carried for a long time — and honor the strength that took","Ask: is this thing I'm persisting with worth persisting with?","Let someone help you today","Distinguish between endurance that builds and endurance that just delays"],p:"What have you been pushing through that actually deserves to be put down?"},
{e:"Victory acknowledged. Hod of Netzach — gratitude for the endurance that carried you.",li:["You recognize that your resilience was not yours alone","You thank someone who held you up when you were running on empty","You celebrate small wins — not just the finish line","You acknowledge how far you've come"],sh:["You never celebrate — there's always more to do","You take sole credit for what actually required a village","You're so focused on the destination you never experience the journey","You dismiss your own accomplishments before anyone else can"],wo:["Celebrate one small win today — actually let yourself feel it","Thank someone who made your endurance possible","Look back at where you were a year ago and acknowledge the distance","Let someone else carry something today"],p:"What have you accomplished that you've never let yourself fully appreciate?"},
{e:"Passion that connects. Yesod of Netzach — your endurance in service of real relationship.",li:["Your energy and drive inspire the people around you","Your commitment to something makes others want to commit too","You channel your passion into creating — not just doing","Your persistence builds something others can inhabit"],sh:["Your drive leaves people behind","Your passion for work crowds out your passion for people","Your endurance isolates you","You build things but neglect relationships"],wo:["Bring someone into your effort today — share what you're working toward","Make sure the people close to you know they matter more than the work","Ask: does my drive serve the people I love — or does it take from them?","Find one way your passion can be directed toward someone"],p:"Who has paid the price for your ambition — and do they know you know?"},
{e:"Four weeks. Netzach of Malchut — endurance made visible in the world.",li:["Something real was built or sustained this week because you didn't quit","Your persistence showed up in behavior, not just intention","Someone else's life is different because you kept going","The effort was worth it — you can see why"],sh:["You endured this week — but you're not sure what for","Your persistence was indistinguishable from avoidance","You were busy but nothing grew","The drive is there but the direction is still unclear"],wo:["Name one thing that exists or improved because you stayed with it","If you're not sure — clarify: what are you actually building?","Write down the one commitment you most want to sustain","Rest today — real, guilt-free rest — as an act of Avodah"],p:"When you look at what you built this week — are you proud of it?"},
{e:"Splendor, humility, and the art of receiving. Hod asks: can you let goodness actually reach you?",li:["You receive a compliment and let it land — really land","You ask for help without making it into a big thing","You acknowledge what others contribute","You find yourself genuinely grateful — spontaneously"],sh:["You deflect every compliment","You can't accept help without feeling like you owe something","Your humility is actually a defense against being seen","You make yourself small so others won't expect too much"],wo:["Accept one compliment today fully — just say thank you","Ask for help with something you've been handling alone","Notice every time you minimize yourself today","Receive something without immediately reciprocating"],p:"What would it mean to let yourself be seen as worthy of love and recognition — without deflecting?"},
{e:"The courage to acknowledge. Gevurah of Hod — it takes real strength to say I was wrong.",li:["You own your mistakes without over-explaining","You say I was wrong and mean it — and nothing collapses","You receive criticism and find the truth in it before you defend","Your acknowledgments are clean — no but, no however"],sh:["Your apologies always have a second half that undoes the first","You accept fault for things that aren't yours","You never admit you're wrong — you just quietly change your behavior","Pride disguises itself as certainty"],wo:["Find one thing today you got wrong and acknowledge it","When criticized today, find the part that's true before you respond","Drop but from one apology","Notice when defensiveness kicks in — and pause before speaking"],p:"Is there an acknowledgment you owe someone that you've been avoiding?"},
{e:"Gratitude that comes from the heart. Tiferet of Hod — genuine thankfulness, not performance.",li:["You feel grateful for something specific today — and it's real","Your thank-yous are detailed and genuine","You notice beauty and goodness that you usually scroll past","Your gratitude changes how you see a situation"],sh:["Your gratitude is a spiritual to-do","You feel grateful in abundance and forget when things are hard","You're grateful in general but not for anyone specifically","You perform gratitude in public and carry resentment in private"],wo:["Write down one thing you are genuinely grateful for — and write why","Tell one person today something you appreciate about them","Find gratitude for something difficult","Spend two minutes in genuine wonder at something ordinary"],p:"What is something in your life you've completely stopped appreciating — and what would it feel like to see it fresh?"},
{e:"Sustained gratitude. Netzach of Hod — finding something to be grateful for every single day.",li:["Even on a hard day, you find one thing that was real and good","Your gratitude is a discipline — not dependent on circumstances","You've trained yourself to notice abundance","Your orientation toward life is fundamentally one of receiving"],sh:["You force gratitude as a way of avoiding legitimate pain","Your positivity doesn't reach the parts that are actually hurting","You've bypassed your own suffering by covering it with spiritual language","You tell others to be grateful when they need to be heard first"],wo:["Find one genuine thing to be grateful for in your hardest current situation","Don't force it — if nothing comes, sit with the difficulty first","Notice if your gratitude practice is authentic or avoidant","Let yourself feel something difficult today — and then find the grace inside it"],p:"Is there something you're using gratitude to bypass — a pain or truth that deserves to be felt rather than reframed?"},
{e:"Lag B'Omer — Hod of Hod. The yahrtzeit of Rabbi Shimon bar Yochai — the day the hidden light burst through.",li:["You let yourself celebrate — fully, without guilt","You recognize the light in yourself and let it shine today","You bring joy into a room just by being fully present","You express something that's been building — creativity, love, truth"],sh:["You suppress your own radiance so others won't feel uncomfortable","You celebrate others easily but can't celebrate yourself","Your joy has a ceiling","You perform happiness while something real goes unexpressed"],wo:["Do something joyful today — not productive, not useful, just joyful","Let yourself shine in one moment without dimming it","Tell someone what makes you light up","Light a fire today. Let it be a symbol of what burns in you"],p:"What is the part of you that most wants to be expressed — and what stops you from letting it out?"},
{e:"Gratitude that deepens bonds. Yesod of Hod — when acknowledgment becomes the foundation of real connection.",li:["You tell someone what they mean to you — specifically and truly","Your acknowledgment creates closeness","People feel genuinely seen and appreciated in your presence","You express love and gratitude before you're forced to by a crisis"],sh:["You assume people know how you feel — so you never say it","Your acknowledgment is general — you're great — rather than real","You express gratitude only when it's socially expected","You've never told the most important people what they actually mean to you"],wo:["Tell one person today something specific they've done that changed your life","Write a message to someone you love that says exactly what you feel — and send it","Don't wait for the right moment — say what you mean today","Ask: if this person weren't here tomorrow, what would I wish I had said?"],p:"Who deserves to hear from you today — and what exactly would you say if you knew they needed to hear it?"},
{e:"Five weeks. Hod of Malchut — gratitude and acknowledgment made real in the world.",li:["Someone felt genuinely seen this week because of you","You received something this week — care, praise, help — and let it in","Your gratitude practice changed how you moved through at least one day","You expressed appreciation that you'd been holding inside"],sh:["The week passed with invisible gratitude — felt but not expressed","You received care this week and immediately deflected","Your humility kept you from being seen — and you called that virtue","Another week of good intentions that didn't make it into words"],wo:["Name one person who felt more appreciated this week because of you","Name one moment you allowed yourself to genuinely receive","If neither — do one of these things before the week closes","Write down one thing you want to carry into Week 6"],p:"What did gratitude look like in your actual life this week — not as a concept, but as a moment?"},
{e:"The channel between worlds. Yesod — what are you actually transmitting?",li:["What you feel inside matches what others experience from you","You're a conduit — good things flow through you to others","Your inner life is rich and you share it selectively and genuinely","People feel more themselves around you"],sh:["There's a wall between your inner world and your outer expression","You leak — unprocessed emotion spills out in ways you're not aware of","You overshare in ways that center you rather than connect you","People experience a version of you that isn't quite real"],wo:["Ask: what am I actually transmitting today?","Share something true about your inner world with one person today","Notice where you're leaking","Find the gap between how you intend to come across and how you actually land"],p:"If the people in your life described the energy you bring — what would they say? Is that what you meant to bring?"},
{e:"Connection held by structure. Gevurah of Yesod — intimacy that has healthy limits.",li:["You're genuinely open AND you know where the limit is","Your vulnerability is chosen — not compulsive, not armored","You let people in without losing yourself","Your closeness with people feels spacious, not suffocating"],sh:["Your walls are so high that closeness is impossible","You connect with everyone at the same shallow depth","You share too much too fast and then feel exposed and retreat","You confuse emotional unavailability with healthy boundaries"],wo:["Let one person a little closer today","Notice the moment you want to shut down — and try staying one beat longer","If you tend to overshare — practice holding something back","Ask: what is one real boundary I need to set — and one false one I should remove?"],p:"In your closest relationships — are you more likely to let too much in, or to keep too much out?"},
{e:"The beauty of true meeting. Tiferet of Yesod — when two people really see each other.",li:["You have a conversation today where both people leave feeling more real","You're interested in the inner life of someone close — not their performance","Your presence creates safety","You connect with the person, not the role they play in your life"],sh:["Your relationships are functional rather than soulful","You connect through doing — activities, tasks — but rarely through being","You know someone's schedule better than you know their heart","Your deepest conversations are with strangers"],wo:["Have one real conversation today — about what actually matters","Ask someone: what are you carrying right now that you haven't told anyone?","Be with someone without an agenda","Notice if you connect more easily with strangers than with people you love — and why"],p:"Who knows your inner world — really knows it? And whose inner world do you know?"},
{e:"Bonds that outlast difficulty. Netzach of Yesod — the connection that endures.",li:["You have relationships that have survived real difficulty","You reach out to people even when there's nothing to do together","Your love doesn't require people to be at their best","You invest in relationships before they need saving"],sh:["You let relationships atrophy through busyness","When things get hard in a relationship, you disappear","Your connections are maintained by proximity","You're loyal to ideas of people rather than to actual people"],wo:["Reach out today to someone you've lost touch with","Do something for a relationship before it needs anything","Sit with a hard relational moment instead of walking away","Ask: who in my life have I been taking for granted?"],p:"Which of your important relationships has been running on fumes — and what would it take to refuel it?"},
{e:"The humility of needing others. Hod of Yesod — connection expressed in the acknowledgment of dependence.",li:["You say I need you — and mean it, and let it land","You allow yourself to be held as well as to hold","You acknowledge what others give you — specifically and truthfully","Your relationships have real mutuality"],sh:["You connect but never admit dependency","You take quietly and give visibly","Your gratitude stays private and your needs stay hidden","You confuse self-sufficiency with strength — and pay for it with loneliness"],wo:["Tell someone today: I couldn't do this without you — and say specifically why","Let someone help you with something and receive it without minimizing","Ask for something you need from someone you trust","Admit a dependency that you've been hiding under independence"],p:"Who do you need — and do they know it?"},
{e:"The foundation of foundations. Yesod of Yesod — the deepest capacity for genuine connection.",li:["You are known — really known — by at least one person","You have tended your most essential bonds with care and intention","Your capacity for intimacy has grown","You are both seen and seeing — the connection is mutual and real"],sh:["You feel profoundly alone even when surrounded by people","Your most important relationships feel hollow or distant","You've been so focused on your external life that your inner world has no witness","You've forgotten how to be close — or never fully learned"],wo:["If you feel alone: don't turn away — let it point you toward what you need","Reach out to one person today with real honesty about how you're doing","If you are well-connected: invest deeply in what you have","Ask: who would I call if something broke open in me tonight?"],p:"Are you truly known by anyone? And if not — what stands between you and that?"},
{e:"Six weeks. Yesod of Malchut — connection made real in the world.",li:["A relationship is genuinely better because of this week's work","You said something true that needed to be said","Someone felt less alone because of you this week","You allowed yourself to be less alone because of someone else"],sh:["The connection stayed in your head","Another week of busyness that crowded out the people who matter","You were present everywhere except where it counted","The loneliness is still there, untouched"],wo:["Name one relationship that moved this week — even an inch","If nothing moved: make one call, send one message, say one real thing today","Write down what you most want to carry into the final week","Ask: who do I want to be closer to by Shavuot?"],p:"What is the most important relationship in your life right now — and what does it need from you?"},
{e:"Sovereignty. Presence. The avodah of Malchut is not about generating more — it is about being fully present to what is already here.",li:["You move through your day as yourself — not performing, not shrinking","You inhabit your life rather than observing it from a distance","You make decisions from your own center","You are present enough to actually experience what is happening"],sh:["You feel disconnected from your own life — going through the motions","You live in your head and call it thinking when it's really avoiding","You're always in the next moment — planning, worrying — never in this one","You feel like an outsider in your own story"],wo:["Take three breaths right now — really feel them","For five minutes today, do one thing with complete presence","Notice when you leave your body today — and come back","Ask: where am I actually living — in the present, in the past, or in the future?"],p:"When did you last feel fully present — fully yourself, fully here? What made it possible?"},
{e:"The sovereign who holds limits. Gevurah of Malchut — presence that doesn't collapse under pressure.",li:["You stay yourself in difficult situations","Your identity doesn't depend on others' approval","You can be in a room full of pressure and still know who you are","You hold your ground without aggression"],sh:["You become whoever the room needs you to be","Your self disappears in strong personalities","You confuse compliance with peace","You enforce your authority through fear rather than presence"],wo:["Notice one moment today where you're about to adjust yourself to manage someone else — and don't","Hold your position in one conversation today — calmly","Ask: in which relationships do I tend to lose myself?","Find the difference between stubbornness and genuine groundedness"],p:"Who or what has the most power to destabilize your sense of self — and what does that tell you?"},
{e:"Presence made beautiful. Tiferet of Malchut — when who you are and how you show up are the same thing.",li:["You carry yourself with dignity — not pride, but genuine self-respect","The way you show up matches what you believe about yourself","People feel something when you walk in — because you're real","Your inner life and outer life are aligned"],sh:["There's a gap between who you believe you are and who your actions reveal","You invest in image rather than integrity","You have a public self and a private self and they barely know each other","You've built a life that looks right from the outside and feels empty"],wo:["Find one place today where your inner reality and outer presentation don't match — and close the gap","Do one thing today that's true rather than impressive","Ask: what would I do differently if no one were watching?","Let something true about you be seen today"],p:"Is there a version of you that you've been keeping hidden — and what would it take to let it live?"},
{e:"The sovereign who persists. Netzach of Malchut — presence that builds over time.",li:["You show up as yourself — day after day — without needing a special occasion","Your presence in people's lives is steady, not dramatic","You've built your sovereignty through consistency","Who you are today is the result of sustained inner work — and you can feel it"],sh:["You wait for the right moment to be yourself — and it never comes","Your best self shows up only under pressure or in peak experiences","You've been waiting to become the person you want to be","Your sovereignty is intermittent"],wo:["Be the person you want to be in one ordinary moment today","Don't wait to feel ready — show up as yourself right now","Ask: in what areas of my life am I still living like I'm in rehearsal?","Notice the gap between your peak self and your daily self — and work to close it"],p:"If you lived every day as the person you are at your best — what would be different?"},
{e:"The sovereign who bows. Hod of Malchut — the royalty that knows how to receive, to thank, to be genuinely grateful.",li:["You receive your life — all of it — as a gift","You bow before something greater than yourself and it doesn't diminish you","Your gratitude is sovereign: it comes from fullness, not fear","You are genuinely, quietly thankful to be here — alive, in this life"],sh:["You've stopped marveling — life became ordinary and you stopped receiving it","Your sovereignty has become arrogance","You're grateful only when things go your way","You carry your life as a burden rather than a privilege"],wo:["Spend one minute today in genuine awe","Bow — physically or inwardly — before something greater than you","Receive today as a gift — even the hard parts","Say thank you — to God, to life, to someone — and mean it with your whole self"],p:"When did you last feel genuinely awe-struck — by your life, by existence, by something beyond you?"},
{e:"The sovereign who connects. Yesod of Malchut — leadership that empowers, presence that creates room for others.",li:["People grow in your presence — you make room for them","Your authority doesn't diminish others — it invites them into their own","You lead by being rather than by doing","The people around you feel more themselves because of you"],sh:["You take up so much space that others shrink","You use your presence to control rather than to create","You need to be the most important person in any room","Your strength is actually intimidation dressed as leadership"],wo:["Help one person step into their own authority today","Make yourself smaller in one interaction — actively create space","Ask: do people around me grow — or do they defer?","Lead today through presence and listening"],p:"Who in your life is waiting for your permission — implied or explicit — to step into their own greatness?"},
{e:"Malchut of Malchut. Day 49. The eve of Shavuot. The counting is complete. The vessel is ready.\n\nThe Torah was not given to angels. It was given to human beings who did forty-nine days of inner work and arrived at Sinai as refined vessels.\n\nYou are that vessel. Tonight stand at Sinai.",li:["You have shown up — day after day — and something in you has changed","You are more of yourself than you were 49 days ago","The Torah is given to someone who has done the work — you have done the work","You are a vessel: refined, present, ready to receive"],sh:["The gap between who you set out to become and who you are is real — and that's okay","That gap is not failure — it is next year's map","There are places the light didn't reach this Omer — they are waiting","Shavuot is not an arrival. It is a beginning"],wo:["Sit tonight with the full 49 days — what opened? What remained closed?","Name one real change in yourself — however small — and honor it","Name one place that still needs work — and write it down as a commitment","Stay up tonight, learn Torah, and stand at Sinai as the person you've become"],p:"Who were you on the first night of the Omer — and who are you now? What do you want to receive at Sinai tonight?"},
];

// ── Week teachings ───────────────────────────────────────────────────────────
const WEEK_TEACHING=[
{title:"The Inner Dimension of Chesed",core:"Chesed is the power of giving and bestowal — a giving that comes from kindness and love. When the Divine Presence illuminates a person with the light of Chesed, it rests upon him, and from that light he can feel love itself — as if the love comes from the Shechina directly into his heart.",practice:"In every encounter today, immediately enter into a feeling of love of God. Take the material moment — whatever is in front of you — extract the divine light within it, and warm your heart with love of Him in thought, speech, and action.",elevation:"When a negative thought or feeling arises — do not fight the shell. Immediately move to the other side: enter into feelings of love for the Creator through that same energy. The shell has no independent power — it is only a sign of the measure of light now available to you.",question:"Where today did you feel a pull toward something? Can you trace that pull back to its source — a divine light asking to be redirected toward its Creator?"},
{title:"The Inner Dimension of Gevurah",core:"The attribute of Gevurah is the power of restraint and contraction — not simply withholding, but the correct structuring of how divine influence is received. The service of Gevurah is fear — through which the light of God is received in an ordered and measured form.",practice:"There are two types of fear. External fear comes from consequences and is focused on the self. Inner fear — fear of exaltedness — comes from recognizing that only God is the true existence. Begin with what you have, allow it to awaken reflection, and from that reflection ascend toward inner awe.",elevation:"When fear arises in any form — recognize it as a divine quality placed within you. God wants you, and this fear is a sign that He expects your return. From this recognition, love is awakened. The order is always: external fear → love → inner fear of exaltedness.",question:"Can you feel, even faintly, the difference between fear of consequences and awe of God's greatness? What would it take to shift from one to the other today?"},
{title:"The Inner Dimension of Tiferet",core:"Tiferet is the attribute of attachment — cleaving to Hashem. It is the integration between Chesed and Gevurah, between expansion and contraction, brought into harmony. When the light of Tiferet shines upon a person, it gives him a feeling of closeness and connection.",practice:"The essence of the service of Tiferet is to overcome pride. When a thought of pride comes — do not engage it directly. Instead, immediately enter into the glory of holiness: contemplate the greatness of God and glorify Him. In this way the pride is sweetened at its root.",elevation:"Cleaving to Hashem means constantly thinking about Him and feeling connected. When a person truly nullifies himself and feels he has no independent existence, he becomes a vessel for divine light. Pride and cleaving are two opposites — they cannot coexist.",question:"In what moment today did you feel most connected, most alive? Was Hashem present in that moment? What would it mean to live that way constantly?"},
{title:"The Inner Dimension of Netzach",core:"The attribute of Netzach is strength — the ability to win, to overcome obstacles, and to connect with holy truths with a very strong will. When Hashem shines the light of Netzach upon a person, he feels a strong desire to connect and continue forward.",practice:"Even when you do not feel closeness or emotion, the power of Netzach shines and gives the power to continue. Every Jew must acquire inner strength and holy determination to ascend higher — not from ego but from connection to Hashem.",elevation:"All desires are equal in their essence — they have no independent content. But when holy desire is awakened through Netzach and redirected toward Hashem, a person transforms the fallen desire into its source. True victory is when a person overcomes not from ego, but from connection.",question:"What is the thing you keep returning to, keep fighting for — even when exhausted? Is that persistence coming from you, or from something larger moving through you?"},
{title:"The Inner Dimension of Hod",core:"The attribute of Hod is humility — the revelation of inner truth within external matter. True beauty is not external grace but the light of the Creator shining through creation. The attribute of Hod is the attribute of acknowledgment: to recognize that everything is done only by Hashem.",practice:"In everything that happens to you, immediately thank Hashem for the truth that is there, and behave according to that truth — without anger, without sadness, without separation.",elevation:"Everything that awakens in a person as a desire for falsehood is in essence a divine light belonging to Hod, sent to awaken him. The correction: feel revulsion toward falsehood, separate from it — and immediately strengthen within your heart the truth that everything is only God.",question:"What is something beautiful in your life that you have stopped seeing as a gift? Where today did you catch a glimpse of the Creator shining through the external?"},
{title:"The Inner Dimension of Yesod",core:"The attribute of Yesod is the power to connect and join everything into one. Yesod is the channel through which all the higher attributes are transferred into actual expression. The work of Yesod is to bind oneself to Hashem — not only through emotional stirrings, but as something attached to truth itself.",practice:"Distance yourself from forbidden desires, and connect yourself — even in permitted desires — to use them in holiness. Connect every matter back to its root in Hashem. The main work is to return it to your heart — that what you know intellectually descends into the heart.",elevation:"The unique point of Yesod is to connect everything in action — to cause every matter to be drawn back to its Source through thought, feeling, and deed. A person's inner drives must be elevated toward truth and used properly. This is Tzaddik Yesod Olam.",question:"What is the strongest inner drive in your life right now? Is it connected to its source — to Hashem — or does it feel like it belongs only to you?"},
{title:"The Inner Dimension of Malchut",core:"The attribute of Malchut is the power to bring things into actual expression. Malchut is also called Shechina, because through it the light of Hashem is revealed within creation. The service of Malchut is emunah — faith — and the acceptance of the yoke of Heaven.",practice:"Acceptance of the yoke means not thinking that you are controlling the outcome. Every state Hashem places you in is for a purpose. When you feel laziness or heaviness — the correction is to overcome in action first.",elevation:"Malchut is both the beginning and the ultimate purpose of everything. All Sefirot, all attributes, all work — their ultimate purpose is to reach completeness of emunah. The Shechina wants one thing: that a person be constantly connected.",question:"Are you conducting your life as if Hashem is watching — not out of fear, but out of love? What would it look like to accept the yoke of Heaven in this one specific moment?"},
];

// ── Body figure SVG ──────────────────────────────────────────────────────────
function BodyFigure({part,color}){
  const hi=color,dim="#D4CFC8";
  const isWhole=part==="whole_body";
  const c=n=>isWhole?hi:(part===n?hi:dim);
  return(
    <svg viewBox="0 0 60 120" width="52" height="104" style={{display:"block",flexShrink:0}}>
      <ellipse cx="30" cy="13" rx="9" ry="10" fill={isWhole?hi:dim}/>
      {part==="tongue"&&<ellipse cx="30" cy="19" rx="3" ry="2.5" fill={hi}/>}
      <rect x="20" y="24" width="20" height="30" rx="3" fill={c("torso")}/>
      <rect x="6"  y="24" width="12" height="32" rx="5" fill={c("left_arm")}  transform="rotate(-4,12,40)"/>
      <rect x="42" y="24" width="12" height="32" rx="5" fill={c("right_arm")} transform="rotate(4,48,40)"/>
      <rect x="20" y="55" width="10" height="36" rx="5" fill={c("left_leg")}/>
      <rect x="30" y="55" width="10" height="36" rx="5" fill={c("right_leg")}/>
      {isWhole&&<ellipse cx="30" cy="60" rx="27" ry="56" fill="none" stroke={color} strokeWidth="1" opacity="0.25"/>}
    </svg>
  );
}

// ── Shared styles ────────────────────────────────────────────────────────────
const S = {
  card: (accent) => ({
    background: "#FFFFFF",
    borderRadius: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    overflow: "hidden",
    marginBottom: 12,
    border: `1px solid rgba(0,0,0,0.06)`,
  }),
  cardAccent: (accent) => ({
    background: "#FFFFFF",
    borderRadius: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    overflow: "hidden",
    marginBottom: 12,
    border: `1px solid ${accent}30`,
    borderTop: `3px solid ${accent}`,
  }),
};

// ── Accordion section ────────────────────────────────────────────────────────
function Section({title, titleHeb, accent, defaultOpen=false, children, tag, dm=false}){
  const [open, setOpen] = useState(defaultOpen);
  const cardBg = dm ? "#1A1A28" : "#FFFFFF";
  const textMain = dm ? "#EDE8DF" : "#1A1A1A";
  const borderTop = `3px solid ${accent}`;
  return (
    <div style={{
      background: cardBg, borderRadius:20,
      boxShadow: dm ? "none" : "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
      overflow:"hidden", marginBottom:12,
      border:`1px solid ${accent}30`, borderTop,
    }}>
      <button onClick={()=>setOpen(v=>!v)} style={{
        width:"100%", background:"none", border:"none", cursor:"pointer",
        padding:"18px 20px", display:"flex", alignItems:"center", gap:12, textAlign:"left"
      }}>
        <div style={{flex:1}}>
          {tag && <div style={{
            fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase",
            color: accent, marginBottom:4, fontFamily:"'DM Sans', sans-serif"
          }}>{tag}</div>}
          <div style={{fontSize:15, fontWeight:600, color: textMain, fontFamily:"'Crimson Pro', Georgia, serif", lineHeight:1.3}}>{title}</div>
          {titleHeb && <div style={{fontSize:13, color: accent, fontFamily:"Georgia, serif", direction:"rtl", marginTop:3, textAlign:"left"}}>{titleHeb}</div>}
        </div>
        <div style={{
          width:28, height:28, borderRadius:"50%", background: open ? accent : `${accent}20`,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s"
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" style={{transform: open ? "rotate(180deg)" : "none", transition:"transform 0.2s"}}>
            <path d="M2 4l4 4 4-4" stroke={open?"#fff":accent} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
      {open && <div style={{padding:"0 20px 20px"}}>{children}</div>}
    </div>
  );
}

// ── Practice card with checkbox ──────────────────────────────────────────────
function PracticeCard({icon, label, labelHeb, accent, defaultOpen=false, children, dm=false}){
  const [open, setOpen] = useState(defaultOpen);
  const [done, setDone] = useState(false);
  const cardBg = dm ? (done ? `${accent}12` : "#14141E") : (done ? `${accent}08` : "#FAFAF9");
  const borderColor = done ? accent+"40" : (dm ? "#252535" : "#EBEBEB");
  const textColor = done ? accent : (dm ? "#EDE8DF" : "#2A2A2A");
  const bodyColor = dm ? "#B8B0A0" : "#444";
  return (
    <div style={{
      background: cardBg,
      borderRadius:14, marginBottom:8,
      border: `1px solid ${borderColor}`,
      transition:"all 0.2s", overflow:"hidden"
    }}>
      <div onClick={()=>setOpen(v=>!v)} style={{
        display:"flex", alignItems:"center", gap:12, padding:"14px 16px", cursor:"pointer"
      }}>
        <button onClick={e=>{e.stopPropagation();setDone(v=>!v);}} style={{
          width:24, height:24, borderRadius:"50%", flexShrink:0, cursor:"pointer",
          border:`2px solid ${done ? accent : (dm ? "#444" : "#CDCDC8")}`,
          background: done ? accent : "transparent",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.15s"
        }}>
          {done && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </button>
        <span style={{fontSize:18, flexShrink:0}}>{icon}</span>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:13, fontWeight:600, color: textColor, fontFamily:"'DM Sans', sans-serif", lineHeight:1.3, transition:"color 0.2s"}}>{label}</div>
          <div style={{fontSize:11, color: `${accent}AA`, fontFamily:"Georgia, serif", direction:"rtl", textAlign:"left", marginTop:2}}>{labelHeb}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" style={{flexShrink:0, transform: open?"rotate(180deg)":"none", transition:"transform 0.2s"}}>
          <path d="M3 5l4 4 4-4" stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {open && (
        <div style={{padding:"0 16px 16px 16px", fontSize:17, lineHeight:1.85, color: bodyColor, fontFamily:"'Crimson Pro', Georgia, serif"}}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Prayer section ────────────────────────────────────────────────────────────
function PrayerBlock({title, accent, children, dm=false}){
  const [open, setOpen] = useState(false);
  const cardBg = dm ? "#1A1A28" : "#FFFFFF";
  const textColor = dm ? "#EDE8DF" : "#3A3A3A";
  const chevBg = open ? (dm ? "#333" : "#3A3A3A") : (dm ? "#252535" : "#F0EFED");
  const chevStroke = open ? "#fff" : (dm ? "#888" : "#888");
  return (
    <div style={{
      background: cardBg, borderRadius:20,
      boxShadow: dm ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
      border:`1px solid ${dm ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
      overflow:"hidden", marginBottom:12,
    }}>
      <button onClick={()=>setOpen(v=>!v)} style={{
        width:"100%", background:"none", border:"none", cursor:"pointer",
        padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between"
      }}>
        <span style={{fontSize:14, fontWeight:600, color: textColor, fontFamily:"'DM Sans', sans-serif"}}>{title}</span>
        <div style={{
          width:26, height:26, borderRadius:"50%", background: chevBg,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
        }}>
          <svg width="11" height="11" viewBox="0 0 12 12" style={{transform: open?"rotate(180deg)":"none", transition:"transform 0.2s"}}>
            <path d="M2 4l4 4 4-4" stroke={chevStroke} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
      {open && <div style={{padding:"0 20px 20px"}}>{children}</div>}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App(){
  const [todayOmer, setTodayOmer] = useState(()=>getTodayOmer());
  const [day, setDay] = useState(()=>getTodayOmer()||1);
  const [showGrid, setShowGrid] = useState(false);
  const prefersDark = typeof window!=="undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [dm, setDm] = useState(prefersDark);
  const [dateStr, setDateStr] = useState(()=>new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}));

  // Keep a ref to todayOmer so the interval can read the latest value without stale closure
  const todayOmerRef = React.useRef(todayOmer);
  React.useEffect(()=>{ todayOmerRef.current = todayOmer; },[todayOmer]);

  // Recalculate every 30 seconds — updates at nightfall automatically
  React.useEffect(()=>{
    const tick=()=>{
      const t = getTodayOmer();
      const current = todayOmerRef.current;
      setTodayOmer(t);
      setDateStr(new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}));
      // Auto-advance displayed day only if user is currently viewing today
      if(t && t !== current) setDay(prev => prev===current ? t : prev);
    };
    const id = setInterval(tick, 30000);
    return ()=> clearInterval(id);
  },[]); // empty — intentionally runs once, reads fresh values via ref

  const wi = Math.floor((day-1)/7);
  const di = (day-1)%7;
  const week = SEFIROT[wi]||SEFIROT[0];
  const inner = SEFIROT[di]||SEFIROT[0];
  const accent = week.color;
  const pageBg = dm ? "#0E0E18" : week.bg;
  const p = PRACTICE[day-1]||PRACTICE[0];
  const dd = D[day-1]||D[0];
  const wt = WEEK_TEACHING[wi]||WEEK_TEACHING[0];

  // Palette
  const cardBg    = dm ? "#1A1A28" : "#FFFFFF";
  const border    = dm ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const textMain  = dm ? "#EDE8DF" : "#1A1A1A";
  const textMid   = dm ? "#9A9490" : "#5A5A5A";
  const textDim   = dm ? "#555" : "#AAA";
  const divider   = dm ? "#252535" : "#EBEBEB";
  const divCard   = dm ? "#222230" : "#F5F4F2";
  const navBg     = dm ? "rgba(14,14,24,0.95)" : "rgba(255,255,255,0.92)";
  const gridBg    = dm ? "#0A0A14" : "#FAFAF9";
  const hebColor  = dm ? "#C8C0B0" : "#4A4A4A";

  React.useEffect(()=>{
    if(!document.getElementById("omer-fonts")){
      const l=document.createElement("link");
      l.id="omer-fonts"; l.rel="stylesheet";
      l.href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@400;500;600&display=swap";
      document.head.appendChild(l);
    }
  },[]);

  return (
    <div style={{minHeight:"100vh", background:pageBg, transition:"background 0.5s", fontFamily:"'DM Sans',system-ui,sans-serif"}}>

      {/* ── Nav ── */}
      <div style={{position:"sticky",top:0,zIndex:100,background:navBg,backdropFilter:"blur(12px)",borderBottom:`1px solid ${border}`}}>
        {/* Title row */}
        <div style={{padding:"12px 20px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:accent,marginBottom:1}}>Sefirat HaOmer</div>
            <div style={{fontSize:12,color:textDim}}>{dateStr}</div>
          </div>
          <div style={{fontSize:18,color:accent,fontFamily:"Georgia,serif",direction:"rtl"}}>סְפִירַת הָעוֹמֶר</div>
        </div>

        {/* Day nav — fixed layout so center never shifts */}
        <div style={{padding:"8px 20px 12px",display:"flex",alignItems:"center",position:"relative"}}>
          {/* Today — absolute LEFT */}
          <button onClick={()=>todayOmer&&setDay(todayOmer)} disabled={!todayOmer||day===todayOmer} style={{
            padding:"6px 14px",borderRadius:20,cursor:(!todayOmer||day===todayOmer)?"default":"pointer",
            border:`1.5px solid ${(!todayOmer||day===todayOmer)?(dm?"#333":"#E0E0E0"):accent+"40"}`,
            background:"transparent",
            color:(!todayOmer||day===todayOmer)?(dm?"#444":"#CCC"):accent,
            fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
            position:"absolute",left:20
          }}>Today</button>

          {/* Prev / Day / Next — always truly centered */}
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
            <button onClick={()=>setDay(v=>Math.max(1,v-1))} disabled={day===1} style={{
              width:32,height:32,borderRadius:"50%",cursor:day===1?"default":"pointer",
              background:day===1?(dm?"#1A1A28":"#F0EFED"):`${accent}20`,
              border:"none",display:"flex",alignItems:"center",justifyContent:"center"
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2L4 7l5 5" stroke={day===1?(dm?"#444":"#CCC"):accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div style={{textAlign:"center",minWidth:64}}>
              <div style={{fontSize:22,fontWeight:600,color:accent,lineHeight:1,fontFamily:"'Crimson Pro',Georgia,serif"}}>Day {day}</div>
              <div style={{fontSize:11,color:textDim,marginTop:2}}>of 49</div>
            </div>
            <button onClick={()=>setDay(v=>Math.min(49,v+1))} disabled={day===49} style={{
              width:32,height:32,borderRadius:"50%",cursor:day===49?"default":"pointer",
              background:day===49?(dm?"#1A1A28":"#F0EFED"):`${accent}20`,
              border:"none",display:"flex",alignItems:"center",justifyContent:"center"
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M5 2l5 5-5 5" stroke={day===49?(dm?"#444":"#CCC"):accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {/* All Days — absolute RIGHT */}
          <button onClick={()=>setShowGrid(v=>!v)} style={{
            padding:"6px 14px",borderRadius:20,cursor:"pointer",
            border:`1.5px solid ${accent}40`,
            background:showGrid?accent:"transparent",
            color:showGrid?"#fff":accent,
            fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
            position:"absolute",right:20
          }}>{showGrid?"Close":"All Days"}</button>
        </div>

        {/* Grid */}
        {showGrid&&(
          <div style={{padding:"12px 16px 16px",background:gridBg,borderTop:`1px solid ${divider}`,display:"flex",flexWrap:"wrap",gap:6}}>
            {Array.from({length:49},(_,i)=>{
              const w=SEFIROT[Math.floor(i/7)]||SEFIROT[0];
              const isSel=day===i+1,isTod=todayOmer===i+1;
              return(
                <button key={i} onClick={()=>{setDay(i+1);setShowGrid(false);}} style={{
                  width:34,height:34,borderRadius:"50%",cursor:"pointer",
                  border:`2px solid ${isSel?w.color:isTod?w.color+"70":(dm?"#2A2A3A":"#E0DFDB")}`,
                  background:isSel?w.color:isTod?`${w.color}18`:"transparent",
                  color:isSel?"#fff":isTod?w.color:(dm?"#555":"#999"),
                  fontSize:11,fontWeight:isSel||isTod?"600":"400",
                  fontFamily:"'DM Sans',sans-serif",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  padding:0,lineHeight:1,transition:"all 0.15s"
                }}>{i+1}</button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Content — responsive 2-column on desktop ── */}
      <div style={{padding:"24px 16px 40px",maxWidth:1100,margin:"0 auto"}}>

        {/* Special notice — full width */}
        {p.special&&(
          <div style={{background:`${accent}15`,border:`1px solid ${accent}30`,borderRadius:14,padding:"14px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:18,flexShrink:0}}>✦</span>
            <p style={{margin:0,fontSize:13,color:accent,lineHeight:1.7,fontFamily:"'Crimson Pro',Georgia,serif",fontStyle:"italic"}}>{p.special}</p>
          </div>
        )}

        {/* Two-column grid on desktop — inner work LEFT, prayer RIGHT */}
        <style>{`
          @media (max-width:700px){
            .omer-col-inner{order:2}
            .omer-col-prayer{order:1}
          }
          @media (min-width:701px){
            .omer-col-inner{order:1}
            .omer-col-prayer{order:2}
          }
        `}</style>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:20,alignItems:"start"}}>

          {/* ── LEFT on desktop / SECOND on mobile: Today's Inner Work ── */}
          <div className="omer-col-inner">
            {/* Divider label */}
            <div style={{display:"flex",alignItems:"center",gap:12,margin:"0 0 20px",justifyContent:"center"}}>
              <div style={{flex:1,height:1,background:divider,maxWidth:60}}/>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:dm?"#444":"#BBBBBB"}}>Today's Inner Work</div>
              <div style={{flex:1,height:1,background:divider,maxWidth:60}}/>
            </div>

            {/* Essence */}
            <div style={{background:cardBg,borderRadius:20,padding:"20px 22px",marginBottom:12,boxShadow:dm?"none":"0 1px 3px rgba(0,0,0,0.05)",border:`1px solid ${accent}25`,borderLeft:`4px solid ${accent}`}}>
              <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:accent,marginBottom:8}}>Essence of the Day</div>
              <p style={{margin:0,fontSize:16,lineHeight:1.85,color:dm?"#C8C0A8":"#3A3A3A",fontFamily:"'Crimson Pro',Georgia,serif",fontStyle:"italic",whiteSpace:"pre-line"}}>{dd.e}</p>
            </div>

            {/* Daily Practice */}
            <div style={{background:cardBg,borderRadius:20,overflow:"hidden",marginBottom:12,boxShadow:dm?"none":"0 1px 3px rgba(0,0,0,0.06)",border:`1px solid ${accent}25`,borderTop:`3px solid ${accent}`}}>
              <div style={{padding:"18px 20px 14px",borderBottom:`1px solid ${divCard}`}}>
                <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:accent,marginBottom:4}}>Daily Practice</div>
                <div style={{fontSize:16,fontWeight:600,color:textMain,fontFamily:"'Crimson Pro',Georgia,serif"}}>עֲבוֹדַת הַיּוֹם</div>
              </div>
              <div style={{padding:"14px 16px 16px",background:dm?"#13131E":"#FAFAF9"}}>
                <PracticeCard icon="🔥" label="Meditation on Hashem" labelHeb="בֵּין אָדָם לַמָּקוֹם" accent={accent} dm={dm} defaultOpen={true}>{p.hashem}</PracticeCard>
                <PracticeCard icon="🤝" label="Meditation on Friends" labelHeb="בֵּין אָדָם לַחֲבֵרוֹ" accent={accent} dm={dm}>{p.friends}</PracticeCard>
                <PracticeCard icon="🫀" label="Body Part Being Rectified" labelHeb="תִּקּוּן הָאֵיבָר" accent={accent} dm={dm}>
                  <div style={{marginBottom:12}}>{p.body.text}</div>
                  <div style={{display:"flex",justifyContent:"center"}}>
                    <BodyFigure part={p.body.part} color={accent}/>
                  </div>
                </PracticeCard>
                <PracticeCard icon="🕐" label="Time" labelHeb="זְמַן" accent={accent} dm={dm}>{p.time}</PracticeCard>
                <PracticeCard icon="🙏" label="Intention — Tefillah Focus" labelHeb="כַּוָּנָה" accent={accent} dm={dm}>{p.intention}</PracticeCard>
                <PracticeCard icon="📖" label="Path into Torah" labelHeb="דֶּרֶךְ הַתּוֹרָה" accent={accent} dm={dm}>{p.torah}</PracticeCard>
              </div>
            </div>

            {/* Divine Dimension */}
            <Section title={wt.title} titleHeb="בֵּין אָדָם לַמָּקוֹם" accent={accent} tag="Divine Dimension" dm={dm}>
              <p style={{margin:"0 0 14px",fontSize:15,lineHeight:1.85,color:dm?"#C0B8A8":"#3A3A3A",fontFamily:"'Crimson Pro',Georgia,serif"}}>{wt.core}</p>
              <div style={{height:1,background:dm?"#252535":"#F0EFED",margin:"14px 0"}}/>
              <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:accent,marginBottom:8}}>The Practice Today</div>
              <p style={{margin:"0 0 14px",fontSize:15,lineHeight:1.85,color:dm?"#A0988A":"#555",fontFamily:"'Crimson Pro',Georgia,serif"}}>{wt.practice}</p>
              <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:accent,marginBottom:8}}>Elevating the Fallen Light</div>
              <p style={{margin:"0 0 16px",fontSize:15,lineHeight:1.85,color:dm?"#A0988A":"#555",fontFamily:"'Crimson Pro',Georgia,serif"}}>{wt.elevation}</p>
              <div style={{background:`${accent}10`,borderRadius:12,padding:"14px 16px",borderLeft:`3px solid ${accent}40`}}>
                <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:accent,marginBottom:6}}>Sit With This</div>
                <p style={{margin:0,fontSize:15,color:dm?"#8888AA":"#5A5A7A",lineHeight:1.85,fontFamily:"'Crimson Pro',Georgia,serif",fontStyle:"italic"}}>"{wt.question}"</p>
              </div>
            </Section>

            {/* Inner Work */}
            <Section title="The Light · The Shadow · The Work" titleHeb="הָאוֹר · הַצֵּל · הָעֲבוֹדָה" accent={accent} tag="Inner Work" dm={dm}>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#2E7A58",marginBottom:8}}>הָאוֹר — The Light</div>
                <p style={{margin:"0 0 8px",fontSize:13,color:dm?"#5A9A78":"#6CAA80",fontFamily:"'Crimson Pro',Georgia,serif",fontStyle:"italic"}}>You know this midah is working when:</p>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {dd.li.map((txt,i)=>(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:18,height:18,borderRadius:"50%",background:"#2E7A5818",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                        <svg width="8" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#2E7A58" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span style={{fontSize:14,lineHeight:1.75,color:dm?"#C0B8A8":"#3A3A3A",fontFamily:"'Crimson Pro',Georgia,serif"}}>{txt}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{height:1,background:dm?"#252535":"#F0EFED",margin:"14px 0"}}/>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#7A4E8A",marginBottom:8}}>הַצֵּל — The Shadow</div>
                <p style={{margin:"0 0 8px",fontSize:13,color:dm?"#7A5A8A":"#9A7AAA",fontFamily:"'Crimson Pro',Georgia,serif",fontStyle:"italic"}}>The klipah of this midah looks like:</p>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {dd.sh.map((txt,i)=>(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:18,height:18,borderRadius:"50%",background:"#7A4E8A18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                        <div style={{width:5,height:5,borderRadius:"50%",background:"#7A4E8A"}}/>
                      </div>
                      <span style={{fontSize:14,lineHeight:1.75,color:dm?"#C0B8A8":"#3A3A3A",fontFamily:"'Crimson Pro',Georgia,serif"}}>{txt}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{height:1,background:dm?"#252535":"#F0EFED",margin:"14px 0"}}/>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:accent,marginBottom:8}}>הָעֲבוֹדָה — The Work</div>
                <p style={{margin:"0 0 8px",fontSize:13,color:textDim,fontFamily:"'Crimson Pro',Georgia,serif",fontStyle:"italic"}}>Concrete actions for today:</p>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {dd.wo.map((txt,i)=>(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:18,height:18,borderRadius:4,background:`${accent}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,fontSize:9,fontWeight:700,color:accent}}>{i+1}</div>
                      <span style={{fontSize:14,lineHeight:1.75,color:dm?"#C0B8A8":"#3A3A3A",fontFamily:"'Crimson Pro',Georgia,serif"}}>{txt}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:`${accent}10`,borderRadius:12,padding:"14px 16px",borderLeft:`3px solid ${accent}40`}}>
                <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:accent,marginBottom:6}}>חֶשְׁבּוֹן הַנֶּפֶשׁ</div>
                <p style={{margin:0,fontSize:15,color:dm?"#8888AA":"#5A5A7A",lineHeight:1.85,fontFamily:"'Crimson Pro',Georgia,serif",fontStyle:"italic"}}>"{dd.p}"</p>
              </div>
            </Section>
          </div>

          {/* ── RIGHT on desktop / FIRST on mobile: Prayer + Count + Midah + HaRachaman + Additional Prayers ── */}
          <div className="omer-col-prayer">
            {/* 1. Preparation */}
            <PrayerBlock title="הֲכָנָה — Preparation" accent={accent} dm={dm}>
              <div style={{fontSize:16,lineHeight:2.4,color:hebColor,direction:"rtl",textAlign:"right",fontFamily:"Georgia,serif"}}>
                לְשֵׁם יִחוּד קֻדְשָׁא בְּרִיךְ הוּא וּשְׁכִינְתֵּיהּ בִּדְחִילוּ וּרְחִימוּ,<br/>
                לְיַחֵד שֵׁם י"ה בְּו"ה בְּיִחוּדָא שְׁלִים בְּשֵׁם כׇּל יִשְׂרָאֵל,<br/>
                הִנְנִי מוּכָן וּמְזֻמָּן לְקַיֵּם מִצְוַת עֲשֵׂה שֶׁל סְפִירַת הָעֹמֶר,<br/>
                כְּמו שֶׁכָּתוּב בַּתּוֹרָה:<br/>
                וּסְפַרְתֶּם לָכֶם מִמָּחֳרַת הַשַּׁבָּת, מִיוֹם הֲבִיאֲכֶם אֶת עֹמֶר הַתְּנוּפָה,<br/>
                שֶׁבַע שַׁבָּתוֹת תְּמִימוֹת תִּהְיֶינָה׃<br/>
                עַד מִמָּחֳרַת הַשַּׁבָּת הַשְּׁבִיעִית תִּסְפְּרוּ חֲמִשִּׁים יוֹם,<br/>
                וְהִקְרַבְתֶּם מִנְחָה חֲדָשָׁה לַי-הוה׃<br/>
                וִיהִי נֹעַם י-הוה אֱ-לֹהֵינוּ עָלֵינוּ,<br/>
                וּמַעֲשֵׂה יָדֵינוּ כּוֹנְנָה עָלֵינוּ, וּמַעֲשֵׂה יָדֵינוּ כּוֹנְנֵהוּ׃
              </div>
            </PrayerBlock>

            {/* 2. Bracha */}
            <PrayerBlock title="בְּרָכָה — Bracha" accent={accent} dm={dm}>
              <div style={{fontSize:20,lineHeight:2.4,color:dm?"#EDE8DF":"#2A2A2A",direction:"rtl",textAlign:"right",fontFamily:"Georgia,serif"}}>
                בָּרוּךְ אַתָּה ה׳ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם,<br/>
                אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ עַל סְפִירַת הָעֹמֶר.
              </div>
            </PrayerBlock>

            {/* 3. Count */}
            <div style={{background:cardBg,borderRadius:20,padding:"20px 24px",marginBottom:12,boxShadow:dm?"none":"0 1px 3px rgba(0,0,0,0.06)",border:`1px solid ${border}`,textAlign:"center"}}>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:textDim,marginBottom:10}}>Today's Count</div>
              <div style={{fontSize:22,direction:"rtl",color:dm?"#EDE8DF":"#2A2A2A",fontFamily:"Georgia,serif",lineHeight:1.8}}>{omerCount(day)}</div>
            </div>

            {/* 4. Midah hero — no background circle */}
            <div style={{background:cardBg,borderRadius:24,padding:"28px 24px",marginBottom:12,boxShadow:dm?"none":"0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)",border:`1px solid ${accent}25`}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:textDim,marginBottom:10}}>Today's Midah</div>
                <div style={{fontSize:38,lineHeight:1.2,direction:"rtl",color:accent,fontFamily:"Georgia,serif",marginBottom:6}}>{inner.heb} שֶׁבְּ{week.heb}</div>
                <div style={{fontSize:17,color:textMid,fontFamily:"'Crimson Pro',Georgia,serif",fontStyle:"italic",marginBottom:4}}>{inner.name} within {week.name}</div>
                <div style={{fontSize:13,color:textDim}}>{inner.quality} · {week.quality}</div>
              </div>
            </div>

            {/* HaRachaman */}
            <div style={{background:cardBg,borderRadius:16,padding:"16px 20px",marginBottom:12,boxShadow:dm?"none":"0 1px 3px rgba(0,0,0,0.05)",border:`1px solid ${border}`,textAlign:"center",direction:"rtl"}}>
              <div style={{fontSize:15,lineHeight:2.2,color:textMid,fontFamily:"Georgia,serif"}}>
                הָרַחֲמָן הוּא יַחֲזִיר לָנוּ עֲבוֹדַת בֵּית הַמִּקְדָּשׁ לִמְקוֹמָהּ,<br/>
                בִּמְהֵרָה בְיָמֵינוּ אָמֵן סֶלָה.
              </div>
            </div>

            {/* Additional Prayers */}
            <Section title="Additional Prayers" titleHeb="מִזְמוֹר שִׁיר · אָנָּא בְּכֹחַ · רִבּוֹנוֹ שֶׁל עוֹלָם" accent={accent} tag="Tefillah" dm={dm}>
              <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:accent,marginBottom:8}}>מִזְמוֹר שִׁיר — תְּהִלִּים סז</div>
              <div style={{fontSize:16,lineHeight:2.4,color:hebColor,direction:"rtl",textAlign:"right",fontFamily:"Georgia,serif",marginBottom:20}}>
                לַמְנַצֵּחַ בִּנְגִינֹת מִזְמוֹר שִׁיר׃<br/>
                אֱ-לֹהִים יְחׇנֵּנוּ וִיבָרְכֵנוּ, יָאֵר פָּנָיו אִתָּנוּ סֶלָה׃<br/>
                לָדַעַת בָּאָרֶץ דַּרְכֶּךָ, בְּכׇל-גּוֹיִם יְשׁוּעָתֶךָ׃<br/>
                יוֹדוּךָ עַמִּים אֱ-לֹהִים, יוֹדוּךָ עַמִּים כֻּלָּם׃<br/>
                יִשְׂמְחוּ וִירַנְּנוּ לְאֻמִּים כִּי-תִשְׁפֹּט עַמִּים מִישֹׁר, וּלְאֻמִּים בָּאָרֶץ תַּנְחֵם סֶלָה׃<br/>
                יוֹדוּךָ עַמִּים אֱ-לֹהִים, יוֹדוּךָ עַמִּים כֻּלָּם׃<br/>
                אֶרֶץ נָתְנָה יְבוּלָהּ, יְבָרְכֵנוּ אֱ-לֹהִים אֱ-לֹהֵינוּ׃<br/>
                יְבָרְכֵנוּ אֱ-לֹהִים, וְיִירְאוּ אוֹתוֹ כׇּל-אַפְסֵי-אָרֶץ׃
              </div>
              <div style={{height:1,background:dm?"#252535":"#F0EFED",margin:"14px 0"}}/>
              <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:accent,marginBottom:8}}>אָנָּא בְּכֹחַ</div>
              <div style={{fontSize:15,lineHeight:2.5,color:hebColor,direction:"rtl",textAlign:"right",fontFamily:"Georgia,serif",marginBottom:20}}>
                אָנָּא בְּכֹחַ גְּדֻלַּת יְמִינֶךָ תַּתִּיר צְרוּרָה:<br/>קַבֵּל רִנַּת עַמְּךָ שַׂגְּבֵנוּ טַהֲרֵנוּ נוֹרָא:<br/>נָא גִבּוֹר דּוֹרְשֵׁי יִחוּדֶךָ כְּבָבַת שָׁמְרֵם:<br/>בָּרְכֵם טַהֲרֵם רַחֲמֵי צִדְקָתְךָ תָּמִיד גָּמְלֵם:<br/>חָסִין קָדוֹשׁ בְּרֹב טוּבְךָ נַהֵל עֲדָתֶךָ:<br/>יָחִיד גֵּאֶה לְעַמְּךָ פְּנֵה זוֹכְרֵי קְדֻשָּׁתֶךָ:<br/>שַׁוְעָתֵנוּ קַבֵּל וּשְׁמַע צַעֲקָתֵנוּ יוֹדֵעַ תַּעֲלוּמוֹת:<br/><span style={{fontSize:13,color:textDim}}>בלחש:</span> בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד:
              </div>
              <div style={{height:1,background:dm?"#252535":"#F0EFED",margin:"14px 0"}}/>
              <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:accent,marginBottom:8}}>רִבּוֹנוֹ שֶׁל עוֹלָם</div>
              <div style={{fontSize:15,lineHeight:2.4,color:hebColor,direction:"rtl",textAlign:"right",fontFamily:"Georgia,serif",marginBottom:12}}>
                רִבּוֹנוֹ שֶׁל עוֹלָם, אַתָּה צִוִּיתָנוּ עַל יְדֵי מֹשֶׁה עַבְדְּךָ לִסְפֹּר סְפִירַת הָעֹמֶר כְּדֵי לְטַהֲרֵנוּ מִקְּלִפּוֹתֵינוּ וּמִטֻּמְאוֹתֵינוּ,<br/>
                כְּמוֹ שֶׁכָּתַבְתָּ בְּתוֹרָתֶךָ: וּסְפַרְתֶּם לָכֶם מִמָּחֳרַת הַשַּׁבָּת, מִיוֹם הֲבִיאֲכֶם אֶת עֹמֶר הַתְּנוּפָה,<br/>
                שֶׁבַע שַׁבָּתוֹת תְּמִימוֹת תִּהְיֶינָה׃ עַד מִמָּחֳרַת הַשַּׁבָּת הַשְּׁבִיעִית תִּסְפְּרוּ חֲמִשִּׁים יוֹם,<br/>
                כְּדֵי שֶׁיִּטָּהֲרוּ נַפְשׁוֹת עַמְּךָ יִשְׂרָאֵל מִזֻּהֲמָתָם.<br/>
                וּבְכֵן יְהִי רָצוֹן מִלְּפָנֶיךָ, י-הוה אֱ-לֹהֵינוּ וֵא-לֹהֵי אֲבוֹתֵינוּ,<br/>
                שֶׁבִּזְכוּת סְפִירַת הָעֹמֶר שֶׁסָּפַרְתִּי הַיּוֹם, יְתֻקַּן מַה שֶׁפָּגַמְתִּי בִּסְפִירָה
              </div>
              <div style={{background:`${accent}12`,borderRadius:12,padding:"14px 16px",fontSize:17,lineHeight:2,color:accent,direction:"rtl",textAlign:"right",fontFamily:"Georgia,serif",fontWeight:600}}>
                {inner.heb} שֶׁבְּ{week.heb}
              </div>
              <div style={{fontSize:15,lineHeight:2.4,color:hebColor,direction:"rtl",textAlign:"right",fontFamily:"Georgia,serif",marginTop:12}}>
                וְאֶטָּהֵר וְאֶתְקַדֵּשׁ בִּקְדֻשָּׁה שֶׁל מַעְלָה, וְעַל יְדֵי זֶה יֻשְׁפַּע שֶׁפַע רַב בְּכׇל הָעוֹלָמוֹת<br/>
                לְתַקֵּן אֶת נַפְשׁוֹתֵינוּ וְרוּחוֹתֵינוּ וְנִשְׁמוֹתֵינוּ מִכׇּל סִיג וּפְגַם,<br/>
                וּלְטַהֲרֵנוּ וּלְקַדְּשֵׁנוּ בִּקְדֻשָּׁתְךָ הָעֶלְיוֹנָה, אָמֵן סֶלָה.
              </div>
            </Section>
          </div>
        </div>{/* end 2-col grid */}

        {/* Tree of Life — full width below columns */}
        <TreeOfLife accent={accent} dm={dm}/>

        {/* ── Dark mode toggle — sliding pill ── */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:40,paddingTop:24,borderTop:`1px solid ${divider}`}}>
          <div style={{
            position:"relative", display:"flex", alignItems:"center",
            background:dm?"#1A1A28":"#EDE9E3",
            borderRadius:40, padding:4,
            border:`1px solid ${dm?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)"}`,
          }}>
            {/* Sliding indicator */}
            <div style={{
              position:"absolute",
              left: dm ? "calc(50% + 2px)" : 4,
              top:4, bottom:4,
              width:"calc(50% - 6px)",
              background: accent,
              borderRadius:32,
              transition:"left 0.25s cubic-bezier(0.4,0,0.2,1)",
              boxShadow:"0 2px 8px rgba(0,0,0,0.18)"
            }}/>
            {/* Light button */}
            <button onClick={()=>setDm(false)} style={{
              position:"relative",zIndex:1,
              display:"flex",alignItems:"center",gap:7,
              background:"none",border:"none",cursor:"pointer",
              padding:"8px 18px",borderRadius:32,
              color:!dm?"#fff":(dm?"#666":"#888"),
              fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
              transition:"color 0.2s", whiteSpace:"nowrap"
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Light
            </button>
            {/* Dark button */}
            <button onClick={()=>setDm(true)} style={{
              position:"relative",zIndex:1,
              display:"flex",alignItems:"center",gap:7,
              background:"none",border:"none",cursor:"pointer",
              padding:"8px 18px",borderRadius:32,
              color:dm?"#fff":"#888",
              fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
              transition:"color 0.2s", whiteSpace:"nowrap"
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Dark
            </button>
          </div>
        </div>

        {/* ── Credits ── */}
        <div style={{
          marginTop:20, paddingBottom:16,
          display:"flex", flexDirection:"column", alignItems:"center", gap:6
        }}>
          <div style={{fontSize:11,color:dm?"#444":"#C8C4BE",fontFamily:"'Crimson Pro',Georgia,serif",fontStyle:"italic",textAlign:"center"}}>
            Daily practice content translated by Eliyahu Pereira
          </div>
          <div style={{fontSize:11,color:dm?"#3A3A4A":"#D0CCC8",fontFamily:"'Crimson Pro',Georgia,serif",fontStyle:"italic",textAlign:"center"}}>
            Sefirah teachings adapted from <span style={{fontStyle:"normal",direction:"rtl",display:"inline-block"}}>בְּיָם דַּרְכֶּךָ</span> — B'yam Darkecha
          </div>
        </div>

      </div>
    </div>
  );
}


const TREE_NODES=[
  {id:"keter",   he:"כֶּתֶר",    en:"Keter",   tr:"Crown",          col:1,row:0,color:"#8A8AAA",
   desc:"The highest Sefirah — the divine will before thought or form. The place where the self dissolves into pure being.",
   corr:"Divine name: Ehyeh אהיה · Archangel: Metatron · Faculty: Supreme will, divine delight",
   omer:"Beyond the seven counted Sefirot — the source from which all refinement flows.",
   deep:"Keter contains two aspects: Atik (the root of delight, called Ayin) and Arich (the expansion of desire). The service of Keter is the delights a person has in God, and the desires he has to cleave to the Divine.\n\nEvery thought, feeling, and desire that comes to a person has a holy source — it is actually a holy light that comes from God. But the shells have captured it and wrapped it, and therefore it appears as something external or lowly. Our task is to remove the shell and use the light properly.\n\nWhen something appears in a negative way, it is not truly negative. Rather, holy abundance has appeared clothed in something difficult, and we must enter it in a proper way — immediately moving to the correct, true feeling, and acquiring it through the ways of acquiring virtues: through feeling, thought, prayer, and contemplation in the Names of God.\n\nThe sign of success is that suddenly a bright and good feeling spreads within, or calm and peace — a sign that the struggle is over and the matter has succeeded."},
  {id:"chochma", he:"חָכְמָה",   en:"Chochma", tr:"Wisdom",         col:2,row:1,color:"#5A7AAA",
   desc:"The first flash of divine intelligence — pure insight before it becomes thought. A single point of infinite potential.",
   corr:"Divine name: Yah יה · Archangel: Raziel · Faculty: Flash of insight, intuition",
   omer:"The source of wisdom the 49 days prepare us to receive at Sinai on Shavuot.",
   deep:"Chochma is called Koach Mah — from it we learn to see in everything only the divine force. Its action is a clear comprehension like a flash of lightning. Nullification is required to attain it.\n\nThe root of every desire and feeling is holy light. When a person awakens a desire for something, he truly has something that was sent to awaken him and guide him — the power to love God, and to receive divine light. But the shells have covered it, and instead of the light reaching the person clearly, it dresses itself in external garments.\n\nThe main way is to use the light — to bypass the covering immediately and enter into the correct feeling. Because the light is scorched by the shells, and when it is used in the right way, the covering breaks, and one understands that in truth there is nothing bad — only the light of God, and there is no other reality in the world."},
  {id:"bina",    he:"בִינָה",    en:"Binah",   tr:"Understanding",  col:0,row:1,color:"#5A7AAA",
   desc:"The divine womb — the great Mother. Binah develops the flash of Chochma into form, structure, and meaning.",
   corr:"Divine name: YHVH (Elohim vowels) · Archangel: Tzafkiel · The 50 Gates of Understanding",
   omer:"The 50th gate — the destination of the Omer. The 49 days climb toward Binah's gates, which open at Shavuot.",
   deep:"Binah expands the point of Chochma and explains it. It is the level of nullification of the yesh. Our sages instituted the Shema and blessings of creation here.\n\nBinah is the womb of understanding — it takes the single flash of Chochma and gestates it into full form over time. The 50 Gates of Binah correspond to the 49 days of Omer plus the fiftieth gate which is Shavuot itself — the moment of full disclosure.\n\nThe work of Binah is to hold the tension between what is revealed and what is still becoming. It is the faculty of teshuvah — of returning — because it has the patience and depth to receive what is broken and reform it into wholeness. When a person develops Binah, they develop the capacity to receive, to wait, and to understand — not just to know."},
  {id:"daat",    he:"דַּעַת",   en:"Da'at",   tr:"Knowledge",      col:1,row:2,color:"#5A9A88",
   desc:"The hidden Sefirah — the point of intimate union between Chochma and Binah. Direct experiential knowing through complete union.",
   corr:"Hidden Sefirah · Faculty: Direct experiential knowledge, union, consciousness",
   omer:"The destination of all 49 days — the intimate, embodied knowing of who we truly are.",
   deep:"Da'at is the Name of Hashem through which all the Sefirot are conducted. 'Adam knew his wife Eve' — this is Da'at. The same word for deepest human intimacy is the word for divine knowledge.\n\nDa'at is not intellectual knowledge but inner, embodied knowing — the kind that changes a person. It is the meeting point between Chochma and Binah, the place where insight and understanding become one lived reality. It is hidden because it cannot be pointed to from the outside — it can only be entered.\n\nThrough the 49 days of Omer, all that has been refined in the seven midot rises and converges at Da'at. The Omer is not just a counting — it is a preparation of the vessel of Da'at, so that at Shavuot the Torah can be received not as external information, but as intimate, transforming inner knowledge."},
  {id:"chesed",  he:"חֶסֶד",    en:"Chesed",  tr:"Loving-Kindness",col:2,row:3,color:"#B8924A",
   desc:"The great right arm — overflowing love, generosity, and grace with no conditions. The Sefirah of Avraham Avinu.",
   corr:"Divine name: El אל · Archangel: Michael · Avraham Avinu",
   omer:"Week 1 of the Omer. We examine the quality of our love — is it free, unconditional, directed toward genuine service?",
   deep:"Chesed is the power of giving and bestowal — a giving that comes from kindness and love, not from calculation.\n\nWhen the Divine Presence illuminates a person with the light of Chesed, it rests upon him, and from that light a person can feel love itself — as if the love comes directly from the Shechinah. At a higher level, when a person sees that he himself is being influenced with great abundance and feels drawn with love toward Hashem, he desires to be connected always.\n\nThe inner work of Chesed is to sense the light of the Divine Presence and to be filled with love toward Him. The pleasure in the soul of kindness and love are equal — kindness is giving and expansion, and love is the movement of the soul toward the thing, the drawing of the soul to include it and love it.\n\nWhen a person is involved in worldly matters, he must immediately enter into feeling love of God — because the root of every desire and feeling is holy light. He takes the material matter, extracts the light from it, and uses it properly. Therefore, in every involvement, one must warm his heart with love in thought, speech, and action.\n\nPractical note: Love and awe are two foundational pillars of inner service, and one must strengthen both. Love teaches about the connection and belonging we have to God — without love, the connection is lacking, and one does not feel closeness or longing. They must be developed together, because love without awe loses its structure, and awe without love loses its warmth."},
  {id:"gevurah", he:"גְבוּרָה",  en:"Gevurah", tr:"Strength",       col:0,row:3,color:"#7A4E8A",
   desc:"The great left arm — restraint, discipline, and holy fire. Also called Din and Pachad. The Sefirah of Yitzchak Avinu.",
   corr:"Divine name: Elohim אלהים · Archangel: Gavriel · Yitzchak Avinu",
   omer:"Week 2 of the Omer. We examine our inner strength — where is our discipline genuine, and where is it rigidity?",
   deep:"Gevurah is the power of restraint and contraction — not withholding, but the correct structuring of how influence is received. Without Gevurah, influence would overwhelm what it seeks to nourish.\n\nThe service of Gevurah is fear — but there are two kinds:\n\nExternal fear comes from outside influences and distances a person from his inner truth. It is focused on consequences, loss, or punishment. This is the entry level — it has value because it prevents sin, but it is not the goal.\n\nInner fear — fear of exaltedness — is fear rooted in recognition of God's greatness. A person recognizes that only God is the true existence, and through this he feels his own smallness and experiences awe. This is deeper.\n\nThe order of ascent: External fear → love → inner fear. When a person feels that God wants him and is not rejecting him, he becomes drawn to closeness. From love, he can ascend to inner fear, which is not a deficiency but the crown of the spiritual path.\n\nFear of exaltedness is not attained only through intellectual understanding — it comes from inner awakening, from prolonged and sincere inner work."},
  {id:"tiferet", he:"תִפְאֶרֶת", en:"Tiferet", tr:"Beauty",         col:1,row:4,color:"#2E7A58",
   desc:"The heart of the Tree — the sun of the Sefirot. Tiferet mediates between Chesed and Gevurah. Truth, beauty, compassion.",
   corr:"Divine name: YHVH יהוה · Archangel: Rafael · Yaakov Avinu",
   omer:"Week 3 of the Omer. We examine our inner truth and the depth of our attachment to Hashem.",
   deep:"Tiferet is the integration and balancing between Chesed and Gevurah. Because Chesed seeks to give without limit while Gevurah restricts and constrains, Tiferet creates proper balance — it does not give without limit, and it does not withhold completely, but gives in a way that is measured, appropriate, and aligned with the recipient.\n\nThe combination of two opposites together, such that they operate properly and harmoniously, is called Tiferet — from the expression of beauty — because beauty is formed through the combination of different elements.\n\nTiferet gives a person a sense of connection to God. This recognition — that God is the true reality and that He is the goodness of everything — brings a person to desire to cling to God and connect with Him in action.\n\nThe service of Tiferet is attachment (devekus). Attachment in Tiferet means that a person constantly thinks about Hashem — not as an intellectual exercise, but as a living reality. He attunes himself to the balance point between expansion and contraction, and in that place, he finds God.\n\nSomeone who understands Tiferet does not simply expand without structure, nor does he constrict without generosity. He walks the path of truth — the middle path that integrates all. This is the proper path: Tiferet — balance and harmony."},
  {id:"netzach", he:"נֶצַח",    en:"Netzach", tr:"Endurance",      col:2,row:5,color:"#B04A2A",
   desc:"The lower right pillar — endurance, passion, desire, and creative drive. Netzach is the fuel of the soul.",
   corr:"Divine name: YHVH Tzvaot · Archangel: Haniel",
   omer:"Week 4 of the Omer. We examine our drive — is our passion aligned with Hashem?",
   deep:"Netzach is strength — the ability to win, to overcome obstacles, and to connect with holy truths with a very strong will, beyond all prevention and disturbance.\n\nWhen Hashem shines a person with the light of Netzach, he feels a strong desire to connect and to continue forward. The light causes a person to feel true faith in his heart, and a desire to truly connect himself to Hashem. Through this, he receives great strength to overcome all that prevents him — even in situations where the love is not revealed in his heart.\n\nFor even when a person does not feel closeness and emotion, the light of Netzach still has the power to make him continue and not fall. This is especially needed in our generation — it is possible to rise through Netzach in truth.\n\nDesires are the ties to evil without knowledge. In the essence of every evil desire there is no real understanding — it is only the pull of desire, one-sided, without reason. And therefore desires cannot give a person truth. One who chases desires chases emptiness. But one who seeks truth, even if he errs, eventually comes to it.\n\nThe purification of Netzach is to overcome difficulties and conquer the low desires — to acquire holy inner strength and holy determination, and to ascend higher and higher. Every Jew must cultivate within himself this holy attribute."},
  {id:"hod",     he:"הוֹד",     en:"Hod",     tr:"Splendor",       col:0,row:5,color:"#2A6A9E",
   desc:"The lower left pillar — acknowledgment, humility, and the capacity to receive. Hod bows before what is real.",
   corr:"Divine name: Elohim Tzvaot · Archangel: Michael",
   omer:"Week 5 of the Omer. We examine our relationship with truth and receiving.",
   deep:"Hod is humility and a path of service — to reveal the inner truth within the externalities. When the inner dimension is revealed and radiates from within the external, there is a special light and elevation. True beauty is the result of an inner matter — high and elevated — that shines from within.\n\nWhen Hashem reveals Himself in the attribute of Hod, He reveals the creation in clarity and influences His light in a way that the inner truth becomes revealed in the world — drawn from actions and external matters. Through this, everyone is drawn to recognize the truth that exists in the world, and to thank Him for His deeds.\n\nFor example: a ray of light that comes from the sun — it appears physical to the eye, but its essence is spiritual. When a person reveals the inner meaning of the external, this is called Hod.\n\nThe inner work of Hod is to recognize and give thanks in truth — that everything is done only by Hashem, and not to act from oneself, but rather to nullify oneself. And furthermore: to acknowledge deeply that there is no independent existence outside of Hashem, for He is the life of all creation, and He gives life to everything.\n\nPractical work: When you see something external, learn to see within it the inner beauty — that it comes from Hashem. Even though you see the external matter, try to see within it the inner truth — that it is a result of Hashem's truth shining through externalities. This is the living practice of Hod."},
  {id:"yesod",   he:"יְסוֹד",   en:"Yesod",   tr:"Foundation",     col:1,row:6,color:"#9A7A08",
   desc:"The channel and covenant — connecting all higher energies to Malchut. Associated with Yosef HaTzaddik.",
   corr:"Divine name: Shaddai שדי · Archangel: Gavriel · Yosef HaTzaddik",
   omer:"Week 6 of the Omer. We examine our inner drives — what are we truly transmitting?",
   deep:"Yesod is the power to connect and join everything into one. It is the ability to connect matters and cause them to become one unified thing, composed properly.\n\nYesod mediates and connects between Netzach and Hod — both are active in all matters, but Yesod unifies them and brings them into proper integration. It takes the force of influence (Chesed), the force of restraint (Gevurah), the force of expansion (Tiferet), and the connection (Netzach and Hod) — and ties everything together into one unified matter, arranged in a practical structure.\n\nYesod appears as one simple thing, but in truth contains multiple parts within it — the side of kindness and expansion, and also a side of contraction and limitation. The power of Yesod is special and wondrous: it is able to connect the reality of all of them into one unified expression — not by canceling the differences, but by bringing them together so they function as one complete system.\n\nAnd therefore, Yesod is called Tzaddik Yesod Olam — the Tzaddik is the Foundation of the World. This is the concept of Yosef HaTzaddik, who held all the energy of the higher worlds and channeled it faithfully to Malchut.\n\nThe work of Yesod: to bind oneself to Hashem in all matters, even when one does not feel a strong connection or illumination. Take all your strengths, your light, and your internal structure — align them so they follow one unified path toward Hashem."},
  {id:"malchut", he:"מַלְכוּת", en:"Malchut", tr:"Kingdom",        col:1,row:7,color:"#5A5A8A",
   desc:"The final Sefirah — the Shechina. Where all higher lights become reality. Malchut has no light of its own; it receives and manifests.",
   corr:"Divine name: Adonai אדני · Archangel: Sandalphon · Dovid HaMelech",
   omer:"Week 7 of the Omer. We examine our presence — are we fully here, inhabiting our lives with Hashem?",
   deep:"Malchut is the power to bring things into actual expression — to bring them from potential into action. Through Malchut, Hashem brings creation into action. Through it He created the entire world, and He is the One who brings everything into existence and conducts all that happens in all the worlds.\n\nThe power of Malchut is to take the infinite light — which is simple, abstract, unlimited — and reveal it in a defined, structured way, forming a system through which the light is expressed in a way fitting for the grasp of created beings. Malchut is also called Shechinah, because through it the light of Hashem is revealed within creation and dwells among them.\n\nWhen Hashem shines a person with the light of Malchut, the person understands that he is here to reveal Hashem's Kingship in the world. He believes fully that everything that happens to him is from Hashem, done with wisdom and for good.\n\nThe service through Malchut is to accept upon oneself the yoke of Heaven — to conduct oneself with awareness that one stands before the King, and to act according to His will in every situation, even when it is difficult, and to go beyond one's nature. This is the foundation of all service.\n\nAs it is written: 'In all your ways know Him' — everything a person does, if it is aligned with this, becomes unified into one center — one unified structure acting for a higher purpose. For when a person understands that what he does is not coming from his own independent power, but rather that Hashem wants it this way — then even something he does not naturally want to do, he accepts upon himself to do."},
];

const TREE_PATHS=[
  ["keter","chochma"],["keter","bina"],["keter","tiferet"],
  ["chochma","bina"],["chochma","chesed"],["chochma","tiferet"],
  ["bina","gevurah"],["bina","tiferet"],
  ["chesed","gevurah"],["chesed","tiferet"],["chesed","netzach"],
  ["gevurah","tiferet"],["gevurah","hod"],
  ["tiferet","netzach"],["tiferet","hod"],["tiferet","yesod"],
  ["netzach","hod"],["netzach","yesod"],["netzach","malchut"],
  ["hod","yesod"],["hod","malchut"],
  ["yesod","malchut"],
];

function TreeOfLife({accent, dm}){
  const [sel, setSel] = useState(null);
  const [showDeep, setShowDeep] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const W=300, H=480, R=22;

  const OVERVIEW = "The Tree of Life is the central symbol of Kabbalah — a map of divine reality and human consciousness. It describes how the Infinite (Ein Sof) emanates into the finite world through ten Sefirot and twenty-two connecting paths.\n\nThree pillars:\n• Right Pillar (Chesed, Chochma, Netzach) — expansion, giving, masculine energy\n• Left Pillar (Gevurah, Binah, Hod) — contraction, receiving, feminine energy\n• Middle Pillar (Keter, Tiferet, Yesod, Malchut) — balance, synthesis, the path of return\n\nThe seven lower Sefirot correspond to the seven weeks of the Omer. The 49-day journey moves through all 7×7 combinations, leading to the 50th gate of Binah which opens at Shavuot.";

  function pos(col, row){
    const cols=[W*0.14, W*0.5, W*0.86];
    const rows=[H*0.035,H*0.155,H*0.275,H*0.405,H*0.54,H*0.675,H*0.815,H*0.955];
    return {x:cols[col], y:rows[row]};
  }

  const node = TREE_NODES.find(n=>n.id===sel);

  // Full dark mode palette for tree
  const cardBg    = dm ? "#12121E" : "#FFFFFF";
  const treeBg    = dm ? "#0A0A14" : "#FAFAF9";
  const borderCol = dm ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const divCol    = dm ? "#1E1E2E" : "#F0EFED";
  const textMain  = dm ? "#EDE8DF" : "#2A2A2A";
  const textMid   = dm ? "#888" : "#AAA";
  const nodeFill  = dm ? "#0A0A14" : "#FAFAF9";
  const nodeText  = dm ? "#C0B8A8" : "#5A5A5A";
  const nodeTextDim = dm ? "#666" : "#AAAAAA";
  const pathColor = dm ? "#3A3A5A" : "#DDDAD4";
  const pillL     = dm ? "#7A4E8A12" : "#7A4E8A08";
  const pillM     = dm ? "#2E7A5812" : "#2E7A5808";
  const pillR     = dm ? "#B8924A12" : "#B8924A08";
  const detailBg  = dm ? "#16162A" : "#F8F7F5";
  const detailText= dm ? "#888" : "#BBBBBB";
  const detailBody= dm ? "#B0A898" : "#666";
  const innerBg   = dm ? "#0A0A14" : "#F5F4F2";
  const closeBg   = dm ? "#1E1E2E" : "#F5F4F2";
  const closeStroke = dm ? "#666" : "#888";
  const overviewBg = dm ? "#0A0A14" : "#FAFAF9";
  const overviewText = dm ? "#C0B8A8" : "#555";

  return (
    <div style={{marginTop:4}}>
      {/* Section divider */}
      <div style={{display:"flex",alignItems:"center",gap:12,margin:"24px 0 16px"}}>
        <div style={{flex:1,height:1,background:dm?"#2A2A3A":"#EBEBEB"}}/>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:dm?"#444":"#BBBBBB"}}>Tree of Life</div>
        <div style={{flex:1,height:1,background:dm?"#2A2A3A":"#EBEBEB"}}/>
      </div>

      <div style={{background:cardBg,borderRadius:24,boxShadow:dm?"none":"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",border:`1px solid ${borderCol}`,overflow:"hidden"}}>

        {/* Header — just Hebrew title + tap hint, no duplicate label */}
        <div style={{padding:"20px 20px 12px",borderBottom:`1px solid ${divCol}`,textAlign:"center"}}>
          <div style={{fontSize:28,color:textMain,fontFamily:"'Crimson Pro',Georgia,serif",direction:"rtl",marginBottom:4}}>עֵץ הַחַיִּים</div>
          <div style={{fontSize:12,color:textMid,fontFamily:"'DM Sans',sans-serif"}}>Tap any Sefirah to explore</div>
        </div>

        {/* SVG tree */}
        <div style={{padding:"8px 16px 4px",background:treeBg}}>
          <div style={{display:"flex",justifyContent:"center"}}>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible",maxWidth:W}}>
              <rect x={W*0.06} y={H*0.02} width={W*0.19} height={H*0.96} rx="10" fill={pillL}/>
              <rect x={W*0.36} y={H*0.02} width={W*0.28} height={H*0.96} rx="10" fill={pillM}/>
              <rect x={W*0.75} y={H*0.02} width={W*0.19} height={H*0.96} rx="10" fill={pillR}/>

              {TREE_PATHS.map((pair,i)=>{
                const a=TREE_NODES.find(n=>n.id===pair[0]);
                const b=TREE_NODES.find(n=>n.id===pair[1]);
                if(!a||!b) return null;
                const p1=pos(a.col,a.row),p2=pos(b.col,b.row);
                const hi=sel&&(pair[0]===sel||pair[1]===sel);
                return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={hi?(node?.color||accent):pathColor}
                  strokeWidth={hi?1.5:0.8} strokeOpacity={hi?0.9:1}/>;
              })}

              {TREE_NODES.filter(n=>n.id!=="daat").map(n=>{
                const p=pos(n.col,n.row);
                const isSel=sel===n.id;
                return (
                  <g key={n.id} onClick={()=>{setSel(isSel?null:n.id);setShowDeep(false);}} style={{cursor:"pointer"}}>
                    {isSel&&<circle cx={p.x} cy={p.y} r={R+7} fill={n.color} opacity={dm?"0.2":"0.12"}/>}
                    <circle cx={p.x} cy={p.y} r={R+1} fill="none" stroke={isSel?n.color:n.color+"50"} strokeWidth={isSel?1.5:0.8}/>
                    <circle cx={p.x} cy={p.y} r={R} fill={isSel?`${n.color}${dm?"30":"18"}`:nodeFill} stroke={n.color} strokeWidth={isSel?1.5:1}/>
                    <text x={p.x} y={p.y-4} textAnchor="middle" fill={isSel?n.color:nodeText} fontSize={n.he.length>5?"8.5":"10"} fontFamily="Georgia,serif" fontWeight={isSel?"bold":"normal"}>{n.he}</text>
                    <text x={p.x} y={p.y+9} textAnchor="middle" fill={isSel?n.color:nodeTextDim} fontSize="7.5" fontFamily="'DM Sans',sans-serif">{n.en}</text>
                  </g>
                );
              })}

              {(()=>{
                const daat=TREE_NODES.find(n=>n.id==="daat");
                const p=pos(daat.col,daat.row);
                const isSel=sel==="daat";
                return (
                  <g key="daat" onClick={()=>{setSel(isSel?null:"daat");setShowDeep(false);}} style={{cursor:"pointer"}}>
                    {isSel&&<circle cx={p.x} cy={p.y} r={R+7} fill={daat.color} opacity={dm?"0.2":"0.12"}/>}
                    <circle cx={p.x} cy={p.y} r={R} fill={isSel?`${daat.color}${dm?"30":"18"}`:nodeFill} stroke={daat.color} strokeWidth={1} strokeDasharray="3 2"/>
                    <text x={p.x} y={p.y-4} textAnchor="middle" fill={isSel?daat.color:nodeText} fontSize="10" fontFamily="Georgia,serif">{daat.he}</text>
                    <text x={p.x} y={p.y+9} textAnchor="middle" fill={isSel?daat.color:nodeTextDim} fontSize="7.5" fontFamily="'DM Sans',sans-serif">{daat.en}</text>
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Selected node detail */}
        {node && (
          <div style={{borderTop:`1px solid ${divCol}`,padding:"20px",animation:"fadeIn 0.2s ease"}}>
            <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
              <div>
                <div style={{fontSize:26,color:node.color,fontFamily:"Georgia,serif",lineHeight:1.2,marginBottom:2}}>{node.he}</div>
                <div style={{fontSize:16,color:textMain,fontFamily:"'Crimson Pro',Georgia,serif"}}>{node.en} — {node.tr}</div>
              </div>
              <button onClick={()=>{setSel(null);setShowDeep(false);}} style={{width:28,height:28,borderRadius:"50%",cursor:"pointer",background:closeBg,border:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 1l8 8M9 1L1 9" stroke={closeStroke} strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <p style={{margin:"0 0 14px",fontSize:15,lineHeight:1.85,color:dm?"#C0B8A8":"#3A3A3A",fontFamily:"'Crimson Pro',Georgia,serif"}}>{node.desc}</p>
            <div style={{background:detailBg,borderRadius:10,padding:"12px 14px",marginBottom:10}}>
              <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:detailText,marginBottom:5}}>Correspondences</div>
              <div style={{fontSize:13,color:detailBody,lineHeight:1.7,fontFamily:"'DM Sans',sans-serif"}}>{node.corr}</div>
            </div>
            <div style={{background:`${node.color}${dm?"18":"0C"}`,borderRadius:10,padding:"12px 14px",marginBottom:10,border:`1px solid ${node.color}25`}}>
              <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:node.color,marginBottom:5}}>Omer Connection</div>
              <div style={{fontSize:13,color:dm?"#B0A898":"#555",lineHeight:1.7,fontFamily:"'Crimson Pro',Georgia,serif"}}>{node.omer}</div>
            </div>
            {node.deep&&(
              <>
                <button onClick={()=>setShowDeep(v=>!v)} style={{width:"100%",background:"none",border:`1px solid ${node.color}30`,borderRadius:10,padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,fontWeight:600,color:node.color,fontFamily:"'DM Sans',sans-serif"}}>{showDeep?"Hide Inner Teaching":"Inner Teaching"}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" style={{transform:showDeep?"rotate(180deg)":"none",transition:"transform 0.2s"}}>
                    <path d="M3 5l4 4 4-4" stroke={node.color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showDeep&&(
                  <div style={{background:`${node.color}${dm?"10":"06"}`,borderRadius:"0 0 10px 10px",padding:"16px",border:`1px solid ${node.color}20`,borderTop:"none"}}>
                    {node.deep.split("\n\n").map((para,i)=>(
                      <p key={i} style={{margin:i===0?"0 0 12px":"12px 0",fontSize:15,lineHeight:1.9,color:dm?"#C0B8A8":"#3A3A3A",fontFamily:"'Crimson Pro',Georgia,serif"}}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Overview — after Malchut, at bottom */}
        <div style={{padding:"16px 20px 20px",borderTop:`1px solid ${divCol}`}}>
          <button onClick={()=>setShowOverview(v=>!v)} style={{
            width:"100%",background:"none",border:`1px solid ${accent}30`,borderRadius:12,
            padding:"10px 16px",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"space-between"
          }}>
            <span style={{fontSize:13,fontWeight:600,color:accent,fontFamily:"'DM Sans',sans-serif"}}>
              {showOverview?"Hide overview":"What is the Tree of Life?"}
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" style={{transform:showOverview?"rotate(180deg)":"none",transition:"transform 0.2s"}}>
              <path d="M3 5l4 4 4-4" stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {showOverview&&(
            <div style={{background:overviewBg,borderRadius:"0 0 12px 12px",padding:"14px 16px",border:`1px solid ${accent}20`,borderTop:"none",marginTop:0}}>
              <p style={{margin:0,fontSize:13,lineHeight:1.85,color:overviewText,fontFamily:"'Crimson Pro',Georgia,serif",whiteSpace:"pre-line"}}>{OVERVIEW}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
