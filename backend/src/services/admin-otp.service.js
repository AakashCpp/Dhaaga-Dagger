import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { env } from "../config/env.js";

export function generateOtp() {
  return randomInt(100000, 1000000).toString();
}

export function hashOtp(email, code) {
  return createHmac("sha256", env.adminOtpSecret).update(`${email}:${code}`).digest("hex");
}

export function otpMatches(email, code, expectedHash) {
  const actual = Buffer.from(hashOtp(email, code));
  const expected = Buffer.from(expectedHash);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

