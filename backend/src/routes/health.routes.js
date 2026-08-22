import { Router } from "express";
import { healthCheck, readinessCheck } from "../controllers/health.controller.js";

export const healthRouter = Router();
healthRouter.get("/", healthCheck);
healthRouter.get("/ready", readinessCheck);

