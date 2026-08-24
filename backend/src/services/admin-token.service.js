import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function createAdminToken(email, remember = false) {
  return jwt.sign({ role: "admin", email }, env.adminTokenSecret, {
    subject: email,
    issuer: "dhaaga-dagger-api",
    audience: "dhaaga-dagger-admin",
    expiresIn: remember ? "30d" : "8h",
  });
}

export function verifyAdminToken(token) {
  return jwt.verify(token, env.adminTokenSecret, {
    issuer: "dhaaga-dagger-api",
    audience: "dhaaga-dagger-admin",
  });
}
