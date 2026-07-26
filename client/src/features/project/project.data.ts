import type { Project } from "./project.type";

export const projects: Project[] = [
  {
    slug: "aurora-crm",
    title: "Aurora CRM",
    date: { month: 3, year: 2026 },
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Redis", "Tailwind"],
    role: ["Fullstack Developer", "UI Designer"],
    gallery: [
      "/images/makon/gallery/glr1.png",
      "/images/makon/gallery/glr2.png",
      "/images/makon/gallery/glr3.png",
      "/images/makon/cover.png",
    ],
    githubUrl: "https://github.com/hikmatillo/aurora-crm",
    liveUrl: "https://aurora-crm.vercel.app",
    content: {
      uz: {
        description:
          "Turli shaharlarga tarqalgan sotuv jamoalari uchun B2B CRM platformasi — pipeline, bitimlar va hisobotlar bitta ish maydonida.",
        problem:
          "Mijozning sotuv bo'limi uch shaharga tarqalgan edi va har bir jamoa o'z Excel faylida ishlar edi. Bitimlar holati kunda bir marta qo'lda birlashtirilardi, natijada rahbariyat hech qachon real vaqtdagi manzarani ko'rmasdi va bir xil mijozga ikki menejer bir vaqtda qo'ng'iroq qilib qolardi.",
        solution:
          "Barcha jamoalar uchun yagona pipeline yaratdim: bitimlar drag-and-drop bilan bosqichdan bosqichga o'tadi, har bir o'zgarish real vaqtda barcha ochiq sessiyalarga uzatiladi. Mijoz kartochkasi bitta manba bo'lgani uchun takroriy aloqa avtomatik bloklanadi.",
        myContribution: [
          "Ma'lumotlar bazasi sxemasi va Prisma migratsiyalarini noldan loyihalash",
          "Rol asosidagi ruxsatlar tizimi (menejer / team lead / direktor)",
          "Server Components asosida pipeline sahifasi va optimistik UI",
          "Redis orqali real vaqtdagi yangilanishlar va sessiya keshi",
          "Dizayn tizimi: ranglar, tipografika va komponentlar kutubxonasi",
        ],
        challenge:
          "Eng og'ir qismi — bir bitimni ikki menejer bir vaqtda tahrirlashi edi. Oddiy \"oxirgi yozgan yutadi\" yondashuvi ma'lumotni yo'qotardi. Versiya raqami asosidagi optimistik qulflash joriy qildim: konflikt yuz berganda foydalanuvchiga ikkala versiya ko'rsatiladi va u qaysi birini saqlashni tanlaydi.",
        result: [
          "Hisobot tayyorlash vaqti 6 soatdan 4 daqiqagacha qisqardi",
          "Takroriy mijoz aloqalari deyarli butunlay yo'qoldi",
          "Uch oy ichida 40 dan ortiq faol foydalanuvchi tizimga o'tdi",
          "Bitimlarning o'rtacha yopilish sikli 18% ga tezlashdi",
        ],
      },
      en: {
        description:
          "B2B CRM platform for distributed sales teams — pipeline, deals and reporting in one workspace.",
        problem:
          "The client's sales department was spread across three cities, and every team worked in its own Excel file. Deal status was merged by hand once a day, so management never saw a real-time picture and two reps would sometimes call the same customer on the same morning.",
        solution:
          "I built a single shared pipeline for all teams: deals move between stages via drag-and-drop, and every change is pushed to all open sessions in real time. Because the customer record is a single source of truth, duplicate outreach is blocked automatically.",
        myContribution: [
          "Designed the database schema and Prisma migrations from scratch",
          "Role-based permission system (rep / team lead / director)",
          "Pipeline page built on Server Components with optimistic UI",
          "Real-time updates and session caching through Redis",
          "Design system: color, typography and the component library",
        ],
        challenge:
          "The hardest part was two reps editing the same deal simultaneously. A naive last-write-wins approach silently destroyed data. I introduced optimistic locking based on a version number: on conflict the user is shown both versions and chooses which one to keep.",
        result: [
          "Report preparation dropped from 6 hours to 4 minutes",
          "Duplicate customer outreach was virtually eliminated",
          "Over 40 active users migrated to the system within three months",
          "Average deal closing cycle got 18% faster",
        ],
      },
    },
  },

  {
    slug: "bozor-api",
    title: "Bozor API",
    date: { month: 11, year: 2025 },
    techStack: ["Go", "PostgreSQL", "Redis", "Docker", "gRPC", "RabbitMQ"],
    role: ["Backend Developer", "DevOps"],
    gallery: [
      "/projects/bozor-api/01.png",
      "/projects/bozor-api/02.png",
      "/projects/bozor-api/03.png",
    ],
    githubUrl: "https://github.com/hikmatillo/bozor-api",
    content: {
      uz: {
        description:
          "Kuniga 12 ming buyurtmani ko'taradigan marketplace backendi — katalog, buyurtma va to'lovlar uchun yuqori o'tkazuvchanlikdagi tizim.",
        problem:
          "Mavjud monolit PHP backend har kuni soat 19:00 dagi eng yuqori yuklamada javob bermay qolardi. Katalog so'rovlari 4 soniyagacha cho'zilar, to'lov jarayoni esa tez-tez yarim yo'lda uzilib, buyurtma yaratilgan-u to'lov o'tmagan holatlar paydo bo'lardi.",
        solution:
          "Backendni Go'da qayta yozdim va uni katalog, buyurtma hamda to'lov servislariga ajratdim. Servislar o'zaro gRPC orqali gaplashadi, to'lov esa RabbitMQ navbati orqali idempotent tarzda qayta ishlanadi — ya'ni bir so'rov necha marta takrorlansa ham pul bir marta yechiladi.",
        myContribution: [
          "Uchta mikroservisning arxitekturasi va gRPC kontraktlari",
          "PostgreSQL indekslarini qayta ko'rib chiqish va so'rovlarni optimallashtirish",
          "Idempotent to'lov oqimi va outbox pattern joriy etish",
          "Docker Compose hamda CI/CD quvuri sozlash",
          "Yuklama testlari va monitoring dashboardlari",
        ],
        challenge:
          "To'lov provayderi ba'zan bitta so'rovga ikki marta javob qaytarardi. Buni transaksiya darajasida hal qilish yetarli emas edi, chunki takroriy javob soatlar keyin ham kelishi mumkin. Har bir to'lov uchun unikal kalit saqlaydigan outbox jadvali qurdim — takroriy hodisa kelganda u shunchaki e'tiborsiz qoldiriladi.",
        result: [
          "Katalog so'rovining p95 javob vaqti 4.1s dan 180ms gacha tushdi",
          "Eng yuqori yuklamada ham xatolik darajasi 0.1% dan past",
          "Yo'qolgan to'lovlar bo'yicha shikoyatlar butunlay to'xtadi",
          "Server xarajatlari oyiga taxminan 35% ga kamaydi",
        ],
      },
      en: {
        description:
          "High-throughput marketplace backend handling catalog, checkout and settlement for 12k daily orders.",
        problem:
          "The existing PHP monolith fell over every evening during the 7pm traffic peak. Catalog queries stretched to 4 seconds, and checkout frequently broke halfway through, leaving orders that existed but were never paid for.",
        solution:
          "I rewrote the backend in Go and split it into catalog, order and payment services. The services talk over gRPC, while payments are processed idempotently through a RabbitMQ queue — so no matter how many times a request repeats, the customer is charged exactly once.",
        myContribution: [
          "Architecture of the three microservices and their gRPC contracts",
          "Reworked PostgreSQL indexes and optimized hot queries",
          "Idempotent payment flow implemented with the outbox pattern",
          "Docker Compose setup and the CI/CD pipeline",
          "Load testing and monitoring dashboards",
        ],
        challenge:
          "The payment provider occasionally sent two callbacks for a single request. Solving it at the transaction level wasn't enough, because a duplicate could arrive hours later. I built an outbox table storing a unique key per payment, so any repeated event is simply ignored.",
        result: [
          "p95 catalog response time fell from 4.1s to 180ms",
          "Error rate stayed below 0.1% even at peak load",
          "Complaints about lost payments stopped completely",
          "Monthly server costs dropped by roughly 35%",
        ],
      },
    },
  },

  {
    slug: "qadam",
    title: "Qadam",
    date: { month: 6, year: 2025 },
    techStack: ["React", "TypeScript", "Node", "PostgreSQL", "Tailwind"],
    role: ["Fullstack Developer"],
    gallery: [
      "/projects/qadam/01.png",
      "/projects/qadam/02.png",
      "/projects/qadam/03.png",
      "/projects/qadam/04.png",
      "/projects/qadam/05.png",
    ],
    githubUrl: "https://github.com/hikmatillo/qadam",
    liveUrl: "https://qadam.app",
    content: {
      uz: {
        description:
          "Odat kuzatuvchi ilova — seriyalar, yumshoq eslatmalar va internetsiz ham ishlaydigan kunlik jurnal.",
        problem:
          "Odat kuzatuvchi ilovalarning aksariyati foydalanuvchini bir kun o'tkazib yuborgani uchun \"jazolaydi\" — seriya nolga tushadi va motivatsiya yo'qoladi. Bundan tashqari ularning barchasi internetga bog'liq, holbuki odat belgilash ko'pincha metroda yoki yotoqda, aloqa yo'q joyda sodir bo'ladi.",
        solution:
          "Seriya mantiqini yumshoq qildim: haftasiga bir kun \"kechirim\" beriladi va seriya saqlanadi. Ilova offline-first ishlaydi — barcha belgilashlar avval qurilmada saqlanadi, aloqa tiklanganda esa fon rejimida serverga sinxronlanadi.",
        myContribution: [
          "Offline-first sinxronizatsiya qatlami va konflikt yechish mantiqi",
          "Seriya (streak) hisoblash algoritmi va vaqt mintaqasi bilan ishlash",
          "Node/Express asosidagi REST API va autentifikatsiya",
          "Butun interfeys dizayni va animatsiyalari",
          "PWA sozlamalari va push bildirishnomalar",
        ],
        challenge:
          "Vaqt mintaqasi eng nozik joy bo'ldi. Foydalanuvchi Toshkentda soat 23:50 da odatni belgilasa, server UTC bo'yicha buni ertangi kun deb hisoblardi va seriya uzilardi. Barcha sanalarni foydalanuvchining mahalliy kunlik chegarasiga bog'lab qayta yozdim, server esa faqat xom timestamp va mintaqani saqlaydi.",
        result: [
          "Foydalanuvchilarning 30 kunlik ushlab qolish darajasi 22% dan 51% gacha ko'tarildi",
          "Belgilashlarning taxminan 40% offline holatda amalga oshiriladi",
          "App Store'da 4.7 reyting va 600 dan ortiq baholash",
          "Sinxronizatsiya bilan bog'liq xato hisobotlari nolga tushdi",
        ],
      },
      en: {
        description:
          "Habit tracking app built around streaks, gentle reminders and an offline-first daily log.",
        problem:
          "Most habit trackers punish you for missing a single day — the streak resets to zero and motivation collapses with it. On top of that they all assume connectivity, while habits are usually logged on the metro or in bed, exactly where there's no signal.",
        solution:
          "I made the streak logic forgiving: one \"grace day\" per week keeps the streak alive. The app is offline-first — every check-in is written to the device immediately and synced to the server in the background once connectivity returns.",
        myContribution: [
          "Offline-first sync layer and conflict resolution logic",
          "Streak calculation algorithm and timezone handling",
          "REST API and authentication on Node/Express",
          "The entire interface design and its animations",
          "PWA configuration and push notifications",
        ],
        challenge:
          "Timezones turned out to be the sharpest edge. If a user checked in at 23:50 in Tashkent, the server counted it as the next day in UTC and broke the streak. I rewrote every date to anchor on the user's local day boundary, with the server storing only the raw timestamp and zone.",
        result: [
          "30-day retention rose from 22% to 51%",
          "Roughly 40% of all check-ins now happen offline",
          "4.7 rating on the App Store across 600+ reviews",
          "Sync-related bug reports dropped to zero",
        ],
      },
    },
  },

  {
    slug: "sahifa-cms",
    title: "Sahifa CMS",
    date: { month: 9, year: 2024 },
    techStack: ["Next.js", "TypeScript", "GraphQL", "PostgreSQL", "Docker"],
    role: ["Fullstack Developer", "Technical Lead"],
    gallery: [
      "/projects/sahifa-cms/01.png",
      "/projects/sahifa-cms/02.png",
      "/projects/sahifa-cms/03.png",
    ],
    liveUrl: "https://sahifa-demo.vercel.app",
    content: {
      uz: {
        description:
          "Mintaqaviy yangiliklar tahririyati uchun headless nashr platformasi — rejalashtirilgan chiqishlar va muharrir rollari bilan.",
        problem:
          "Tahririyat WordPress'da ishlardi, lekin ular uchun ikki tilli maqola tayyorlash azob edi: har bir til alohida post sifatida yaratilar, ular o'zaro bog'lanmasdi va bittasi tahrirlanganda ikkinchisi eskirib qolardi. Nashr jadvali esa umuman yo'q edi — muharrir tunda uyg'onib qo'lda \"publish\" bosardi.",
        solution:
          "Maqolani yagona obyekt sifatida modellashtirdim, tillar esa uning versiyalari bo'ldi — bittasini ochganda ikkinchisining holati ham ko'rinadi. Rejalashtirilgan nashr uchun navbat tizimi qurdim, GraphQL API esa frontendga faqat kerakli maydonlarni beradi.",
        myContribution: [
          "Kontent modeli va ko'p tilli versiyalash arxitekturasi",
          "GraphQL sxemasi, resolverlar va ruxsatlar qatlami",
          "Rejalashtirilgan nashr uchun navbat va cron tizimi",
          "Muharrir uchun WYSIWYG redaktor integratsiyasi",
          "Ikki kichik dasturchiga texnik yo'l-yo'riq va code review",
        ],
        challenge:
          "Rejalashtirilgan nashrlar dastlab oddiy cron bilan qilingandi, lekin server qayta ishga tushganda navbatdagi maqolalar o'tkazib yuborilardi. Buni ma'lumotlar bazasidagi holat mashinasi bilan almashtirdim: har bir maqola \"scheduled\" holatida turadi va vorker uni har daqiqada tekshiradi, shuning uchun to'xtash ham nashrni yo'qotmaydi.",
        result: [
          "Ikki tilli maqola tayyorlash vaqti ikki baravar qisqardi",
          "Nashr jadvali bo'yicha o'tkazib yuborilgan post qolmadi",
          "Sahifa yuklanish tezligi Lighthouse'da 62 dan 96 ballga chiqdi",
          "Tahririyat oyiga o'rtacha 180 ta materialni muammosiz chiqarmoqda",
        ],
      },
      en: {
        description:
          "Headless publishing platform for a regional news desk, with scheduled releases and editorial roles.",
        problem:
          "The newsroom ran on WordPress, but producing bilingual articles was painful: each language lived as a separate post, the two were never linked, and editing one silently left the other stale. There was no publishing schedule at all — an editor would wake up at night to press publish by hand.",
        solution:
          "I modeled an article as a single entity with languages as its versions, so opening one always shows the state of the other. I built a queue for scheduled releases, and a GraphQL API that hands the frontend only the fields it actually needs.",
        myContribution: [
          "Content model and the multilingual versioning architecture",
          "GraphQL schema, resolvers and the permission layer",
          "Queue and cron system for scheduled publishing",
          "WYSIWYG editor integration for the newsroom",
          "Technical guidance and code review for two junior developers",
        ],
        challenge:
          "Scheduled publishing was first done with a plain cron job, but any server restart caused queued articles to be skipped entirely. I replaced it with a state machine in the database: each article sits in a \"scheduled\" state and a worker sweeps it every minute, so downtime can no longer lose a release.",
        result: [
          "Time to produce a bilingual article was cut in half",
          "Not a single scheduled post has been missed since launch",
          "Lighthouse performance went from 62 to 96",
          "The desk now ships around 180 pieces per month without friction",
        ],
      },
    },
  },

  {
    slug: "nuqta-analytics",
    title: "Nuqta Analytics",
    date: { month: 2, year: 2024 },
    techStack: ["React", "TypeScript", "Node", "Redis", "PostgreSQL", "Docker"],
    role: ["Frontend Developer", "Data Visualization"],
    gallery: [
      "/projects/nuqta-analytics/01.png",
      "/projects/nuqta-analytics/02.png",
      "/projects/nuqta-analytics/03.png",
      "/projects/nuqta-analytics/04.png",
    ],
    githubUrl: "https://github.com/hikmatillo/nuqta-analytics",
    content: {
      uz: {
        description:
          "Maxfiylikni birinchi o'ringa qo'yadigan veb-analitika paneli — cookie yo'q, shaxsiy ma'lumot yo'q, jonli grafiklar bir soniyadan tez.",
        problem:
          "Kichik biznes egalari Google Analytics'ni o'rnatib qo'yishardi-yu, undan hech narsa tushunishmasdi: o'nlab hisobotlar, tushunarsiz atamalar va cookie roziligi haqidagi doimiy tashvish. Ularga kerak bo'lgani atigi uchta savolga javob edi — kim keldi, qayerdan keldi, nima qildi.",
        solution:
          "Faqat shu uchta savolga javob beradigan bitta ekranli dashboard qurdim. Hech qanday cookie yoki shaxsiy ma'lumot yig'ilmaydi — hisoblash server tomonida anonim imzo orqali amalga oshiriladi. Grafiklar jonli, ya'ni tashrifchi sahifani ochishi bilan raqam o'zgaradi.",
        myContribution: [
          "Butun dashboard interfeysi va grafiklar tizimi",
          "SVG asosidagi maxsus chart komponentlari (tashqi kutubxonasiz)",
          "WebSocket orqali jonli ma'lumot oqimi va throttling",
          "Katta ma'lumot to'plamlari uchun virtual ro'yxat",
          "Rang va tipografika tizimi, qorong'i rejim",
        ],
        challenge:
          "Jonli grafiklar sekundiga yuzlab hodisa kelganda brauzerni butunlay muzlatib qo'yardi. Har bir hodisada qayta render qilish o'rniga, ularni 250ms oynalarga yig'ib, faqat bitta yangilanish yuboradigan bufer qatlamini yozdim va chartlarni React render siklidan tashqarida, to'g'ridan-to'g'ri SVG ustida yangiladim.",
        result: [
          "Sekundiga 500 hodisada ham interfeys 60fps da barqaror ishlaydi",
          "Skript hajmi raqobatchilarga nisbatan 12 baravar kichik — 3.4kb",
          "Cookie banneriga ehtiyoj butunlay yo'qoldi",
          "Birinchi yilda 90 dan ortiq sayt tizimga ulandi",
        ],
      },
      en: {
        description:
          "Privacy-first web analytics dashboard — no cookies, no personal data, sub-second live charts.",
        problem:
          "Small business owners would install Google Analytics and then understand nothing in it: dozens of reports, unfamiliar terminology, and a constant worry about cookie consent. All they actually needed was an answer to three questions — who showed up, where from, and what did they do.",
        solution:
          "I built a single-screen dashboard that answers exactly those three questions. No cookies and no personal data are collected — counting happens server-side through an anonymous signature. The charts are live, so the numbers move the moment a visitor opens a page.",
        myContribution: [
          "The entire dashboard interface and charting system",
          "Custom SVG chart components, built without an external library",
          "Live data streaming over WebSocket with throttling",
          "Virtualized lists for large datasets",
          "Color and typography system, plus dark mode",
        ],
        challenge:
          "Live charts froze the browser outright once hundreds of events per second started arriving. Instead of re-rendering on every event, I wrote a buffering layer that batches them into 250ms windows and emits a single update, then drove the charts directly against the SVG outside React's render cycle.",
        result: [
          "The interface holds a steady 60fps even at 500 events per second",
          "Tracking script is 3.4kb — about 12x smaller than competitors",
          "The cookie banner became unnecessary entirely",
          "Over 90 sites were connected in the first year",
        ],
      },
    },
  },
];
