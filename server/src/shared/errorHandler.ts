import { ErrorRequestHandler } from "express";
import { MulterError } from "multer";
import { ApiError } from "./ApiError";
import { MAX_FILES, MAX_FILE_SIZE } from "./upload";

const MULTER_MESSAGES: Record<string, { status: number; message: string }> = {
  LIMIT_FILE_SIZE: {
    status: 413,
    message: `Rasm hajmi ${MAX_FILE_SIZE / (1024 * 1024)}MB dan oshmasligi kerak`,
  },
  LIMIT_FILE_COUNT: {
    status: 400,
    message: `Bir vaqtda ko'pi bilan ${MAX_FILES} ta rasm yuklash mumkin`,
  },
  LIMIT_UNEXPECTED_FILE: {
    status: 400,
    message: "Rasm fayllari 'gallery' maydonida yuborilishi kerak",
  },
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ success: false, message: err.message, data: null });
    return;
  }

  if (err instanceof MulterError) {
    const mapped = MULTER_MESSAGES[err.code] ?? { status: 400, message: "Rasm yuklashda xatolik" };
    res.status(mapped.status).json({ success: false, message: mapped.message, data: null });
    return;
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Serverda xatolik yuz berdi", data: null });
};
