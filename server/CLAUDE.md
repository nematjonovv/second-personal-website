# Server — shaxsiy sayt backend'i

Express 5 + TypeScript + Prisma 7 (PostgreSQL). Client — `../client` (Next.js 16, next-intl).
Vazifasi: sayt kontentini (proyekt, blog, about, contact) ikki tilda saqlash va admin panel uchun himoyalangan CRUD berish.

## Buyruqlar

```bash
npm run dev        # tsx watch src/server.ts
npm run build      # tsc -> dist/
npm start          # node dist/server.js
npm run db:seed    # admin/admin1 foydalanuvchisini yaratadi (upsert)
npx prisma studio  # DB'ni brauzerda ko'rish
```

## Env

`.env` (gitignore'da, namuna — `.env.example`):

| O'zgaruvchi | Majburiy | Izoh |
|---|---|---|
| `DATABASE_URL` | ha | `postgresql://postgres:PAROL@localhost:5432/second-personal-wb?schema=public` |
| `JWT_SECRET` | ha | uzun tasodifiy satr |
| `PORT` | yo'q | default `4000` |
| `CLIENT_URL` | yo'q | default `http://localhost:3000`, CORS origin |

`DATABASE_URL` yoki `JWT_SECRET` bo'lmasa server **startda yiqiladi** (`shared/constants.ts` dagi `required()`).

## Struktura

```
src/
  server.ts              app.listen
  app.ts                 middleware zanjiri + router'lar + errorHandler
  shared/                modullar orasida bo'lishiladigan hamma narsa
    openapi.ts           OpenAPI yordamchilari (success, errors, ref, localized)
    swagger.ts           hujjatni yig'adi + /api/docs router'i
  modules/<nom>/         har bir domen alohida papka
  generated/prisma/      Prisma client (gitignore'da, `prisma generate` yasaydi)
prisma/
  schema.prisma
  seed.ts
  migrations/
uploads/projects/        yuklangan webp'lar (gitignore'da)
examples/                Postman/curl uchun tayyor JSON namunalar
```

## Modul qolipi

Har bir domen — `src/modules/<nom>/` ichida quyidagi fayllar. Yangi modul **shu tartibda** yoziladi:

| Fayl | Mazmuni |
|---|---|
| `<nom>.validation.ts` | zod sxemalar (`create...Schema`, `update...Schema`) + `z.infer` tiplari |
| `<nom>.mapper.ts` | DB yozuvi → client kutayotgan shakl (faqat shakl mos kelmasa) |
| `<nom>.service.ts` | Biznes mantiq, Prisma, `ApiError` tashlaydi. HTTP haqida hech narsa bilmaydi |
| `<nom>.controller.ts` | `req`/`res`, servisni chaqiradi, xatoni `next(error)` ga uzatadi |
| `<nom>.route.ts` | Router, middleware tartibi |
| `<nom>.docs.ts` | OpenAPI: `schemas` + `paths`. Kod bilan yonma-yon turadi, `shared/swagger.ts` yig'adi |

Konvensiya: klass yoziladi, **eksport qilinadigan yagona instance** bilan.

```ts
class ProjectService { /* ... */ }
export const projectService = new ProjectService();
```

⚠️ **Controller metodlari `RequestHandler` tipidagi arrow property bo'lishi shart**, oddiy metod emas. Router'ga `authController.check` deb uzatilganda oddiy metodda `this` yo'qoladi. `health.controller.ts` hali eski uslubda — namuna sifatida `project.controller.ts` ga qarang.

Modul tayyor bo'lgach `app.ts` ga ulanadi:

```ts
app.use("/api/projects", projectRouter);
```

⚠️ `errorHandler` **eng oxirida** turishi shart, aks holda xatolarni ushlamaydi.

## Javob shakli

Barcha endpointlar — muvaffaqiyat ham, xato ham — **bir xil uch maydon**:

```ts
{ success: boolean, message: string, data: T | null }
```

Xatoda `data` doim `null`. Client uchun tip:

```ts
type ApiResponse<T = null> = { success: boolean; message: string; data: T };
```

| Kod | Qachon |
|---|---|
| 200 / 201 | muvaffaqiyat (201 — create) |
| 400 | zod validatsiya, noto'g'ri rasm formati, gallery mantiq xatosi |
| 401 | token yo'q / yaroqsiz / muddati tugagan, login noto'g'ri |
| 404 | resurs topilmadi |
| 409 | takrorlanadigan unique qiymat (slug, username) |
| 413 | rasm hajmi limitdan oshdi |
| 500 | kutilmagan xato — asl xato konsolga log qilinadi, clientga umumiy matn ketadi |

## Xatolar

Servis qatlamida:

```ts
throw new ApiError(409, "Bunday slug bilan proyekt allaqachon mavjud");
```

`shared/errorHandler.ts` `ApiError` ni statusi bilan qaytaradi, `MulterError` ni o'zbekcha xabarga tarjima qiladi, qolgan hammasini 500 qilib log qiladi. Xato xabarlari **o'zbekcha** yoziladi.

## Validatsiya

`shared/validate.ts` — zod sxemani `req.body` ga qo'llaydi, o'tsa `req.body` ni **parse qilingan data bilan almashtiradi** (shuning uchun servis toza, tiplangan obyekt oladi).

Xabar formati — `maydon.yo'li: xabar`:

```
techStack: Invalid input: expected array, received undefined
content.uz.myContribution: Invalid input: expected array, received undefined
password: Parol kamida 6 ta belgi bo'lishi kerak
```

Faqat **birinchi** xato qaytadi.

### Multipart uchun `jsonField`

Multipart so'rovda hamma matn maydoni string bo'lib keladi. Massiv/obyekt maydonlari JSON string sifatida yuboriladi va sxema ichida parse qilinadi:

```ts
const jsonField = <T extends ZodType>(schema: T) =>
  z.preprocess((value, ctx) => {
    if (typeof value !== "string") return value;
    try { return JSON.parse(value); }
    catch (error) {
      ctx.addIssue({ code: "custom", message: `JSON formati noto'g'ri (${(error as Error).message})` });
      return z.NEVER;
    }
  }, schema);
```

⚠️ `catch` ichida xatoni **yutib yubormang** — aks holda "expected object, received string" degan tushunarsiz xabar chiqadi. Namuna `project.validation.ts` da.

### Sxema yozish qoidalari

- `createXSchema` — majburiy maydonlar; `updateXSchema` — hammasi `.optional()` (PATCH semantikasi)
- Har bir `.min()` / `.regex()` ga **o'zbekcha xabar** yoziladi
- Matnlar `.trim()`, massivlar `.min(1)`
- Slug: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, create'da `.optional()`
- URL uchun `z.url()`; update'da tozalash imkoni kerak bo'lsa `z.union([z.url(), z.literal("")])`
- Ikki tilli blok yuborilmasa tushunarli xabar chiqishi uchun `z.object(shape, { error: "content.en to'liq kiritilishi shart" })`
- Sxemadan tip chiqariladi: `export type CreateXInput = z.infer<typeof createXSchema>`

## i18n saqlash

Client barcha kontentni `Record<"uz" | "en", ...>` ko'rinishida kutadi va tilni **o'zi tanlaydi** (locale cookie + next-intl). Shuning uchun:

- API **doim ikkala tilni** qaytaradi, `?locale=` query param yo'q
- DB'da alohida `uz` va `en` **`Json` ustun** — translation jadval va relation **yozilmaydi**
- Json ichi zod bilan tekshiriladi (`content.uz`, `content.en`)
- Mapper DB ustunlarini `content: { uz, en }` ga yig'adi

⚠️ Postgres `jsonb` obyekt kalitlari tartibini o'zgartiradi. Qiymatlarga ta'sir qilmaydi, lekin javobda kalitlar boshqa tartibda kelishi normal.

## Rasm yuklash tartibi

Oqim: **multipart so'rov → multer (xotira) → sharp (webp) → diskka yozish → path DB'ga**.

| Qadam | Qayerda | Qoida |
|---|---|---|
| Qabul qilish | `shared/upload.ts` | `memoryStorage`, mime whitelist: `image/jpeg`, `image/png`, `image/webp`. Maksimum **5MB/fayl**, **10 fayl** |
| Konvertatsiya | `shared/imageToWebp.ts` | `.rotate()` (EXIF) → `.resize({ width: 1920, withoutEnlargement: true })` → `.webp({ quality: 80 })` |
| Nomlash | `imageToWebp` | `randomUUID()` + `.webp`. Asl fayl nomi ishlatilmaydi |
| Saqlash | `uploads/<folder>/` | DB'ga public path yoziladi: `/uploads/projects/<uuid>.webp` |
| O'chirish | `removeUpload` / `removeUploads` | Fayl yo'q bo'lsa jim o'tadi; `/uploads/` dan tashqaridagi path rad etiladi (path traversal) |

Kiruvchi format jpg/jpeg/png/webp bo'lishi mumkin, **saqlanadigan format doim webp**.

### Gallery semantikasi

Client har safar **yakuniy holatni** yuboradi.

**CREATE** — `gallery` faqat fayl maydoni. Kamida 1 ta rasm shart. Massiv tartibi = yuklash tartibi.

**PATCH** — `gallery` ikki ma'noda ishlatiladi:
- **matn maydoni** — saqlanadigan mavjud path'lar massivi (tartibi bilan)
- **fayl maydoni** — yangi rasmlar

```
DB'da:   [1.webp, 2.webp, 3.webp, 5.webp]
Yuborildi: gallery = ["1.webp","2.webp","3.webp"]   (matn)
           gallery = <yangi fayl>                    (fayl)
Natija:  [1.webp, 2.webp, 3.webp, yangi.webp]
         5.webp diskdan o'chiriladi
```

Qoidalar:
- Na matn maydoni, na fayl kelmasa — gallery **umuman tegilmaydi**
- Faqat fayl kelsa — mavjudlarga qo'shiladi, massiv o'chib ketmaydi
- Yangi fayllar **doim oxiriga** qo'shiladi (o'rtaga joylashtirib bo'lmaydi)
- Matn maydonidagi har bir path shu yozuvga tegishli ekani tekshiriladi, aks holda 400
- Yakuniy massiv bo'sh qolsa 400

**DELETE** — DB yozuvi va barcha fayllar birga o'chadi.

⚠️ **Orphan fayl**: rasmlar DB yozuvidan **oldin** diskka tushadi. Har bir servis metodida `catch` ichida yozilgan fayllar `removeUploads` bilan tozalanishi shart — `project.service.ts` dagi qolipga qarang.

⚠️ **helmet CORP**: `/uploads` uchun `helmet.crossOriginResourcePolicy({ policy: "cross-origin" })` qo'yilgan. Busiz brauzer `:3000` dagi client'da `<img src="http://localhost:4000/uploads/...">` ni **bloklaydi**.

## Auth

Sodda, bitta token: **faqat access token, HS256, 1 soat**. Refresh token yo'q.

| Endpoint | Himoya |
|---|---|
| `POST /api/auth/login` | ochiq |
| `POST /api/auth/register` | 🔒 `protect` |
| `POST /api/auth/logout` | 🔒 `protect` |

⚠️ **`register` ataylab himoyalangan** — admin panelga tashqaridan ro'yxatdan o'tib bo'lmasligi kerak. Birinchi foydalanuvchi `npm run db:seed` orqali yaratiladi.

- Parol `bcryptjs`, 10 salt rounds. Javobda **hech qachon** qaytmaydi (servis `select` bilan `id`, `username`, `createdAt` ni oladi)
- `protect` (`auth.middleware.ts`): `Bearer` header → `jwt.verify` → DB'dan user → `req.user = { id, username }`
- Username kamida 3, parol kamida 6 belgi

⚠️ `logout` **stateless** — server tokenni bekor qilmaydi, client uni o'chiradi. Eski token muddati tugaguncha yaroqli qoladi.

Yozish endpointlari (`POST`/`PATCH`/`DELETE`) `protect` bilan, o'qish (`GET`) ochiq — sayt kontentini hamma ko'radi.

## Prisma 7 tafsilotlari

- Konfiguratsiya **`prisma.config.ts`** da (`schema`, `migrations.path`, `migrations.seed`, `datasource.url`), `schema.prisma` da `url` yo'q
- Generator — `prisma-client` (eski `prisma-client-js` emas), chiqish joyi `src/generated/prisma`, `moduleFormat = "cjs"`
- ⚠️ **Driver adapter majburiy**: `new PrismaClient()` o'zi ishlamaydi. `src/shared/prisma.ts` da `PrismaPg` adapter bilan yagona instance yaratilgan — barcha servislar **shuni** import qiladi
- `src/generated/` gitignore'da, `postinstall: prisma generate` uni tiklaydi

⚠️ **`prisma migrate dev` ustun o'chirilishi kabi ogohlantirish chiqsa interaktiv tasdiq so'raydi** va agent muhitida yiqiladi. Bunday holatda migratsiyani qo'lda yasang:

```bash
mkdir -p prisma/migrations/$(date +%Y%m%d%H%M%S)_nom
npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script > .../migration.sql
npx prisma migrate deploy
```

Yangi jadval qo'shishda ogohlantirish bo'lmaydi — oddiy `prisma migrate dev --name nom` ishlaydi.

## Mavjud modellar

```prisma
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("users")
}

model Project {
  id        String   @id @default(uuid())
  slug      String   @unique
  title     String
  month     Int
  year      Int
  techStack String[]
  role      String[]
  gallery   String[]
  githubUrl String?
  liveUrl   String?
  uz        Json
  en        Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("projects")
}
```

```prisma
/// Yagona yozuv (singleton): id doim ABOUT_ID ga teng.
model AboutContent {
  id        String   @id @default("about")
  uz        Json     // { headline: AccentText, bio: { primary: AccentText, secondary } }
  en        Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("about_content")
}

model Experience {
  id        String   @id @default(uuid())
  key       String   @unique   // tashqariga `id` deb chiqadi
  company   String
  fromYear  Int
  toYear    Int?               // null = hozirgacha
  uz        Json               // { role, summary }
  en        Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("experiences")
}

model ToolboxGroup {
  id        String   @id @default(uuid())
  key       String   @unique
  position  Int
  labelUz   String              // label — skalyar, Json emas
  labelEn   String
  items     String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("toolbox_groups")
}
```

```prisma
model BlogPost {
  id        String   @id @default(uuid())
  slug      String   @unique
  theme     String
  uz        Json     // { title, post } — post markdown
  en        Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("blog_posts")
}
```

```prisma
/// Yagona yozuv (singleton): id doim CONTACT_ID ga teng.
model Contact {
  id          String   @id @default("contact")
  email       String
  github      String
  linkedin    String
  telegram    String
  phoneNumber String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@map("contacts")
}
```

Konvensiyalar: `id` — uuid, jadval nomi `@@map` bilan ko'plikda va kichik harfda, tashqi dunyoga **`slug`** ochiladi (`id` javobda chiqmaydi), ro'yxat `ORDER BY year DESC, month DESC` (tartib UI'da ko'rinadi).

## Project endpointlari

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/api/projects` | ochiq | — |
| GET | `/api/projects/:slug` | ochiq | — |
| POST | `/api/projects` | 🔒 | multipart |
| PATCH | `/api/projects/:slug` | 🔒 | multipart |
| DELETE | `/api/projects/:slug` | 🔒 | — |

Multipart maydonlari:

| Maydon | Turi | Namuna |
|---|---|---|
| `title` | matn | `Aurora CRM` |
| `slug` | matn, ixtiyoriy | yo'q bo'lsa `title` dan `slugify()` yasaydi |
| `githubUrl`, `liveUrl` | matn, ixtiyoriy | to'liq URL |
| `date` | JSON string | `{"month":3,"year":2026}` |
| `techStack`, `role` | JSON string | `["Next.js","TypeScript"]` |
| `content` | JSON string | `{"uz":{...},"en":{...}}` — 6 tadan maydon |
| `gallery` | fayl (ko'p) | rasm fayllari |

Tayyor namuna: `examples/aurora-crm.content.json` (o'qish uchun) va `examples/aurora-crm.content.min.json` (Postman'ga nusxalash uchun — bitta qator, satr buzilmaydi).

Javob client'ning `Project` tipiga aynan mos: `date: { month, year }`, `content: { uz, en }`, `id`/`createdAt` chiqmaydi, `githubUrl`/`liveUrl` bo'sh bo'lsa **umuman qo'shilmaydi**.

## About endpointlari

Uchta model, lekin **o'qish yagona**: `GET /api/about` client'ning `About` tipini to'liq qaytaradi.

| Method | Path | Auth | Izoh |
|---|---|---|---|
| GET | `/api/about` | ochiq | `{ content, experience, toolbox }` |
| PATCH | `/api/about/content` | 🔒 | upsert, ikkala til birga |
| POST | `/api/about/experience` | 🔒 | 201 |
| PATCH / DELETE | `/api/about/experience/:id` | 🔒 | `:id` = `key` |
| POST | `/api/about/toolbox` | 🔒 | 201 |
| PATCH / DELETE | `/api/about/toolbox/:id` | 🔒 | |

- ⚠️ **`:id` — DB'dagi `key` ustuni** (`"freelance"`, `"frontend"`), uuid emas. Mapper `id: record.key` qaytaradi. `key` create'da beriladi, **PATCH bilan o'zgartirilmaydi**
- `content` yozuvi yo'q bo'lsa GET DB'ga tegmasdan `DEFAULT_ABOUT_CONTENT` (mapper'da) qaytaradi — Contact bilan bir xil qolip
- Tartib: `experience` — `fromYear DESC` (tabiiy kalit, qo'shimcha ustun kerak emas); `toolbox` — `position ASC`, POST'da berilmasa `max + 1`
- ⚠️ `position` PATCH'da **shunchaki o'rnatiladi**, qolgan yozuvlar surilmaydi. Qayta tartiblash = har bir guruhga alohida PATCH
- `AccentText` (`before` + `<accent>` + `after`): `accent` majburiy, `before`/`after` **bo'sh satr bo'lishi mumkin** (urg'u gap boshi/oxirida bo'lgani uchun), lekin maydonning o'zi majburiy
- `period.to` — `null` bo'lsa "hozirgacha"; `to < from` bo'lsa 400
- Namunalar: `examples/about.content.json`, `examples/about.experience.json` (massiv — bittalab POST qilinadi), `examples/about.toolbox.json`

## Blog endpointlari

Body — **JSON** (multipart emas, rasm yo'q). `post` maydoni **markdown matn**: server uni parse qilmaydi, render qilmaydi, o'zgartirmasdan saqlaydi va qaytaradi.

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/api/blog` | ochiq | — |
| GET | `/api/blog/:slug` | ochiq | — |
| POST | `/api/blog` | 🔒 | JSON |
| PATCH | `/api/blog/:slug` | 🔒 | JSON, hamma maydon ixtiyoriy |
| DELETE | `/api/blog/:slug` | 🔒 | — |

| Maydon | Izoh |
|---|---|
| `slug` | ixtiyoriy, yo'q bo'lsa **`content.uz.title`** dan `slugify()` yasaydi |
| `theme` | client `themes.<theme>` i18n kaliti sifatida ishlatadi → slug qolipiga cheklangan |
| `createdAt` | ixtiyoriy ISO string (eski postni ko'chirish uchun), yo'q bo'lsa `now()` |
| `content` | `{ uz: { title, post }, en: { title, post } }` |

- Ro'yxat `ORDER BY createdAt DESC` — **client tartiblamaydi**, tartib serverdan keladi
- Project'dan farqli: javobda `createdAt` **bor** (ISO string), client `formatMonthYear` bilan ko'rsatadi
- `express.json({ limit: "1mb" })` — default 100kb ikki tilli uzun markdown'ga yetmaydi
- Tayyor namuna: `examples/mikroservislarga-shoshilmang.json` (+ `.min.json` Postman uchun)

## Contact endpointlari

Jadval **yagona yozuvli (singleton)** — `id` doim `"contact"`. Kontent ikki tilli emas, 5 ta oddiy string.

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/api/contact` | ochiq | — |
| PATCH | `/api/contact` | 🔒 | JSON, hamma maydon ixtiyoriy |

Maydonlar: `email`, `github`, `linkedin`, `telegram` (username, to'liq URL emas — havolani client yasaydi), `phoneNumber` (`+998901234567` formatida).

- Default qiymatlar **`contact.mapper.ts` dagi `DEFAULT_CONTACT`** da — schema'da `@default` yo'q, manba bitta
- Yozuv hali yo'q bo'lsa GET DB'ga tegmasdan default'larni qaytaradi
- PATCH — `upsert`: birinchi chaqiruvda yozuv `{ ...DEFAULT_CONTACT, ...input }` dan yaratiladi, keyingilarida faqat yuborilgan maydonlar yangilanadi
- ⚠️ `z.email().trim()` emas, **`z.string().trim().pipe(z.email())`** — aks holda bo'sh joyli email trim qilinmasdan rad etiladi

## Hujjatlar (Swagger / OpenAPI)

| Manzil | Nima |
|---|---|
| `http://localhost:4000/api/docs` | Swagger UI |
| `http://localhost:4000/api/docs/openapi.json` | Xom OpenAPI 3.1 hujjati |

Hujjat **qo'lda yoziladi** (zod'dan avtomatik generatsiya yo'q) va kod bilan yonma-yon turadi:

```
modules/<nom>/<nom>.docs.ts   →   export const <nom>Docs: ModuleDocs = { schemas, paths }
shared/swagger.ts             →   MODULES massiviga qo'shiladi, bitta hujjatga yig'iladi
```

`shared/openapi.ts` dagi yordamchilar — takrorlanishni oldini oladi:

| Yordamchi | Vazifasi |
|---|---|
| `success(description, data?)` | `{ success, message, data }` qobig'ini yasaydi; `data` berilmasa `null` |
| `errors("Unauthorized", "NotFound", ...)` | umumiy xato javoblariga `$ref` (`components.responses` da bir marta ta'riflangan) |
| `ref("Project")` | `#/components/schemas/Project` |
| `localized(schema)` | `{ uz, en }` bloki |
| `secured` | 🔒 endpointlar uchun `bearerAuth` |
| `slugParam(name, description)` | path parametri |

- ⚠️ **Yangi endpoint qo'shsangiz `<nom>.docs.ts` ga ham yozing** — hujjat kodni avtomatik kuzatmaydi
- ⚠️ Swagger UI inline style/script ishlatadi, helmet'ning default CSP'si ularni bloklaydi. `/api/docs` uchun yumshatilgan CSP `shared/swagger.ts` da qo'yilgan
- ⚠️ `openapi-types` da `OpenAPIV3_1.PathItemObject` V3.0 operatsiya tiplari bilan kesishadi va `type: ["integer","null"]` kabi 3.1 sxemalarini rad etadi. Shuning uchun `Paths` tipi `openapi.ts` da o'zimizniki, `swagger.ts` da bir marta cast qilinadi. Docs faylida umumiy maydonni `as const` bilan emas, **`: Schema` annotatsiyasi bilan** e'lon qiling (`as const` `readonly` yasaydi va tip mos kelmaydi)
- UI'da **Authorize** tugmasiga login qaytargan tokenni kiritsangiz, 🔒 so'rovlar avtomatik imzolanadi (`persistAuthorization` yoqilgan)

## Yangi modul qo'shish checklist

1. `prisma/schema.prisma` ga model (`uz`/`en` — `Json`, `@@map` bilan)
2. `npx prisma migrate dev --name <nom>` + `npx prisma generate`
3. `modules/<nom>/` ichida fayllar (yuqoridagi qolip)
4. `app.ts` ga router (`errorHandler` dan **oldin**)
5. Rasm kerak bo'lsa — `uploadImages.array("<maydon>")` va `imageToWebp(buffer, "<papka>")`
6. `<nom>.docs.ts` yozilib, `shared/swagger.ts` dagi `MODULES` massiviga qo'shiladi
7. `npx tsc --noEmit` va haqiqiy curl bilan tekshirish: 401 (tokensiz), 400 (validatsiya), 404, 409, muvaffaqiyat
8. Rasm bilan ishlaydigan modulda **fayl haqiqatan diskka yozilgani/o'chganini** alohida tekshirish
9. `/api/docs` ochilib, yangi endpointlar ko'rinayotgani tekshiriladi

## Ish yuritish qoidalari

- ⚠️ **Test tozalashda `DELETE` ni ko'r-ko'rona ishlatmang** — DB umumiy, foydalanuvchi Postman orqali yaratgan yozuvni o'chirib yuborish oson. Faqat o'zingiz yaratgan, slug'i aniq ma'lum yozuvni o'chiring
- Endpointni "ishlaydi" deyishdan oldin haqiqiy so'rov bilan tekshiring — tiplar o'tgani yetarli emas
- Vaqtinchalik skriptlarni `src/` ichida yaratsangiz, ishlatib bo'lgach **o'chiring** (`tsc` ularni ham kompilyatsiya qiladi)
- ⚠️ `tsx` CJS rejimida ishlaydi — vaqtinchalik skriptlarda **top-level `await` ishlamaydi**, `(async () => { ... })()` ishlating
