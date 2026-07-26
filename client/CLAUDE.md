@AGENTS.md
@md/CONTEXT.md
@md/STRUCTURE.md

# Style system

Barcha token'lar `src/app/globals.css` da. Tailwind **v4**, CSS-first — `tailwind.config.*` **yo'q**, yangi token `@theme inline` blokiga qo'shiladi.

## Ranglar

`:root` da xom qiymat, `@theme inline` da utility'ga bog'langan:

| CSS var | Qiymat | Utility | Qayerda ishlatiladi |
|---|---|---|---|
| `--paper` | `#ede7da` | `bg-paper` `text-paper` | Sahifa foni, to'q fon ustidagi matn |
| `--ink` | `#0c0c0c` | `bg-ink` `text-ink` `border-ink` | Asosiy matn, chegaralar, to'ldirilgan tugma |
| `--vermilion` | `#ff3b00` | `bg-accent` `text-accent` | Aksent: logo badge, marquee foni, aktiv holat |
| `--electric-blue` | `#1a1aff` | `bg-electric-blue` | Faqat `::selection` |
| `--signal-green` | `#00b341` | `bg-signal-green` | "Available for work" pulsli nuqta |

Shaffoflik uchun slash sintaksisi: `bg-ink/10` (hover), `border-ink/15` (ichki ajratgich), `text-ink/40` (ikkilamchi matn), `bg-paper/70` (blur ostidagi header).

⚠️ **`--accent` ikki xil ma'noda.** shadcn'ning `--accent` (kulrang, `oklch(0.97 0 0)`) hali ham `:root` da turibdi, lekin `@theme inline` da `--color-accent: var(--vermilion)`. Ya'ni `bg-accent` → vermilion, `bg-accent-foreground` → shadcn kulrangi. shadcn komponentlarida `focus:bg-accent` kutilmagan natija berishi mumkin — buni har safar tekshiring.

## Fontlar

`src/app/layout.tsx` da `next/font/google` orqali, `<html>` ga variable sifatida biriktiriladi.

| Utility | Font | Vazifasi |
|---|---|---|
| `font-display` | Archivo Black (400) | Sarlavhalar, logo, marquee, kartochka qiymatlari |
| `font-body` | Archivo (variable, 400–900) | Tavsif paragraflari — dizaynda ular `600` og'irlikda |
| `font-accent` | Instrument Serif italic (400) | Ta'kidlangan so'zlar — "jonov", `<accent>` teg ichi |
| `font-mono` | JetBrains Mono | **Body default** — meta, nav, tugmalar, yorliqlar |

`--font-heading` ham `--font-mono` ga qaratilgan. `body` va `html` ikkalasida ham mono default.

⚠️ **Archivo Black yagona og'irlikda keladi** — `font-display` bilan `font-semibold` yozsangiz hech narsa o'zgarmaydi. Dizayndagi tavsif paragraflari (`font-weight: 600`) uchun `font-body` kerak. Hozircha u faqat contact sahifasida qo'llangan; hero, `/work`, `/blog` intro va about bio hamon `font-display` bilan, ya'ni dizayndan qalinroq.

## Matn o'lchamlari

Loyihada **uch xil matn darajasi** bor, boshqasi deyarli ishlatilmaydi:

**1. Micro-label** — nav, tugmalar, meta, dropdown. Har doim to'liq bir xil:
```
font-mono text-xs font-bold uppercase tracking-wide
```

**2. Body / description** — ikki xil holat:
- Eski (hero, `/work`, `/blog`, about): `font-display text-lg md:text-2xl font-normal leading-normal`, kengligi `max-w-172`, aksent `font-accent italic text-xl md:text-2xl`.
- Dizaynga mos (contact): `font-body font-semibold text-[clamp(1.2rem,2.4vw,1.8rem)] leading-[1.25] max-w-[520px]`, aksent esa **o'lchamini meros qiladi** — `font-accent font-normal italic`, kattalashmaydi.

Yangi tavsif yozganda ikkinchisini ishlating.

**3. Display** — inline `style` bilan clamp:
- Hero H1: `clamp(3rem, 15vw, 15rem)`, `fontWeight: 900`, `lineHeight: 0.82`, `letterSpacing: -0.04em`, `uppercase`
- Marquee: `text-[clamp(2rem,5vw,4rem)] tracking-wide`
- Mobil menyu linklari: `font-display text-2xl uppercase tracking-tight`
- Logo: `font-display text-xl font-bold` (badge `text-sm`)

## Takrorlanuvchi patternlar

**Pill** — ikki variant, ikkalasi ham `rounded-full` + micro-label:
- To'ldirilgan: `bg-ink text-paper px-6 py-3` (HeroCta, aktiv nav)
- Chegarali: `border-2 border-ink text-ink px-4 py-2 hover:bg-ink/10` (LanguageSwitcher, burger)

**Chegaralar** — tashqi ajratgichlar har doim `border-2 border-ink` yoki `h-0.5 bg-ink`; ichki, yumshoq ajratgichlar `border-b border-ink/15`.

**Aktiv holat belgisi** — `h-2 w-2 rounded-full`, aktiv `bg-accent`, nofaol `bg-ink/20`, matn `text-accent`. Mobil menyu va til tanlagichda bir xil.

**Layout** — gorizontal padding faqat `<Container>` orqali: `mx-auto w-full px-6 md:px-7`. Komponentlarda o'zicha padding bermang.

**Header** — `sticky top-0 z-50 border-b-2 border-ink bg-paper/70 backdrop-blur-md backdrop-saturate-150`.

**Kartochka setkasi** — ichki chiziqlar `border` bilan emas, `gap-0.5` + ota fon usuli bilan: `grid gap-0.5 border-2 border-ink bg-ink`, har bir katak `bg-paper`. Elementlar soni o'zgarsa ham chiziqlar to'g'ri joylashadi (`ToolboxSection`, `ContactChannels`).

**Scrollbar** — `globals.css` da global: 14px, yumaloqlanishsiz, qog'oz yo'lak + `border-left: 2px solid ink`, ink polzunok (3px qog'oz "tirqish" bilan), hover'da vermilion. To'q fonli ichki konteynerlar uchun `.scroll-invert` klassi. Firefox faqat rang sxemasini oladi.

## Animatsiya (framer-motion)

- Standart ease: `[0.2, 0.8, 0.2, 1]` — hero, mobil menyu, blur.
- Davomiyligi: micro `0.2–0.3s`, panel ochilishi `0.42s`, hero kirishi `0.8s`.
- Spring: `stiffness 300–380`, `damping 20–30` (nav `layoutId="active-pill"`, CTA strelkasi).
- Stagger: `staggerChildren: 0.06`, `delayChildren: 0.08`; yopilganda `0.03` + `staggerDirection: -1`.
- Rang o'tishlari: `transition-colors duration-200`.

## Responsive

Yagona breakpoint — **`md`**. Undan pastda mobil, tepasida desktop. Desktop nav `hidden md:flex`, mobil menyu `md:hidden`.

## Ma'lum tuzoqlar

1. **shadcn `DropdownMenuItem`** base class'ida `focus:**:text-accent-foreground` bor — bu `**:` bilan **barcha avlodlarga** rang majburlaydi va sizning span'laringizni bosadi. Yechim: rangni `!` bilan mahkamlash (`text-accent!`) va to'q fon o'rniga `focus:bg-ink/10` ishlatish.
2. **Header'da `backdrop-filter` bor** — demak u ichidagi `fixed` elementlar uchun *containing block*. Butun ekranni qoplashi kerak bo'lgan overlay'ni `createPortal` bilan `document.body` ga chiqaring, aks holda u header ichida qolib ketadi.
3. `.dark` variant `globals.css` da e'lon qilingan, lekin loyihada **dark mode yo'q** — hech qayerda `dark:` ishlatilmagan.
