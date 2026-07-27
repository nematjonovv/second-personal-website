import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import type { OpenAPIV3_1 } from "openapi-types";
import { aboutDocs } from "../modules/about/about.docs";
import { authDocs } from "../modules/auth/auth.docs";
import { blogDocs } from "../modules/blog/blog.docs";
import { contactDocs } from "../modules/contact/contact.docs";
import { healthDocs } from "../modules/health/health.docs";
import { projectDocs } from "../modules/project/project.docs";
import { PORT } from "./constants";
import { MAX_FILES, MAX_FILE_SIZE } from "./upload";
import type { ModuleDocs, Paths, Schemas } from "./openapi";

const MODULES: ModuleDocs[] = [
  healthDocs,
  authDocs,
  projectDocs,
  blogDocs,
  contactDocs,
  aboutDocs,
];

const paths: Paths = Object.assign({}, ...MODULES.map((module) => module.paths));
const schemas: Schemas = Object.assign({}, ...MODULES.map((module) => module.schemas ?? {}));

const errorSchema = (message: string): OpenAPIV3_1.SchemaObject => ({
  type: "object",
  required: ["success", "message", "data"],
  properties: {
    success: { type: "boolean", examples: [false] },
    message: { type: "string", examples: [message] },
    data: { type: "null" },
  },
});

const errorResponse = (description: string, message: string): OpenAPIV3_1.ResponseObject => ({
  description,
  content: { "application/json": { schema: errorSchema(message) } },
});

export const openApiDocument: OpenAPIV3_1.Document = {
  openapi: "3.1.0",
  info: {
    title: "Shaxsiy sayt API",
    version: "1.0.0",
    description: [
      "Shaxsiy sayt backend'i — sayt kontentini ikki tilda saqlaydi va admin panel uchun himoyalangan CRUD beradi.",
      "",
      "### Javob shakli",
      "Barcha endpointlar — muvaffaqiyat ham, xato ham — bir xil uch maydon qaytaradi:",
      "```json",
      '{ "success": true, "message": "...", "data": null }',
      "```",
      "Xatoda `data` doim `null`, xabar o'zbekcha.",
      "",
      "### i18n",
      "API doim **ikkala tilni** qaytaradi (`{ uz, en }`), `?locale=` query param yo'q — tilni client tanlaydi.",
      "",
      "### Auth",
      "🔒 belgisi qo'yilgan endpointlar `Authorization: Bearer <token>` talab qiladi.",
      "Token `POST /api/auth/login` dan olinadi, HS256, **1 soat** amal qiladi (refresh token yo'q).",
      "O'ng yuqoridagi **Authorize** tugmasi orqali tokenni kiritsangiz, quyidagi so'rovlar avtomatik imzolanadi.",
      "",
      "### Rasm yuklash",
      `Multipart, mime whitelist: jpeg / png / webp. Maksimum ${MAX_FILE_SIZE / (1024 * 1024)}MB/fayl, ${MAX_FILES} fayl.`,
      "Kiruvchi format har qanday bo'lsin — saqlanadigan format doim **webp**, path `/uploads/<papka>/<uuid>.webp`.",
    ].join("\n"),
  },

  servers: [{ url: `http://localhost:${PORT}`, description: "Lokal" }],

  tags: [
    { name: "Health", description: "Server holati" },
    { name: "Auth", description: "Login va admin foydalanuvchilar" },
    { name: "Projects", description: "Proyektlar — rasm bilan, multipart" },
    { name: "Blog", description: "Blog postlari — ikki tilli markdown" },
    { name: "Contact", description: "Kontakt ma'lumotlari — yagona yozuv" },
    { name: "About", description: "About: matn, tajriba va toolbox" },
  ],

  paths: paths as OpenAPIV3_1.Document["paths"],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "`POST /api/auth/login` qaytargan token.",
      },
    },
    schemas,
    responses: {
      BadRequest: errorResponse(
        "Validatsiya xatosi. Xabar `maydon.yo'li: xabar` formatida, faqat birinchi xato qaytadi.",
        "title: title kiritilishi shart",
      ),
      Unauthorized: errorResponse(
        "Token yuborilmadi, yaroqsiz yoki muddati tugagan.",
        "Token yuborilmadi",
      ),
      NotFound: errorResponse("Resurs topilmadi.", "Proyekt topilmadi"),
      Conflict: errorResponse(
        "Takrorlanadigan unique qiymat (slug, username, id).",
        "Bunday slug bilan proyekt allaqachon mavjud",
      ),
      PayloadTooLarge: errorResponse(
        "Rasm hajmi limitdan oshdi.",
        `Rasm hajmi ${MAX_FILE_SIZE / (1024 * 1024)}MB dan oshmasligi kerak`,
      ),
      ServerError: errorResponse(
        "Kutilmagan xato. Asl xato konsolga log qilinadi, clientga umumiy matn ketadi.",
        "Serverda xatolik yuz berdi",
      ),
    },
  },
};

const router = express.Router();

router.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:"],
      },
    },
  }),
);

router.get("/openapi.json", (_req, res) => {
  res.json(openApiDocument);
});

router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: "Shaxsiy sayt API",
    swaggerOptions: { persistAuthorization: true, docExpansion: "list", tryItOutEnabled: true },
  }),
);

export const docsRouter = router;
