import { z } from "zod";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const keySchema = z
  .string()
  .trim()
  .regex(SLUG_PATTERN, "id faqat kichik harf, raqam va defisdan iborat bo'lishi kerak");

const accentTextSchema = z.object({
  before: z.string(),
  accent: z.string().trim().min(1, "accent bo'sh bo'lmasligi kerak"),
  after: z.string(),
});

const aboutContentShape = {
  headline: accentTextSchema,
  bio: z.object({
    primary: accentTextSchema,
    secondary: z.string().trim().min(1, "secondary bo'sh bo'lmasligi kerak"),
  }),
};

const aboutContentSchema = z.object(aboutContentShape);

const localeAboutSchema = (locale: "uz" | "en") =>
  z.object(aboutContentShape, { error: `content.${locale} to'liq kiritilishi shart` });

export const updateAboutContentSchema = z.object({
  content: z.object({
    uz: localeAboutSchema("uz"),
    en: localeAboutSchema("en"),
  }),
});

const yearSchema = z
  .number()
  .int()
  .min(1970, "yil 1970 dan 2100 gacha bo'lishi kerak")
  .max(2100, "yil 1970 dan 2100 gacha bo'lishi kerak");

const periodSchema = z
  .object({ from: yearSchema, to: yearSchema.nullable() })
  .refine((period) => period.to === null || period.to >= period.from, {
    error: "period.to period.from dan kichik bo'lmasligi kerak",
    path: ["to"],
  });

const experienceContentShape = {
  role: z.string().trim().min(1, "role bo'sh bo'lmasligi kerak"),
  summary: z.string().trim().min(1, "summary bo'sh bo'lmasligi kerak"),
};

const experienceContentSchema = z.object(experienceContentShape);

const localeExperienceSchema = (locale: "uz" | "en") =>
  z.object(experienceContentShape, { error: `content.${locale} to'liq kiritilishi shart` });

const experienceContentPairSchema = z.object({
  uz: localeExperienceSchema("uz"),
  en: localeExperienceSchema("en"),
});

export const createExperienceSchema = z.object({
  id: keySchema,
  company: z.string().trim().min(1, "company kiritilishi shart"),
  period: periodSchema,
  content: experienceContentPairSchema,
});

export const updateExperienceSchema = z.object({
  company: z.string().trim().min(1, "company bo'sh bo'lmasligi kerak").optional(),
  period: periodSchema.optional(),
  content: experienceContentPairSchema.optional(),
});

export const createToolboxGroupSchema = z.object({
  id: keySchema,
  label: z.object(
    {
      uz: z.string().trim().min(1, "label.uz bo'sh bo'lmasligi kerak"),
      en: z.string().trim().min(1, "label.en bo'sh bo'lmasligi kerak"),
    },
    { error: "label to'liq kiritilishi shart" },
  ),
  items: z.array(z.string().trim().min(1)).min(1, "kamida bitta item kiritilishi kerak"),
  position: z.number().int().min(0, "position manfiy bo'lmasligi kerak").optional(),
});

export const updateToolboxGroupSchema = z.object({
  label: z
    .object({
      uz: z.string().trim().min(1, "label.uz bo'sh bo'lmasligi kerak"),
      en: z.string().trim().min(1, "label.en bo'sh bo'lmasligi kerak"),
    })
    .optional(),
  items: z.array(z.string().trim().min(1)).min(1, "kamida bitta item kiritilishi kerak").optional(),
  position: z.number().int().min(0, "position manfiy bo'lmasligi kerak").optional(),
});

export type UpdateAboutContentInput = z.infer<typeof updateAboutContentSchema>;
export type AboutContentInput = z.infer<typeof aboutContentSchema>;
export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
export type ExperienceContentInput = z.infer<typeof experienceContentSchema>;
export type CreateToolboxGroupInput = z.infer<typeof createToolboxGroupSchema>;
export type UpdateToolboxGroupInput = z.infer<typeof updateToolboxGroupSchema>;
