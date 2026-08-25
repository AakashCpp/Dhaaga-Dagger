import { Router } from "express";
import { createOrder, getCustomerOrder, getOrderAnalytics, listCustomerOrders, listOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { requireAdmin, requireCustomer, requireOrderVerification } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema, orderIdSchema, orderStatusSchema } from "../validation/schemas.js";

export const orderRouter = Router();
orderRouter.get("/mine", requireCustomer, listCustomerOrders);
orderRouter.get("/mine/:id", requireCustomer, validate(orderIdSchema), getCustomerOrder);
orderRouter.get("/analytics", requireAdmin, getOrderAnalytics);
orderRouter.get("/", requireAdmin, listOrders);
orderRouter.post("/", requireCustomer, requireOrderVerification, validate(createOrderSchema), createOrder);
orderRouter.patch("/:id/status", requireAdmin, validate(orderStatusSchema), updateOrderStatus);
