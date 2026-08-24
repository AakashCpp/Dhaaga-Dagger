import { AdminOtp } from "../models/AdminOtp.js";
import { CustomerOtp } from "../models/CustomerOtp.js";
import { env } from "../config/env.js";
import { createAdminToken } from "../services/admin-token.service.js";
import { generateOtp, hashOtp, otpMatches } from "../services/admin-otp.service.js";
import { sendAdminOtp, sendCustomerOtp } from "../services/mail.service.js";
import { customerOtpMatches, generateCustomerOtp, hashCustomerOtp } from "../services/customer-otp.service.js";
import { createOrderVerificationToken } from "../services/order-verification-token.service.js";

const genericOtpResponse = { message: "If this email is authorized, a verification code has been sent." };

function adminAuthReady() {
  if (!env.adminEmail) return false;
  if (env.mailMode === "smtp" && (!env.smtpHost || !env.smtpUser || !env.smtpPass)) return false;
  if (env.nodeEnv !== "production") return env.mailMode === "console" || env.mailMode === "smtp";
  return env.mailMode === "smtp"
    && !env.adminOtpSecret.startsWith("development-only")
    && !env.adminTokenSecret.startsWith("development-only");
}

function customerOtpReady() {
  if (env.mailMode === "smtp" && (!env.smtpHost || !env.smtpUser || !env.smtpPass)) return false;
  if (env.nodeEnv !== "production") return env.mailMode === "console" || env.mailMode === "smtp";
  return env.mailMode === "smtp"
    && !env.orderOtpSecret.startsWith("development-only")
    && !env.orderTokenSecret.startsWith("development-only");
}

export function customerSession(request, response) {
  response.json({ data: request.customer.user });
}

export async function requestCustomerCode(request, response) {
  if (!customerOtpReady()) return response.status(503).json({ error: { message: "Order email verification is not configured" } });
  const firebaseUid = request.customer.firebase.uid;
  const email = request.customer.firebase.email.toLowerCase();
  const code = generateCustomerOtp();
  const expiresAt = new Date(Date.now() + env.orderOtpExpiryMinutes * 60_000);
  await CustomerOtp.deleteMany({ firebaseUid });
  const otp = await CustomerOtp.create({ firebaseUid, email, codeHash: hashCustomerOtp(firebaseUid, email, code), expiresAt });
  try {
    await sendCustomerOtp(email, code);
  } catch (error) {
    await CustomerOtp.deleteOne({ _id: otp._id });
    throw error;
  }
  response.status(202).json({
    message: "A verification code has been sent to your Google account email.",
    email,
    ...(env.nodeEnv === "development" && env.mailMode === "console" ? { devCode: code } : {}),
  });
}

export async function verifyCustomerCode(request, response) {
  if (!customerOtpReady()) return response.status(503).json({ error: { message: "Order email verification is not configured" } });
  const firebaseUid = request.customer.firebase.uid;
  const email = request.customer.firebase.email.toLowerCase();
  const code = String(request.body.code || "").trim();
  if (!/^\d{6}$/.test(code)) return response.status(401).json({ error: { message: "Invalid or expired verification code" } });
  const otp = await CustomerOtp.findOne({ firebaseUid, email, usedAt: null, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
  if (!otp || otp.attempts >= 5) return response.status(401).json({ error: { message: "Invalid or expired verification code" } });
  if (!customerOtpMatches(firebaseUid, email, code, otp.codeHash)) {
    otp.attempts += 1;
    await otp.save();
    return response.status(401).json({ error: { message: "Invalid or expired verification code" } });
  }
  otp.usedAt = new Date();
  await otp.save();
  response.json({ data: {
    token: createOrderVerificationToken(firebaseUid, email),
    expiresAt: new Date(Date.now() + env.orderTokenExpiryMinutes * 60_000).toISOString(),
  } });
}

export async function requestAdminCode(request, response) {
  if (!adminAuthReady()) return response.status(503).json({ error: { message: "Admin authentication is not configured" } });
  const email = String(request.body.email || "").trim().toLowerCase();
  if (!email || email !== env.adminEmail) return response.status(202).json(genericOtpResponse);

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + env.adminOtpExpiryMinutes * 60_000);
  await AdminOtp.deleteMany({ email });
  const otp = await AdminOtp.create({ email, codeHash: hashOtp(email, code), expiresAt });
  try {
    await sendAdminOtp(email, code);
  } catch (error) {
    await AdminOtp.deleteOne({ _id: otp._id });
    throw error;
  }

  response.status(202).json({
    ...genericOtpResponse,
    ...(env.nodeEnv === "development" && env.mailMode === "console" ? { devCode: code } : {}),
  });
}

export async function verifyAdminCode(request, response) {
  if (!adminAuthReady()) return response.status(503).json({ error: { message: "Admin authentication is not configured" } });
  const email = String(request.body.email || "").trim().toLowerCase();
  const code = String(request.body.code || "").trim();
  const remember = Boolean(request.body.remember);
  if (email !== env.adminEmail || !/^\d{6}$/.test(code)) {
    return response.status(401).json({ error: { message: "Invalid or expired verification code" } });
  }

  const otp = await AdminOtp.findOne({ email, usedAt: null, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
  if (!otp || otp.attempts >= 5) return response.status(401).json({ error: { message: "Invalid or expired verification code" } });
  if (!otpMatches(email, code, otp.codeHash)) {
    otp.attempts += 1;
    await otp.save();
    return response.status(401).json({ error: { message: "Invalid or expired verification code" } });
  }

  otp.usedAt = new Date();
  await otp.save();
  response.json({ data: { token: createAdminToken(email, remember), admin: { email, role: "admin" } } });
}

export function adminSession(request, response) {
  response.json({ data: { email: request.admin.email, role: "admin" } });
}
