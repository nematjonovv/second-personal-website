import multer from "multer";
import { ApiError } from "./ApiError";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_FILES = 10;

export const uploadImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new ApiError(400, "Faqat jpg, jpeg, png va webp formatdagi rasmlar qabul qilinadi"));
      return;
    }
    cb(null, true);
  },
});
