import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { env } from "../config/env.js";

export function generateCustomerOtp() {
  return randomInt(100000, 1000000).toString();
}

export function hashCustomerOtp(firebaseUid, email, code) {
  return createHmac("sha256", env.orderOtpSecret).update(`${firebaseUid}:${email}:${code}`).digest("hex");
}

export function customerOtpMatches(firebaseUid, email, code, expectedHash) {
  const actual = Buffer.from(hashCustomerOtp(firebaseUid, email, code));
  const expected = Buffer.from(expectedHash);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
