import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

function purchaseStatus(status) {
  if (status === "Delivered") return "Delivered";
  if (["Shipped", "Out for delivery"].includes(status)) return "Shipped";
  return "Processing";
}

async function hydratedCustomerState(user) {
  const cartItems = user.cart || [];
  const productIds = [...new Set(cartItems.map((item) => item.productId))];
  const products = await Product.find({ id: { $in: productIds }, deletedAt: null }).lean();
  const productMap = new Map(products.map((product) => [product.id, product]));
  const cart = cartItems.flatMap((item) => {
    const product = productMap.get(item.productId);
    return product ? [{ ...product, _id: undefined, size: item.size, quantity: item.quantity }] : [];
  });
  const orders = await Order.find({ customerUid: user.firebaseUid }).sort({ createdAtTimestamp: -1 }).lean();
  return {
    profile: { uid: user.firebaseUid, name: user.displayName, email: user.email, phone: user.phone || user.checkoutDraft?.phone || "", joinedAt: new Date(user.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) },
    likedIds: user.wishlistIds || [],
    cart,
    checkout: user.checkoutDraft || {},
    purchases: orders.map((order) => ({ id: order.id, date: order.createdAt, status: purchaseStatus(order.status), total: order.total, productIds: order.items.map((item) => item.productId) })),
    orders,
  };
}

export async function getCustomerState(request, response) {
  const user = await User.findOne({ firebaseUid: request.customer.firebase.uid }).lean();
  response.json({ data: await hydratedCustomerState(user) });
}

export async function updateProfile(request, response) {
  const user = await User.findOneAndUpdate({ firebaseUid: request.customer.firebase.uid }, request.validated.body, { new: true, runValidators: true }).lean();
  response.json({ data: await hydratedCustomerState(user) });
}

export async function replaceCart(request, response) {
  const items = request.validated.body.items;
  const ids = [...new Set(items.map((item) => item.productId))];
  const products = await Product.find({ id: { $in: ids }, active: true, deletedAt: null }).lean();
  const productMap = new Map(products.map((product) => [product.id, product]));
  const seen = new Map();
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product || !product.sizes.includes(item.size)) continue;
    const key = `${item.productId}:${item.size}`;
    seen.set(key, Math.min((seen.get(key) || 0) + item.quantity, 10));
  }
  const normalized = [...seen].map(([key, quantity]) => { const [productId, size] = key.split(":"); return { productId: Number(productId), size, quantity }; });
  const user = await User.findOneAndUpdate({ firebaseUid: request.customer.firebase.uid }, { cart: normalized }, { new: true }).lean();
  response.json({ data: await hydratedCustomerState(user) });
}

export async function updateWishlist(request, response) {
  const { productId, liked } = request.validated.body;
  const exists = await Product.exists({ id: productId, active: true, deletedAt: null });
  if (!exists) return response.status(404).json({ error: { message: "Product not found" } });
  const update = liked ? { $addToSet: { wishlistIds: productId } } : { $pull: { wishlistIds: productId } };
  const user = await User.findOneAndUpdate({ firebaseUid: request.customer.firebase.uid }, update, { new: true }).lean();
  response.json({ data: { likedIds: user.wishlistIds } });
}

export async function updateCheckout(request, response) {
  const user = await User.findOneAndUpdate({ firebaseUid: request.customer.firebase.uid }, { checkoutDraft: request.validated.body, phone: request.validated.body.phone }, { new: true }).lean();
  response.json({ data: { checkout: user.checkoutDraft } });
}
