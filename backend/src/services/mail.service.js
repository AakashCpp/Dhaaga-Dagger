import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  if (env.mailMode === "console") {
    transporter = nodemailer.createTransport({ jsonTransport: true });
    return transporter;
  }
  if (env.mailMode !== "smtp" || !env.smtpHost || !env.smtpUser || !env.smtpPass) {
    const error = new Error("SMTP is not configured");
    error.status = 503;
    throw error;
  }
  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: { user: env.smtpUser, pass: env.smtpPass },
  });
  return transporter;
}

export async function verifyAdminMailer() {
  if (env.mailMode === "console") return { mode: "console", ready: env.nodeEnv !== "production" };
  await getTransporter().verify();
  return { mode: "smtp", ready: true };
}

export async function sendAdminOtp(email, code) {
  const info = await getTransporter().sendMail({
    from: env.mailFrom,
    to: email,
    subject: "Your Dhaaga & Dagger admin access code",
    text: `Your admin verification code is ${code}. It expires in ${env.adminOtpExpiryMinutes} minutes. If you did not request this code, ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;color:#121d2e;max-width:520px;padding:28px"><p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#9b3025">Dhaaga &amp; Dagger</p><h1 style="font-size:24px">Admin verification</h1><p>Use this code to continue to the operations workspace:</p><p style="font-size:34px;font-weight:700;letter-spacing:.18em;margin:28px 0">${code}</p><p style="font-size:13px;color:#596575">This code expires in ${env.adminOtpExpiryMinutes} minutes. If you did not request it, ignore this email.</p></div>`,
  });
  if (env.mailMode === "console") console.log(`Admin OTP for ${email}: ${code}`, info.message);
}

export async function sendCustomerOtp(email, code) {
  const info = await getTransporter().sendMail({
    from: env.mailFrom,
    to: email,
    subject: "Verify your Dhaaga & Dagger order",
    text: `Your order verification code is ${code}. It expires in ${env.orderOtpExpiryMinutes} minutes. If you did not request this code, ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;color:#121d2e;max-width:520px;padding:28px"><p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#9b3025">Dhaaga &amp; Dagger</p><h1 style="font-size:24px">Verify your order</h1><p>Use this code to continue securely with your order:</p><p style="font-size:34px;font-weight:700;letter-spacing:.18em;margin:28px 0">${code}</p><p style="font-size:13px;color:#596575">This code expires in ${env.orderOtpExpiryMinutes} minutes. If you did not request it, ignore this email.</p></div>`,
  });
  if (env.mailMode === "console") console.log(`Customer OTP for ${email}: ${code}`, info.message);
}
