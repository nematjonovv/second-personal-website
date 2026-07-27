import {
  errors,
  localized,
  ref,
  secured,
  slugParam,
  success,
  type ModuleDocs,
  type Schema,
} from "../../shared/openapi";

const SLUG_PATTERN = "^[a-z0-9]+(?:-[a-z0-9]+)*$";

const jsonField = (description: string, example: string) => ({
  type: "string" as const,
  description: `JSON string. ${description}`,
  examples: [example],
});

const contentExample =
  '{"uz":{"description":"...","problem":"...","solution":"...","myContribution":["..."],"challenge":"...","result":["..."]},"en":{...}}';

const multipartFields: Record<string, Schema> = {
  slug: {
    type: "string",
    pattern: SLUG_PATTERN,
    description: "Ixtiyoriy. Yuborilmasa `title` dan yasaladi.",
    examples: ["aurora-crm"],
  },
  title: { type: "string", examples: ["Aurora CRM"] },
  date: jsonField("Proyekt sanasi.", '{"month":3,"year":2026}'),
  techStack: jsonField("Texnologiyalar ro'yxati.", '["Next.js","TypeScript"]'),
  role: jsonField("Rollar ro'yxati.", '["Fullstack"]'),
  githubUrl: { type: "string", format: "uri", examples: ["https://github.com/user/repo"] },
  liveUrl: { type: "string", format: "uri", examples: ["https://aurora.example.com"] },
  content: jsonField("Ikki tilli kontent, har birida 6 ta maydon.", contentExample),
};

const galleryFiles: Schema = {
  type: "array",
  description: "Rasm fayllari (jpg/jpeg/png/webp). Har biri webp'ga o'giriladi. Maks 5MB, 10 fayl.",
  items: { type: "string", format: "binary" },
};

export const projectDocs: ModuleDocs = {
  schemas: {
    ProjectContent: {
      type: "object",
      required: ["description", "problem", "solution", "myContribution", "challenge", "result"],
      properties: {
        description: { type: "string" },
        problem: { type: "string" },
        solution: { type: "string" },
        myContribution: { type: "array", items: { type: "string" }, minItems: 1 },
        challenge: { type: "string" },
        result: { type: "array", items: { type: "string" }, minItems: 1 },
      },
    },
    Project: {
      type: "object",
      required: ["slug", "title", "date", "techStack", "role", "gallery", "content"],
      description:
        "Client'ning `Project` tipiga aynan mos. `id` va `createdAt` chiqmaydi; `githubUrl`/`liveUrl` bo'sh bo'lsa umuman qo'shilmaydi.",
      properties: {
        slug: { type: "string", examples: ["aurora-crm"] },
        title: { type: "string", examples: ["Aurora CRM"] },
        date: {
          type: "object",
          required: ["month", "year"],
          properties: {
            month: { type: "integer", minimum: 1, maximum: 12 },
            year: { type: "integer", minimum: 1970, maximum: 2100 },
          },
        },
        techStack: { type: "array", items: { type: "string" } },
        role: { type: "array", items: { type: "string" } },
        gallery: {
          type: "array",
          items: { type: "string", examples: ["/uploads/projects/uuid.webp"] },
        },
        githubUrl: { type: "string", format: "uri" },
        liveUrl: { type: "string", format: "uri" },
        content: localized(ref("ProjectContent")),
      },
    },
  },

  paths: {
    "/api/projects": {
      get: {
        tags: ["Projects"],
        summary: "Proyektlar ro'yxati",
        description: "Tartib: `year DESC, month DESC` — client tartiblamaydi.",
        responses: {
          200: success("Proyektlar ro'yxati", { type: "array", items: ref("Project") }),
          ...errors("ServerError"),
        },
      },
      post: {
        tags: ["Projects"],
        summary: "Yangi proyekt 🔒",
        description: "Kamida bitta rasm shart. Massiv tartibi = yuklash tartibi.",
        security: secured,
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "date", "techStack", "role", "content", "gallery"],
                properties: { ...multipartFields, gallery: galleryFiles },
              },
            },
          },
        },
        responses: {
          201: success("Proyekt yaratildi", ref("Project")),
          ...errors("BadRequest", "Unauthorized", "Conflict", "PayloadTooLarge", "ServerError"),
        },
      },
    },

    "/api/projects/{slug}": {
      get: {
        tags: ["Projects"],
        summary: "Bitta proyekt",
        parameters: [slugParam("slug", "Proyekt slug'i")],
        responses: {
          200: success("Proyekt topildi", ref("Project")),
          ...errors("NotFound", "ServerError"),
        },
      },
      patch: {
        tags: ["Projects"],
        summary: "Proyektni yangilash 🔒",
        description: [
          "Hamma maydon ixtiyoriy. `gallery` bu yerda **ikki ma'noda** ishlatiladi:",
          "",
          "- **matn maydoni** — saqlanadigan mavjud path'lar (JSON massiv, tartibi bilan)",
          "- **fayl maydoni** — yangi rasmlar, doim oxiriga qo'shiladi",
          "",
          "Ro'yxatdan tushib qolgan rasmlar diskdan o'chiriladi. Na matn, na fayl kelmasa gallery umuman tegilmaydi. Yakuniy massiv bo'sh qolsa 400.",
        ].join("\n"),
        security: secured,
        parameters: [slugParam("slug", "Proyekt slug'i")],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  ...multipartFields,
                  gallery: {
                    oneOf: [
                      jsonField(
                        "Saqlanadigan mavjud rasm path'lari.",
                        '["/uploads/projects/1.webp","/uploads/projects/2.webp"]',
                      ),
                      galleryFiles,
                    ],
                    description: "Matn maydoni (saqlanadiganlar) va/yoki fayl maydoni (yangilar).",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: success("Proyekt yangilandi", ref("Project")),
          ...errors(
            "BadRequest",
            "Unauthorized",
            "NotFound",
            "Conflict",
            "PayloadTooLarge",
            "ServerError",
          ),
        },
      },
      delete: {
        tags: ["Projects"],
        summary: "Proyektni o'chirish 🔒",
        description: "DB yozuvi va gallery'dagi barcha fayllar birga o'chadi.",
        security: secured,
        parameters: [slugParam("slug", "Proyekt slug'i")],
        responses: {
          200: success("Proyekt o'chirildi"),
          ...errors("Unauthorized", "NotFound", "ServerError"),
        },
      },
    },
  },
};
