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

const keyParam = slugParam("id", "Yozuvning `id` si (DB'dagi `key`), masalan `freelance`");

const keyField: Schema = {
  type: "string",
  pattern: SLUG_PATTERN,
  description: "Ma'noli kalit. Create'da beriladi, PATCH bilan o'zgartirilmaydi.",
  examples: ["freelance"],
};

const periodField: Schema = {
  type: "object",
  required: ["from", "to"],
  properties: {
    from: { type: "integer", minimum: 1970, maximum: 2100, examples: [2023] },
    to: {
      type: ["integer", "null"],
      description: "`null` — hozirgacha. `from` dan kichik bo'lishi mumkin emas.",
      examples: [null],
    },
  },
};

const labelField: Schema = {
  type: "object",
  required: ["uz", "en"],
  properties: { uz: { type: "string", examples: ["Frontend"] }, en: { type: "string" } },
};

const itemsField: Schema = {
  type: "array",
  minItems: 1,
  items: { type: "string" },
  examples: [["React", "Next.js", "TypeScript"]],
};

const positionField: Schema = {
  type: "integer",
  minimum: 0,
  description:
    "Ro'yxatdagi o'rni. POST'da berilmasa oxiriga qo'shiladi. PATCH shunchaki o'rnatadi — qolgan guruhlar surilmaydi.",
};

export const aboutDocs: ModuleDocs = {
  schemas: {
    AccentText: {
      type: "object",
      required: ["before", "accent", "after"],
      description:
        "Client matnni uch bo'lakka bo'lib chizadi: before + <accent> + after. `before`/`after` bo'sh satr bo'lishi mumkin, `accent` — yo'q.",
      properties: {
        before: { type: "string", examples: ["Detallar ustida "] },
        accent: { type: "string", minLength: 1, examples: ["terlaydigan"] },
        after: { type: "string", examples: [" muhandis"] },
      },
    },
    AboutContent: {
      type: "object",
      required: ["headline", "bio"],
      properties: {
        headline: ref("AccentText"),
        bio: {
          type: "object",
          required: ["primary", "secondary"],
          properties: { primary: ref("AccentText"), secondary: { type: "string" } },
        },
      },
    },
    ExperienceContent: {
      type: "object",
      required: ["role", "summary"],
      properties: {
        role: { type: "string", examples: ["Senior Fullstack Muhandis"] },
        summary: { type: "string" },
      },
    },
    Experience: {
      type: "object",
      required: ["id", "company", "period", "content"],
      properties: {
        id: keyField,
        company: { type: "string", examples: ["Freelance"] },
        period: periodField,
        content: localized(ref("ExperienceContent")),
      },
    },
    ToolboxGroup: {
      type: "object",
      required: ["id", "items", "label"],
      properties: { id: keyField, items: itemsField, label: labelField },
    },
    About: {
      type: "object",
      required: ["content", "experience", "toolbox"],
      description: "Client'ning `About` tipiga aynan mos — uchala qism bitta obyektda.",
      properties: {
        content: localized(ref("AboutContent")),
        experience: { type: "array", items: ref("Experience") },
        toolbox: { type: "array", items: ref("ToolboxGroup") },
      },
    },
  },

  paths: {
    "/api/about": {
      get: {
        tags: ["About"],
        summary: "About ma'lumotlari (yagona o'qish)",
        description: [
          "Uchta model, bitta javob. Tartib serverdan keladi — client tartiblamaydi:",
          "",
          "- `experience` — `from` bo'yicha kamayish tartibida",
          "- `toolbox` — `position` bo'yicha o'sish tartibida",
          "",
          "`content` yozuvi hali yaratilmagan bo'lsa DB'ga tegilmasdan default matn qaytadi.",
        ].join("\n"),
        responses: {
          200: success("About ma'lumotlari", ref("About")),
          ...errors("ServerError"),
        },
      },
    },

    "/api/about/content": {
      patch: {
        tags: ["About"],
        summary: "About matnini yangilash 🔒",
        description: "Upsert. Ikkala til birga yuboriladi.",
        security: secured,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: { content: localized(ref("AboutContent")) },
              },
            },
          },
        },
        responses: {
          200: success("About matni yangilandi", localized(ref("AboutContent"))),
          ...errors("BadRequest", "Unauthorized", "ServerError"),
        },
      },
    },

    "/api/about/experience": {
      post: {
        tags: ["About"],
        summary: "Yangi tajriba 🔒",
        security: secured,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "company", "period", "content"],
                properties: {
                  id: keyField,
                  company: { type: "string" },
                  period: periodField,
                  content: localized(ref("ExperienceContent")),
                },
              },
            },
          },
        },
        responses: {
          201: success("Tajriba qo'shildi", ref("Experience")),
          ...errors("BadRequest", "Unauthorized", "Conflict", "ServerError"),
        },
      },
    },

    "/api/about/experience/{id}": {
      patch: {
        tags: ["About"],
        summary: "Tajribani yangilash 🔒",
        description: "Hamma maydon ixtiyoriy. `id` o'zgartirilmaydi.",
        security: secured,
        parameters: [keyParam],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  company: { type: "string" },
                  period: periodField,
                  content: localized(ref("ExperienceContent")),
                },
              },
            },
          },
        },
        responses: {
          200: success("Tajriba yangilandi", ref("Experience")),
          ...errors("BadRequest", "Unauthorized", "NotFound", "ServerError"),
        },
      },
      delete: {
        tags: ["About"],
        summary: "Tajribani o'chirish 🔒",
        security: secured,
        parameters: [keyParam],
        responses: {
          200: success("Tajriba o'chirildi"),
          ...errors("Unauthorized", "NotFound", "ServerError"),
        },
      },
    },

    "/api/about/toolbox": {
      post: {
        tags: ["About"],
        summary: "Yangi toolbox guruhi 🔒",
        security: secured,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "label", "items"],
                properties: {
                  id: { ...keyField, examples: ["frontend"] },
                  label: labelField,
                  items: itemsField,
                  position: positionField,
                },
              },
            },
          },
        },
        responses: {
          201: success("Toolbox guruhi qo'shildi", ref("ToolboxGroup")),
          ...errors("BadRequest", "Unauthorized", "Conflict", "ServerError"),
        },
      },
    },

    "/api/about/toolbox/{id}": {
      patch: {
        tags: ["About"],
        summary: "Toolbox guruhini yangilash 🔒",
        description:
          "Hamma maydon ixtiyoriy. Qayta tartiblash uchun har bir guruhga alohida `position` PATCH yuboriladi.",
        security: secured,
        parameters: [keyParam],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { label: labelField, items: itemsField, position: positionField },
              },
            },
          },
        },
        responses: {
          200: success("Toolbox guruhi yangilandi", ref("ToolboxGroup")),
          ...errors("BadRequest", "Unauthorized", "NotFound", "ServerError"),
        },
      },
      delete: {
        tags: ["About"],
        summary: "Toolbox guruhini o'chirish 🔒",
        security: secured,
        parameters: [keyParam],
        responses: {
          200: success("Toolbox guruhi o'chirildi"),
          ...errors("Unauthorized", "NotFound", "ServerError"),
        },
      },
    },
  },
};
