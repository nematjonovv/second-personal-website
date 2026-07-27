import { errors, ref, secured, success, type ModuleDocs, type Schema } from "../../shared/openapi";

const USERNAME_PATTERN = "^[A-Za-z0-9][A-Za-z0-9._-]*$";
const PHONE_PATTERN = "^\\+[0-9]{9,15}$";

const fields: Record<string, Schema> = {
  email: { type: "string", format: "email", examples: ["hello@hikmatillo.dev"] },
  github: {
    type: "string",
    pattern: USERNAME_PATTERN,
    description: "Faqat username — havolani client yasaydi.",
    examples: ["hikmatillo"],
  },
  linkedin: { type: "string", pattern: USERNAME_PATTERN, examples: ["hikmatillo"] },
  telegram: { type: "string", pattern: USERNAME_PATTERN, examples: ["hikmatillo"] },
  phoneNumber: {
    type: "string",
    pattern: PHONE_PATTERN,
    description: "Xalqaro format.",
    examples: ["+998901234567"],
  },
};

export const contactDocs: ModuleDocs = {
  schemas: {
    Contact: {
      type: "object",
      required: ["email", "github", "linkedin", "telegram", "phoneNumber"],
      description: "Client'ning `Contact` tipiga aynan mos.",
      properties: { ...fields },
    },
  },

  paths: {
    "/api/contact": {
      get: {
        tags: ["Contact"],
        summary: "Kontakt ma'lumotlari",
        description:
          "Jadval yagona yozuvli (singleton). Yozuv hali yaratilmagan bo'lsa DB'ga tegilmasdan default qiymatlar qaytadi.",
        responses: {
          200: success("Kontakt ma'lumotlari", ref("Contact")),
          ...errors("ServerError"),
        },
      },
      patch: {
        tags: ["Contact"],
        summary: "Kontaktni yangilash 🔒",
        description:
          "Upsert: birinchi chaqiruvda yozuv default qiymatlar asosida yaratiladi, keyingilarida faqat yuborilgan maydonlar o'zgaradi.",
        security: secured,
        requestBody: {
          content: {
            "application/json": { schema: { type: "object", properties: { ...fields } } },
          },
        },
        responses: {
          200: success("Kontakt ma'lumotlari yangilandi", ref("Contact")),
          ...errors("BadRequest", "Unauthorized", "ServerError"),
        },
      },
    },
  },
};
