import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function createAdminToken(email, remember = false) {
  return jwt.sign({ role: "admin", email }, env.adminJwtSecret, {
    subject: email,
    issuer: "dhaaga-dagger-api",
    audience: "dhaaga-dagger-admin",
    expiresIn: remember ? "30d" : "8h",
  });
}

export function verifyAdminToken(token) {
  return jwt.verify(token, env.adminJwtSecret, {
    issuer: "dhaaga-dagger-api",
    audience: "dhaaga-dagger-admin",
  });
}

