import { Router } from "express";
import rateLimit from "express-rate-limit";
import { adminSession, customerSession, requestAdminCode, requestCustomerCode, verifyAdminCode, verifyCustomerCode } from "../controllers/auth.controller.js";
import { requireAdmin, requireCustomer } from "../middleware/auth.js";

const otpLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 8, standardHeaders: "draft-8", legacyHeaders: false });

export const authRouter = Router();
authRouter.get("/customer/session", requireCustomer, customerSession);
authRouter.post("/customer/request-code", otpLimiter, requireCustomer, requestCustomerCode);
authRouter.post("/customer/verify-code", otpLimiter, requireCustomer, verifyCustomerCode);
authRouter.post("/admin/request-code", otpLimiter, requestAdminCode);
authRouter.post("/admin/verify-code", otpLimiter, verifyAdminCode);
authRouter.get("/admin/session", requireAdmin, adminSession);
