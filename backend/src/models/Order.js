import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  name: { type: String, required: true, trim: true },
  image: { type: String, default: "" },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
}, { _id: false });

const historySchema = new mongoose.Schema({
  status: { type: String, required: true },
  at: { type: String, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, trim: true, index: true },
  customerUid: { type: String, required: true, trim: true, index: true },
  customer: {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
  },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  pin: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true, default: "Not provided" },
  landmark: { type: String, trim: true, default: "" },
  createdAt: { type: String, required: true },
  status: { type: String, enum: ["Placed", "Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"], default: "Placed", index: true },
  payment: { type: String, enum: ["COD", "UPI", "Card"], required: true },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending" },
  subtotal: { type: Number, required: true, min: 0, default: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0, default: 0 },
  items: { type: [orderItemSchema], validate: (items) => items.length > 0 },
  history: { type: [historySchema], default: [] },
}, {
  timestamps: { createdAt: "createdAtTimestamp", updatedAt: "updatedAtTimestamp" },
  versionKey: false,
});

orderSchema.index({ createdAtTimestamp: -1 });

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
