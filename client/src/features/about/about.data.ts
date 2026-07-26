import type { About } from "./about.type";

export const about: About = {
  content: {
    uz: {
      headline: {
        before: "Detallar ustida ",
        accent: "terlaydigan",
        after: " muhandis",
      },
      bio: {
        primary: {
          before:
            "Men 6+ yillik tajribaga ega fullstack dasturchiman — noaniq g'oyalarni ishlaydigan mahsulotga aylantiraman. Butun stack'ni yaxshi ko'raman: ma'lumotni to'g'ri modellashtirish, toza API chegaralari chizish va oxirida interfeysni ",
          accent: "bemalol",
          after: " his qildirish.",
        },
        secondary:
          "Ishimning katta qismi TypeScript'da. Ishlash tezligi, foydalanish qulayligi va keyingi odam o'qiy oladigan kod men uchun muhim. Klaviaturadan tashqarida: mexanik klaviaturalar, uzun maqolalar va allaqachon ishlab turgan narsalarni shunchaki tushunish uchun qaytadan qurish.",
      },
    },
    en: {
      headline: {
        before: "Engineer who ",
        accent: "sweats",
        after: " the details",
      },
      bio: {
        primary: {
          before:
            "I'm a fullstack developer with 6+ years of turning fuzzy ideas into shipped software. I like the whole stack: modeling data properly, drawing clean API boundaries, and then making the interface feel ",
          accent: "effortless",
          after: ".",
        },
        secondary:
          "Most of my work lives in TypeScript. I care about performance budgets, accessible interfaces, and code that the next person can actually read. Off-keyboard: mechanical keyboards, long-form articles, and rebuilding things that already work just to understand them better.",
      },
    },
  },

  experience: [
    {
      id: "freelance",
      company: "Freelance",
      period: { from: 2023, to: null },
      content: {
        uz: {
          role: "Senior Fullstack Muhandis",
          summary:
            "Startaplar uchun mahsulotlarni boshdan oxirigacha quraman — arxitektura, yetkazib berish va orasidagi noqulay qismlar.",
        },
        en: {
          role: "Senior Fullstack Engineer",
          summary:
            "Building products end-to-end for startups — architecture, delivery, and the awkward parts in between.",
        },
      },
    },
    {
      id: "payme",
      company: "Payme",
      period: { from: 2021, to: 2023 },
      content: {
        uz: {
          role: "Fullstack Muhandis",
          summary:
            "Oyiga millionlab tranzaksiyaga xizmat qiladigan to'lov va solishtirish oqimlariga javobgar edim.",
        },
        en: {
          role: "Fullstack Engineer",
          summary:
            "Owned checkout and reconciliation flows serving millions of transactions a month.",
        },
      },
    },
    {
      id: "uzum",
      company: "Uzum",
      period: { from: 2019, to: 2021 },
      content: {
        uz: {
          role: "Frontend Dasturchi",
          summary:
            "Dizayn tizimini qurdim va do'kon interfeysini tezlik hamda qulaylik uchun qaytadan yozdim.",
        },
        en: {
          role: "Frontend Developer",
          summary:
            "Built the design system and rebuilt the storefront for speed and accessibility.",
        },
      },
    },
  ],

  toolbox: [
    {
      id: "frontend",
      label: { uz: "Frontend", en: "Frontend" },
      items: ["React", "Next.js", "TypeScript", "Svelte", "Tailwind"],
    },
    {
      id: "backend",
      label: { uz: "Backend", en: "Backend" },
      items: ["Node", "Go", "tRPC", "GraphQL", "REST"],
    },
    {
      id: "data",
      label: { uz: "Ma'lumot", en: "Data" },
      items: ["Postgres", "Redis", "Prisma", "SQLite"],
    },
    {
      id: "infra",
      label: { uz: "Infratuzilma", en: "Infra" },
      items: ["Docker", "AWS", "CI/CD", "Terraform"],
    },
  ],
};
