import type { AboutContent, Experience, ToolboxGroup } from "../../generated/prisma/client";
import type { AboutContentInput, ExperienceContentInput } from "./about.validation";

export type AboutContentResponse = { uz: AboutContentInput; en: AboutContentInput };

export type ExperienceResponse = {
  id: string;
  company: string;
  period: { from: number; to: number | null };
  content: { uz: ExperienceContentInput; en: ExperienceContentInput };
};

export type ToolboxGroupResponse = {
  id: string;
  items: string[];
  label: { uz: string; en: string };
};

export type AboutResponse = {
  content: AboutContentResponse;
  experience: ExperienceResponse[];
  toolbox: ToolboxGroupResponse[];
};

export const ABOUT_ID = "about";

export const DEFAULT_ABOUT_CONTENT: AboutContentResponse = {
  uz: {
    headline: { before: "Detallar ustida ", accent: "terlaydigan", after: " muhandis" },
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
    headline: { before: "Engineer who ", accent: "sweats", after: " the details" },
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
};

export function toAboutContentResponse(content: AboutContent): AboutContentResponse {
  return {
    uz: content.uz as unknown as AboutContentInput,
    en: content.en as unknown as AboutContentInput,
  };
}

export function toExperienceResponse(experience: Experience): ExperienceResponse {
  return {
    id: experience.key,
    company: experience.company,
    period: { from: experience.fromYear, to: experience.toYear },
    content: {
      uz: experience.uz as unknown as ExperienceContentInput,
      en: experience.en as unknown as ExperienceContentInput,
    },
  };
}

export function toToolboxGroupResponse(group: ToolboxGroup): ToolboxGroupResponse {
  return {
    id: group.key,
    items: group.items,
    label: { uz: group.labelUz, en: group.labelEn },
  };
}
