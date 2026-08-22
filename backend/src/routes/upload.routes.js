import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    const allowed = allowedTypes.has(file.mimetype);
    callback(allowed ? null : new Error("Only JPG, PNG and WEBP images are allowed"), allowed);
  },
});

export const uploadRouter = Router();
uploadRouter.post("/product-image", requireAdmin, upload.single("image"), uploadImage);

