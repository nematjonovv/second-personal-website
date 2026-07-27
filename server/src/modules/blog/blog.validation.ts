import { z } from "zod";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const contentShape = {
  title: z.string().trim().min(1, "title bo'sh bo'lmasligi kerak"),
  post: z.string().trim().min(1, "post bo'sh bo'lmasligi kerak"),
};

const blogPostContentSchema = z.object(contentShape);

const localeContentSchema = (locale: "uz" | "en") =>
  z.object(contentShape, { error: `content.${locale} to'liq kiritilishi shart` });

const contentSchema = z.object({
  uz: localeContentSchema("uz"),
  en: localeContentSchema("en"),
});

const slugSchema = z
  .string()
  .trim()
  .regex(SLUG_PATTERN, "slug faqat kichik harf, raqam va defisdan iborat bo'lishi kerak");

const themeSchema = z
  .string()
  .trim()
  .regex(SLUG_PATTERN, "theme faqat kichik harf, raqam va defisdan iborat bo'lishi kerak");

const createdAtSchema = z.iso.datetime("createdAt ISO formatda bo'lishi kerak, masalan 2026-06-18T09:00:00.000Z");

export const createBlogPostSchema = z.object({
  slug: slugSchema.optional(),
  theme: themeSchema,
  createdAt: createdAtSchema.optional(),
  content: contentSchema,
});

export const updateBlogPostSchema = z.object({
  slug: slugSchema.optional(),
  theme: themeSchema.optional(),
  createdAt: createdAtSchema.optional(),
  content: contentSchema.optional(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogPostContentInput = z.infer<typeof blogPostContentSchema>;
