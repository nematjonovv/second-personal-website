import { z, ZodType } from "zod";

const jsonField = <T extends ZodType>(schema: T) =>
  z.preprocess((value, ctx) => {
    if (typeof value !== "string") {
      return value;
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        message: `JSON formati noto'g'ri (${(error as Error).message})`,
      });
      return z.NEVER;
    }
  }, schema);

const nonEmptyStrings = z.array(z.string().trim().min(1)).min(1);

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const contentShape = {
  description: z.string().trim().min(1, "description bo'sh bo'lmasligi kerak"),
  problem: z.string().trim().min(1, "problem bo'sh bo'lmasligi kerak"),
  solution: z.string().trim().min(1, "solution bo'sh bo'lmasligi kerak"),
  myContribution: nonEmptyStrings,
  challenge: z.string().trim().min(1, "challenge bo'sh bo'lmasligi kerak"),
  result: nonEmptyStrings,
};

const projectContentSchema = z.object(contentShape);

const localeContentSchema = (locale: "uz" | "en") =>
  z.object(contentShape, { error: `content.${locale} to'liq kiritilishi shart` });

const dateSchema = z.object({
  month: z.number().int().min(1, "month 1 dan 12 gacha bo'lishi kerak").max(12, "month 1 dan 12 gacha bo'lishi kerak"),
  year: z.number().int().min(1970, "year 1970 dan 2100 gacha bo'lishi kerak").max(2100, "year 1970 dan 2100 gacha bo'lishi kerak"),
});

const contentSchema = z.object({
  uz: localeContentSchema("uz"),
  en: localeContentSchema("en"),
});

export const createProjectSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(SLUG_PATTERN, "slug faqat kichik harf, raqam va defisdan iborat bo'lishi kerak")
    .optional(),
  title: z.string().trim().min(1, "title kiritilishi shart"),
  date: jsonField(dateSchema),
  techStack: jsonField(nonEmptyStrings),
  role: jsonField(nonEmptyStrings),
  githubUrl: z.url("githubUrl to'g'ri URL bo'lishi kerak").optional(),
  liveUrl: z.url("liveUrl to'g'ri URL bo'lishi kerak").optional(),
  content: jsonField(contentSchema),
});

export const updateProjectSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(SLUG_PATTERN, "slug faqat kichik harf, raqam va defisdan iborat bo'lishi kerak")
    .optional(),
  title: z.string().trim().min(1, "title bo'sh bo'lmasligi kerak").optional(),
  date: jsonField(dateSchema).optional(),
  techStack: jsonField(nonEmptyStrings).optional(),
  role: jsonField(nonEmptyStrings).optional(),
  githubUrl: z.union([z.url("githubUrl to'g'ri URL bo'lishi kerak"), z.literal("")]).optional(),
  liveUrl: z.union([z.url("liveUrl to'g'ri URL bo'lishi kerak"), z.literal("")]).optional(),
  content: jsonField(contentSchema).optional(),
  gallery: jsonField(z.array(z.string().trim().min(1))).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectContentInput = z.infer<typeof projectContentSchema>;
