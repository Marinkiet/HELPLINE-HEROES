export const gameContent = {
  welcome: {
    en: "Hi there! Welcome to Safe Touch Detective. You'll be the detective today! Click on the 3 green stars to enter and start your safety adventure.",
    af: "Hallo daar! Welkom by Veilige Raak Speurder. Jy gaan vandag die speurder wees! Klik op die 3 groen sterre om in te gaan en jou veiligheidsavontuur te begin.",
    zu: "Sawubona! Wamukelekile ku-Safe Touch Detective. Uzoba umcuphi namuhla! Chofoza izinkanyezi eziluhlaza ezingu-3 ukuze ungene uqale uhambo lwakho lokuphepha."
  },
  
  bodyParts: {
    upperBody: {
      en: "This is your upper body. The covered areas are private parts. Only trusted adults like doctors or parents helping you get dressed should touch these areas.",
      af: "Dit is jou boonste liggaam. Die bedekte areas is private dele. Slegs vertroude volwassenes soos dokters of ouers wat jou help aantrek moet hierdie areas raak.",
      zu: "Lesi yisitho sakho esiphezulu. Izindawo ezimboziwe yizingxenye eziyimfihlo. Kuphela abantu abadala abathembekile njengodokotela noma abazali abakusiza ukugqoka okumele bathinte lezi zindawo."
    },
    lowerBody: {
      en: "This is your lower body. These covered areas are also private parts. Remember, your body belongs to you, and you have the right to say no to unwanted touch.",
      af: "Dit is jou onderste liggaam. Hierdie bedekte areas is ook private dele. Onthou, jou liggaam behoort aan jou, en jy het die reg om nee te sê vir ongewenste aanraking.",
      zu: "Lesi yisitho sakho esiphansi. Lezi zindawo ezimboziwe nazo yizingxenye eziyimfihlo. Khumbula, umzimba wakho ungowakho, futhi unelungelo lokuthi cha ekuthinteni okungafuneki."
    }
  },
  
  trustedAdults: {
    en: "Trusted adults are people who keep you safe and make you feel comfortable. They include your parents, teachers, doctors, and family members who care for you. They will always ask permission and explain why they need to help you.",
    af: "Vertroude volwassenes is mense wat jou veilig hou en jou gemaklik laat voel. Hulle sluit jou ouers, onderwysers, dokters en familielede in wat vir jou omgee. Hulle sal altyd toestemming vra en verduidelik hoekom hulle jou moet help.",
    zu: "Abantu abadala abathembekile ngabantu abakugcina uphephile futhi bakwenza uzizwe ukhululekile. Bahlanganisa abazali bakho, othisha, odokotela, namalungu omndeni akunakekelayo. Bazocela imvume njalo futhi bachaze ukuthi kungani kudingeka bakusize."
  },
  
  scenarios: [
    {
      id: 1,
      en: "Your doctor needs to check your chest during a medical exam, and your parent is in the room. Is this a Good Touch or Bad Touch?",
      af: "Jou dokter moet jou bors ondersoek tydens 'n mediese ondersoek, en jou ouer is in die kamer. Is dit 'n Goeie Raak of Slegte Raak?",
      zu: "Udokotela wakho udinga ukuhlola isifuba sakho ngesikhathi sokuhlolwa kwezempilo, futhi umzali wakho usekamelweni. Lokhu kuyikuthinta okuhle noma okubi?",
      correctAnswer: 'good',
      explanation: {
        en: "This is a Good Touch because it's a medical exam with a trusted adult (doctor) and your parent is present.",
        af: "Dit is 'n Goeie Raak omdat dit 'n mediese ondersoek is met 'n vertroude volwassene (dokter) en jou ouer is teenwoordig.",
        zu: "Lokhu kuyikuthinta okuhle ngoba kuyisihlolelo sezempilo nodokotela othembekile futhi umzali wakho ukhona."
      }
    },
    {
      id: 2,
      en: "A stranger offers you candy and asks you to come with them to their car. They want to touch you. Is this a Good Touch or Bad Touch?",
      af: "'n Vreemdeling bied jou lekkers aan en vra jou om saam met hulle na hul motor te kom. Hulle wil jou raak. Is dit 'n Goeie Raak of Slegte Raak?",
      zu: "Umuntu ongamaziyo akupha amaswidi futhi akucela ukuthi uhambe naye emotoyweni yakhe. Ufuna ukukuthinta. Lokhu kuyikuthinta okuhle noma okubi?",
      correctAnswer: 'bad',
      explanation: {
        en: "This is a Bad Touch. Never go with strangers or let them touch you. Tell a trusted adult immediately.",
        af: "Dit is 'n Slegte Raak. Moenie ooit saam met vreemdelinge gaan of hulle toelaat om jou te raak nie. Vertel dadelik 'n vertroude volwassene.",
        zu: "Lokhu kuyikuthinta okubi. Ungahambi nabantu ongabaziyo noma ubavumele ukukuthinta. Tshela umuntu omdala othembekile ngokushesha."
      }
    },
    {
      id: 3,
      en: "Your parent helps you take a bath because you're still learning. Is this a Good Touch or Bad Touch?",
      af: "Jou ouer help jou om te bad omdat jy nog leer. Is dit 'n Goeie Raak of Slegte Raak?",
      zu: "Umzali wakho akusize ukugeza ngoba usafunda. Lokhu kuyikuthinta okuhle noma okubi?",
      correctAnswer: 'good',
      explanation: {
        en: "This is a Good Touch because your parent is a trusted adult helping you with necessary care.",
        af: "Dit is 'n Goeie Raak omdat jou ouer 'n vertroude volwassene is wat jou help met nodige sorg.",
        zu: "Lokhu kuyikuthinta okuhle ngoba umzali wakho ungumuntu omdala othembekile okusiza ngokunakekelwa okudingekayo."
      }
    }
  ],
  
  feedback: {
    correct: {
      en: "Great job, detective! You're learning to keep yourself safe!",
      af: "Goed gedaan, speurder! Jy leer om jouself veilig te hou!",
      zu: "Umsebenzi omuhle, mcuphi! Uyafunda ukuzigcina uphephile!"
    },
    incorrect: {
      en: "Let's think about this again. Remember what we learned about trusted adults and private parts.",
      af: "Kom ons dink weer hieroor. Onthou wat ons geleer het oor vertroude volwassenes en private dele.",
      zu: "Ake sicabange futhi ngalokhu. Khumbula lokho esikufundile ngabantu abadala abathembekile nezingxenye eziyimfihlo."
    }
  }
};