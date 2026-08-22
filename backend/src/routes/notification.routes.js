import { Router } from "express";
import { addNotification, listNotifications, markAllNotificationsRead, markNotificationRead } from "../controllers/notification.controller.js";
import { requireAdmin } from "../middleware/auth.js";

export const notificationRouter = Router();
notificationRouter.use(requireAdmin);
notificationRouter.get("/", listNotifications);
notificationRouter.post("/", addNotification);
notificationRouter.patch("/read-all", markAllNotificationsRead);
notificationRouter.patch("/:id/read", markNotificationRead);
