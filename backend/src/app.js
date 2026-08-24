import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import { healthRouter } from "./routes/health.routes.js";
import { notificationRouter } from "./routes/notification.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { adminProductRouter, productRouter } from "./routes/product.routes.js";
import { customerRouter } from "./routes/customer.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.clientOrigins, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 15 * 60_000, limit: 600, standardHeaders: "draft-8", legacyHeaders: false }));
app.get("/", (_request, response) => response.json({
  service: "Dhaaga & Dagger API",
  health: "/api/v1/health",
  version: "v1",
}));
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/admin/products", adminProductRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/uploads", uploadRouter);

app.use(notFound);
app.use(errorHandler);
