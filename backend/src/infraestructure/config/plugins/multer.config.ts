import multer from "multer";
import { AppError } from "../../../shared";

const storage = multer.memoryStorage();

// Allowed MIME types for image uploads
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      AppError.badRequest(
        `Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten imágenes (JPEG, PNG, WebP, GIF).`
      )
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
    files: 5, // Max 5 files per request
  },
});
