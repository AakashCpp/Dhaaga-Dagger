import { createHash } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

export function productImageDigest(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

export async function uploadProductImage(file) {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    const error = new Error("Cloudinary image storage is not configured");
    error.status = 503;
    throw error;
  }

  const digest = productImageDigest(file.buffer);
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: "dhaaga-dagger/products",
      public_id: digest,
      unique_filename: false,
      overwrite: true,
      resource_type: "image",
      context: { sha256: digest, source: "admin-product-upload" },
      transformation: [{ width: 1800, height: 2200, crop: "limit", quality: "auto" }],
    }, (error, result) => {
      if (error || !result?.secure_url) reject(error || new Error("Cloudinary upload failed"));
      else resolve(result.secure_url);
    });
    stream.end(file.buffer);
  });
}
