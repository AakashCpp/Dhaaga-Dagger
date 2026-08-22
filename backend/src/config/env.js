import "dotenv/config";

function readOrigins(value) {
  return value.split(",").map((origin) => origin.trim()).filter(Boolean);
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dhaaga_dagger",
  clientOrigins: readOrigins(process.env.CLIENT_ORIGINS || "http://localhost:5173"),
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "",
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  firebasePrivateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  adminEmail: (process.env.ADMIN_EMAIL || "").trim().toLowerCase(),
  adminOtpSecret: process.env.ADMIN_OTP_SECRET || "development-only-change-me",
  adminJwtSecret: process.env.ADMIN_JWT_SECRET || "development-only-change-me-too",
  adminOtpMinutes: Math.max(Number(process.env.ADMIN_OTP_MINUTES || 10), 2),
  mailMode: process.env.MAIL_MODE || "console",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  mailFrom: process.env.MAIL_FROM || "Dhaaga & Dagger <no-reply@dhaagaanddagger.com>",
  publicApiUrl: (process.env.PUBLIC_API_URL || `http://localhost:${Number(process.env.PORT || 5000)}`).replace(/\/$/, ""),
  uploadProvider: process.env.UPLOAD_PROVIDER || (process.env.NODE_ENV === "production" ? "cloudinary" : "local"),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
});
