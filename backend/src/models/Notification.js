import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ["order", "product", "system"], default: "system", index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, required: true, trim: true, maxlength: 280 },
  actor: { type: String, trim: true, maxlength: 100, default: "Store" },
  orderId: { type: String, trim: true, index: true },
  read: { type: Boolean, default: false, index: true },
}, { timestamps: true, versionKey: false });

notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

