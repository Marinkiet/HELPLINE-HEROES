export interface Game {
  id: string;
  title: Record<'en' | 'af' | 'zu' | 'xh' | 'st' | 'tn' | 'ts' | 've' | 'nr' | 'nso', string>;
  image: string;
  featured?: boolean;
  description: Record<'en' | 'af' | 'zu' | 'xh' | 'st' | 'tn' | 'ts' | 've' | 'nr' | 'nso', string>;
  ageGroup: 'early' | 'middle' | 'teen';
  category: 'recognition' | 'response' | 'reporting' | 'support';
}

export const games: Game[] = [
  {
    id: '1',
    title: {
      en: 'Safe Touch Detective',
      af: 'Veilige Raak Speurder',
      zu: 'Umcuphi Wokuthinta Okuphephile',
      xh: 'Umcuphi Wokuchukumisa Okukhuselekileyo',
      st: 'Mofuputsi oa Tšoaetso e Sireletsehileng',
      tn: 'Mmatlisisi wa Kgoma e e Babalesegileng',
      ts: 'Mufuputsi wa ku Kuma loku Hlayisekeke',
      ve: 'Mufuputsi wa u Khou Amba ha Vhushai',
      nr: 'Umcuphi Wokuthinta Okuphephile',
      nso: 'Mmatlisisi wa Kgoma ye e Šireletšegileng'
    },
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    featured: true,
    description: {
      en: 'Learn about appropriate and inappropriate touch in a safe.',
      af: 'Leer oor gepaste en ongepaste aanraking op \'n veilige.',
      zu: 'Funda ngokuthinta okufanele nokungafanele ngendlela ephephile.',
      xh: 'Funda ngokuchukumisa okufanelekileyo nokungafanelekanga ngendlela ekhuselekileyo.',
      st: 'Ithuta ka tšoaetso e nepahetseng le e sa nepahetseng ka tsela e sireletsehileng.',
      tn: 'Ithuta ka kgoma e e siameng le e e sa siamang ka tsela e e babalesegileng.',
      ts: 'Dyondza hi ku kuma loku faneleke na loku nga faneleki hi ndlela ya vuhlayiseki.',
      ve: 'Gudani nga u khou amba ha vhushai na ha vhusina vhushai nga ndila ya vhushai.',
      nr: 'Funda ngokuthinta okufanele nokungafanele ngendlela ephephile.',
      nso: 'Ithuta ka kgoma ye e nepagetšego le ye e sa nepagetšego ka tsela ye e šireletšegileng.'
    },
    ageGroup: 'early',
    category: 'recognition'
  },
  {
    id: '2',
    title: {
      en: 'Trusted Heroes Circle',
      af: 'Vertroude Helde Kring',
      zu: 'Isiyingi Samaqhawe Athembekile',
      xh: 'Isangqa Samaqhawe Athembekileyo',
      st: 'Selikalikoe sa Liqhawe tse Tšepahalang',
      tn: 'Setlhopha sa Diqhakga tse di Ikanyegang',
      ts: 'Xirhendzevutani xa Tiqhakga leti Tshembhekaka',
      ve: 'Tshirunzi tsha Magwala a Teaho',
      nr: 'Isiyingi Samaqhawe Athembekile',
      nso: 'Selekane sa Magwala a Tšhepegago'
    },
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: {
      en: 'Identify and connect with trusted adults who can help you.',
      af: 'Identifiseer en verbind met vertroude volwassenes wat jou kan help.',
      zu: 'Khomba futhi uxhumane nabantu abadala abathembekile abangakusiza.',
      xh: 'Chonga kwaye unxibelelane nabantu abadala abathembekileyo abanokukunceda.',
      st: 'Tseba \'me u hokahane le batho ba baholo ba tšepahalang ba ka u thusang.',
      tn: 'Lemoga mme o golagane le bagolo ba ba ikanyegang ba ba ka go thusang.',
      ts: 'Vona naswona u hlanganisa na vanhu va vadala lava tshembhekaka lava nga ku pfunaka.',
      ve: 'Divhani nahone ni ṱanganyane na vhathu vhahulwane vho teaho vha nga ni thusaho.',
      nr: 'Khomba futhi uxhumane nabantu abadala abathembekile abangakusiza.',
      nso: 'Lemoga gomme o kgokagane le bagolo ba tšhepegago ba ka go thušago.'
    },
    ageGroup: 'early',
    category: 'support'
  },
  {
    id: '3',
    title: {
      en: 'Brave Voice',
      af: 'Dapper Stem',
      zu: 'Izwi Elinesbindi',
      xh: 'Ilizwi Elinesbindi',
      st: 'Lentsoe le Sebete',
      tn: 'Lentswe le le Pelokgale',
      ts: 'Rito ra Vutshila',
      ve: 'Ipfi ḽa Khongolose',
      nr: 'Izwi Elinesbindi',
      nso: 'Lentšu le le Pelokgale'
    },
    image: 'https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&w=400',
    featured: true,
    description: {
      en: 'Practice finding your voice and speaking up when something feels wrong.',
      af: 'Oefen om jou stem te vind en uit te praat wanneer iets verkeerd voel.',
      zu: 'Zijwayeze ukuthola izwi lakho futhi ukhulume uma into izwakala ingalungile.',
      xh: 'Ziqhelise ukufumana ilizwi lakho kwaye uthethe xa into iziva ingalunganga.',
      st: 'Itloaetse ho fumana lentsoe la hao le ho bua ha ntho e utlwahala e sa nepahala.',
      tn: 'Ikatise go bona lentswe la gago le go bua fa sengwe se utlwala se sa siama.',
      ts: 'Titolovete ku kuma rito ra wena na ku vulavula loko swin\'wana swi vonaka swi nga lulamanga.',
      ve: 'Titolovetseni u wana ipfi ḽaṋu na u amba musi tshithu tshi tshi vhonala tshi si khou ita zwavhuḓi.',
      nr: 'Zijwayeze ukuthola izwi lakho futhi ukhulume uma into izwakala ingalungile.',
      nso: 'Itlwaetše go hwetša lentšu la gago le go bolela ge selo se bonala se sa lokala.'
    },
    ageGroup: 'middle',
    category: 'response'
  },
  {
    id: '4',
    title: {
      en: 'Secret vs. Surprise',
      af: 'Geheim vs. Verrassing',
      zu: 'Imfihlo vs. Isimangaliso',
      xh: 'Imfihlo vs. Isimangaliso',
      st: 'Lekunutu vs. Tšohanyetso',
      tn: 'Sephiri vs. Makatso',
      ts: 'Swifihla vs. Swimangaliso',
      ve: 'Zwiṅwe vs. Zwiṅwe zwa Vhudifhinduleli',
      nr: 'Imfihlo vs. Isimangaliso',
      nso: 'Sephiri vs. Makatšo'
    },
    image: 'https://images.pexels.com/photos/1298684/pexels-photo-1298684.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: {
      en: 'Learn the difference between good surprises and harmful secrets.',
      af: 'Leer die verskil tussen goeie verrassings en skadelike geheime.',
      zu: 'Funda umehluko phakathi kwezimangaliso ezinhle nezimfihlo eziyingozi.',
      xh: 'Funda umahluko phakathi kwezimangaliso ezilungileyo neemfihlo eziyingozi.',
      st: 'Ithuta phapang pakeng tsa litšohanyetso tse molemo le liphiri tse kotsi.',
      tn: 'Ithuta pharologano magareng ga makatso a a molemo le diphiri tse di kotsi.',
      ts: 'Dyondza ku hambana exikarhi ka swimangaliso swa kahle na swifihla leswi nga koteka.',
      ve: 'Gudani phambano vhukati ha zwiṅwe zwa vhudifhinduleli zwa vhuḓi na zwiṅwe zwo ḓowaho.',
      nr: 'Funda umehluko phakathi kwezimangaliso ezinhle nezimfihlo eziyingozi.',
      nso: 'Ithuta phapano magareng ga makatšo a mabotse le diphiri tše di kotsi.'
    },
    ageGroup: 'early',
    category: 'recognition'
  },
  {
    id: '5',
    title: {
      en: 'Body Safety Rules',
      af: 'Liggaamsveiligheidsreëls',
      zu: 'Imithetho Yokuphepha Komzimba',
      xh: 'Imithetho Yokhuseleko Lomzimba',
      st: 'Melao ea Polokeho ea \'Mele',
      tn: 'Melao ya Pabalesego ya Mmele',
      ts: 'Milawu ya Vuhlayiseki bya Miri',
      ve: 'Milayo ya Vhushai ha Muvhili',
      nr: 'Imithetho Yokuphepha Komzimba',
      nso: 'Melao ya Polokego ya Mmele'
    },
    image: 'https://images.pexels.com/photos/1477166/pexels-photo-1477166.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: {
      en: 'Understand important rules about your body and personal boundaries.',
      af: 'Verstaan belangrike reëls oor jou liggaam en persoonlike grense.',
      zu: 'Qonda imithetho ebalulekile ngomzimba wakho nemingcele yakho.',
      xh: 'Qonda imithetho ebalulekileyo ngomzimba wakho nemida yakho.',
      st: 'Utloisisa melao ea bohlokoa mabapi le \'mele oa hao le meeli ea hao.',
      tn: 'Tlhaloganye melao e e botlhokwa ka mmele wa gago le melelwane ya gago.',
      ts: 'Twisisa milawu ya nkoka hi miri wa wena na swipimo swa wena.',
      ve: 'Pfesesani milayo ya ndeme nga ha muvhili waṋu na zwiṅwe zwaṋu.',
      nr: 'Qonda imithetho ebalulekile ngomzimba wakho nemingcele yakho.',
      nso: 'Kwešiša melao ye bohlokwa ka ga mmele wa gago le melelwane ya gago.'
    },
    ageGroup: 'early',
    category: 'recognition'
  },
  {
    id: '6',
    title: {
      en: 'Help a Friend',
      af: 'Help \'n Vriend',
      zu: 'Siza Umngane',
      xh: 'Nceda Umhlobo',
      st: 'Thusa Motsoalle',
      tn: 'Thusa Tsala',
      ts: 'Pfuna Munghana',
      ve: 'Thusani Muṅwali',
      nr: 'Siza Umngane',
      nso: 'Thuša Mogwera'
    },
    image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400',
    featured: true,
    description: {
      en: 'Learn how to help a friend who might be in an unsafe situation.',
      af: 'Leer hoe om \'n vriend te help wat dalk in \'n onveilige situasie is.',
      zu: 'Funda ukuthi ungasiza kanjani umngane ongase abe esimweni esingaphephile.',
      xh: 'Funda indlela yokunceda umhlobo onokuba kwimeko engakhuselekanga.',
      st: 'Ithuta hore na u ka thusa joang motsoalle ea ka bang maemong a sa sireletsehang.',
      tn: 'Ithuta gore o ka thusa jang tsala e e ka nnang mo maemong a a sa babalesegang.',
      ts: 'Dyondza leswaku u nga pfuna njhani munghana loyi a nga va eka xiyimo lexi nga hlayisekangiki.',
      ve: 'Gudani uri ni nga thusa hani muṅwali a nga vha kha tshiimo tshi sa vhushaaho.',
      nr: 'Funda ukuthi ungasiza kanjani umngane ongase abe esimweni esingaphephile.',
      nso: 'Ithuta gore o ka thuša bjang mogwera yo a ka bago mo maemong a a sa šireletšegago.'
    },
    ageGroup: 'middle',
    category: 'support'
  },
  {
    id: '7',
    title: {
      en: 'Online Safety Shield',
      af: 'Aanlyn Veiligheidskerms',
      zu: 'Isihlangu Sokuphepha Ku-inthanethi',
      xh: 'Ikhaka Lokhuseleko Kwi-intanethi',
      st: 'Sesireletsi sa Polokeho Inthaneteng',
      tn: 'Sesireletsi sa Pabalesego mo Mafaratlhatlheng',
      ts: 'Xirhendzevutani xa Vuhlayiseki eka Inthanete',
      ve: 'Tshiṱirelo tsha Vhushai kha Inthanete',
      nr: 'Isihlangu Sokuphepha Ku-inthanethi',
      nso: 'Sesireletši sa Polokego Inthaneteng'
    },
    image: 'https://images.pexels.com/photos/1680247/pexels-photo-1680247.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: {
      en: 'Stay safe online and recognize inappropriate behavior on the internet.',
      af: 'Bly veilig aanlyn en herken ongepaste gedrag op die internet.',
      zu: 'Hlala uphephile ku-inthanethi futhi ubone ukuziphatha okungafanele ku-inthanethi.',
      xh: 'Hlala ukhuselekile kwi-intanethi kwaye uqaphele ukuziphatha okungafanelekanga kwi-intanethi.',
      st: 'Dula u sireletsehile inthaneteng \'me u tsebe boitšoaro bo sa nepahetseng inthaneteng.',
      tn: 'Nna o sireletsegile mo mafaratlhatlheng mme o lemoge maitsholo a a sa siamang mo inthaneteng.',
      ts: 'Tshama u hlayisekile eka inthanete naswona u vona mahanyelo lama nga fanelekangiki eka inthanete.',
      ve: 'Dzulani ni tshi khou pfalwa kha inthanete nahone ni divhe maitele a si khou ita zwavhuḓi kha inthanete.',
      nr: 'Hlala uphephile ku-inthanethi futhi ubone ukuziphatha okungafanele ku-inthanethi.',
      nso: 'Dula o šireletšegile inthaneteng gomme o lemoge boitshwaro bjo bo sa nepagetšego inthaneteng.'
    },
    ageGroup: 'middle',
    category: 'recognition'
  },
  {
    id: '8',
    title: {
      en: 'Emergency Contacts',
      af: 'Noodkontakte',
      zu: 'Oxhumana Nabo Ezimweni Eziphuthumayo',
      xh: 'Abantu Boqhagamshelwano Lwengxaki',
      st: 'Mabitso a Tšohanyetso',
      tn: 'Dikaonafatso tsa Kgogolego',
      ts: 'Vuhlanganisi bya Swiphiqo',
      ve: 'Vhudavhidzani ha Zwiṅwe',
      nr: 'Oxhumana Nabo Ezimweni Eziphuthumayo',
      nso: 'Dikgokagano tša Maemo a Tšhošetšo'
    },
    image: 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: {
      en: 'Learn important phone numbers and how to ask for help.',
      af: 'Leer belangrike telefoonnommers en hoe om hulp te vra.',
      zu: 'Funda izinombolo zocingo ezibalulekile nokuthi ungacela kanjani usizo.',
      xh: 'Funda iinombolo zefowuni ezibalulekileyo nendlela yokucela uncedo.',
      st: 'Ithuta linomoro tsa mohala tse bohlokoa le hore na u ka kopa thuso joang.',
      tn: 'Ithuta dinomoro tsa mogala tse di botlhokwa le gore o ka kopa thuso jang.',
      ts: 'Dyondza tinomboro ta riqingho leti nga bohlokwa na leswaku u nga kombela mpfuno njhani.',
      ve: 'Gudani nomboro dza lutingo dzo tou fhelelaho na uri ni nga ṱoḓa thuso hani.',
      nr: 'Funda izinombolo zocingo ezibalulekile nokuthi ungacela kanjani usizo.',
      nso: 'Ithuta dinomoro tša mogala tše bohlokwa le gore o ka kgopela thušo bjang.'
    },
    ageGroup: 'early',
    category: 'reporting'
  },
  {
    id: '9',
    title: {
      en: 'Feeling Safe at Home',
      af: 'Veilig Voel by die Huis',
      zu: 'Ukuzizwa Uphephile Ekhaya',
      xh: 'Ukuziva Ukhuselekile Ekhaya',
      st: 'Ho ikutloa u Sireletsehile Lapeng',
      tn: 'Go ikutlwa o Sireletsegile Gae',
      ts: 'Ku titwa u Hlayisekile Ekaya',
      ve: 'U pfesesa uri ni a Pfalwa Hayani',
      nr: 'Ukuzizwa Uphephile Ekhaya',
      nso: 'Go ikwa o Šireletšegile Gae'
    },
    image: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: {
      en: 'Understand what a safe home feels like and what to do if it doesn\'t.',
      af: 'Verstaan hoe \'n veilige huis voel en wat om te doen as dit nie so voel nie.',
      zu: 'Qonda ukuthi ikhaya eliphephile lizwakala kanjani nokuthi wenzeni uma lingenjalo.',
      xh: 'Qonda ukuba ikhaya elikhuselekileyo liziva njani kwaye wenze ntoni xa lingenjalo.',
      st: 'Utloisisa hore na lehae le sireletsehileng le utlwahala joang le hore na u ka etsa eng haeba le sa utlwahale jwalo.',
      tn: 'Tlhaloganye gore legae le le babalesegileng le utlwala jang le gore o ka dira eng fa le sa utlwale jalo.',
      ts: 'Twisisa leswaku kaya leri hlayisekeke ri titwa njhani na leswaku u nga endla yini loko ri nga titwa ri njalo.',
      ve: 'Pfesesani uri hayani ha vhushai hu pfesesa hani na uri ni nga ita mini arali hu si pfesese zwenezwo.',
      nr: 'Qonda ukuthi ikhaya eliphephile lizwakala kanjani nokuthi wenzeni uma lingenjalo.',
      nso: 'Kwešiša gore gae le le šireletšegileng le ikwa bjang le gore o ka dira eng ge le sa ikwe bjalo.'
    },
    ageGroup: 'middle',
    category: 'recognition'
  },
  {
    id: '10',
    title: {
      en: 'Bullying Response Team',
      af: 'Boelie Reaksie Span',
      zu: 'Ithimba Lokuphendula Ukuxhaphaza',
      xh: 'Iqela Lokuphendula Ukuxhaphaza',
      st: 'Sehlopha sa ho Arabela Khathatso',
      tn: 'Setlhopha sa go Araba Kgatelelo',
      ts: 'Ntlawa wa ku Hlamula Ku Hlundzukisa',
      ve: 'Tshigwada tsha u Fhindula Vhudifhinduleli',
      nr: 'Ithimba Lokuphendula Ukuxhaphaza',
      nso: 'Sehlopha sa go Araba Kgateletšo'
    },
    image: 'https://images.pexels.com/photos/1679618/pexels-photo-1679618.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: {
      en: 'Learn strategies to handle bullying and when to get help.',
      af: 'Leer strategieë om boelie te hanteer en wanneer om hulp te kry.',
      zu: 'Funda amasu okubhekana nokuxhaphaza nokuthi usizo lufunwa nini.',
      xh: 'Funda amaqhinga okujongana nokuxhaphaza nanini xa kufuneka ufumane uncedo.',
      st: 'Ithuta maano a ho sebetsana le khathatso le hore na u fumane thuso neng.',
      tn: 'Ithuta mekgwa ya go samagana le kgatelelo le gore o bone thuso leng.',
      ts: 'Dyondza maendlelo yo tirhisa ku hlundzukisa na nkarhi lowu u faneleke ku kuma mpfuno.',
      ve: 'Gudani maitele a u shandukisa vhudifhinduleli na tshifhinga tsha u wana thuso.',
      nr: 'Funda amasu okubhekana nokuxhaphaza nokuthi usizo lufunwa nini.',
      nso: 'Ithuta mekgwa ya go šomana le kgateletšo le gore o hwetše thušo neng.'
    },
    ageGroup: 'middle',
    category: 'response'
  },
  {
    id: '11',
    title: {
      en: 'Teen Safety Network',
      af: 'Tiener Veiligheidsnetwerk',
      zu: 'Inethiwekhi Yokuphepha Kwentsha',
      xh: 'Uthungelwano Lokhuseleko Lolutsha',
      st: 'Marang-rang a Polokeho ea Bacha',
      tn: 'Mafaratlhatlha a Pabalesego ya Basha',
      ts: 'Netiweke ya Vuhlayiseki bya Vantshwa',
      ve: 'Netiweke ya Vhushai ha Vhatshena',
      nr: 'Inethiwekhi Yokuphepha Kwentsha',
      nso: 'Netiweke ya Polokego ya Baša'
    },
    image: 'https://images.pexels.com/photos/1556195/pexels-photo-1556195.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: {
      en: 'Navigate complex social situations and peer pressure safely.',
      af: 'Navigeer komplekse sosiale situasies en portuurdruk veilig.',
      zu: 'Zulazula ezimweni zomphakathi eziyinkimbinkimbi nengcindezi yontanga ngokuphepha.',
      xh: 'Khangela iimeko zentlalo ezintsonkothileyo noxinzelelo lontanga ngokukhuselekileyo.',
      st: 'Tsamaea maemong a rarahaneng a sechaba le khatello ea bo-metsoalle ka polokeho.',
      tn: 'Tsamaya mo maemong a a raraaneng a loago le kgateletso ya ditsala ka pabalesego.',
      ts: 'Famba-famba eka swiyimo swa ntshamisano leswi rharhanganeke na ku cincindzeleka ka vanghana hi vuhlayiseki.',
      ve: 'Fambani kha zwithu zwa vhutshilo zwo ralo na u khakhea ha vhaṅwali nga vhushai.',
      nr: 'Zulazula ezimweni zomphakathi eziyinkimbinkimbi nengcindezi yontanga ngokuphepha.',
      nso: 'Sepela mo maemong a a raraganego a leago le kgateletšo ya bagwera ka polokego.'
    },
    ageGroup: 'teen',
    category: 'response'
  },
  {
    id: '12',
    title: {
      en: 'Report It Right',
      af: 'Rapporteer dit Reg',
      zu: 'Kubike Kahle',
      xh: 'Xela Ngendlela Efanelekileyo',
      st: 'E Bege ka Nepo',
      tn: 'E Begele Sentle',
      ts: 'Ku Vika hi Ndlela',
      ve: 'Pfi nga Ndila',
      nr: 'Kubike Kahle',
      nso: 'E Begele ka Nepagalo'
    },
    image: 'https://images.pexels.com/photos/1482477/pexels-photo-1482477.jpeg?auto=compress&cs=tinysrgb&w=400',
    featured: true,
    description: {
      en: 'Learn how and when to report unsafe situations to trusted adults.',
      af: 'Leer hoe en wanneer om onveilige situasies aan vertroude volwassenes te rapporteer.',
      zu: 'Funda ukuthi ubike kanjani nanini izimo ezingaphephile kubantu abadala abathembekile.',
      xh: 'Funda indlela nanini xa uxela iimeko ezingakhuselekanga kubantu abadala abathembekileyo.',
      st: 'Ithuta hore na u ka bega joang le neng maemo a sa sireletsehang ho batho ba baholo ba tšepahalang.',
      tn: 'Ithuta gore o ka begela jang le leng maemo a a sa babalesegang go bagolo ba ba ikanyegang.',
      ts: 'Dyondza leswaku u nga vika njhani na nkarhi lowu swiyimo leswi nga hlayisekangiki eka vanhu va vadala lava tshembhekaka.',
      ve: 'Gudani uri ni nga pfi hani na nini zwithu zwo sa vhushaaho kha vhathu vhahulwane vho teaho.',
      nr: 'Funda ukuthi ubike kanjani nanini izimo ezingaphephile kubantu abadala abathembekile.',
      nso: 'Ithuta gore o ka begela bjang le neng maemo a a sa šireletšegago go bagolo ba tšhepegago.'
    },
    ageGroup: 'middle',
    category: 'reporting'
  }
];

export const helplineNumbers = {
  childline: '116',
  emergency: '911',
  textLine: 'Text HOME to 741741'
};