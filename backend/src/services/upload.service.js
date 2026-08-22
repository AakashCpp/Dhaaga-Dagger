import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

const extensionByMime = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

async function uploadLocal(file) {
  const extension = extensionByMime[file.mimetype] || ".jpg";
  const filename = `${randomUUID()}${extension}`;
  const uploadDirectory = path.resolve(process.cwd(), "uploads");
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, filename), file.buffer);
  return `${env.publicApiUrl}/uploads/${filename}`;
}

async function uploadCloudinary(file) {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    const error = new Error("Cloudinary is not configured");
    error.status = 503;
    throw error;
  }
  cloudinary.config({ cloud_name: env.cloudinaryCloudName, api_key: env.cloudinaryApiKey, api_secret: env.cloudinaryApiSecret, secure: true });
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "dhaaga-dagger/products", resource_type: "image", transformation: [{ width: 1800, height: 2200, crop: "limit", quality: "auto", fetch_format: "auto" }] }, (error, result) => {
      if (error || !result) reject(error || new Error("Upload failed"));
      else resolve(result.secure_url);
    });
    stream.end(file.buffer);
  });
}

export function uploadProductImage(file) {
  return env.uploadProvider === "cloudinary" ? uploadCloudinary(file) : uploadLocal(file);
}

