import { Notification } from "../models/Notification.js";
import { createNotification } from "../services/notification.service.js";

export async function listNotifications(request, response) {
  const limit = Math.min(Math.max(Number(request.query.limit) || 20, 1), 50);
  const notifications = await Notification.find().sort({ createdAt: -1 }).limit(limit).lean();
  response.json({ data: notifications });
}

export async function addNotification(request, response) {
  const notification = await createNotification(request.body);
  response.status(201).json({ data: notification });
}

export async function markNotificationRead(request, response) {
  const notification = await Notification.findByIdAndUpdate(request.params.id, { read: true }, { new: true }).lean();
  if (!notification) return response.status(404).json({ error: { message: "Notification not found" } });
  response.json({ data: notification });
}

export async function markAllNotificationsRead(_request, response) {
  await Notification.updateMany({ read: false }, { read: true });
  response.status(204).end();
}

