import { errors, ref, secured, success, type ModuleDocs, type Schema } from "../../shared/openapi";

const credentials: Schema = {
  type: "object",
  required: ["username", "password"],
  properties: {
    username: { type: "string", minLength: 3, examples: ["admin"] },
    password: { type: "string", minLength: 6, examples: ["admin1"] },
  },
};

export const authDocs: ModuleDocs = {
  schemas: {
    User: {
      type: "object",
      required: ["id", "username", "createdAt"],
      properties: {
        id: { type: "string", format: "uuid" },
        username: { type: "string", examples: ["admin"] },
        createdAt: { type: "string", format: "date-time" },
      },
      description: "Parol hech qachon qaytmaydi.",
    },
    LoginResult: {
      type: "object",
      required: ["user", "token"],
      properties: {
        user: ref("User"),
        token: {
          type: "string",
          description: "HS256 access token, 1 soat amal qiladi. Refresh token yo'q.",
        },
      },
    },
  },

  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Tizimga kirish",
        description:
          "Yagona ochiq auth endpointi. Qaytgan token barcha 🔒 so'rovlarda `Authorization: Bearer <token>` sifatida yuboriladi.",
        requestBody: { required: true, content: { "application/json": { schema: credentials } } },
        responses: {
          200: success("Tizimga kirildi", ref("LoginResult")),
          ...errors("BadRequest", "Unauthorized", "ServerError"),
        },
      },
    },

    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Yangi admin yaratish 🔒",
        description:
          "Ataylab himoyalangan — admin panelga tashqaridan ro'yxatdan o'tib bo'lmaydi. Birinchi foydalanuvchi `npm run db:seed` orqali yaratiladi.",
        security: secured,
        requestBody: { required: true, content: { "application/json": { schema: credentials } } },
        responses: {
          201: success("Foydalanuvchi yaratildi", ref("User")),
          ...errors("BadRequest", "Unauthorized", "Conflict", "ServerError"),
        },
      },
    },

    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Tizimdan chiqish 🔒",
        description:
          "Stateless — server tokenni bekor qilmaydi, client uni o'chiradi. Eski token muddati tugaguncha yaroqli qoladi.",
        security: secured,
        responses: {
          200: success("Tizimdan chiqildi"),
          ...errors("Unauthorized", "ServerError"),
        },
      },
    },
  },
};
