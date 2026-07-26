# Data structure

Loyihadagi barcha data shakllari. Backend hali yo'q — bu type'lar kelajakdagi API javoblarining shartnomasi, `*.data.ts` esa ularning vaqtinchalik o'rnini bosuvchisi.

## Asosiy qoida — ikki qatlam

Har bir data ikki qatlamga bo'linadi:

- **Tarjimasiz** maydonlar **ildizda** turadi — texnologiya nomlari, sanalar, URL'lar, rasm yo'llari, brend va kompaniya nomlari. Ularni ikki marta yozish xato manbai bo'lardi.
- **Tarjimali** maydonlar `content[locale]` ostida — murojaat `project.content[locale].problem` shaklida.

Yangi maydon qo'shganda avval shu savolni bering: *"bu matn tilga qarab o'zgaradimi?"* — javob "yo'q" bo'lsa ildizga, "ha" bo'lsa `*Content` type'iga.

Backend **ikkala tilni bitta javobda** qaytaradi (`?locale=` emas). Shu sababli til almashganda qayta so'rov ketmaydi va React Query keshi o'zgarmaydi.

`Locale` type'i har bir feature'da alohida e'lon qilingan (`"uz" | "en"`) — feature'lar bir-biridan import qilmasligi uchun.

⚠️ **Ba'zi feature'da `content` qatlami umuman bo'lmaydi.** `contact` shunday: email, username va telefon raqami tilga qarab o'zgarmaydi, demak `Record<Locale, ...>` qo'shish keraksiz murakkablik bo'lardi. Qoida "har doim ikki qatlam" emas — qoida shu: *tarjimali maydon bor bo'lsa, u `content[locale]` ostiga tushadi*.

---

## Project

`src/features/project/project.type.ts` — type'lar
`src/features/project/project.data.ts` — fake data

```ts
export type Locale = "uz" | "en";

export type ProjectContent = {
  description: string;
  problem: string;
  solution: string;
  myContribution: string[];
  challenge: string;
  result: string[];
};

export type Project = {
  // ---- tarjimasiz ----
  slug: string;
  title: string;
  date: { month: number; year: number };
  techStack: string[];
  role: string[];
  gallery: string[];
  githubUrl?: string;
  liveUrl?: string;

  // ---- tarjima bilan ----
  content: Record<Locale, ProjectContent>;
};
```

### Maydonlar

| Maydon | Tip | Izoh |
|---|---|---|
| `slug` | `string` | URL identifikatori (`/work/aurora-crm`). Unikal, kebab-case, o'zgarmasligi kerak. |
| `title` | `string` | Brend nomi — ikkala tilda ham bir xil. |
| `date.month` | `number` | **1–12 raqam**, `"Mart"` emas. Oy nomi UI'da `Intl.DateTimeFormat` orqali locale bo'yicha chiqariladi. |
| `date.year` | `number` | To'liq yil. |
| `techStack` | `string[]` | Nomlar `src/shared/data/marque.data.ts` bilan bir xil yozilsin (`Next.js`, `PostgreSQL`, `Go`...) — keyinchalik filtr qilish uchun. |
| `role` | `string[]` | Loyihadagi rollar. |
| `gallery` | `string[]` | `public/` **ildiz sifatida xizmat qiladi**: `public/images/makon/cover.png` → `"/images/makon/cover.png"`. Yo'lda `/public` **bo'lmasligi kerak**. Alohida `cover` maydoni yo'q — kartochka uchun `gallery[0]`. |
| `githubUrl` | `string?` | **Ixtiyoriy** — yopiq loyihalarda yo'q. |
| `liveUrl` | `string?` | **Ixtiyoriy** — deploy qilinmagan loyihalarda yo'q. Batafsil sahifada `LIVE` belgisi shu maydon borligiga qarab chiqadi. |
| `content` | `Record<Locale, ProjectContent>` | `uz` va `en` — ikkalasi ham majburiy. |

### ProjectContent

| Maydon | Tip | Izoh |
|---|---|---|
| `description` | `string` | Qisqa bir jumla — kartochka va ro'yxat uchun. |
| `problem` | `string` | To'liq paragraf: qanday muammo bor edi. |
| `solution` | `string` | To'liq paragraf: qanday yechildi. |
| `myContribution` | `string[]` | Qisqa bandlar, 4–5 ta. |
| `challenge` | `string` | To'liq paragraf: eng qiyin texnik joy. |
| `result` | `string[]` | Qisqa, o'lchanadigan natijalar. |

### Yangi loyiha qo'shish

1. `projects` massiviga **eng boshiga** qo'shing — massiv sanadan yangidan eskiga qarab tartiblangan, UI'da qo'shimcha sort yo'q.
2. `slug` unikal ekanini tekshiring.
3. `content.uz` va `content.en` ni **ikkalasini ham** to'ldiring — TypeScript birini tashlab ketishga yo'l qo'ymaydi, lekin bo'sh string yozib qo'yishdan saqlaydigan narsa yo'q.
4. Rasmlarni `public/images/<nom>/` ga joylang, `gallery` da esa `/images/...` deb yozing.

### Hozirgi holat

Massivda **5 ta fake loyiha**: `aurora-crm`, `bozor-api`, `qadam`, `sahifa-cms`, `nuqta-analytics`.

Ular ataylab har xil qilingan — UI'ni haqiqiy holatlarda sinash uchun:
- `bozor-api` da faqat `githubUrl`, `sahifa-cms` da faqat `liveUrl`, qolganlarida ikkalasi ham
- `gallery` uzunligi 3 tadan 5 tagacha
- `role` da 1 tadan 2 tagacha element

Rasmlar faqat `aurora-crm` da mavjud (`/images/makon/...`), qolganlarida yo'llar `/projects/<slug>/NN.png` ga ishora qiladi, lekin fayllar yo'q — galereya bo'sh quti bo'lib chiqadi.

---

## Blog

`src/features/blog/blog.type.ts` — type'lar
`src/features/blog/blog.data.ts` — fake data
`src/features/blog/blog.util.ts` — `formatMonthYear()`

```ts
export type Locale = "uz" | "en";

export type BlogTheme =
  | "architecture"
  | "typescript"
  | "postgres"
  | "frontend"
  | "devops";

export type BlogPostContent = {
  title: string;
  post: string;
};

export type BlogPost = {
  // ---- tarjimasiz ----
  slug: string;
  theme: BlogTheme;
  createdAt: string;

  // ---- tarjima bilan ----
  content: Record<Locale, BlogPostContent>;
};
```

### Maydonlar

| Maydon | Tip | Izoh |
|---|---|---|
| `slug` | `string` | URL identifikatori (`/blog/postgres-imkoniyatlari`). Unikal, kebab-case, o'zgarmasligi kerak. |
| `theme` | `BlogTheme` | **Union**, erkin string emas — filtr/tab qo'shish osonlashadi va `"Postgres"` / `"postgres"` chalkashligi bo'lmaydi. Ko'rinadigan yorliq bu yerda emas, `messages/*.json` da (`BlogPage.themes.<theme>`). Yangi mavzu qo'shsangiz **ikkala tilga ham** yorliq yozing, aks holda next-intl xato beradi. |
| `createdAt` | `string` | **ISO** (`"2026-06-18T09:00:00.000Z"`), `Date` obyekti emas — backend JSON qaytaradi va `Date` baribir string bo'lib keladi. UI'da `formatMonthYear()` orqali `IYN 2026` / `JUN 2026` bo'lib chiqadi. |
| `content[locale].title` | `string` | Sarlavha. UI'da har doim `uppercase`. |
| `content[locale].post` | `string` | To'liq matn, **markdown**. Qo'llab-quvvatlanadigan sintaksis `CONTEXT.md` dagi `Markdown` bo'limida. |

⚠️ `formatMonthYear` da `timeZone: "UTC"` majburan berilgan. Usiz server va brauzer vaqt zonasi farq qilganda oy nomi ikki xil chiqib, hydration mismatch beradi.

### Yangi post qo'shish

1. `blogPosts` massiviga **eng boshiga** qo'shing — massiv yangidan eskiga tartiblangan, UI'da qo'shimcha sort yo'q.
2. `slug` unikal ekanini tekshiring.
3. `content.uz` va `content.en` — **ikkalasi ham** to'liq matn bilan.
4. `theme` uchun yorliq `messages/{uz,en}.json` da borligiga ishonch hosil qiling.

### Hozirgi holat

Massivda **5 ta fake post**: `mikroservislarga-shoshilmang`, `typescript-dizayn-vositasi`, `postgres-imkoniyatlari`, `skeleton-emas-kontent`, `bitta-vps-yetadi`. Har birida sarlavha, paragraf, ro'yxat va kod bloklari bor — renderer'ni sinash uchun.

Postlar admin panel yozilgunicha shu faylda qo'lda tahrirlanadi.

---

## About

`src/features/about/about.type.ts` — type'lar
`src/features/about/about.data.ts` — fake data

Bitta `GET /about` javobi uchala bo'limni qaytaradi.

```ts
export type Locale = "uz" | "en";

export type AccentText = {
  before: string;
  accent: string;
  after: string;
};

export type ExperienceContent = { role: string; summary: string };

export type Experience = {
  id: string;
  company: string;
  period: { from: number; to: number | null };
  content: Record<Locale, ExperienceContent>;
};

export type ToolboxGroup = {
  id: string;
  items: string[];
  label: Record<Locale, string>;
};

export type AboutContent = {
  headline: AccentText;
  bio: { primary: AccentText; secondary: string };
};

export type About = {
  content: Record<Locale, AboutContent>;
  experience: Experience[];
  toolbox: ToolboxGroup[];
};
```

### AccentText

Dizaynda matn ichidagi **bitta so'z** kursiv serif va vermilion rangda chiqadi ("engineer who *sweats* the details"). Buni HTML teg (`<accent>`) sifatida saqlab keyin parse qilish o'rniga **strukturaviy** qilingan — backenddan kelgan matnni HTML deb talqin qilish keraksiz xavf.

⚠️ **Bo'shliqlar `before` / `after` ichiga kiritiladi.** Sababi: aksent so'z gap o'rtasida bo'lsa ikki tomonida bo'shliq kerak, gap oxirida bo'lsa (`effortless.`) o'ngida bo'shliq kerak emas. Render qiluvchi komponent (`AccentPhrase`) hech qanday bo'shliq qo'shmaydi.

### Experience

| Maydon | Tip | Izoh |
|---|---|---|
| `id` | `string` | React `key` va kelajakda CRUD identifikatori. |
| `company` | `string` | Kompaniya nomi — tarjimasiz. |
| `period.from` | `number` | Boshlangan yil. |
| `period.to` | `number \| null` | **`null` = hozirgi ish joyi**, UI'da `AboutPage.now` ("Hozir" / "Now") bo'lib chiqadi. |
| `content[locale].role` | `string` | Lavozim. UI'da `role — company` shaklida birlashtiriladi. |
| `content[locale].summary` | `string` | Bir jumlalik izoh. |

Massiv **yangidan eskiga** tartiblangan, UI'da qo'shimcha sort yo'q.

### ToolboxGroup

| Maydon | Tip | Izoh |
|---|---|---|
| `id` | `string` | `frontend` / `backend` / `data` / `infra`. |
| `items` | `string[]` | Texnologiya nomlari — tarjimasiz. |
| `label[locale]` | `string` | Kategoriya sarlavhasi. |

UI'da 4 ustunli quti (`md:grid-cols-4`), ajratgichlar `gap-0.5` + ota fon usuli bilan — guruhlar soni o'zgarsa ham chiziqlar to'g'ri chiqadi.

---

## Contact

`src/features/contact/contact.type.ts` — type'lar
`src/features/contact/contact.data.ts` — fake data
`src/features/contact/contact.util.ts` — `formatPhone()`, `toChannels()`

Bitta `GET /contact` javobi — **butunlay tarjimasiz**, `content` qatlami yo'q.

```ts
export type Contact = {
  email: string;
  github: string;
  linkedin: string;
  telegram: string;
  phoneNumber: string;
};

export type ContactChannelId =
  | "email" | "github" | "linkedin" | "telegram" | "phone";

// Data'dan yasaladi, backenddan kelmaydi
export type ContactChannel = {
  id: ContactChannelId;
  display: string;
  href: string;
};
```

### Maydonlar

| Maydon | Tip | Izoh |
|---|---|---|
| `email` | `string` | To'liq manzil (`hello@hikmatillo.dev`). |
| `github` | `string` | **Faqat username** — `"hikmatillo"`, `@` ham, URL ham emas. |
| `linkedin` | `string` | Faqat username (`in/` prefiksisiz). |
| `telegram` | `string` | Faqat username. |
| `phoneNumber` | `string` | **E.164**: `"+998901234567"` — bo'shliqsiz, qavssiz. |

### Nega username'lar xom saqlanadi

Ko'rinadigan shakl ham, havola ham `contact.util.ts` dagi `toChannels()` da yasaladi:

| id | display | href |
|---|---|---|
| `email` | `hello@hikmatillo.dev` | `mailto:...` |
| `github` | `@hikmatillo` | `https://github.com/hikmatillo` |
| `linkedin` | `in/hikmatillo` | `https://linkedin.com/in/hikmatillo` |
| `telegram` | `@hikmatillo` | `https://t.me/hikmatillo` |
| `phone` | `+998 90 123 45 67` | `tel:+998901234567` |

Platforma URL'i o'zgarsa bitta funksiya tuzatiladi, data'ga tegilmaydi. Telefon ham shunday — data'da xom E.164 turadi (`tel:` shuni talab qiladi), `formatPhone()` esa faqat ko'rsatish uchun bo'shliq qo'yadi. `formatPhone` hozircha **faqat `+998`** raqamlarini formatlaydi, boshqasi xom holicha qaytadi.

### Yorliqlar

`EMAIL`, `TELEFON` kabi yorliqlar data'da **yo'q** — ular `messages/{uz,en}.json` da, `ContactPage.channels.<id>`. Kanal qo'shsangiz `ContactChannelId` ga, `toChannels()` ga va ikkala til fayliga yorliq qo'shish kerak.

---

## Stats

`src/features/stats/stats.data.ts` — statik, API qatlami yo'q.

```ts
export type Stat = {
  value: string;                  // "6+", "40+", "12", "∞" — tarjimasiz
  label: Record<Locale, string>;
};
```

`value` string, number emas — chunki `"6+"` va `"∞"` kabi qiymatlar bor.

---

## Menu

`src/features/menu/menu.data.ts` — nav linklari.

```ts
export const navLinks = {
  uz: [{ label: "Bosh sahifa", href: "/" }, ...],
  en: [{ label: "Home", href: "/" }, ...],
} as const;
```

Bu yerda shakl boshqacha — `navLinks[locale]` butun massivni qaytaradi, ya'ni `href` ikkala tilda takrorlanadi. Sabab: bu eng eski fayl va o'zgartirilmagan. Yangi data yozganda **yuqoridagi ikki qatlamli** shaklga amal qiling.

---

## Marquee

`src/shared/data/marque.data.ts` — `string[]`, bosh sahifadagi harakatlanuvchi qatorning elementlari. Tarjimasiz, hammasi katta harfda yozilgan.
