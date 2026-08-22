import { Router } from "express";
import { createOrder, getCustomerOrder, listCustomerOrders, listOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { requireAdmin, requireCustomer } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema, orderIdSchema, orderStatusSchema } from "../validation/schemas.js";

export const orderRouter = Router();
orderRouter.get("/mine", requireCustomer, listCustomerOrders);
orderRouter.get("/mine/:id", requireCustomer, validate(orderIdSchema), getCustomerOrder);
orderRouter.get("/", requireAdmin, listOrders);
orderRouter.post("/", requireCustomer, validate(createOrderSchema), createOrder);
orderRouter.patch("/:id/status", requireAdmin, validate(orderStatusSchema), updateOrderStatus);

