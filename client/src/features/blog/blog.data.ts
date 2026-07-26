import type { BlogPost } from "./blog.type";

export const blogPosts: BlogPost[] = [
  {
    slug: "mikroservislarga-shoshilmang",
    theme: "architecture",
    createdAt: "2026-06-18T09:00:00.000Z",
    content: {
      uz: {
        title: "Mikroservislarga shoshilmang",
        post: `Har bir yangi loyihada birinchi savol bir xil bo'lib qoldi: "monolit'mi yoki mikroservis?" Aslida bu savol noto'g'ri qo'yilgan.

## Muammo servislar soni emas

Mikroservis arxitekturasi **tashkiliy** muammoni hal qiladi — bir-biriga xalaqit beradigan bir nechta jamoa. Agar sizda bitta jamoa, ba'zan esa bitta odam bo'lsa, siz hal qilayotgan muammo mavjud emas. Buning evaziga esa quyidagilar keladi:

- tarmoq chegarasi — har bir funksiya chaqiruvi endi timeout, retry va qisman muvaffaqiyatsizlikka ega
- tranzaksiya yo'qoladi — ikkita jadval o'rniga ikkita ma'lumotlar bazasi
- lokal ishga tushirish uchun docker-compose'da sakkizta konteyner

## Nima qilish kerak

Modulli monolit bilan boshlang. Kod ichidagi chegaralarni **hozirdanoq** qat'iy chizing:

\`\`\`
src/
  modules/
    billing/    # faqat billing/index.ts orqali tashqariga chiqadi
    catalog/
    identity/
\`\`\`

Modullar bir-birining ichki fayllarini import qilmasin. ESLint qoidasi bilan buni majburlash mumkin. Shunda haqiqatan ham ajratish kerak bo'lganda — masalan, \`catalog\` yuklamasi qolganidan o'n barobar oshganda — ajratish bir haftalik ish bo'ladi, bir yillik emas.

## Qachon ajratish kerak

Uchta belgi bor va ularning hech biri "zamonaviy ko'rinadi" emas:

1. Ikki jamoa bitta deploy navbatida bir-birini kutmoqda.
2. Bir modulning resurs profili qolganlaridan tubdan farq qiladi.
3. Bir qismning ishdan chiqishi butun tizimni to'xtatmasligi kerak.

Uchtasidan bittasi ham yo'q bo'lsa — monolit qoladi. Bu zaiflik emas, bu tanlov.`,
      },
      en: {
        title: "Stop reaching for microservices",
        post: `Every new project starts with the same question: "monolith or microservices?" It's the wrong question.

## The problem isn't the number of services

Microservice architecture solves an **organizational** problem — multiple teams stepping on each other. If you have one team, and sometimes one person, the problem you're solving doesn't exist. What you get in exchange is:

- a network boundary — every function call now has timeouts, retries and partial failure
- no transactions — two databases instead of two tables
- eight containers in docker-compose just to run things locally

## What to do instead

Start with a modular monolith. Draw the boundaries inside the code **right now**, and draw them hard:

\`\`\`
src/
  modules/
    billing/    # only reachable through billing/index.ts
    catalog/
    identity/
\`\`\`

Modules must not import each other's internal files. An ESLint rule can enforce this. Then, when you genuinely need to split — say \`catalog\` traffic grows ten times past everything else — the split is a week of work, not a year.

## When to actually split

There are three signals, and none of them is "it looks modern":

1. Two teams are blocking each other in the same deploy queue.
2. One module's resource profile is fundamentally different from the rest.
3. One part failing must not take the whole system down.

If none of the three is true, the monolith stays. That isn't weakness, it's a choice.`,
      },
    },
  },
  {
    slug: "typescript-dizayn-vositasi",
    theme: "typescript",
    createdAt: "2026-04-07T09:00:00.000Z",
    content: {
      uz: {
        title: "TypeScript — bu dizayn vositasi, majburiyat emas",
        post: `Ko'pchilik TypeScript'ni JavaScript ustiga yopishtirilgan tekshiruv deb qaraydi: \`any\` yozasan, xato yo'qoladi, ish davom etadi. Aslida type tizimi — bu **modelni oldindan chizish** imkoni.

## Noto'g'ri holatni yozib bo'lmaydigan qiling

Klassik misol — yuklanish holati:

\`\`\`ts
type State = {
  loading: boolean;
  data?: User;
  error?: string;
};
\`\`\`

Bu type sakkizta kombinatsiyaga ruxsat beradi, ulardan beshtasi ma'nosiz — \`loading: true\` bo'lib turib \`data\` ham, \`error\` ham bo'lgan holat. Discriminated union bilan faqat haqiqiy holatlar qoladi:

\`\`\`ts
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: string };
\`\`\`

Endi \`if (state.status === "success")\` ichida \`state.data\` mavjudligini kompilyator kafolatlaydi. Hech qanday \`!\` va \`?.\` kerak emas.

## Type'ni keyin emas, oldin yozing

Men komponent yozishdan oldin uning data shaklini yozaman. Ba'zan shu daqiqada ma'lum bo'ladiki, kerakli maydon backend javobida umuman yo'q — bu bilishning eng arzon vaqti. Kodni yozib bo'lgandan keyin emas.

## \`any\` — bu qarz

\`any\` yozish xatoni yo'qotmaydi, uni kelajakka suradi va foizini ham qo'shadi. Vaqt bo'lmasa \`unknown\` yozing: u ham o'tkazadi, lekin ishlatishdan oldin tekshirishga majbur qiladi.`,
      },
      en: {
        title: "Types are a design tool, not a chore",
        post: `Most people treat TypeScript as a checker bolted onto JavaScript: write \`any\`, the error goes away, work continues. In practice the type system is a chance to **sketch the model before you build it**.

## Make the wrong state unrepresentable

The classic example is loading state:

\`\`\`ts
type State = {
  loading: boolean;
  data?: User;
  error?: string;
};
\`\`\`

This type permits eight combinations, five of which are nonsense — \`loading: true\` while both \`data\` and \`error\` are set. A discriminated union leaves only the real ones:

\`\`\`ts
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: string };
\`\`\`

Now inside \`if (state.status === "success")\` the compiler guarantees \`state.data\` exists. No \`!\`, no \`?.\`.

## Write the type first, not last

I write the data shape before I write the component. Sometimes that's the exact moment I discover a field I need doesn't exist in the backend response at all — the cheapest possible time to find out. Not after the code is written.

## \`any\` is debt

Writing \`any\` doesn't remove the error, it moves it into the future and adds interest. If you're short on time write \`unknown\`: it also lets you through, but forces a check before use.`,
      },
    },
  },
  {
    slug: "postgres-imkoniyatlari",
    theme: "postgres",
    createdAt: "2026-02-12T09:00:00.000Z",
    content: {
      uz: {
        title: "Postgres'ning kechroq bilganim imkoniyatlari",
        post: `Postgres bilan besh yil ishlab, uning yarmini bilmasligimni angladim. Quyida — bilganimda ancha kod yozmasligim mumkin bo'lgan narsalar.

## \`RETURNING\`

\`INSERT\` qilib, keyin \`SELECT\` bilan qaytarib olish shart emas:

\`\`\`sql
INSERT INTO posts (slug, title)
VALUES ('salom', 'Salom')
RETURNING id, created_at;
\`\`\`

\`UPDATE\` va \`DELETE\` da ham ishlaydi. Bitta round-trip tejaladi va poyga holati yo'qoladi.

## Qisman indeks

Agar so'rovlaringiz doim bitta shartga tayansa, butun jadvalni indekslash shart emas:

\`\`\`sql
CREATE INDEX idx_active_users ON users (email) WHERE deleted_at IS NULL;
\`\`\`

Indeks kichrayadi, yozish tezlashadi.

## \`generated always as identity\`

\`serial\` — eski usul. Standart SQL varianti ketma-ketlik egaligini to'g'ri boshqaradi:

\`\`\`sql
id bigint generated always as identity primary key
\`\`\`

## \`jsonb\` — lekin ehtiyot bo'lib

\`jsonb\` ustuni sxemasiz data uchun ajoyib. Lekin u sxema yo'qligini **yashiradi**: bir yildan keyin ichida nima borligini hech kim bilmaydi. Qoidam oddiy — agar maydon bo'yicha filtr qilinsa, u alohida ustun bo'lishi kerak.

## \`EXPLAIN (ANALYZE, BUFFERS)\`

Oddiy \`EXPLAIN\` rejani ko'rsatadi, \`ANALYZE\` haqiqiy vaqtni, \`BUFFERS\` esa diskdan necha blok o'qilganini. Uchinchisisiz sekin so'rovning sababi ko'rinmaydi.`,
      },
      en: {
        title: "The Postgres features I wish I knew earlier",
        post: `After five years with Postgres I realised I knew maybe half of it. Below are the things that would have saved me a lot of code.

## \`RETURNING\`

You don't need an \`INSERT\` followed by a \`SELECT\` to read the row back:

\`\`\`sql
INSERT INTO posts (slug, title)
VALUES ('hello', 'Hello')
RETURNING id, created_at;
\`\`\`

It works on \`UPDATE\` and \`DELETE\` too. One round-trip saved, one race condition gone.

## Partial indexes

If your queries always carry the same predicate, there's no reason to index the whole table:

\`\`\`sql
CREATE INDEX idx_active_users ON users (email) WHERE deleted_at IS NULL;
\`\`\`

Smaller index, faster writes.

## \`generated always as identity\`

\`serial\` is the legacy way. The standard SQL form handles sequence ownership correctly:

\`\`\`sql
id bigint generated always as identity primary key
\`\`\`

## \`jsonb\` — but carefully

A \`jsonb\` column is excellent for genuinely schemaless data. But it also **hides** the absence of a schema: a year later nobody knows what's inside. My rule is simple — if you filter on a field, it deserves its own column.

## \`EXPLAIN (ANALYZE, BUFFERS)\`

Plain \`EXPLAIN\` shows the plan, \`ANALYZE\` shows real timings, and \`BUFFERS\` shows how many blocks came off disk. Without the third one you can't see why a query is slow.`,
      },
    },
  },
  {
    slug: "skeleton-emas-kontent",
    theme: "frontend",
    createdAt: "2025-12-03T09:00:00.000Z",
    content: {
      uz: {
        title: "Skeleton yaxshi yechim emas edi",
        post: `Bu saytning o'zi shu xatoga tushgan. Barcha data client-side query orqali kelgani uchun server yuborgan HTML'da kontent emas, kulrang to'rtburchaklar turadi.

## Nima yomon

- **SEO** — qidiruv tizimi bo'sh sahifa ko'radi
- **Idrok tezligi** — foydalanuvchi avval skeleton, keyin siljish, keyin matn ko'radi
- **Ulashish** — Telegram yoki Twitter'dagi preview bo'sh chiqadi

Skeleton'ning yagona haqiqiy vazifasi — **kutish muqarrar bo'lganda** layout siljishini oldini olish. Agar kutishning o'zi keraksiz bo'lsa, skeleton muammoni yashiradi, hal qilmaydi.

## To'g'ri yechim

Server komponentida data'ni oldindan olib, keshni client'ga uzatish:

\`\`\`tsx
const queryClient = new QueryClient();
await queryClient.prefetchQuery({
  queryKey: ["posts"],
  queryFn: () => blogApi.getAll(),
});

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <BlogList />
  </HydrationBoundary>
);
\`\`\`

Komponent o'zgarmaydi — u hamon \`useBlogPosts()\` chaqiradi. Shunchaki birinchi renderda kesh allaqachon to'la.

## Qoida

Data sahifaning **asosiy mazmuni** bo'lsa — server. Foydalanuvchi harakatidan keyin keladigan data bo'lsa — client. Ikkovini aralashtirmang.`,
      },
      en: {
        title: "Skeletons were never the fix",
        post: `This very site made the mistake. Because all data arrives through client-side queries, the HTML the server sends contains grey rectangles instead of content.

## Why that's bad

- **SEO** — the crawler sees an empty page
- **Perceived speed** — the user sees a skeleton, then a shift, then text
- **Sharing** — the preview on Telegram or Twitter comes out blank

The only honest job of a skeleton is preventing layout shift **when the wait is unavoidable**. If the wait itself was unnecessary, the skeleton hides the problem instead of solving it.

## The actual fix

Fetch on the server and hand the cache to the client:

\`\`\`tsx
const queryClient = new QueryClient();
await queryClient.prefetchQuery({
  queryKey: ["posts"],
  queryFn: () => blogApi.getAll(),
});

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <BlogList />
  </HydrationBoundary>
);
\`\`\`

The component doesn't change — it still calls \`useBlogPosts()\`. The cache is simply already warm on the first render.

## The rule

If the data is the **main content** of the page — server. If it arrives after a user action — client. Don't blur the two.`,
      },
    },
  },
  {
    slug: "bitta-vps-yetadi",
    theme: "devops",
    createdAt: "2025-09-21T09:00:00.000Z",
    content: {
      uz: {
        title: "Bitta VPS ko'p loyihaga yetadi",
        post: `Pet-loyiha uchun Kubernetes klasteri ko'targanlarni ko'rganman. Men ham bir marta ko'targanman. Ikki oydan keyin loyiha emas, klaster qolgan edi.

## Nima yetadi

5 dollarlik VPS, ustida:

- **Caddy** — reverse proxy va avtomatik HTTPS. Konfiguratsiya rostdan ham uch qator.
- **Docker Compose** — har loyihaga bitta fayl.
- **Postgres** — bitta instans, har loyihaga alohida ma'lumotlar bazasi.

Bu o'ntacha kichik loyihani hech qanday shovqinsiz olib yuradi.

## Nimani birinchi kunda qiling

1. **Zaxira nusxa.** \`pg_dump\` + cron + tashqi obyekt saqlagich. Sinab ko'rilmagan zaxira — zaxira emas.
2. **Root bilan SSH'ni yoping.** Kalit bo'yicha kirish, parolni o'chirish.
3. **Avtomatik xavfsizlik yangilanishlari.**

## Qachon yetmaydi

Rostdan ham ko'chish kerak bo'lgan payt bor: bir mashinaning ishdan chiqishi biznesni to'xtatsa, yoki yuklama bitta mashinaga sig'masa. O'shanda ko'chasiz. Lekin bu paytga qadar yozilgan har bir YAML qatori — yozilmagan funksiya.

Infratuzilma sizni ta'sirlantirmasligi kerak. U ko'rinmasligi kerak.`,
      },
      en: {
        title: "One VPS is enough for most projects",
        post: `I've watched people stand up a Kubernetes cluster for a pet project. I did it once myself. Two months later what was left wasn't the project — it was the cluster.

## What's actually enough

A $5 VPS running:

- **Caddy** — reverse proxy and automatic HTTPS. The config really is three lines.
- **Docker Compose** — one file per project.
- **Postgres** — a single instance, one database per project.

That carries ten small projects without a sound.

## What to do on day one

1. **Backups.** \`pg_dump\` + cron + off-box object storage. An untested backup is not a backup.
2. **Close SSH for root.** Key-based login, passwords disabled.
3. **Automatic security updates.**

## When it stops being enough

There is a real moment to move: when one machine going down stops the business, or when the load no longer fits on one box. Then you move. But every line of YAML written before that moment is a feature you didn't ship.

Infrastructure shouldn't impress you. It should be invisible.`,
      },
    },
  },
];
