import { Notification } from "../models/Notification.js";
import { emitAdminEvent } from "../realtime/hub.js";

export async function createNotification(payload) {
  const notification = await Notification.create(payload);
  const serialized = notification.toObject();
  emitAdminEvent("notification:new", serialized);
  return serialized;
}

