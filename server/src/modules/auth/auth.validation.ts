import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({ message: "Username kiritilishi shart" })
    .trim()
    .min(3, "Username kamida 3 ta belgi bo'lishi kerak"),
  password: z
    .string({ message: "Parol kiritilishi shart" })
    .min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
});

export const loginSchema = z.object({
  username: z
    .string({ message: "Username kiritilishi shart" })
    .trim()
    .min(3, "Username kamida 3 ta belgi bo'lishi kerak"),
  password: z
    .string({ message: "Parol kiritilishi shart" })
    .min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
