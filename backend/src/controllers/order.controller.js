import { randomInt } from "node:crypto";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { emitAdminEvent } from "../realtime/hub.js";
import { createNotification } from "../services/notification.service.js";

const statuses = ["Placed", "Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"];
const displayTime = () => new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export async function listOrders(request, response) {
  const limit = Math.min(Math.max(Number(request.query.limit) || 50, 1), 100);
  const filter = request.query.status && statuses.includes(request.query.status) ? { status: request.query.status } : {};
  const orders = await Order.find(filter).sort({ createdAtTimestamp: -1, _id: -1 }).limit(limit).lean();
  response.json({ data: orders });
}

export async function listCustomerOrders(request, response) {
  const orders = await Order.find({ customerUid: request.customer.firebase.uid }).sort({ createdAtTimestamp: -1 }).lean();
  response.json({ data: orders });
}

export async function getCustomerOrder(request, response) {
  const order = await Order.findOne({ id: request.validated.params.id, customerUid: request.customer.firebase.uid }).lean();
  if (!order) return response.status(404).json({ error: { message: "Order not found" } });
  response.json({ data: order });
}

export async function createOrder(request, response) {
  const payload = request.validated.body;
  if (payload.id) {
    const existing = await Order.findOne({ id: payload.id, customerUid: request.customer.firebase.uid }).lean();
    if (existing) return response.status(200).json({ data: existing, duplicate: true });
  }

  const combined = new Map();
  for (const item of payload.items) {
    const key = `${item.productId}:${item.size}`;
    combined.set(key, { ...item, quantity: Math.min((combined.get(key)?.quantity || 0) + item.quantity, 10) });
  }

  const reserved = [];
  let committed = false;
  try {
    for (const requested of combined.values()) {
      const product = await Product.findOneAndUpdate(
        { id: requested.productId, active: true, deletedAt: null, sizes: requested.size, stock: { $gte: requested.quantity } },
        { $inc: { stock: -requested.quantity } },
        { new: true },
      ).lean();
      if (!product) {
        const error = new Error(`Selected size is unavailable or out of stock for product ${requested.productId}`);
        error.status = 409;
        throw error;
      }
      reserved.push({ product, requested });
    }

    const items = reserved.map(({ product, requested }) => ({ productId: product.id, name: product.name, image: product.image, size: requested.size, quantity: requested.quantity, price: product.price }));
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = subtotal > 3000 ? 200 : 0;
    const total = subtotal - discount;
    const at = displayTime();
    const id = payload.id || `DK${Date.now().toString(36).toUpperCase()}${randomInt(10, 99)}`;
    const order = await Order.create({
      id,
      customerUid: request.customer.firebase.uid,
      customer: { name: payload.customer.name, phone: payload.customer.phone, email: request.customer.firebase.email },
      address: payload.address,
      city: payload.city,
      pin: payload.pin,
      state: payload.state,
      landmark: payload.landmark,
      createdAt: at,
      status: "Placed",
      payment: payload.payment,
      paymentStatus: "Pending",
      subtotal,
      discount,
      total,
      items,
      history: [{ status: "Placed", at }],
    });
    await User.updateOne({ firebaseUid: request.customer.firebase.uid }, { cart: [], phone: payload.customer.phone, checkoutDraft: { phone: payload.customer.phone, fullName: payload.customer.name, pin: payload.pin, address: payload.address, landmark: payload.landmark, city: payload.city, state: payload.state, payment: payload.payment } });
    committed = true;
    const serialized = order.toObject();
    const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
    createNotification({ type: "order", title: `New order from ${serialized.customer.name}`, message: `#${serialized.id} · ${quantity} ${quantity === 1 ? "piece" : "pieces"} · ${serialized.payment}`, actor: serialized.customer.name, orderId: serialized.id })
      .catch((error) => console.error(`Could not create order notification: ${error.message}`));
    emitAdminEvent("order:created", serialized);
    return response.status(201).json({ data: serialized });
  } catch (error) {
    if (!committed && reserved.length) await Promise.all(reserved.map(({ product, requested }) => Product.updateOne({ id: product.id }, { $inc: { stock: requested.quantity } })));
    throw error;
  }
}

export async function updateOrderStatus(request, response) {
  const { id } = request.validated.params;
  const { status } = request.validated.body;
  const order = await Order.findOne({ id });
  if (!order) return response.status(404).json({ error: { message: "Order not found" } });
  const currentIndex = statuses.indexOf(order.status);
  const nextIndex = statuses.indexOf(status);
  if (nextIndex < currentIndex || nextIndex > currentIndex + 1) return response.status(409).json({ error: { message: `Order can only move from ${order.status} to ${statuses[currentIndex + 1] || order.status}` } });
  if (nextIndex === currentIndex) return response.json({ data: order.toObject() });
  const at = displayTime();
  order.status = status;
  order.history.push({ status, at });
  if (status === "Delivered" && order.payment === "COD") order.paymentStatus = "Paid";
  await order.save();
  const serialized = order.toObject();
  emitAdminEvent("order:updated", serialized);
  response.json({ data: serialized });
}
