# Context

## Loyiha nima

Hikmatillo Nematjonovning **shaxsiy websayti** — asosan portfolio saqlash uchun. Bitta odamning ishlarini ko'rsatuvchi sayt, ko'p foydalanuvchili mahsulot emas.

Dizayn yo'nalishi: neo-brutalist / editorial — qog'oz rangli fon, qalin qora chegaralar, Archivo Black sarlavhalar, vermilion aksent. Batafsil `CLAUDE.md` da.

Dizayn manbasi — `Portfolio.dc.html` (statik HTML prototip). Tipografiya bo'yicha shubha tug'ilsa taxmin qilmang, o'sha fayldagi inline `style` qiymatlarini o'qing.

## Stack

- **Next.js 16.2.11**, App Router, `src/app`. Turbopack.
  ⚠️ Bu versiyada breaking change'lar bor — kod yozishdan oldin `node_modules/next/dist/docs/` dagi tegishli qo'llanmani o'qing.
- **React 19.2**
- **Tailwind v4** — CSS-first, `tailwind.config` **yo'q**, hammasi `src/app/globals.css` da
- **TanStack Query 5** — barcha data shu orqali, faqat client-side (`QueryProvider` da `staleTime: 60s`, `refetchOnWindowFocus: false`)
- **shadcn** (`style: "radix-lyra"`, `iconLibrary: "phosphor"`) + `radix-ui`
- **framer-motion 12**
- **next-intl 4** — uz / en
- Ikonkalar: `lucide-react` va `@phosphor-icons/react` ikkalasi ham o'rnatilgan; kodda hozircha `lucide` ishlatilgan
- Markdown uchun **kutubxona yo'q** — blog postlari o'z renderer'i bilan chiqadi (pastga qarang)

## Fayl tuzilishi

```
src/
  app/
    layout.tsx        root — html/body, fontlar, QueryProvider + NextIntlClientProvider
    globals.css       token'lar, scrollbar, ::selection
    (site)/           Header + Footer'li layout
      page.tsx        bosh sahifa
      work/page.tsx   loyihalar ro'yxati
      blog/page.tsx   yozuvlar ro'yxati
      about|contact/
    (project)/        chrome'siz, to'q fonli layout
      work/[slug]/page.tsx
    (post)/           chrome'siz, qog'oz fonli layout
      blog/[slug]/page.tsx
  components/         Header, Footer, Logo, Container, Marquee, ViewImage, LnaguageSwitcher
    hero/             Hero, HeroTitle, HeroMeta, HeroDescription, HeroCta
    ui/               shadcn: button, dropdown-menu
  features/
    about/            about.{type,data,api,hook}.ts + components/
    project/          project.{type,data,api,hook}.ts + components/
    blog/             blog.{type,data,api,hook,util}.ts + components/
    contact/          contact.{type,data,api,hook,util}.ts + components/
    stats/            stats.data.ts + components/
    menu/             menu.data.ts + components/
  shared/
    providers/        QueryProvider.tsx
    data/             marque.data.ts
    contstans/        constants.ts (EASE, AUTOPLAY_MS) ⚠️ papka nomida typo
  i18n/               request.ts, set-locale.ts
  messages/           uz.json, en.json
  lib/utils.ts        cn()
```

## Route guruhlari — Header/Footer'ni boshqarish

Root `layout.tsx` da **Header ham, Footer ham yo'q** — u faqat `<html>`, fontlar va provider'lar. Chrome to'rtta route guruhiga bo'lingan:

| Guruh | Layout | Route'lar |
|---|---|---|
| `(site)` | `<Header />` + `<main className="flex-1">` + `<Footer />` | `/`, `/work`, `/blog`, `/about`, `/contact` |
| `(project)` | `min-h-svh bg-[#1A1A1A] text-paper`, chrome yo'q | `/work/[slug]` |
| `(post)` | `min-h-svh`, chrome yo'q, fon qog'oz rangda qoladi | `/blog/[slug]` |
| `(admin)` | `AuthProvider` → `ToastProvider` → `AdminGate` → `AdminNav`, sayt Header/Footer'isiz | `/admin/**` |

Ya'ni **ikkala batafsil sahifa ham to'liq ekranli**, undan chiqish faqat sahifadagi "Orqaga" tugmasi orqali. Farqi rangda: loyiha sahifasi teskari rangda (galereya uchun), blog yozuvi esa qog'oz fonda qoladi — uzun matnni to'q fonda o'qish charchatadi.

`work` va `blog` papkalari ikki joyda takrorlanadi (`(site)/work` + `(project)/work/[slug]`, `(site)/blog` + `(post)/blog/[slug]`) — bu ataylab, URL'lar to'qnashmaydi.

⚠️ Yangi sahifa qo'shganda uni `(site)` ichiga qo'ying, aks holda u Header'siz qoladi.

## Data oqimi

Backend ulangan (`../server`, Express + Prisma). Komponent hech qachon data'ni to'g'ridan-to'g'ri import qilmaydi:

```
backend  →  shared/api/client.ts  →  *.api.ts  →  *.hook.ts  →  komponent
             (axios + interceptor)   (endpoint)   (useQuery)
```

`*.data.ts` fake fayllari **o'chirilgan** — faqat `menu`, `stats` va `marquee` statik bo'lib qoldi.

### `shared/api`

| Fayl | Vazifasi |
|---|---|
| `client.ts` | axios instance, `API_BASE_URL`, `ApiError`, tiplangan `api.get/post/patch/delete` |
| `token.ts` | localStorage kaliti, `auth:change` eventi, `subscribeToken` |
| `types.ts` | `ApiResponse<T>` |
| `imageUrl.ts` | `/uploads/...` → backend manzili |

Backend javobi doim `{ success, message, data }` — qobiq `client.ts` da ochiladi, chaqiruvchi toza `T` oladi. Interceptorlar: har so'rovga `Bearer` token qo'shadi; **401** da tokenni tozalaydi (admin login formasiga qaytadi); xato xabarini backenddan olib `Error.message` ga chiqaradi — UI o'z matnini yozmaydi, backend xabari o'zbekcha keladi.

⚠️ `NEXT_PUBLIC_API_URL` — `.env.local` da (namuna `.env.example` da). Berilmasa `http://localhost:4000`.

⚠️ 4xx javoblarda React Query qayta urinmaydi (`QueryProvider` dagi `retry`) — aks holda 404 uch marta so'ralib, "topilmadi" kech chiqadi.

| Feature | API | Hook | Query key |
|---|---|---|---|
| `project` | `projectApi.getAll()` / `.getBySlug(slug)` | `useProjects()` / `useProject(slug)` | `["projects"]` / `["projects", slug]` |
| `blog` | `blogApi.getAll()` / `.getBySlug(slug)` | `useBlogPosts()` / `useBlogPost(slug)` | `["posts"]` / `["posts", slug]` |
| `about` | `aboutApi.get()` | `useAbout()` | `["about"]` |
| `contact` | `contactApi.get()` | `useContact()` | `["contact"]` |

Yozish (admin) mutatsiyalari shu fayllarda yonma-yon turadi: `useCreate*` / `useUpdate*` / `useDelete*`, hammasi muvaffaqiyatdan keyin o'z kalitini `invalidate` qiladi.

**`about` uchun bitta endpoint** tanlangan: `GET /about` uchala bo'limni (`content`, `experience`, `toolbox`) bitta javobda qaytaradi. Sababi — uchala bo'lim ham bitta ekranda, bir vaqtda ko'rinadi, alohida so'rov qilish uchta loading holati va uchta round-trip degani bo'lardi. CRUD esa **alohida** endpointlarda: `PATCH /api/about/content`, `POST|PATCH|DELETE /api/about/experience/:id`, xuddi shunday `/api/about/toolbox/:id`. `GET /api/about` faqat o'qish uchun read-model bo'lib qoladi.

**`contact`** ham bitta obyekt qaytaradi va tarjimasiz — batafsil `STRUCTURE.md` da.

`stats` va `menu` — statik, API qatlami yo'q (`Stats` hatto server komponenti, client JS yubormaydi).

### Server vs client komponentlar

Query ishlatadigan hamma narsa `"use client"`. Statik matnli bo'limlar esa server komponenti bo'lib qoladi va `getTranslations()` ishlatadi — `Footer`, `Stats`, `WorkIntro`, `BlogIntro`, `ContactIntro`. Yangi bo'lim yozganda avval "bunga hook kerakmi?" deb so'rang; kerak bo'lmasa server komponenti qiling.

⚠️ Client-side query tufayli SSR HTML'da **skeleton** chiqadi, kontent emas. Bu SEO uchun cheklov — kelajakda `HydrationBoundary` bilan server prefetch qo'shish mumkin. (Kulgili tomoni: `/blog` dagi "Skeleton yaxshi yechim emas edi" posti aynan shu haqda.)

## Multilingual

**URL'da locale segmenti yo'q** (`/uz`, `/en` emas) — til **cookie** orqali aniqlanadi:

- `src/i18n/request.ts` — `cookies().get("locale")`, qo'llab-quvvatlanadigan `["uz", "en"]`, default **`uz`**
- `src/i18n/set-locale.ts` — server action, cookie 1 yilga
- `LnaguageSwitcher` — `setLocale()` chaqiradi, keyin `router.refresh()`
- `layout.tsx` — `getLocale()` + `getMessages()` → `NextIntlClientProvider`

Tarjimalar **ikki xil joyda** saqlanadi, va bu ataylab:

| Joy | Nima uchun |
|---|---|
| `src/messages/{uz,en}.json` | UI matnlari — `useTranslations()` / `getTranslations()`, `t.rich()` bilan inline teglar (`<accent>`) |
| `*.data.ts` (feature ichida) | Kontent datasi — `content[locale]` (`STRUCTURE.md` ga qarang) |

Namespace'lar: `HomePage`, `AboutPage`, `WorkPage`, `BlogPage`, `ContactPage`, `ProjectPage`, `Footer`.

Yangi tarjima qo'shganda: **UI matni** → `messages/*.json`, **kontent datasi** → tegishli `*.data.ts`. Data ikkala tilda ham bitta javobda keladi — til almashganda qayta so'rov ketmaydi.

⚠️ Chegara har doim ham ravshan emas. Ikkita misol:
- Blog `theme` — data'da `"architecture"` **kaliti** turadi, ko'rinadigan yorliq (`BlogPage.themes.architecture`) esa messages'da. Data kalitni saqlaydi, tarjimani emas.
- Contact kanal yorliqlari (`EMAIL`, `TELEFON`) — messages'da, chunki bular UI matni; `email` va `phoneNumber` qiymatlari esa data'da, chunki ular tilga qarab o'zgarmaydi.

## Takrorlanuvchi komponentlar

### `Marquee`

Ikki variant, bitta komponent (RAF mantiqi bir marta yozilgan):

| Prop | Qiymatlar | Izoh |
|---|---|---|
| `variant` | `"accent"` (default) / `"plain"` | accent — bosh sahifadagi vermilion tasma; plain — fonsiz, ink rangdagi katta sarlavha (contact) |
| `direction` | `"left"` (default) / `"right"` | contact sahifasida o'ngga |
| `separator` | default `"✦"` | contact'da `"—"` |
| `items` | default `marqueeItems` | contact'da sarlavha uch marta takrorlanadi — bitta so'z uzluksiz lenta uchun yetmaydi |

Teskari yo'nalishda lenta `-setWidth` dan boshlanadi, aks holda birinchi kadrlarda chap tomonda bo'shliq ochiladi.

### `Markdown`

`src/features/blog/components/Markdown.tsx` — blog postidagi `post` maydonini chiqaradi. **Kutubxona yo'q**, ~200 qatorlik parser.

Sababi: har bir element loyiha stiliga bo'ysunishi kerak (`font-display` sarlavhalar, vermilion kvadrat bullet'lar, teskari rangdagi kod bloklari), ya'ni `react-markdown` bilan ham butun `components` xaritasini yozish kerak bo'lardi — farq faqat parser'da.

Qo'llab-quvvatlanadi: `##` / `###`, ``` bloklari, `-` va `1.` ro'yxatlar, `**qalin**`, `` `inline kod` ``, `[matn](url)`.
Yo'q: jadval, rasm, blockquote, ichma-ich ro'yxat.

Kengaytirish kerak bo'lsa **faqat shu fayl** almashtiriladi — chaqiruvchi komponentlar o'zgarmaydi.

## Scrollbar

`globals.css` da global: 14px, yumaloqlanishsiz, qog'oz yo'lak + `border-left: 2px solid ink`, ink polzunok (atrofida 3px qog'oz "tirqish"), hover'da vermilion.

- Firefox faqat `scrollbar-width` + `scrollbar-color` ni tushunadi — u yerda chegara va tirqish bo'lmaydi, rang sxemasi qoladi.
- `.scroll-invert` klassi — to'q fonli ichki konteynerlar uchun (hozircha blog kod bloklarida).
- ⚠️ Sahifaning asosiy scrollbar'i `<html>` darajasida, ya'ni **route'ga qarab o'zgarmaydi** — `/work/[slug]` to'q fonli sahifasida ham qog'oz rangda qoladi.

## Hozirgi holat

**Tayyor — barcha sahifalar:**
- Header — sticky, blur, mobil burger menyu (portal backdrop, scroll lock)
- Footer — `(site)` layout darajasida
- Til tanlagich — aktiv til belgisi bilan
- `/` — Hero, Marquee, SelectedWork (3 ta loyiha, scroll'da stagger), Stats
- `/work` — barcha loyihalar, har qatori alohida scroll animatsiyasi bilan
- `/work/[slug]` — to'q fonli batafsil sahifa: galereya (autoplay + fullscreen `ViewImage`), muammo/yechim, hissa, qiyinchilik, natijalar, tech chiplar, CTA
- `/about` — sarlavha, ikki ustunli bio, Experience, Toolbox
- `/blog` — yozuvlar ro'yxati (sana • mavzu, sarlavha, hover'da to'liq qator teskari rangda)
- `/blog/[slug]` — chrome'siz o'qish sahifasi, markdown
- `/contact` — o'ngga harakatlanuvchi "Gaplashaylik" marquee, tavsif + vermilion CTA, kanallar setkasi

**Admin panel — `/admin`, to'liq tayyor:**
- Kirish: `/admin` ga kirilganda token bo'lmasa **shu sahifada** login formasi chiqadi (redirect yo'q), token localStorage'da. 401 kelsa token o'chadi va forma qaytadi
- Bo'limlar: Proyekt (CRUD + rasm yuklash), Blog (CRUD + markdown editor), About (matn upsert, tajriba va toolbox CRUD), Kontakt (upsert)
- Saqlangandan keyin: toast + bitta orqaga (ro'yxatga / dashboard'ga); about'da inline forma yopiladi
- O'chirish har joyda **ikki bosqichli tasdiq** bilan
- Admin matnlari faqat o'zbekcha, komponent ichida — `messages/*.json` da emas (admin bitta odam uchun)

**Hali yo'q:**
- Server prefetch (`HydrationBoundary`) — SSR HTML'da hamon skeleton chiqadi

## Ma'lum kamchiliklar

Bular bilib turib qoldirilgan, tuzatish navbat bilan:

1. `layout.tsx` da `<html lang="en">` qattiq yozilgan — locale `uz` bo'lganda ham `en` qoladi.
2. Fayl/papka nomlarida typo: `LnaguageSwitcher.tsx`, `marque.data.ts`, `shared/contstans/`.
3. `HeroCta` dagi "See selected work" matni tarjima qilinmagan — hardcode.
4. Cookie asosidagi til statik render va SEO'ni cheklaydi; kelajakda `/[locale]` routing kerak bo'lishi mumkin.
5. `metadata` hali `"Create Next App"` — o'zgartirilmagan.
6. `Locale` type **besh joyda** takrorlangan (`menu.data.ts`, `project.type.ts`, `about.type.ts`, `blog.type.ts`, `stats.data.ts`) — feature'lar bir-biridan import qilmasligi uchun. Kerak bo'lsa `shared/types/` ga chiqariladi.
7. `constants.ts` da `EASE` bor, lekin ko'p komponent uni o'z ichida qayta e'lon qilgan.
8. About'dagi tajriba ro'yxati hamon namunaviy — admin paneldan haqiqiy CV bilan almashtirilishi kerak.
9. **Tipografiya to'liq moslashtirilmagan.** Dizaynda barcha tavsif paragraflari Archivo `600` og'irlikda; loyihada `font-body` tokeni qo'shilgan va **faqat contact** sahifasida qo'llangan. Hero, `/work`, `/blog` intro va about bio hamon `font-display` (Archivo Black) bilan, ya'ni dizayndan qalinroq.
10. Blog `theme` ro'yxati ikki joyda: `blog.type.ts` dagi `BLOG_THEMES` (kalitlar) va `messages/{uz,en}.json` (yorliqlar) — yangi mavzu qo'shsangiz ikkalasiga ham yozing, aks holda next-intl xato beradi.
