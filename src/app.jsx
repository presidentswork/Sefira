import { useState } from "react";

const SEFIROT = [
  { name:"Chesed",  heb:"חֶסֶד",     color:"#C8A96E", quality:"Loving-Kindness" },
  { name:"Gevurah", heb:"גְבוּרָה",  color:"#9B6B9B", quality:"Discipline" },
  { name:"Tiferet", heb:"תִפְאֶרֶת", color:"#4A8C6F", quality:"Beauty & Truth" },
  { name:"Netzach", heb:"נֶצַח",      color:"#C05A3A", quality:"Endurance" },
  { name:"Hod",     heb:"הוֹד",       color:"#3A7AB5", quality:"Gratitude" },
  { name:"Yesod",   heb:"יְסוֹד",     color:"#B8960C", quality:"Connection" },
  { name:"Malchut", heb:"מַלְכוּת",   color:"#7A7AAA", quality:"Presence" },
];

const WEEK_TEACHING = [
  // Week 1 — Chesed
  {
    title: "The Inner Dimension of Chesed",
    core: "The attribute of Chesed is the power of giving and bestowal — a giving that comes from kindness and love. When the Divine Presence illuminates a person with the light of Chesed, it rests upon him, and from that light he can feel love itself — as if the love comes from the Shechina directly into his heart.",
    practice: "In every encounter and involvement today, immediately enter into a feeling of love of God. Take the material moment — whatever is in front of you — extract the divine light within it, and warm your heart with love of Him in thought, speech, and action. The root of every desire and feeling is holy light. What appears as attraction to something external is in truth the power to love God, clothed in matter.",
    elevation: "When a negative thought or feeling arises — do not fight the shell. Immediately move to the other side: enter into feelings of love for the Creator through that same energy. The shell has no independent power. It is only a sign — an indication of the measure of light now available to you for divine service.",
    question: "Where today did you feel a pull toward something? Can you trace that pull back to its source — a divine light asking to be redirected toward its Creator?"
  },
  // Week 2 — Gevurah
  {
    title: "The Inner Dimension of Gevurah",
    core: "The attribute of Gevurah is the power of restraint and contraction — not simply withholding, but the correct structuring of how divine influence is received. Gevurah measures the flow according to the capacity of the receiver. The service of Gevurah is fear — through which the light of God is received in an ordered and measured form.",
    practice: "There are two types of fear. External fear comes from consequences and is focused on the self. Inner fear — fear of exaltedness — comes from recognizing that only God is the true existence. Through this, a person feels his own smallness and experiences awe. The path: begin with what you have (even external fear), allow it to awaken reflection, and from that reflection ascend toward inner awe.",
    elevation: "When fear arises in any form — recognize it as a divine quality placed within you. God wants you, and this fear is a sign that He expects your return. From this recognition, love is awakened. From love, you can ascend to inner fear. The order is always: external fear → love → inner fear of exaltedness.",
    question: "Can you feel, even faintly, the difference between fear of consequences and awe of God's greatness? What would it take to shift from one to the other today?"
  },
  // Week 3 — Tiferet
  {
    title: "The Inner Dimension of Tiferet",
    core: "Tiferet is the attribute of attachment — cleaving to Hashem. It is the integration between Chesed and Gevurah, between expansion and contraction, brought into harmony. When the light of Tiferet shines upon a person, it gives him a feeling of closeness and connection — a sense that he is bound to something higher and does not want to separate from it.",
    practice: "The essence of the service of Tiferet is to overcome pride. Pride is self-centeredness, and the divine light belongs to Tiferet. When a thought of pride comes — do not engage it and try to elevate it directly, for that is dangerous. Instead, immediately enter into the glory of holiness: contemplate the greatness of God and glorify Him. In this way the pride is sweetened at its root.",
    elevation: "Cleaving to Hashem means constantly thinking about Him and feeling connected. A Jew is not an independent being — everything he expresses is only an expression of Hashem in this world. When a person truly nullifies himself and feels he has no independent existence, he becomes equal before everyone and a vessel for divine light. Pride and cleaving are two opposites. They cannot coexist.",
    question: "In what moment today did you feel most like yourself — most connected, most alive? Was Hashem present in that moment? What would it mean to live that way constantly?"
  },
  // Week 4 — Netzach
  {
    title: "The Inner Dimension of Netzach",
    core: "The attribute of Netzach is strength — the ability to win, to overcome obstacles, and to connect with holy truths with a very strong will, beyond all prevention and disturbance. When Hashem shines the light of Netzach upon a person, he feels a strong desire to connect and continue forward — a true faith in his heart and a desire to be genuinely bound to Hashem.",
    practice: "The light of Netzach gives a person strength to overcome even in situations where love is not felt in the heart. Even when you do not feel closeness or emotion, the power of Netzach shines and you have the power to continue and not fall. Every Jew must acquire this holy attribute — inner strength and holy determination to ascend higher and higher, not from ego but from connection to Hashem.",
    elevation: "All desires are equal in their essence — they have no independent content. They are only a pull without knowledge, without direction. But when a person realizes that every holy desire comes from Hashem — and redirects that energy toward Him — he transforms the fallen desire into its source. True victory is when a person overcomes not from ego, but from connection.",
    question: "What is the thing you keep returning to, keep fighting for, keep going back to — even when exhausted? Is that persistence coming from you, or from something larger moving through you?"
  },
  // Week 5 — Hod
  {
    title: "The Inner Dimension of Hod",
    core: "The attribute of Hod is humility — the revelation of inner truth within external matter. When the inner dimension is revealed and radiates from within the external, there is a special light and elevation. This is called true beauty — not external grace but the light of the Creator shining through creation. The attribute of Hod is the attribute of acknowledgment: to recognize that everything is done only by Hashem, and not to act from oneself — but to nullify oneself completely.",
    practice: "The practical work of Hod: in everything that happens to you, immediately thank Hashem for the truth that is there, and behave according to that truth — without anger, without sadness, without separation. In everything good that happens — immediately give thanks to Hashem, that He is the source of the good, and do not attribute it to anything else. The flaw of the Greeks was giving worth and importance to external grace and beauty for its own sake. Do not relate to any matter as an end in itself.",
    elevation: "When a person reveals the inner meaning of the external — this is Hod. Everything that awakens in a person as a desire for falsehood or attraction to something untrue — this is in essence a divine light belonging to Hod, sent to awaken him. The way to correct it: feel revulsion toward falsehood, separate from it — and immediately enter into strengthening within your heart the truth that everything is only God.",
    question: "What is something beautiful in your life that you have stopped seeing as a gift? What is one moment today where you caught a glimpse of the Creator shining through the external?"
  },
  // Week 6 — Yesod
  {
    title: "The Inner Dimension of Yesod",
    core: "The attribute of Yesod is the power to connect and to join everything into one. Yesod is the channel through which all the higher attributes are transferred into actual expression. The work of Yesod is to bind oneself to Hashem — not only through emotional stirrings, but from within, as something attached to truth itself. Even when a person does not feel a revealed cleaving to Hashem, he is still connected to Him from every place within.",
    practice: "In practical matters, the work of Yesod is: distance yourself from forbidden desires, and connect yourself — even in permitted desires — to use them in holiness. Connect every matter back to its root in Hashem. Not to think that created beings are doing anything on their own, but to live with the awareness that everything is only what Hashem does. The main work is 'to return it to your heart' — that what you know intellectually descends into the heart and becomes a living inner feeling.",
    elevation: "The unique point of Yesod is to connect everything in action — to cause every matter to be drawn back to its Source. This is done through thought, feeling, and action. A person's inner drives and urges must be elevated toward truth and used properly. When these drives are connected to Hashem, they become the very channel through which divine light flows into the world. This is called Tzaddik Yesod Olam — the righteous uphold the world because they connect everything.",
    question: "What is the strongest inner drive in your life right now? Is it connected to its source — to Hashem — or does it feel like it belongs only to you?"
  },
  // Week 7 — Malchut
  {
    title: "The Inner Dimension of Malchut",
    core: "The attribute of Malchut is the power to bring things into actual expression — to bring them from potential into action. Through Malchut, Hashem brings creation into being and conducts all that happens in all the worlds. Malchut is also called Shechina, because through it the light of Hashem is revealed within creation and dwells among them. The service of Malchut is emunah — faith — and the acceptance of the yoke of Heaven.",
    practice: "Acceptance of the yoke is to guard in every action that Hashem gives you, and not to think that you are controlling the outcome. Every state Hashem places you in is for a purpose, and you must act in that situation according to His will. When you feel laziness or heaviness — recognize this as the opposite of emunah. The correction: overcome in action first. Even if you do not yet feel it internally, perform actions of guarding and effort. Through external movement, it begins to enter your will.",
    elevation: "Malchut is both the beginning and the ultimate purpose of everything. When a person stands with true emunah in the existence of Hashem and conducts himself in the world with this emunah — he opens the gateway of all service. All the Sefirot, all the attributes, all the work — their ultimate purpose is to reach completeness of emunah in a greater and greater measure. The Shechina wants one thing: that a person be constantly connected. Seek this. Make this the goal of everything.",
    question: "Are you conducting your life as if Hashem is watching — not out of fear, but out of love? What would it look like to accept the yoke of Heaven in this one specific moment you are in right now?"
  },
];

const TREE = [
  { id:"keter",   he:"כֶּתֶר",     en:"Keter",   tr:"Crown",   col:1,row:0, color:"#E8E8F8",
    desc:"The highest Sefirah, closest to Ein Sof. Keter represents the divine will — the first stirring of existence before thought or form. Sometimes called Ayin (nothingness). The place where the self dissolves into pure being.",
    corr:"Divine name: Ehyeh אהיה · Archangel: Metatron · Faculty: Supreme will, divine delight (Ta'anug), the root of all",
    omer:"Not counted in the Omer — Keter is beyond the seven lower Sefirot we refine during the 49 days. It is the source from which all refinement flows.",
    deep:"Keter is the revelation of the will of Hashem to create the world — the aspect of will that is above all the names. Within Keter are two aspects: Atik (the root of delight, the inner aspect, called Ayin) and Arich (the expansion of desire that descends, the nullification of self). Keter in general is from Ayin and not from Yesh — for the delight in the pleasure produces the will, and both together are the root of everything. The service of Keter is the delights a person has in God, and the desires he has to include himself and cleave to the Divine — even to the point of self-sacrifice." },
  { id:"chochma", he:"חָכְמָה",    en:"Chochma", tr:"Wisdom",  col:2,row:1, color:"#C8D8F0",
    desc:"The first flash of divine intelligence — pure insight before it becomes thought. Chochma is the point: undifferentiated, seminal. A single point containing infinite potential.",
    corr:"Divine name: Yah יה · Archangel: Raziel · Faculty: Flash of insight, intuition, the moment before words",
    omer:"Not in the Omer cycle. Chochma is the source of wisdom that the 49 days of inner work prepares us to receive at Sinai on Shavuot.",
    deep:"Chochma is the beginning of the revelation of the matter — the point from which the idea begins to expand. It is called Koach Mah (the power of 'what'), for from Chochma we learn to see in everything only the point of the root, the divine revelation that exists in every matter. The action of Chochma in a person is the matter of seeing — a clear comprehension in the soul like a flash of lightning. The service of Hashem in Chochma is divine seeing: in everything in the world, a person sees only the divine force that is in it. This requires nullification — and not only in grasping divine recognition, but to attain any aspect of Chochma, nullification is required." },
  { id:"bina",    he:"בִינָה",     en:"Binah",   tr:"Understanding", col:0,row:1, color:"#C8D8F0",
    desc:"The divine womb — the great Mother. Binah takes the flash of Chochma and develops it into form, structure, and meaning. She is the palace, the sea, the 50 Gates of Understanding.",
    corr:"Divine name: YHVH (in Elohim vowels) · Archangel: Tzafkiel · Faculty: Deep understanding, processing, expansion",
    omer:"Binah is the 50th gate — the destination of the Omer. The 49 days climb toward Binah's 50 gates of understanding, which open at Shavuot.",
    deep:"Binah expands the point of Chochma and explains it and gives it understanding. It is the unfolding of the divine light that began in Chochma, now in a detailed and explained way. Binah is the level of 'nullification of the yesh (something)' — and opposite this, our sages instituted the blessings of creation and the Shema, where the divine contemplation of the heavenly hosts is explained. Binah is hinted in the first Heh of the Name Havayah — for just as Heh expands the point of Yud, so Binah expands Chochma to all sides. From Binah begins the full expansion of the structure of the Sefirot." },
  { id:"daat",    he:"דַּעַת",     en:"Da'at",   tr:"Knowledge", col:1,row:2, color:"#A0C0C0",
    desc:"The hidden Sefirah — the point of intimate union between Chochma and Binah. Da'at is direct experiential knowledge — not knowledge about something, but knowledge through complete union with it.",
    corr:"Hidden Sefirah · Connects Chochma and Binah · Faculty: Direct experiential knowledge, union, consciousness",
    omer:"Da'at is the destination of all 49 days. Each day of refinement builds toward Da'at — the intimate, embodied knowing of who we truly are. You cannot think your way to Da'at. You must live your way there.",
    deep:"Da'at is the name of Hashem through which all the Sefirot are conducted — it connects the Middot and activates the seven lower Sefirot. It is the aspect of knowledge that is not merely intellectual but experiential — the collapse of subject and object into one. The Zohar teaches: Adam knew his wife Eve — this is Da'at. The same word for deepest human intimacy is the word for divine knowledge. Da'at is hidden because it is the place where the self has truly dissolved into union with the Source — and such a state cannot be displayed or pointed to. It can only be lived." },
  { id:"chesed",  he:"חֶסֶד",     en:"Chesed",  tr:"Loving-Kindness", col:2,row:3, color:"#C8A96E",
    desc:"The great right arm — overflowing love, generosity, and grace with no conditions. Chesed is the Sefirah of Avraham Avinu. The right pillar: expansion, giving, warmth.",
    corr:"Divine name: El אל · Archangel: Michael · Faculty: Love, generosity, grace · Avraham Avinu · Name of Havayah with segol",
    omer:"Week 1 of the Omer. We examine the quality of our love — is it free, unconditional, directed toward genuine service of Hashem and others?",
    deep:"Chesed is the power of giving without measure and limit — it has the aspect of expansion. In the service of God, Chesed is the aspect of love: to love Hashem, and through this attribute a person causes kindness to flow through him. When the Shechina illuminates a person with the light of Chesed, it rests upon him, and from that light he can feel love itself — as if the love comes from the Shechina directly. At a higher level, when a person sees that he is being drawn with love and closeness toward Hashem, he desires to be connected to Him always. The Divine Name connected to Chesed is the Name Havayah in the vocalization of segol." },
  { id:"gevurah", he:"גְבוּרָה",  en:"Gevurah", tr:"Strength / Judgment", col:0,row:3, color:"#9B6B9B",
    desc:"The great left arm — the power of restraint, discipline, and holy fire. Also called Din and Pachad. The Sefirah of Yitzchak Avinu.",
    corr:"Divine name: Elohim אלהים · Archangel: Gavriel · Faculty: Discipline, boundaries, judgment, awe · Yitzchak Avinu",
    omer:"Week 2 of the Omer. We examine our inner strength — where is our discipline genuine, and where is it the rigidity of the ego?",
    deep:"Gevurah is contraction and restraint — the root of judgment, which does not allow influence to expand beyond its boundary. Through it a person is able to receive divine light properly, because if influence came without limit, the receiver could not contain it. The service of Gevurah is fear — through which the light of God is received in an ordered and measured form. There are two types of fear: external fear (fear of consequences, focused on the self) and inner fear — fear of exaltedness — which comes from recognizing that only God is the true existence. The path moves: external fear → love → inner fear. Fear is called 'small' — Moshe said 'What does God ask of you? Only to fear Him.' It appears difficult, but once a person enters this gate, he sees that it is not distant." },
  { id:"tiferet", he:"תִפְאֶרֶת", en:"Tiferet", tr:"Beauty / Harmony", col:1,row:4, color:"#4A8C6F",
    desc:"The heart of the Tree — the sun of the Sefirot. Tiferet mediates between Chesed and Gevurah, bringing them into harmony. Truth, beauty, compassion. The Sefirah of Yaakov Avinu.",
    corr:"Divine name: YHVH יהוה · Archangel: Rafael · Faculty: Compassion, truth, harmony, cleaving · Yaakov Avinu · Name of Havayah with cholam",
    omer:"Week 3 of the Omer. We examine our inner truth — the harmony between what we feel and what we express, and the depth of our attachment to Hashem.",
    deep:"Tiferet is built from the feeling of attachment (devekus) — a connection with taste, a connection with enjoyment. Tiferet unifies all the attributes that conduct the world — it is the attribute through which God acts in all influence. The essence of the service of Tiferet is to overcome pride. Pride is self-centeredness; the divine light belongs to Tiferet. When pride arises, do not engage it — immediately enter into the glory of holiness and contemplate the greatness of God. Pride and cleaving are two opposites. True connection with Hashem is only when a person feels smallness and humility. Only when he understands that without the light of Hashem he has nothing of his own — then he becomes nullified to Hashem and cleaves to Him in truth. The Divine Name connected to Tiferet is Havayah with the vocalization of cholam." },
  { id:"netzach", he:"נֶצַח",     en:"Netzach", tr:"Eternity / Victory", col:2,row:5, color:"#C05A3A",
    desc:"The lower right pillar — the force of endurance, passion, desire, and creative drive. Netzach is the fuel of the soul, the part that keeps going.",
    corr:"Divine name: YHVH Tzvaot · Archangel: Haniel · Faculty: Passion, endurance, holy desire · Name of Havayah with chirik",
    omer:"Week 4 of the Omer. We examine our drive — is our passion aligned with our values and with Hashem?",
    deep:"Netzach is the power of victory — to overcome obstacles and connect with holy truths with a very strong will. In Netzach, Hashem helps a person move past everything that prevents him from influencing and growing. The attribute of Netzach strengthens a person, brings out his will, reveals his abilities, and nothing can stand against him. Even when a person does not feel closeness or emotion, the light of Netzach shines and gives the power to continue. Desires have no true understanding — they have no inner content and cannot give a person truth. But when holy desire is awakened through Netzach, it gives a person faithfulness to Hashem and the ability to defeat the evil inclination. True victory is when a person overcomes not from ego, but from connection to Hashem. The Name connected to Netzach is Havayah with the vocalization of chirik." },
  { id:"hod",     he:"הוֹד",      en:"Hod",     tr:"Splendor / Gratitude", col:0,row:5, color:"#3A7AB5",
    desc:"The lower left pillar — the force of acknowledgment, humility, and the capacity to receive. Hod bows before what is real.",
    corr:"Divine name: Elohim Tzvaot · Archangel: Michael · Faculty: Humility, gratitude, acknowledgment · Name of Havayah with kubbutz",
    omer:"Week 5 of the Omer. We examine our relationship with truth and receiving — can we accept what is real without deflecting?",
    deep:"Hod is humility and a path of service — the revelation of inner truth within the externalities. When the inner dimension is revealed and radiates from within the external, there is a special light and elevation. Hod is the attribute of acknowledgment: to recognize that everything is done only by Hashem, and to nullify oneself before this truth. The flaw of the Greeks was giving worth and importance to external grace and beauty — this is called 'the beauty of Yefet.' True beauty is only when the external points to and reveals an inner quality. When something external no longer points to anything and becomes a goal in itself — that is falsehood. Hod supervises a person's actions, that they should be aligned with truth and not conducted from oneself. The Divine Name connected to Hod is Havayah with the vocalization of kubbutz." },
  { id:"yesod",   he:"יְסוֹד",    en:"Yesod",   tr:"Foundation", col:1,row:6, color:"#B8960C",
    desc:"The channel and covenant — connecting all higher energies to Malchut. Yesod is the brit (covenant), associated with Yosef HaTzaddik.",
    corr:"Divine name: Shaddai שדי · Archangel: Gavriel · Faculty: Connection, intimacy, channeling · Yosef HaTzaddik · Name of Havayah with shuruk",
    omer:"Week 6 of the Omer. We examine our relationships and our inner drives — what are we truly transmitting to those around us?",
    deep:"Yesod is the power to connect and join everything into one. It mediates between Netzach and Hod, unifying them, and serves as the bridge between the inner structure and its expression in Malchut. Yesod takes the force of influence (Chesed), restraint (Gevurah), expansion (Tiferet), and connection (Netzach and Hod) — and ties everything together into one unified matter. This is why it is called Tzaddik Yesod Olam — the righteous uphold the world because they connect everything. The connection of Yesod is not superficial — it is a real inner feeling: 'I am connected to Him.' The main practical work: distance from forbidden desires, and connect every permitted matter to Hashem. The Name connected to Yesod is Havayah with the vocalization of shuruk." },
  { id:"malchut", he:"מַלְכוּת",  en:"Malchut", tr:"Kingdom / Presence", col:1,row:7, color:"#7A7AAA",
    desc:"The final Sefirah — the divine feminine, the Shechina. The place where all higher lights become reality. Malchut has no light of its own; it receives and manifests.",
    corr:"Divine name: Adonai אדני · Archangel: Sandalphon · Faculty: Presence, manifestation, emunah, acceptance of the yoke · Dovid HaMelech",
    omer:"Week 7 of the Omer. We examine our presence — are we fully here, inhabiting our lives as they actually are, with Hashem?",
    deep:"Malchut is the power to bring things into actual expression — from potential into action. Through Malchut, Hashem brings creation into being. Malchut is also called Shechina, because through it the light of Hashem is revealed within creation. The service of Malchut is emunah (faith) and acceptance of the yoke of Heaven. Malchut is both the beginning and the ultimate purpose of everything — all levels, services, and attributes have as their purpose to reach completeness of emunah in a greater measure. The Shechina wants one thing: that a person be constantly connected. To connect to the Shechina is the essential inner point of all service — to connect to Hashem in a revealed and inner way, and to feel how He is within us at all times and guiding us. The Name connected to Malchut is the Name Adonai, or the Name Havayah in its various fillings." },
];

const PATHS = [
  ["keter","chochma"],["keter","bina"],["keter","tiferet"],
  ["chochma","bina"],["chochma","chesed"],["chochma","tiferet"],
  ["bina","gevurah"],["bina","tiferet"],
  ["chesed","gevurah"],["chesed","tiferet"],["chesed","netzach"],
  ["gevurah","tiferet"],["gevurah","hod"],
  ["tiferet","netzach"],["tiferet","hod"],["tiferet","yesod"],
  ["netzach","hod"],["netzach","yesod"],["netzach","malchut"],
  ["hod","yesod"],["hod","malchut"],["yesod","malchut"],
];

const OVERVIEW = "The Tree of Life is the central symbol of Kabbalah — a map of divine reality and human consciousness. It describes how the Infinite (Ein Sof) emanates into the finite world through ten Sefirot and twenty-two connecting paths.\n\nThree pillars:\n• Right Pillar (Chesed, Chochma, Netzach) — expansion, giving, masculine energy\n• Left Pillar (Gevurah, Binah, Hod) — contraction, receiving, feminine energy\n• Middle Pillar (Keter, Tiferet, Yesod, Malchut) — balance, synthesis, the path of return\n\nThe seven lower Sefirot correspond to the seven weeks of the Omer. The 49-day journey moves through all 7×7 combinations, leading to the 50th gate of Binah which opens at Shavuot.\n\nThe Ten Sefirot are all included and hinted in the holy Name Havayah — for the name of anything is like the revelation of its essence. Keter is the tip of the Yud. Chochma is the letter Yud itself. Binah is the first Heh. The six Sefirot of Chesed through Yesod are in the letter Vav. Malchut is the final Heh.";

const OH = ["","אֶחָד","שְׁנַיִם","שְׁלֹשָׁה","אַרְבָּעָה","חֲמִשָּׁה","שִׁשָּׁה","שִׁבְעָה","שְׁמוֹנָה","תִּשְׁעָה","עֲשָׂרָה","אַחַד עָשָׂר","שְׁנֵים עָשָׂר","שְׁלֹשָׁה עָשָׂר","אַרְבָּעָה עָשָׂר","חֲמִשָּׁה עָשָׂר","שִׁשָּׁה עָשָׂר","שִׁבְעָה עָשָׂר","שְׁמוֹנָה עָשָׂר","תִּשְׁעָה עָשָׂר","עֶשְׂרִים","עֶשְׂרִים וְאֶחָד","עֶשְׂרִים וּשְׁנַיִם","עֶשְׂרִים וּשְׁלֹשָׁה","עֶשְׂרִים וְאַרְבָּעָה","עֶשְׂרִים וַחֲמִשָּׁה","עֶשְׂרִים וְשִׁשָּׁה","עֶשְׂרִים וְשִׁבְעָה","עֶשְׂרִים וּשְׁמוֹנָה","עֶשְׂרִים וְתִשְׁעָה","שְׁלֹשִׁים","שְׁלֹשִׁים וְאֶחָד","שְׁלֹשִׁים וּשְׁנַיִם","שְׁלֹשִׁים וּשְׁלֹשָׁה","שְׁלֹשִׁים וְאַרְבָּעָה","שְׁלֹשִׁים וַחֲמִשָּׁה","שְׁלֹשִׁים וְשִׁשָּׁה","שְׁלֹשִׁים וְשִׁבְעָה","שְׁלֹשִׁים וּשְׁמוֹנָה","שְׁלֹשִׁים וְתִשְׁעָה","אַרְבָּעִים","אַרְבָּעִים וְאֶחָד","אַרְבָּעִים וּשְׁנַיִם","אַרְבָּעִים וּשְׁלֹשָׁה","אַרְבָּעִים וְאַרְבָּעָה","אַרְבָּעִים וַחֲמִשָּׁה","אַרְבָּעִים וְשִׁשָּׁה","אַרְבָּעִים וְשִׁבְעָה","אַרְבָּעִים וּשְׁמוֹנָה","תִּשְׁעָה וְאַרְבָּעִים"];
const WK = ["","שֶׁהֵם שָׁבוּעַ אֶחָד","שֶׁהֵם שְׁנֵי שָׁבוּעוֹת","שֶׁהֵם שְׁלֹשָׁה שָׁבוּעוֹת","שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת","שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת","שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת","שֶׁהֵם שִׁבְעָה שָׁבוּעוֹת"];
const WD = ["","וְיוֹם אֶחָד","וּשְׁנֵי יָמִים","וּשְׁלֹשָׁה יָמִים","וְאַרְבָּעָה יָמִים","וַחֲמִשָּׁה יָמִים","וְשִׁשָּׁה יָמִים"];

function omerCount(day) {
  const w=Math.floor((day-1)/7),r=day-w*7;
  let t="הַיּוֹם "+OH[day]+" יָמִים";
  if(w>0){t+=" "+WK[w];if(r>0)t+=" "+WD[r];}
  return t+" לָעֹמֶר";
}

function getTodayOmer() {
  const now=new Date(),utc=now.getTime()+now.getTimezoneOffset()*60000;
  const edt=new Date(utc-4*3600000);
  const h=edt.getHours(),m=edt.getMinutes();
  const afterNightfall=h>20||(h===20&&m>=42);
  const cal=new Date(edt.getFullYear(),edt.getMonth(),edt.getDate()+(afterNightfall?1:0));
  const day1=new Date(2026,3,3);
  const diff=Math.floor((cal-day1)/86400000)+1;
  return diff>=1&&diff<=49?diff:null;
}

const D = [
  {e:"Pure love with no strings attached. Chesed begins here — the raw capacity to give simply because it is in your nature. Avraham Avinu ran from his tent to greet strangers on the third day after his bris. Chesed does not calculate. It simply opens.",li:["You smile at a stranger with no reason","You give more time than asked and feel good doing it","You offer help before anyone asks","You genuinely enjoy making others feel welcome"],sh:["You give but quietly keep score of who reciprocates","Your generosity comes with invisible strings: approval, gratitude, loyalty","You're kind to people who can help you, less so to those who can't","You feel resentful when your giving isn't noticed"],wo:["Do one act of giving today that nobody will ever know about","Give something and consciously release any expectation","Notice when a generous impulse is really about being seen","Ask: would I still give this if they'd never thank me?"],p:"Who in your life receives your love freely — and who receives a version that has conditions?"},
  {e:"Love that knows its own limits. Chesed through Gevurah — generosity with a spine. True kindness sometimes requires the strength to say no, to give in a way that empowers rather than enables.",li:["You say no to someone with warmth — and it actually helps them","You give in a way that empowers rather than creates dependency","Your love is honest: you tell people what they need to hear","You hold a boundary and still feel genuine care"],sh:["You can't say no without guilt, so you say yes and resent it","Your kindness enables people — you give fish instead of teaching fishing","You withhold love as a form of control","You're strict with those closest and generous with strangers"],wo:["Say no to one request today — kindly, without over-explaining","Notice where your helping might be keeping someone stuck","Find the line between support and enabling in one relationship","Tell someone a truth they need to hear — from love, not judgment"],p:"Where is your generosity protecting you from having to make a harder choice?"},
  {e:"Love that is beautiful — balanced, truthful, full-hearted. Chesed through Tiferet is the art of giving that uplifts both sides.",li:["You give and the other person feels seen, not just helped","Your presence itself is the gift","You balance giving with receiving — it feels like flow","Your kindness matches what you feel inside"],sh:["You perform generosity — the gesture looks good but the heart isn't in it","You give to feel good about yourself","You're kind in public, less so at home","You give in ways that make you look generous rather than ways that serve"],wo:["Do one act of kindness that serves the other person's actual need","Be as kind to someone in private as you would be if the world were watching","Check: is there a gap between how generous you feel and how you actually are?","Sit with someone in their difficulty instead of rushing to fix it"],p:"If your loved ones described how you give — would it match how you see yourself?"},
  {e:"Love that shows up even when you don't feel it. Chesed through Netzach is the commitment that outlasts mood.",li:["You call someone when you're tired — because you said you would","Your love doesn't depend on people being at their best","You show up consistently, quietly, without needing recognition","You build others up over time — small gestures, steady presence"],sh:["You're generous in bursts but disappear when life gets busy","Your love is intense at first and then fades","You keep giving to people who drain you without reassessing","You confuse intensity with love — big gestures but not reliable"],wo:["Reach out to someone you've been meaning to check on — do it today","Make one small commitment and keep it, even though inconvenient","Ask: am I showing up for people in ways that actually sustain?","Notice if your giving is seasonal"],p:"Who in your life needed you consistently — and got you inconsistently?"},
  {e:"Love expressed through acknowledgment. Chesed through Hod — seeing someone fully and saying so.",li:["You tell someone specifically what you appreciate about them","You notice the effort behind what someone did — not just the result","You make people feel seen without needing anything in return","Your words of recognition land because they're true and specific"],sh:["You take the people who love you for granted — assuming they know","You give compliments strategically — to get something or smooth something over","You notice what's wrong more quickly than what's right","You're generous with strangers and stingy with acknowledgment at home"],wo:["Tell someone today specifically what they mean to you and why","Write a message of genuine appreciation to someone who helped you","Catch yourself noticing something good about someone — and say it out loud","Ask: when did I last make someone feel truly seen?"],p:"Who has been giving to you quietly, consistently — and hasn't heard you notice?"},
  {e:"Love that creates real bonds. Chesed through Yesod — giving that goes deep, not just wide.",li:["You invest real time in one relationship instead of spreading yourself thin","You're vulnerable with someone — and it brings you closer","You give in a way that creates lasting trust","You let someone into your real life — not just the presentable version"],sh:["You're everyone's friend and nobody's close friend","You give attention and warmth but never real access","You're emotionally available to acquaintances and distant from family","You confuse being pleasant with being genuinely present"],wo:["Have one real conversation today — not small talk","Let someone see you when you're not at your best","Ask a friend or family member a real question and listen to the full answer","Notice: who do you keep at arm's length while calling them close?"],p:"In your most important relationships — are you truly present, or performing presence?"},
  {e:"A week of Chesed complete. Malchut asks: did love actually reach anyone? Malchut does not accept intention. It accepts only what is real.",li:["Your love left a mark on someone this week — they felt it","You moved from intention to action at least once","Someone experienced you differently this week","You gave something real — not just energy, but yourself"],sh:["The week passed with good intentions that stayed intentions","Your loving feelings never made it into words or actions","You were kinder to the idea of people than to actual people in front of you","You waited for the right moment — and it never came"],wo:["Look back: name one person who concretely experienced your Chesed","If nobody comes to mind — do one real act today","Write down one thing you will do differently in Week 2","Acknowledge yourself for what you did — and be honest about what you didn't"],p:"What did love look like in your life this week — not in theory, but in practice?"},
  {e:"The courage to hold a line. Gevurah is not cruelty — it is the force that makes love sustainable, truth possible, and character real.",li:["You keep a commitment even when breaking it would be easier","You hold a boundary and feel at peace rather than guilty","Your no comes from values, not fear","You confront something difficult instead of going around it"],sh:["You mistake harshness for strength","Your inner critic is louder than your inner coach","You judge others quickly and forgive yourself slowly","You call your rigidity having standards"],wo:["Keep one commitment today that you'd normally quietly let slide","Notice when your inner voice disciplines vs. destroys — and shift","Set one clear expectation where things have been vague","Say something difficult but necessary — without cruelty"],p:"Where in your life do you need more strength — and where do you need to soften what you call strength?"},
  {e:"Discipline within discipline. Gevurah of Gevurah — the peak of inner structure.",li:["You can be strict with yourself without being punishing","You hold high standards AND give yourself room to be human","Your discipline is consistent — it doesn't depend on who's watching","You make hard decisions clearly"],sh:["Your standards for yourself are impossible — you're always falling short","You've confused rigidity with discipline","You're hard on yourself in ways that prevent growth","You control your environment to avoid feeling out of control"],wo:["Name one rule you live by — and ask if it serves you or just controls you","Be as compassionate with your own failure as you'd be with a friend's","Do one thing that requires real self-discipline — and note how it feels","Drop one self-critical thought the moment you notice it"],p:"Is your inner discipline building you up or wearing you down?"},
  {e:"Strength softened by truth. Gevurah through Tiferet — the courage to be both honest and kind.",li:["You tell the truth — and tell it with care","You can disagree and still leave the person feeling respected","Your feedback builds rather than breaks","You stand firm on what's right without needing to win"],sh:["You use honesty as a license to be blunt or superior","You hold back real feedback because conflict feels too risky","You're right but in a way that damages the relationship","You confuse being direct with being harsh"],wo:["Give one piece of honest feedback today — for the person's benefit, not your relief","Disagree with someone today — clearly, without backing down or attacking","Notice where you're withholding truth to keep the peace","Ask: when I'm being honest, who is it really for?"],p:"Think of a truth you've been holding back. What would it take to say it with both honesty and love?"},
  {e:"The staying power of discipline. Gevurah through Netzach — the commitment that holds even when motivation evaporates.",li:["You show up for your commitments on the hard days","Your word means something — people count on it","You finish what you start even when the energy is gone","You've built something through quiet, consistent effort"],sh:["You burn yourself out because you can't say this is enough for today","You quit exactly when things start to require real effort","You're motivated by emotion — inspired one day, gone the next","You keep rules that no longer serve you out of stubbornness"],wo:["Do the thing you've been putting off — start it, even if you can't finish","Honor one commitment that felt optional — treat it as non-negotiable","Notice the moment you want to quit today — and stay five more minutes","Ask: what am I sustaining that deserves more, and what am I just grinding through?"],p:"Where does your commitment run deep — and where does it run out the moment things get uncomfortable?"},
  {e:"The strength of honest acknowledgment. Gevurah through Hod — the courage to say I was wrong.",li:["You admit a mistake without over-explaining","You say I was wrong and mean it — and nothing collapses","You can receive criticism without becoming defensive","Your apologies are clean — no but, no deflection"],sh:["You apologize constantly without changing anything","You defend your position long after you privately know you're wrong","Your pride disguises itself as principle","You accept blame for things that aren't yours to avoid conflict"],wo:["Find one place today where you owe someone an acknowledgment — and give it","Receive one piece of criticism today without defending yourself","Notice the moment you shift from explaining to justifying — and stop","Say you were right about that to someone, and mean it"],p:"Is there an acknowledgment you've been withholding — and what are you protecting by holding it back?"},
  {e:"The strength that makes you reliable. Gevurah through Yesod — discipline in service of real connection.",li:["People know what to expect from you — you're steady","Your commitments in relationships are as strong as your commitments to work","You're as disciplined in how you show up for others as in how you perform","You protect relationships with the same care you protect your time"],sh:["You're extremely disciplined professionally and careless with the people who matter most","You hold others to standards you don't apply to yourself in relationships","Your reliability is transactional","You use I'm busy as a shield from emotional accountability"],wo:["Be as reliable in a personal commitment today as you are in a professional one","Keep one relational promise you might normally reschedule","Ask someone close: do they experience you as dependable?","Notice where your discipline protects you from intimacy"],p:"Does the person who knows you best experience you as someone they can count on?"},
  {e:"Two weeks complete. Gevurah of Malchut — strength made visible in the world.",li:["Your discipline this week changed something real","Someone experienced you as stronger, steadier, more honest","You held something this week that you would have let go before","Your inner work showed up in your outer behavior"],sh:["The discipline stayed internal — nothing actually changed in how you acted","Your strength this week may have just been stubbornness","You were hard on yourself and soft on what actually needed confronting","Gevurah without Malchut is just private suffering"],wo:["Name one concrete thing that is different because of this week's work","If nothing changed — what was the obstacle?","Write down one commitment you will carry into Week 3","Acknowledge one way you showed real strength — and one way you avoided it"],p:"What did strength look like in your actual life this week — not as an idea, but as an action?"},
  {e:"The heart of the Tree of Life. Tiferet is truth, compassion, and beauty all at once. The midah of Yaakov Avinu.",li:["You see another person fully — not just their role","You respond to complexity with nuance rather than snap judgment","You find beauty in ordinary moments","You're moved by something today — and you let yourself be"],sh:["You tell yourself a beautiful story about who you are that doesn't match how you act","You pursue an ideal version of your life while neglecting the actual one","You perform depth but avoid real vulnerability","You value beauty in art and ignore ugliness in your own character"],wo:["Look at someone close and really see them — not as you need them to be","Let one moment of beauty today fully land","Find where your self-image is more flattering than the truth","Have one conversation where you're genuinely curious rather than waiting to speak"],p:"Where is there a gap between the person you believe yourself to be and the person your actions reveal?"},
  {e:"Compassion with strength. Tiferet through Gevurah — the heart that holds its shape under pressure.",li:["You stay emotionally present in a hard conversation without shutting down or exploding","You feel someone's pain AND maintain your own groundedness","Your empathy is honest — you don't just validate everything to avoid discomfort","You can hold space for someone without losing yourself"],sh:["You armor your heart with analysis — you understand feelings without feeling them","You're emotionally available in theory but checked out when actually needed","You collapse into other people's emotions and call it empathy","Your compassion has a shorter limit than you think"],wo:["Stay present in one uncomfortable conversation today — don't redirect, fix, or escape","Notice when you go analytical to avoid feeling — and stay in the feeling","Ask someone how they're really doing — and just listen","Find the line between healthy boundaries and emotional unavailability"],p:"Think of someone who is struggling. Are you truly present with them — or managing them from a safe distance?"},
  {e:"The radiant center. Tiferet of Tiferet — the heart fully open, truth fully spoken.",li:["You're fully yourself today — no performance, no mask","Your inner and outer life feel aligned","You speak from your actual experience, not from what sounds right","You let yourself be moved — by music, by nature, by another person"],sh:["You curate your self-presentation so carefully that even you have lost track of what's real","You're more comfortable with the idea of openness than actual openness","You pursue perfection as a way to avoid showing up as you are","You wait until you're ready before letting anyone really see you"],wo:["Say something true today that you usually keep to yourself","Let yourself receive something — a compliment, an act of care — without deflecting","Notice where you're performing rather than being — and drop the performance","Find one place where what you say and what you feel don't match — and close the gap"],p:"Who in your life sees the real you — and who sees only the version you've decided is safe to show?"},
  {e:"Compassion that endures. Tiferet through Netzach — the heart that keeps showing up.",li:["You love people at their worst, not just their best","Your care doesn't fluctuate with how they're treating you","You've stayed in a difficult relationship because it matters","Your compassion is a practice, not just a feeling"],sh:["Your empathy burns bright and then burns out","You stay in situations that harm you and call it loyalty","You give compassion endlessly to others and none to yourself","You've become numb — the sustained difficulty has closed something in you"],wo:["Extend compassion today to someone who is being difficult — ask what might be underneath it","Give yourself the same kindness you'd give a friend in your exact situation","Notice if numbness has replaced your sensitivity somewhere — and gently reopen","Ask: where am I staying out of habit rather than genuine love?"],p:"Where have you closed your heart to protect yourself — and what would it cost you to open it again?"},
  {e:"Beauty seen through gratitude. Tiferet through Hod — the compassion that makes you thankful for life as it is.",li:["You find something genuinely beautiful in an ordinary day","You feel grateful — not forced, not performed — just quietly thankful","You notice what you have rather than cataloguing what you lack","You receive your life as a gift"],sh:["You intellectually know you have a lot but emotionally feel empty","Your gratitude is situational — you're thankful when things go well","You've stopped noticing the good because it became familiar","You perform positivity while privately carrying a different reality"],wo:["Find one thing today you've completely stopped noticing — and really look at it","Write down three things you are genuinely grateful for — and say why each matters","Tell someone that their presence in your life is a gift — mean it","Sit for two minutes with the fact that you are alive today"],p:"If you looked at your life through the eyes of someone who wanted what you have — what would they see?"},
  {e:"The heart that creates real bonds. Tiferet through Yesod — compassion that connects at the soul level.",li:["You're genuinely interested in the inner life of someone close to you","You create safety — people tell you things they don't tell others","Your care makes people feel less alone","You love in a way that gives people room to be themselves"],sh:["You connect through roles and functions — not through who people actually are","Your love comes with an unspoken vision of who the person should be","You need people to be okay so you can feel okay","You confuse closeness with control"],wo:["Ask someone close a question about their inner world — and be genuinely curious","Notice if your love allows the other person to be themselves","Create one moment of real connection today — not transactional","Be with someone in a way that has no agenda"],p:"Do the people closest to you feel truly seen and free — or managed and loved conditionally?"},
  {e:"Three weeks. Tiferet of Malchut — beauty and truth made real in the world.",li:["Your inner work this week showed up in how you treated people","Something in the world is more beautiful because you were in it","You brought truth AND compassion together in at least one real moment","The heart you opened this week stayed open"],sh:["Tiferet stayed theoretical — a beautiful framework that didn't touch actual behavior","You were moved emotionally but unmoved practically","You recognized the gap between who you are and who you want to be — and did nothing","Another week of insight without change"],wo:["Name one relationship that is genuinely better because of this week's work","Name one truth that you brought into your life — not just thought about","What opened in your heart this week that you want to protect going forward?","Write one intention for the week ahead"],p:"What is one concrete thing that is more beautiful, more true, or more loving in your life because of this week?"},
  {e:"Endurance, passion, and the will that keeps going. Netzach is the force beneath all sustained effort.",li:["You know what you're fighting for — and it pulls you forward on hard days","Your energy comes from genuine passion, not just habit or fear","You've built something real through sustained effort","You have a deep well — and you know how to draw from it"],sh:["You're driven by desire but not sure which desires are actually yours","You have passion but no direction — intensity without aim","You can't rest — busyness has become your identity","You keep going out of stubbornness and call it perseverance"],wo:["Name the deepest why behind your main effort right now — say it out loud","Notice what you're doing from genuine desire vs. compulsion or fear","Give yourself permission to stop today — real rest, not collapse","Ask: what am I really chasing, and is it worth chasing?"],p:"Underneath the busyness — what do you actually want? And is your life currently moving toward it?"},
  {e:"Discipline in service of endurance. Gevurah of Netzach — the structure that sustains your passion.",li:["You pace yourself — showing up tomorrow matters as much as today","Your habits are in service of what you love","You finish things — even when the excitement is long gone","You've learned the rhythm of effort and rest"],sh:["You sprint until you crash — the all-or-nothing pattern","Your discipline is brittle — one disruption and the whole structure falls","You've disciplined the passion out of what you love","You rest only when forced to"],wo:["Build in one deliberate pause today — before you need it","Look at one area where your all-or-nothing pattern is costing you","Do less today than you could — as a conscious choice, not laziness","Ask: what would sustainable look like where I currently burn bright and crash?"],p:"Is your current pace one you could maintain for a year? If not — what needs to change?"},
  {e:"Passion aligned with heart. Tiferet of Netzach — when your energy comes from love, not just drive.",li:["You work on something and it feels like it matters","Your motivation is connected to your values, not just your ambitions","You feel the difference between effort from love and effort from fear","What you're working toward has meaning — and you know why"],sh:["You've optimized for success and lost track of why you wanted it","You're excellent at things you no longer love","You confuse intensity with passion — busyness with purpose","You're chasing someone else's definition of winning"],wo:["Reconnect with why you started something you're currently grinding through","Ask: if I succeeded completely at this — would my life feel meaningful?","Find one thing you do purely for love — and make time for it today","Notice when effort comes from joy vs. from anxiety — and try to shift the ratio"],p:"When did you last do something just because you loved it — not because it served a goal?"},
  {e:"Pure endurance. Netzach of Netzach — the unbreakable will.",li:["You've survived something that would have stopped many people — and you're still here","Your resilience has been tested — and it held","You don't need external motivation to keep going","You know what you're made of because situations have shown you"],sh:["You keep going when you should stop — stubbornness disguised as strength","You don't know how to receive help — you insist on doing it alone","Your endurance is actually avoidance — staying in motion to avoid feeling","You've mistaken suffering for virtue"],wo:["Acknowledge something you've carried for a long time — and honor the strength that took","Ask: is this thing I'm persisting with worth persisting with?","Let someone help you today with something you'd normally handle alone","Distinguish between endurance that builds and endurance that just delays"],p:"What have you been pushing through that actually deserves to be put down?"},
  {e:"Victory acknowledged. Hod of Netzach — gratitude for the endurance that carried you.",li:["You recognize that your resilience was not yours alone","You thank someone who held you up when you were running on empty","You celebrate small wins — not just the finish line","You acknowledge how far you've come, not just how far you have to go"],sh:["You never celebrate — there's always more to do before you're allowed to feel good","You take sole credit for what actually required a village","You're so focused on the destination you never experience the journey","You dismiss your own accomplishments before anyone else can"],wo:["Celebrate one small win today — actually let yourself feel it","Thank someone who made your endurance possible — name specifically what they did","Look back at where you were a year ago and acknowledge the distance","Let someone else carry something today — and practice being grateful"],p:"What have you accomplished that you've never let yourself fully appreciate?"},
  {e:"Passion that connects. Yesod of Netzach — your endurance in service of real relationship.",li:["Your energy and drive inspire the people around you","Your commitment to something makes others want to commit too","You channel your passion into creating — not just doing","Your persistence builds something others can inhabit and build on"],sh:["Your drive leaves people behind — you're always ahead, they're always catching up","Your passion for work crowds out your passion for people","Your endurance isolates you — the long hours, the grinding, the absence","You build things but neglect relationships, then wonder why you feel alone"],wo:["Bring someone into your effort today — share what you're working toward","Make sure the people close to you know they matter more than the work","Ask: does my drive serve the people I love — or does it take from them?","Find one way your passion can be directed toward someone rather than just something"],p:"Who has paid the price for your ambition — and do they know you know?"},
  {e:"Four weeks. Netzach of Malchut — endurance made visible in the world.",li:["Something real was built or sustained this week because you didn't quit","Your persistence showed up in behavior, not just intention","Someone else's life is different because you kept going","The effort was worth it — you can see why"],sh:["You endured this week — but you're not sure what for","Your persistence was indistinguishable from avoidance","You were busy but nothing grew","The drive is there but the direction is still unclear"],wo:["Name one thing that exists or improved because you stayed with it this week","If you're not sure — clarify: what are you actually building?","Write down the one commitment you most want to sustain going into Week 5","Rest today — real, guilt-free rest — as an act of Avodah"],p:"When you look at what you built this week — are you proud of it?"},
  {e:"Splendor, humility, and the art of receiving. Hod asks: can you let goodness actually reach you?",li:["You receive a compliment and let it land — really land","You ask for help without making it into a big thing","You acknowledge what others contribute without diminishing your own","You find yourself genuinely grateful — spontaneously"],sh:["You deflect every compliment — oh it was nothing","You can't accept help without feeling like you owe something","Your humility is actually a defense against being seen","You make yourself small so others won't expect too much"],wo:["Accept one compliment today fully — just say thank you and nothing else","Ask for help with something you've been handling alone out of pride","Notice every time you minimize yourself today — and try once not to","Receive something — praise, care, a meal — without immediately reciprocating"],p:"What would it mean to let yourself be seen as worthy of love and recognition — without deflecting?"},
  {e:"The courage to acknowledge. Gevurah of Hod — it takes real strength to say I was wrong.",li:["You own your mistakes without over-explaining","You say I was wrong and mean it — and nothing collapses","You receive criticism and find the truth in it before you defend","Your acknowledgments are clean — no but, no however"],sh:["Your apologies always have a second half that undoes the first","You accept fault for things that aren't yours to avoid conflict","You never admit you're wrong — you just quietly change your behavior","Pride disguises itself as certainty"],wo:["Find one thing today you got wrong and acknowledge it — to yourself or out loud","When criticized today, find the part that's true before you respond","Drop but from one apology or acknowledgment","Notice when defensiveness kicks in — and pause before speaking"],p:"Is there an acknowledgment you owe someone that you've been avoiding?"},
  {e:"Gratitude that comes from the heart. Tiferet of Hod — genuine thankfulness, not performance.",li:["You feel grateful for something specific today — and it's real","Your thank-yous are detailed and genuine — people feel the difference","You notice beauty and goodness that you usually scroll past","Your gratitude changes how you see a situation, not just how you describe it"],sh:["Your gratitude is a spiritual to-do — you list it because you should","You feel grateful in abundance and forget when things are hard","You're grateful in general but not for anyone specifically","You perform gratitude in public and carry resentment in private"],wo:["Write down one thing you are genuinely grateful for — and write why, specifically","Tell one person today something you appreciate about them — make it specific","Find gratitude for something difficult — what has a hard situation taught you?","Spend two minutes in genuine wonder at something ordinary"],p:"What is something in your life you've completely stopped appreciating — and what would it feel like to see it fresh?"},
  {e:"Sustained gratitude. Netzach of Hod — the practice of finding something to be grateful for every single day.",li:["Even on a hard day, you find one thing that was real and good","Your gratitude is a discipline — not dependent on circumstances","You've trained yourself to notice abundance rather than default to lack","Your orientation toward life is fundamentally one of receiving"],sh:["You force gratitude as a way of avoiding legitimate pain","Your positivity is a performance — it doesn't reach the parts that are actually hurting","You've bypassed your own suffering by covering it with spiritual language","You tell others to be grateful when they need to be heard first"],wo:["Find one genuine thing to be grateful for in your hardest current situation","Don't force it — if nothing comes, sit with the difficulty first","Notice if your gratitude practice is authentic or avoidant","Let yourself feel something difficult today — and then find the grace inside it"],p:"Is there something you're using gratitude to bypass — a pain or truth that deserves to be felt rather than reframed?"},
  {e:"Lag B'Omer — Hod of Hod. The yahrtzeit of Rabbi Shimon bar Yochai — the day the hidden light burst through.",li:["You let yourself celebrate — fully, without guilt","You recognize the light in yourself and let it shine today","You bring joy into a room just by being fully present","You express something that's been building — creativity, love, truth"],sh:["You suppress your own radiance so others won't feel uncomfortable","You celebrate others easily but can't celebrate yourself","Your joy has a ceiling — you pull back right when things get really good","You perform happiness while something real goes unexpressed"],wo:["Do something joyful today — not productive, not useful, just joyful","Let yourself shine in one moment without dimming it","Tell someone what makes you light up — let them see that part of you","Light a fire today. Let it be a symbol of what burns in you"],p:"What is the part of you that most wants to be expressed — and what stops you from letting it out?"},
  {e:"Gratitude that deepens bonds. Yesod of Hod — when acknowledgment becomes the foundation of real connection.",li:["You tell someone what they mean to you — specifically and truly","Your acknowledgment creates closeness rather than just being polite","People feel genuinely seen and appreciated in your presence","You express love and gratitude before you're forced to by a crisis or a loss"],sh:["You assume people know how you feel — so you never say it","Your acknowledgment is general — you're great — rather than real","You express gratitude only when it's socially expected","You've never told the most important people what they actually mean to you"],wo:["Tell one person today something specific they've done that changed your life","Write a message to someone you love that says exactly what you feel — and send it","Don't wait for the right moment — say what you mean today","Ask: if this person weren't here tomorrow, what would I wish I had said?"],p:"Who deserves to hear from you today — and what exactly would you say if you knew they needed to hear it?"},
  {e:"Five weeks. Hod of Malchut — gratitude and acknowledgment made real in the world.",li:["Someone felt genuinely seen this week because of you","You received something this week — care, praise, help — and let it in","Your gratitude practice changed how you moved through at least one day","You expressed appreciation that you'd been holding inside"],sh:["The week passed with invisible gratitude — felt but not expressed","You received care this week and immediately deflected or reciprocated","Your humility kept you from being seen — and you called that virtue","Another week of good intentions that didn't make it into words"],wo:["Name one person who felt more appreciated this week because of you","Name one moment you allowed yourself to genuinely receive","If neither — do one of these things before the week closes","Write down one thing you want to carry into Week 6"],p:"What did gratitude look like in your actual life this week — not as a concept, but as a moment?"},
  {e:"The channel between worlds. Yesod connects all the higher Sefirot to Malchut. What are you actually transmitting?",li:["What you feel inside matches what others experience from you","You're a conduit — good things flow through you to others","Your inner life is rich and you share it selectively and genuinely","People feel more themselves around you — you don't distort"],sh:["There's a wall between your inner world and your outer expression","You leak — unprocessed emotion spills out in ways you're not aware of","You overshare in ways that center you rather than connect you","People experience a version of you that isn't quite real"],wo:["Ask: what am I actually transmitting today?","Share something true about your inner world with one person today","Notice where you're leaking — emotion coming out sideways rather than directly","Find the gap between how you intend to come across and how you actually land"],p:"If the people in your life described the energy you bring — what would they say? Is that what you meant to bring?"},
  {e:"Connection held by structure. Gevurah of Yesod — intimacy that has healthy limits.",li:["You're genuinely open AND you know where the limit is","Your vulnerability is chosen — not compulsive, not armored","You let people in without losing yourself","Your closeness with people feels spacious, not suffocating"],sh:["Your walls are so high that closeness is impossible","You connect with everyone at the same shallow depth","You share too much too fast and then feel exposed and retreat","You confuse emotional unavailability with healthy boundaries"],wo:["Let one person a little closer today — share something you usually keep back","Notice the moment you want to shut down in a conversation — and try staying one beat longer","If you tend to overshare — practice holding something back","Ask: what is one real boundary I need to set — and one false one I should remove?"],p:"In your closest relationships — are you more likely to let too much in, or to keep too much out?"},
  {e:"The beauty of true meeting. Tiferet of Yesod — when two people really see each other.",li:["You have a conversation today where both people leave feeling more real","You're interested in the inner life of someone close — not their performance","Your presence creates safety — people say things to you they don't say elsewhere","You connect with the person, not the role they play in your life"],sh:["Your relationships are functional rather than soulful","You connect through doing — activities, tasks — but rarely through being","You know someone's schedule better than you know their heart","Your deepest conversations are with strangers, not with the people you live with"],wo:["Have one real conversation today — about what actually matters, not logistics","Ask someone: what are you carrying right now that you haven't told anyone?","Be with someone without an agenda — not helpful, not productive, just present","Notice if you connect more easily with strangers than with people you love — and why"],p:"Who knows your inner world — really knows it? And whose inner world do you know?"},
  {e:"Bonds that outlast difficulty. Netzach of Yesod — the connection that endures.",li:["You have relationships that have survived real difficulty — and they're stronger for it","You reach out to people even when there's nothing to do together","Your love doesn't require people to be at their best","You invest in relationships before they need saving"],sh:["You let relationships atrophy through busyness and tell yourself they'll always be there","When things get hard in a relationship, you disappear","Your connections are maintained by proximity — when the circumstance changes, the relationship ends","You're loyal to ideas of people rather than to actual people"],wo:["Reach out today to someone you've lost touch with — not because there's a reason, just because you value them","Do something for a relationship before it needs anything","Sit with a hard relational moment instead of walking away","Ask: who in my life have I been taking for granted?"],p:"Which of your important relationships has been running on fumes — and what would it take to refuel it?"},
  {e:"The humility of needing others. Hod of Yesod — connection expressed in the acknowledgment of dependence.",li:["You say I need you — and mean it, and let it land","You allow yourself to be held as well as to hold","You acknowledge what others give you — specifically and truthfully","Your relationships have real mutuality — both people give and receive"],sh:["You connect but never admit dependency — always the strong one, never the needy one","You take quietly and give visibly","Your gratitude stays private and your needs stay hidden","You confuse self-sufficiency with strength — and pay for it with loneliness"],wo:["Tell someone today: I couldn't do this without you — and say specifically why","Let someone help you with something and receive it without minimizing","Ask for something you need from someone you trust","Admit a dependency that you've been hiding under independence"],p:"Who do you need — and do they know it?"},
  {e:"The foundation of foundations. Yesod of Yesod — the deepest capacity for genuine connection.",li:["You are known — really known — by at least one person","You have tended your most essential bonds with care and intention","Your capacity for intimacy has grown — you can go deeper than you could before","You are both seen and seeing — the connection is mutual and real"],sh:["You feel profoundly alone even when surrounded by people","Your most important relationships feel hollow or distant","You've been so focused on your external life that your inner world has no witness","You've forgotten how to be close — or never fully learned"],wo:["If you feel alone: don't turn away — let it point you toward what you need","Reach out to one person today with real honesty about how you're doing","If you are well-connected: invest deeply in what you have","Ask: who would I call if something broke open in me tonight?"],p:"Are you truly known by anyone? And if not — what stands between you and that?"},
  {e:"Six weeks. Yesod of Malchut — connection made real in the world.",li:["A relationship is genuinely better because of this week's work","You said something true that needed to be said","Someone felt less alone because of you this week","You allowed yourself to be less alone because of someone else"],sh:["The connection stayed in your head — you thought about reaching out but didn't","Another week of busyness that crowded out the people who matter","You were present everywhere except where it counted","The loneliness is still there, untouched"],wo:["Name one relationship that moved this week — even an inch","If nothing moved: make one call, send one message, say one real thing today","Write down what you most want to carry into the final week","Ask: who do I want to be closer to by Shavuot?"],p:"What is the most important relationship in your life right now — and what does it need from you?"},
  {e:"Sovereignty. Presence. The avodah of Malchut is not about generating more — it is about being fully present to what is already here.",li:["You move through your day as yourself — not performing, not shrinking","You inhabit your life rather than observing it from a distance","You make decisions from your own center, not from fear of what others think","You are present enough to actually experience what is happening"],sh:["You feel disconnected from your own life — going through the motions","You live in your head and call it thinking when it's really avoiding","You're always in the next moment — planning, worrying — never in this one","You feel like an outsider in your own story"],wo:["Take three breaths right now — really feel them","For five minutes today, do one thing with complete presence — no phone, no planning","Notice when you leave your body today — and come back","Ask: where am I actually living — in the present, in the past, or in the future?"],p:"When did you last feel fully present — fully yourself, fully here? What made it possible?"},
  {e:"The sovereign who holds limits. Gevurah of Malchut — presence that doesn't collapse under pressure.",li:["You stay yourself in difficult situations — you don't shape-shift to manage others","Your identity doesn't depend on others' approval","You can be in a room full of pressure and still know who you are","You hold your ground without aggression"],sh:["You become whoever the room needs you to be","Your self disappears in strong personalities — you're defined by comparison","You confuse compliance with peace and conflict avoidance with strength","You enforce your authority through fear rather than presence"],wo:["Notice one moment today where you're about to adjust yourself to manage someone else — and don't","Hold your position in one conversation today — calmly, without defensiveness","Ask: in which relationships do I tend to lose myself?","Find the difference between stubbornness and genuine groundedness — practice the latter"],p:"Who or what has the most power to destabilize your sense of self — and what does that tell you?"},
  {e:"Presence made beautiful. Tiferet of Malchut — when who you are and how you show up are the same thing.",li:["You carry yourself with dignity — not pride, but genuine self-respect","The way you show up matches what you believe about yourself","People feel something when you walk in — not because you're performing, but because you're real","Your inner life and outer life are aligned"],sh:["There's a gap between who you believe you are and who your actions reveal","You invest in image rather than integrity","You have a public self and a private self and they barely know each other","You've built a life that looks right from the outside and feels empty from the inside"],wo:["Find one place today where your inner reality and outer presentation don't match — and close the gap","Do one thing today that's true rather than impressive","Ask: what would I do differently if no one were watching?","Let something true about you be seen today — without curating it first"],p:"Is there a version of you that you've been keeping hidden — and what would it take to let it live?"},
  {e:"The sovereign who persists. Netzach of Malchut — presence that builds over time.",li:["You show up as yourself — day after day — without needing a special occasion","Your presence in people's lives is steady, not dramatic","You've built your sovereignty through consistency, not grand gestures","Who you are today is the result of sustained inner work — and you can feel it"],sh:["You wait for the right moment to be yourself — and it never comes","Your best self shows up only under pressure or in peak experiences","You've been waiting to become the person you want to be instead of being them now","Your sovereignty is intermittent — present sometimes, absent often"],wo:["Be the person you want to be in one ordinary moment today — not a special one","Don't wait to feel ready — show up as yourself right now","Ask: in what areas of my life am I still living like I'm in rehearsal?","Notice the gap between your peak self and your daily self — and work to close it"],p:"If you lived every day as the person you are at your best — what would be different?"},
  {e:"The sovereign who bows. Hod of Malchut — the royalty that knows how to receive, to thank, to be genuinely grateful.",li:["You receive your life — all of it — as a gift rather than a given","You bow before something greater than yourself and it doesn't diminish you","Your gratitude is sovereign: it comes from fullness, not from fear","You are genuinely, quietly thankful to be here — alive, in this life"],sh:["You've stopped marveling — life became ordinary and you stopped receiving it","Your sovereignty has become arrogance — you've forgotten you didn't make yourself","You're grateful only when things go your way","You carry your life as a burden rather than a privilege"],wo:["Spend one minute today in genuine awe — at being alive, at light, at anything","Bow — physically or inwardly — before something greater than you","Receive today as a gift — even the hard parts","Say thank you — to God, to life, to someone — and mean it with your whole self"],p:"When did you last feel genuinely awe-struck — by your life, by existence, by something beyond you?"},
  {e:"The sovereign who connects. Yesod of Malchut — leadership that empowers, presence that creates room for others.",li:["People grow in your presence — you make room for them","Your authority doesn't diminish others — it invites them into their own","You lead by being rather than by doing","The people around you feel more themselves because of you"],sh:["You take up so much space that others shrink","You use your presence to control rather than to create","You need to be the most important person in any room you're in","Your strength is actually intimidation dressed as leadership"],wo:["Help one person step into their own authority today — ask their opinion, elevate their contribution","Make yourself smaller in one interaction — actively create space","Ask: do people around me grow — or do they defer?","Lead today through presence and listening, not through direction and control"],p:"Who in your life is waiting for your permission — implied or explicit — to step into their own greatness?"},
  {e:"Malchut of Malchut. Day 49. The eve of Shavuot. The counting is complete. The vessel is ready.\n\nThe Torah was not given to angels. It was given to human beings who had done forty-nine days of inner work — and arrived at Sinai as refined vessels.\n\nYou are that vessel. Tonight stand at Sinai.",li:["You have shown up — day after day — and something in you has changed","You are more of yourself than you were 49 days ago","The Torah is given to someone who has done the work — you have done the work","You are a vessel: refined, present, ready to receive"],sh:["The gap between who you set out to become and who you are is real — and that's okay","That gap is not failure — it is next year's map","There are places the light didn't reach this Omer — they are waiting","Shavuot is not an arrival. It is a beginning"],wo:["Sit tonight with the full 49 days — what opened? What remained closed?","Name one real change in yourself — however small — and honor it","Name one place that still needs work — and write it down as a commitment","Stay up tonight, learn Torah, and stand at Sinai as the person you've become"],p:"Who were you on the first night of the Omer — and who are you now? What do you want to receive at Sinai tonight?"},
];

function Bullets({items,color,icon}){
  return <div style={{display:"flex",flexDirection:"column",gap:10}}>{items.map((t,i)=><div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}><span style={{color,flexShrink:0,marginTop:3,fontSize:14}}>{icon}</span><span style={{fontSize:14,lineHeight:1.75,color:"#CCC8B0"}}>{t}</span></div>)}</div>;
}
function Block({label,color,children}){
  return <div style={{marginBottom:14}}><div style={{background:color+"18",borderLeft:"4px solid "+color,padding:"8px 12px",fontSize:11,letterSpacing:1,color,fontFamily:"Georgia,serif"}}>{label}</div><div style={{background:"#0E0E18",borderLeft:"4px solid "+color+"22",padding:"14px"}}>{children}</div></div>;
}
function Btn({onClick,style,children,disabled}){
  return <button onClick={onClick} disabled={disabled} style={{fontFamily:"Georgia,serif",cursor:disabled?"default":"pointer",border:"none",...style}}>{children}</button>;
}

function DivineDimension({week, inner, c}){
  const [open,setOpen]=useState(false);
  const t=WEEK_TEACHING[week];
  return (
    <div style={{background:"#0C0C1A",border:"1px solid "+c+"55",borderRadius:14,overflow:"hidden",marginBottom:18}}>
      <div style={{background:c+"18",padding:"12px 14px",borderBottom:"1px solid "+c+"33"}}>
        <div style={{fontSize:10,letterSpacing:2,color:c,textTransform:"uppercase",marginBottom:4}}>בֵּין אָדָם לַמָּקוֹם — Your Relationship with Hashem</div>
        <div style={{fontSize:13,color:"#D0C8A8",fontStyle:"italic"}}>{t.title}</div>
      </div>
      <div style={{padding:"14px"}}>
        <div style={{fontSize:14,lineHeight:1.9,color:"#C8C0A0",marginBottom:12}}>{t.core}</div>
        {open && <>
          <div style={{height:1,background:c+"22",margin:"12px 0"}}/>
          <div style={{fontSize:10,letterSpacing:2,color:c,textTransform:"uppercase",marginBottom:8}}>The Practice Today</div>
          <div style={{fontSize:14,lineHeight:1.9,color:"#B8B098",marginBottom:14}}>{t.practice}</div>
          <div style={{fontSize:10,letterSpacing:2,color:c,textTransform:"uppercase",marginBottom:8}}>Elevating the Fallen Light</div>
          <div style={{fontSize:14,lineHeight:1.9,color:"#B8B098",marginBottom:14}}>{t.elevation}</div>
          <div style={{background:c+"12",border:"1px solid "+c+"33",borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontSize:10,letterSpacing:2,color:c,textTransform:"uppercase",marginBottom:8}}>Sit With This — Toward Hashem</div>
            <div style={{fontSize:14,color:"#A098C0",lineHeight:1.9,fontStyle:"italic"}}>{"\""+t.question+"\""}</div>
          </div>
        </>}
        <div style={{textAlign:"center",marginTop:12}}>
          <Btn onClick={()=>setOpen(v=>!v)} style={{background:"transparent",border:"1px solid "+c+"55",borderRadius:20,padding:"6px 18px",color:c,fontSize:12}}>
            {open?"Close":"Read More"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function TreeOfLife(){
  const [sel,setSel]=useState(null);
  const [showOv,setShowOv]=useState(false);
  const [showDeep,setShowDeep]=useState(false);
  const W=310,H=490,R=24;
  function pos(col,row){
    const cols=[W*0.15,W*0.5,W*0.85];
    const rows=[H*0.04,H*0.16,H*0.28,H*0.41,H*0.55,H*0.69,H*0.83,H*0.955];
    return {x:cols[col],y:rows[row]};
  }
  const node=TREE.find(n=>n.id===sel);
  return (
    <div>
      <div style={{fontSize:18,color:"#C8A96E",marginBottom:10,textAlign:"center",direction:"rtl"}}>עֵץ הַחַיִּים</div>
      <Btn onClick={()=>setShowOv(v=>!v)} style={{width:"100%",padding:"9px",borderRadius:showOv?"10px 10px 0 0":"10px",border:"1px solid #C8A96E44",background:showOv?"#C8A96E18":"transparent",color:"#C8A96E",fontSize:12,marginBottom:showOv?0:8}}>
        {showOv?"Hide Overview":"What is the Tree of Life?"}
      </Btn>
      {showOv&&<div style={{background:"#0F0F1A",border:"1px solid #C8A96E33",borderTop:"none",borderRadius:"0 0 10px 10px",padding:"14px",marginBottom:8}}><div style={{fontSize:13,lineHeight:1.9,color:"#C8C0A0",whiteSpace:"pre-line"}}>{OVERVIEW}</div></div>}
      <div style={{fontSize:11,color:"#444",textAlign:"center",padding:"4px 0",fontStyle:"italic"}}>Tap any Sefirah to explore</div>
      <div style={{display:"flex",justifyContent:"center"}}>
        <svg width="100%" viewBox={"0 0 "+W+" "+H} style={{overflow:"visible",maxWidth:W}}>
          <rect x={W*0.07} y={H*0.02} width={W*0.2} height={H*0.96} rx="8" fill="#9B6B9B0A"/>
          <rect x={W*0.37} y={H*0.02} width={W*0.26} height={H*0.96} rx="8" fill="#4A8C6F0A"/>
          <rect x={W*0.73} y={H*0.02} width={W*0.2} height={H*0.96} rx="8" fill="#C8A96E0A"/>
          {PATHS.map((pair,i)=>{
            const a=TREE.find(n=>n.id===pair[0]),b=TREE.find(n=>n.id===pair[1]);
            if(!a||!b)return null;
            const p1=pos(a.col,a.row),p2=pos(b.col,b.row);
            const hi=sel&&(pair[0]===sel||pair[1]===sel);
            return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={hi?"#C8A96E":"#FFF"} strokeWidth={hi?1.5:0.5} strokeOpacity={hi?0.7:0.1}/>;
          })}
          {TREE.filter(n=>n.id!=="daat").map(n=>{
            const p=pos(n.col,n.row),isSel=sel===n.id;
            return <g key={n.id} onClick={()=>setSel(isSel?null:n.id)} style={{cursor:"pointer"}}>
              {isSel&&<circle cx={p.x} cy={p.y} r={R+8} fill={n.color} opacity="0.18"/>}
              <circle cx={p.x} cy={p.y} r={R+2} fill="none" stroke={isSel?n.color:n.color+"44"} strokeWidth={isSel?2:1}/>
              <circle cx={p.x} cy={p.y} r={R} fill={isSel?n.color+"33":"#0C0C18"} stroke={n.color} strokeWidth={isSel?2:1}/>
              <text x={p.x} y={p.y-5} textAnchor="middle" fill={n.color} fontSize={n.he.length>6?"9":"11"} fontFamily="Georgia,serif" fontWeight="bold">{n.he}</text>
              <text x={p.x} y={p.y+8} textAnchor="middle" fill={isSel?"#F0E8D8":"#888"} fontSize="8" fontFamily="Georgia,serif">{n.en}</text>
            </g>;
          })}
          {(()=>{const daat=TREE.find(n=>n.id==="daat"),p=pos(daat.col,daat.row),isSel=sel==="daat";
            return <g key="daat" onClick={()=>setSel(isSel?null:"daat")} style={{cursor:"pointer"}}>
              {isSel&&<circle cx={p.x} cy={p.y} r={R+8} fill={daat.color} opacity="0.18"/>}
              <circle cx={p.x} cy={p.y} r={R} fill={isSel?daat.color+"33":"#0C0C18"} stroke={daat.color} strokeWidth={isSel?2:1}/>
              <text x={p.x} y={p.y-5} textAnchor="middle" fill={daat.color} fontSize="11" fontFamily="Georgia,serif" fontWeight="bold">{daat.he}</text>
              <text x={p.x} y={p.y+8} textAnchor="middle" fill={isSel?"#F0E8D8":"#888"} fontSize="8" fontFamily="Georgia,serif">{daat.en}</text>
            </g>;
          })()}
        </svg>
      </div>
      {node&&<div style={{background:"#0F0F1A",border:"1px solid "+node.color+"44",borderRadius:14,overflow:"hidden",marginTop:4}}>
        <div style={{background:node.color+"22",borderBottom:"1px solid "+node.color+"33",padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:20,color:node.color}}>{node.he}</div><div style={{fontSize:14,color:"#F0E8D8",marginTop:2}}>{node.en} — {node.tr}</div></div>
          <Btn onClick={()=>{setSel(null);setShowDeep(false);}} style={{background:"transparent",border:"1px solid #333",borderRadius:"50%",width:26,height:26,color:"#666",fontSize:15}}>x</Btn>
        </div>
        <div style={{padding:"14px"}}>
          <div style={{fontSize:13,lineHeight:1.9,color:"#C8C0A0",marginBottom:14}}>{node.desc}</div>
          <div style={{background:"#13131E",border:"1px solid #2A2A3A",borderRadius:8,padding:"10px 12px",marginBottom:10}}>
            <div style={{fontSize:10,letterSpacing:2,color:node.color,textTransform:"uppercase",marginBottom:6}}>Correspondences</div>
            <div style={{fontSize:12,lineHeight:1.8,color:"#A0A090"}}>{node.corr}</div>
          </div>
          <div style={{background:node.color+"12",border:"1px solid "+node.color+"33",borderRadius:8,padding:"10px 12px",marginBottom:10}}>
            <div style={{fontSize:10,letterSpacing:2,color:node.color,textTransform:"uppercase",marginBottom:6}}>Omer Connection</div>
            <div style={{fontSize:12,lineHeight:1.8,color:"#B0A890"}}>{node.omer}</div>
          </div>
          {node.deep&&<>
            <Btn onClick={()=>setShowDeep(v=>!v)} style={{width:"100%",padding:"8px",borderRadius:showDeep?"8px 8px 0 0":"8px",border:"1px solid "+node.color+"44",background:showDeep?node.color+"18":"transparent",color:node.color,fontSize:12,marginBottom:0}}>
              {showDeep?"Hide Inner Teaching":"Learn Deeper — Inner Dimension"}
            </Btn>
            {showDeep&&<div style={{background:"#0A0A14",border:"1px solid "+node.color+"33",borderTop:"none",borderRadius:"0 0 8px 8px",padding:"12px 14px"}}>
              <div style={{fontSize:13,lineHeight:1.9,color:"#B0A888",whiteSpace:"pre-line"}}>{node.deep}</div>
            </div>}
          </>}
        </div>
      </div>}
    </div>
  );
}

export default function App(){
  const todayOmer=getTodayOmer();
  const [day,setDay]=useState(todayOmer||1);
  const [showGrid,setShowGrid]=useState(false);
  const [showLeshon,setShowLeshon]=useState(false);
  const [showBracha,setShowBracha]=useState(false);
  const [showMore,setShowMore]=useState(false);
  const wi=Math.floor((day-1)/7),di=(day-1)%7;
  const week=SEFIROT[wi],inner=SEFIROT[di],c=week.color,dd=D[day-1];
  const dateStr=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});

  return (
    <div style={{minHeight:"100vh",background:"#0C0C14",color:"#F0E8D8",fontFamily:"Georgia,serif"}}>
      <div style={{position:"sticky",top:0,zIndex:100,background:"#0C0C14",borderBottom:"1px solid "+c+"33"}}>
        <div style={{background:"#10101E",padding:"10px 14px",textAlign:"center"}}>
          <div style={{fontSize:18,color:c,direction:"rtl"}}>סְפִירַת הָעוֹמֶר</div>
          <div style={{fontSize:10,color:"#555",marginTop:1}}>{dateStr}</div>
        </div>
        <div style={{padding:"7px 14px",display:"flex",alignItems:"center",gap:8,background:"#0E0E1A"}}>
          <Btn onClick={()=>setShowGrid(v=>!v)} style={{padding:"5px 10px",borderRadius:20,border:"1px solid "+c+"44",background:showGrid?c+"22":"transparent",color:c,fontSize:11}}>
            {showGrid?"Hide":"All Days"}
          </Btn>
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
            <Btn onClick={()=>setDay(v=>Math.max(1,v-1))} disabled={day===1} style={{width:28,height:28,borderRadius:"50%",border:"1px solid "+(day===1?"#222":c+"66"),background:"transparent",color:day===1?"#333":c,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>&lsaquo;</Btn>
            <div style={{textAlign:"center"}}><div style={{color:c,fontWeight:"bold",fontSize:16,lineHeight:1.2}}>Day {day}</div><div style={{color:"#555",fontSize:10,marginTop:2}}>of 49</div></div>
            <Btn onClick={()=>setDay(v=>Math.min(49,v+1))} disabled={day===49} style={{width:28,height:28,borderRadius:"50%",border:"1px solid "+(day===49?"#222":c+"66"),background:"transparent",color:day===49?"#333":c,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>&rsaquo;</Btn>
          </div>
          <Btn onClick={()=>todayOmer&&setDay(todayOmer)} disabled={!todayOmer||day===todayOmer} style={{padding:"5px 10px",borderRadius:20,border:"1px solid "+(!todayOmer||day===todayOmer?"#333":c+"44"),background:(!todayOmer||day===todayOmer)?"transparent":c+"22",color:(!todayOmer||day===todayOmer)?"#444":c,fontSize:11}}>Today</Btn>
        </div>
        {showGrid&&<div style={{padding:"10px 12px 12px",background:"#0A0A12",borderTop:"1px solid #1A1A28",display:"flex",flexWrap:"wrap",gap:5}}>
          {Array.from({length:49},(_,i)=>{const w=SEFIROT[Math.floor(i/7)],sel=day===i+1,tod=todayOmer===i+1;
            return <Btn key={i} onClick={()=>{setDay(i+1);setShowGrid(false);}} style={{width:30,height:30,borderRadius:"50%",border:"2px solid "+(sel?w.color:tod?w.color+"88":"rgba(255,255,255,0.07)"),background:sel?w.color+"33":tod?w.color+"15":"transparent",color:sel?w.color:tod?w.color+"99":"#444",fontSize:10,fontWeight:sel||tod?"bold":"normal"}}>{i+1}</Btn>;
          })}
        </div>}
      </div>

      <div style={{padding:"20px 14px 60px"}}>
        <div style={{fontSize:11,letterSpacing:3,color:c,textTransform:"uppercase",marginBottom:12,textAlign:"center"}}>✦ Sefirat HaOmer</div>

        <Block label="הֲכָנָה — Preparation" color="#6666AA">
          <div style={{fontSize:15,lineHeight:2.6,color:"#C0B8D0",direction:"rtl",textAlign:"center"}}>
            לְשֵׁם יִחוּד קוּדְשָׁא בְּרִיךְ הוּא וּשְׁכִינְתֵּיהּ, בִּדְחִילוּ וּרְחִימוּ,<br/>
            לְיַחֵד שֵׁם י״ה בו״ה בְּיִחוּדָא שְׁלִים בְּשֵׁם כָּל יִשְׂרָאֵל.<br/>
            הִנְנִי מוּכָן וּמְזֻמָּן לְקַיֵּם מִצְוַת עֲשֵׂה שֶׁל סְפִירַת הָעֹמֶר<br/>
            כְּמוֹ שֶׁכָּתוּב בַּתּוֹרָה:
          </div>
          {showLeshon&&<div style={{fontSize:15,lineHeight:2.6,color:"#C0B8D0",direction:"rtl",textAlign:"center",marginTop:8}}>
            וּסְפַרְתֶּם לָכֶם מִמָּחֳרַת הַשַּׁבָּת מִיּוֹם הֲבִיאֲכֶם<br/>
            אֶת עֹמֶר הַתְּנוּפָה שֶׁבַע שַׁבָּתוֹת תְּמִימֹת תִּהְיֶינָה:<br/>
            עַד מִמָּחֳרַת הַשַּׁבָּת הַשְּׁבִיעִת תִּסְפְּרוּ חֲמִשִּׁים יוֹם<br/>
            וְהִקְרַבְתֶּם מִנְחָה חֲדָשָׁה לַה׳:<br/><br/>
            וִיהִי נֹעַם ה׳ אֱלֹהֵינוּ עָלֵינוּ<br/>
            וּמַעֲשֵׂה יָדֵינוּ כּוֹנְנָה עָלֵינוּ וּמַעֲשֵׂה יָדֵינוּ כּוֹנְנֵהוּ:
          </div>}
          <div style={{textAlign:"center",marginTop:12}}>
            <Btn onClick={()=>setShowLeshon(v=>!v)} style={{background:"transparent",border:"1px solid #6666AA66",borderRadius:"50%",width:32,height:32,color:"#8888BB",fontSize:16,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>{showLeshon?"↑":"↓"}</Btn>
          </div>
        </Block>

        <Btn onClick={()=>setShowBracha(v=>!v)} style={{width:"100%",padding:"11px",borderRadius:showBracha?"10px 10px 0 0":"10px",border:"1px solid "+c+"44",background:showBracha?c+"18":"transparent",color:c,fontSize:13}}>
          {showBracha?"Hide Bracha":"Show Bracha — בְּרָכָה"}
        </Btn>
        {showBracha&&<div style={{background:"#100E08",border:"1px solid "+c+"44",borderTop:"none",borderRadius:"0 0 10px 10px",padding:"18px 14px",marginBottom:0}}>
          <div style={{fontSize:18,lineHeight:2.6,color:"#E8D8A0",direction:"rtl",textAlign:"center"}}>
            בָּרוּךְ אַתָּה ה׳ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם,<br/>
            אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ עַל סְפִירַת הָעֹמֶר.
          </div>
        </div>}

        <div style={{background:c+"12",border:"2px solid "+c+"55",borderRadius:14,padding:"22px 16px",textAlign:"center",marginTop:14,marginBottom:14}}>
          <div style={{fontSize:10,letterSpacing:2,color:c,marginBottom:10,textTransform:"uppercase"}}>Today's Count</div>
          <div style={{fontSize:26,lineHeight:2.4,color:"#F5EDD6",direction:"rtl"}}>{omerCount(day)}</div>
        </div>

        <div style={{background:"#0F0F1A",border:"1px solid #252535",borderRadius:12,padding:"16px 14px",marginBottom:14,direction:"rtl",textAlign:"center"}}>
          <div style={{fontSize:17,lineHeight:2.4,color:"#C8C0A0"}}>הָרַחֲמָן הוּא יַחֲזִיר לָנוּ עֲבוֹדַת בֵּית הַמִּקְדָּשׁ לִמְקוֹמָהּ, בִּמְהֵרָה בְיָמֵינוּ אָמֵן סֶלָה.</div>
        </div>

        <Btn onClick={()=>setShowMore(v=>!v)} style={{width:"100%",padding:"11px",borderRadius:showMore?"10px 10px 0 0":"10px",border:"1px solid #4A4A5A",background:showMore?"#14141E":"transparent",color:"#AAA",fontSize:12}}>
          {showMore?"Hide Additional Prayers":"Additional Prayers — מִזְמוֹר שִׁיר · אָנָּא בְּכֹחַ · רִבּוֹנוֹ שֶׁל עוֹלָם"}
        </Btn>
        {showMore&&<div style={{background:"#0E0E18",border:"1px solid #4A4A5A",borderTop:"none",borderRadius:"0 0 10px 10px",padding:"18px 14px",marginBottom:0}}>
          <div style={{fontSize:10,letterSpacing:2,color:"#6666AA",textTransform:"uppercase",marginBottom:8,textAlign:"center"}}>מִזְמוֹר שִׁיר — תְּהִלִּים סז</div>
          <div style={{fontSize:14,lineHeight:2.5,color:"#B0A890",direction:"rtl",textAlign:"center",marginBottom:24}}>
            לַמְנַצֵּחַ בִּנְגִינוֹת מִזְמוֹר שִׁיר:<br/>
            אֱלֹהִים יְחָנֵּנוּ וִיבָרְכֵנוּ, יָאֵר פָּנָיו אִתָּנוּ סֶלָה:<br/>
            לָדַעַת בָּאָרֶץ דַּרְכֶּךָ, בְּכָל גּוֹיִם יְשׁוּעָתֶךָ:<br/>
            יוֹדוּךָ עַמִּים אֱלֹהִים, יוֹדוּךָ עַמִּים כֻּלָּם:<br/>
            יִשְׂמְחוּ וִירַנְּנוּ לְאֻמִּים, כִּי תִשְׁפֹּט עַמִּים מִישׁוֹר,<br/>
            וּלְאֻמִּים בָּאָרֶץ תַּנְחֵם סֶלָה:<br/>
            יוֹדוּךָ עַמִּים אֱלֹהִים, יוֹדוּךָ עַמִּים כֻּלָּם:<br/>
            אֶרֶץ נָתְנָה יְבוּלָהּ, יְבָרְכֵנוּ אֱלֹהִים אֱלֹהֵינוּ:<br/>
            יְבָרְכֵנוּ אֱלֹהִים, וְיִירְאוּ אֹתוֹ כָּל אַפְסֵי אָרֶץ:
          </div>
          <div style={{fontSize:10,letterSpacing:2,color:"#6666AA",textTransform:"uppercase",marginBottom:8,textAlign:"center"}}>אָנָּא בְּכֹחַ</div>
          <div style={{fontSize:14,lineHeight:2.6,color:"#B0A890",direction:"rtl",textAlign:"center",marginBottom:24}}>
            אָנָּא בְּכֹחַ גְּדֻלַּת יְמִינֶךָ תַּתִּיר צְרוּרָה. <span style={{fontSize:11,color:"#6666AA"}}>(אב״ג ית״ץ)</span><br/>
            קַבֵּל רִנַּת עַמְּךָ שַׂגְּבֵנוּ טַהֲרֵנוּ נוֹרָא. <span style={{fontSize:11,color:"#6666AA"}}>(קר״ע שט״ן)</span><br/>
            נָא גִבּוֹר דּוֹרְשֵׁי יִחוּדֶךָ כְּבָבַת שָׁמְרֵם. <span style={{fontSize:11,color:"#6666AA"}}>(נג״ד יכ״ש)</span><br/>
            בָּרְכֵם טַהֲרֵם רַחֲמֵי צִדְקָתְךָ תָּמִיד גָּמְלֵם. <span style={{fontSize:11,color:"#6666AA"}}>(בט״ר צת״ג)</span><br/>
            חָסִין קָדוֹשׁ בְּרֹב טוּבְךָ נַהֵל עֲדָתֶךָ. <span style={{fontSize:11,color:"#6666AA"}}>(חק״ב טנ״ע)</span><br/>
            יָחִיד גֵּאֶה לְעַמְּךָ פְּנֵה זוֹכְרֵי קְדֻשָּׁתֶךָ. <span style={{fontSize:11,color:"#6666AA"}}>(יג״ל פז״ק)</span><br/>
            שַׁוְעָתֵנוּ קַבֵּל וּשְׁמַע צַעֲקָתֵנוּ יוֹדֵעַ תַּעֲלוּמוֹת. <span style={{fontSize:11,color:"#6666AA"}}>(שק״ו צי״ת)</span><br/><br/>
            <span style={{fontSize:12,color:"#888"}}>בלחש:</span> בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד:
          </div>
          <div style={{fontSize:10,letterSpacing:2,color:"#6666AA",textTransform:"uppercase",marginBottom:8,textAlign:"center"}}>רִבּוֹנוֹ שֶׁל עוֹלָם</div>
          <div style={{fontSize:15,lineHeight:2.6,color:"#B0A890",direction:"rtl",textAlign:"center"}}>
            רִבּוֹנוֹ שֶׁל עוֹלָם, אַתָּה צִוִּיתָנוּ עַל יְדֵי מֹשֶׁה עַבְדֶּךָ לִסְפּוֹר סְפִירַת הָעוֹמֶר,<br/>
            כְּדֵי לְטַהֲרֵנוּ מִקְּלִפּוֹתֵינוּ וּמִטֻּמְאוֹתֵינוּ, כְּמוֹ שֶׁכָּתַבְתָּ בְּתוֹרָתֶךָ.<br/>
            וּסְפַרְתֶּם לָכֶם מִמָּחֳרַת הַשַּׁבָּת מִיּוֹם הֲבִיאֲכֶם אֶת־עֹמֶר הַתְּנוּפָה,<br/>
            שֶׁבַע שַׁבָּתוֹת תְּמִימֹת תִּהְיֶינָה. עַד מִמָּחֳרַת הַשַּׁבָּת הַשְּׁבִיעִת תִּסְפְּרוּ חֲמִשִּׁים יוֹם.<br/>
            כְּדֵי שֶׁיִּטָּהֲרוּ נַפְשׁוֹת עַמְּךָ יִשְׂרָאֵל מִזֻּהֲמָתָם.<br/>
            וּבְכֵן יְהִי רָצוֹן מִלְּפָנֶיךָ יְיָ אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ,<br/>
            שֶׁבִּזְכוּת סְפִירַת הָעוֹמֶר שֶׁסָּפַרְתִּי הַיּוֹם,<br/>
            יְתֻקַּן מַה שֶׁפָּגַמְתִּי בִּסְפִירָה
          </div>
          <div style={{fontSize:18,color:c,direction:"rtl",textAlign:"center",margin:"10px 0",lineHeight:2,fontWeight:"bold"}}>
            {inner.heb + " שֶׁבְּ" + week.heb}
          </div>
          <div style={{fontSize:15,lineHeight:2.6,color:"#B0A890",direction:"rtl",textAlign:"center"}}>
            וְאֶטָּהֵר וְאֶתְקַדֵּשׁ בִּקְדֻשָּׁה שֶׁל מַעְלָה,<br/>
            וַעַל יְדֵי זֶה יֻשְׁפַּע שֶׁפַע רַב בְּכָל הָעוֹלָמוֹת. וּלְתַקֵּן אֶת נַפְשׁוֹתֵינוּ, וְרוּחוֹתֵינוּ,<br/>
            וְנִשְׁמוֹתֵינוּ, מִכָּל סִיג וּפְגַם, וּלְטַהֲרֵנוּ וּלְקַדְּשֵׁנוּ בִּקְדֻשָּׁתְךָ הָעֶלְיוֹנָה, אָמֵן סֶלָה.
          </div>
        </div>}

        <div style={{height:2,background:"linear-gradient(90deg, transparent, "+c+"55, transparent)",margin:"24px 0 0"}}/>
        <div style={{textAlign:"center",padding:"10px 0 16px",color:"#444",fontSize:12}}>Today's Inner Work</div>

        <div style={{background:c+"12",border:"1px solid "+c+"33",borderRadius:14,padding:"20px 16px",textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Today's Midah</div>
          <div style={{fontSize:32,color:c,marginBottom:6,lineHeight:1.5}}>{inner.heb + " שֶׁבְּ" + week.heb}</div>
          <div style={{fontSize:17,color:"#B0A080",fontStyle:"italic"}}>{inner.name + " within " + week.name}</div>
          <div style={{fontSize:13,color:"#555",marginTop:3}}>{inner.quality + " within " + week.quality}</div>
        </div>

        <div style={{background:"#13131E",border:"1px solid #242438",borderLeft:"4px solid "+c+"55",borderRadius:12,padding:"16px 14px",marginBottom:14}}>
          <div style={{fontSize:10,letterSpacing:2,color:"#6666AA",marginBottom:8,textTransform:"uppercase"}}>Essence</div>
          <div style={{fontSize:14,lineHeight:1.9,color:"#C8C0A0",fontStyle:"italic",whiteSpace:"pre-line"}}>{dd.e}</div>
        </div>

        <DivineDimension week={wi} inner={inner} c={c}/>

        <Block label="הָאוֹר — The Light: When This Midah Is Healthy" color="#4A8C6F">
          <div style={{fontSize:13,color:"#6CAA80",fontStyle:"italic",marginBottom:10}}>You know this midah is working when you can honestly say:</div>
          <Bullets items={dd.li} color="#4A8C6F" icon="✓"/>
        </Block>

        <Block label="הַצֵּל — The Shadow: When It Goes Wrong" color="#8A5A9A">
          <div style={{fontSize:13,color:"#9A7AAA",fontStyle:"italic",marginBottom:10}}>The klipah of this midah looks like:</div>
          <Bullets items={dd.sh} color="#8A5A9A" icon="◆"/>
        </Block>

        <Block label="הָעֲבוֹדָה — The Work: What To Actually Do Today" color={c}>
          <div style={{fontSize:13,color:"#B0A070",fontStyle:"italic",marginBottom:10}}>Concrete actions for today:</div>
          <Bullets items={dd.wo} color={c} icon="→"/>
        </Block>

        <div style={{background:"#0E0E18",border:"1px solid #1E1E30",borderRadius:12,padding:"16px 14px",marginBottom:28}}>
          <div style={{fontSize:10,letterSpacing:2,color:"#6666AA",marginBottom:10,textTransform:"uppercase"}}>
            חֶשְׁבּוֹן הַנֶּפֶשׁ — Sit With This
          </div>
          <div style={{fontSize:14,color:"#A098C0",lineHeight:1.9,fontStyle:"italic"}}>{"\""+dd.p+"\""}</div>
        </div>

        <div style={{height:2,background:"linear-gradient(90deg, transparent, #C8A96E55, transparent)",marginBottom:22}}/>
        <TreeOfLife/>
      </div>
    </div>
  );
}
