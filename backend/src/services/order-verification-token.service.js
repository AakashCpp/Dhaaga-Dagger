import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const issuer = "dhaaga-dagger-api";
const audience = "dhaaga-dagger-order-verification";

export function createOrderVerificationToken(firebaseUid, email) {
  return jwt.sign({ purpose: "order-email-verification", email }, env.orderTokenSecret, {
    subject: firebaseUid,
    issuer,
    audience,
    expiresIn: `${env.orderTokenExpiryMinutes}m`,
  });
}

export function verifyOrderVerificationToken(token) {
  return jwt.verify(token, env.orderTokenSecret, { issuer, audience });
}
