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

const contentField = localized(ref("BlogPostContent"));

const themeField: Schema = {
  type: "string",
  pattern: SLUG_PATTERN,
  description:
    "Client uni `themes.<theme>` i18n kaliti sifatida ishlatadi, shuning uchun slug qolipida.",
  examples: ["architecture"],
};

const createdAtField: Schema = {
  type: "string",
  format: "date-time",
  description: "Ixtiyoriy — eski postni ko'chirish uchun. Yuborilmasa hozirgi vaqt.",
  examples: ["2026-06-18T09:00:00.000Z"],
};

export const blogDocs: ModuleDocs = {
  schemas: {
    BlogPostContent: {
      type: "object",
      required: ["title", "post"],
      properties: {
        title: { type: "string", examples: ["Mikroservislarga shoshilmang"] },
        post: {
          type: "string",
          description:
            "Markdown matn. Server uni parse qilmaydi va o'zgartirmaydi — qanday kelsa shunday saqlanadi va qaytariladi.",
          examples: ["## Sarlavha\n\nMatn **qalin** bilan."],
        },
      },
    },
    BlogPost: {
      type: "object",
      required: ["slug", "theme", "createdAt", "content"],
      description: "Client'ning `BlogPost` tipiga aynan mos.",
      properties: {
        slug: { type: "string", examples: ["mikroservislarga-shoshilmang"] },
        theme: themeField,
        createdAt: { type: "string", format: "date-time" },
        content: contentField,
      },
    },
  },

  paths: {
    "/api/blog": {
      get: {
        tags: ["Blog"],
        summary: "Postlar ro'yxati",
        description: "Tartib: `createdAt DESC` — yangi post birinchi. Client tartiblamaydi.",
        responses: {
          200: success("Postlar ro'yxati", { type: "array", items: ref("BlogPost") }),
          ...errors("ServerError"),
        },
      },
      post: {
        tags: ["Blog"],
        summary: "Yangi post 🔒",
        security: secured,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["theme", "content"],
                properties: {
                  slug: {
                    type: "string",
                    pattern: SLUG_PATTERN,
                    description: "Ixtiyoriy. Yuborilmasa `content.uz.title` dan yasaladi.",
                  },
                  theme: themeField,
                  createdAt: createdAtField,
                  content: contentField,
                },
              },
            },
          },
        },
        responses: {
          201: success("Post yaratildi", ref("BlogPost")),
          ...errors("BadRequest", "Unauthorized", "Conflict", "ServerError"),
        },
      },
    },

    "/api/blog/{slug}": {
      get: {
        tags: ["Blog"],
        summary: "Bitta post",
        parameters: [slugParam("slug", "Post slug'i")],
        responses: {
          200: success("Post topildi", ref("BlogPost")),
          ...errors("NotFound", "ServerError"),
        },
      },
      patch: {
        tags: ["Blog"],
        summary: "Postni yangilash 🔒",
        description: "Hamma maydon ixtiyoriy. `content` yuborilsa ikkala til to'liq bo'lishi shart.",
        security: secured,
        parameters: [slugParam("slug", "Post slug'i")],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  slug: { type: "string", pattern: SLUG_PATTERN },
                  theme: themeField,
                  createdAt: createdAtField,
                  content: contentField,
                },
              },
            },
          },
        },
        responses: {
          200: success("Post yangilandi", ref("BlogPost")),
          ...errors("BadRequest", "Unauthorized", "NotFound", "Conflict", "ServerError"),
        },
      },
      delete: {
        tags: ["Blog"],
        summary: "Postni o'chirish 🔒",
        security: secured,
        parameters: [slugParam("slug", "Post slug'i")],
        responses: {
          200: success("Post o'chirildi"),
          ...errors("Unauthorized", "NotFound", "ServerError"),
        },
      },
    },
  },
};
