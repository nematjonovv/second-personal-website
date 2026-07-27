import { z } from "zod";

const username = (field: string) =>
  z
    .string()
    .trim()
    .min(1, `${field} bo'sh bo'lmasligi kerak`)
    .regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, `${field} faqat harf, raqam, nuqta, defis va pastki chiziqdan iborat bo'lishi kerak`);

export const updateContactSchema = z.object({
  email: z.string().trim().pipe(z.email("email to'g'ri manzil bo'lishi kerak")).optional(),
  github: username("github").optional(),
  linkedin: username("linkedin").optional(),
  telegram: username("telegram").optional(),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+[0-9]{9,15}$/, "phoneNumber xalqaro formatda bo'lishi kerak, masalan +998901234567")
    .optional(),
});

export type UpdateContactInput = z.infer<typeof updateContactSchema>;
