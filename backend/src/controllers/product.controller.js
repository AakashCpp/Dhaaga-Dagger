import { Product } from "../models/Product.js";
import { nextSequence } from "../models/Counter.js";
import { emitStorefrontEvent } from "../realtime/hub.js";
import { createNotification } from "../services/notification.service.js";

function cleanProduct(product) {
  const { _id, deletedAt, ...clean } = product;
  return { ...clean, category: clean.category || "Jeans", subtype: clean.subtype || clean.fit || "Straight fit" };
}

const styles = {
  Jeans: ["Straight fit", "Wide leg", "Bootcut", "Baggy fit"],
  Henley: ["Classic Slub", "Waffle Knit", "Heavyweight Rib", "Short Sleeve"],
};

function normalizeProductPayload(payload, current = {}) {
  const category = payload.category || current.category || "Jeans";
  const categoryChanged = payload.category && payload.category !== current.category;
  const subtype = payload.subtype || (categoryChanged ? styles[category][0] : current.subtype || current.fit || styles[category][0]);
  if (!styles[category]?.includes(subtype)) {
    const error = new Error(`${subtype} is not a valid ${category} style`);
    error.status = 400;
    throw error;
  }
  return { ...payload, category, subtype, fit: category === "Jeans" ? subtype : payload.fit || current.fit || "Regular" };
}

export async function listProducts(request, response) {
  const filter = { deletedAt: null };
  if (!request.admin) filter.active = true;
  if (request.query.category) filter.category = request.query.category;
  if (request.query.fit) filter.fit = request.query.fit;
  if (request.query.search) filter.$text = { $search: String(request.query.search).slice(0, 80) };
  const products = await Product.find(filter).sort({ createdAt: -1, id: 1 }).lean();
  response.json({ data: products.map(cleanProduct) });
}

export async function getProduct(request, response) {
  const product = await Product.findOne({ id: request.validated.params.id, deletedAt: null, ...(request.admin ? {} : { active: true }) }).lean();
  if (!product) return response.status(404).json({ error: { message: "Product not found" } });
  response.json({ data: cleanProduct(product) });
}

export async function createProduct(request, response) {
  const payload = normalizeProductPayload(request.validated.body);
  const id = await nextSequence("product");
  const product = await Product.create({ ...payload, id, sku: payload.sku.toUpperCase(), gallery: [...new Set(payload.gallery)], image: payload.gallery[0] || payload.image, sizes: [...new Set(payload.sizes)] });
  const serialized = cleanProduct(product.toObject());
  createNotification({ type: "product", title: "Product added", message: `${serialized.name} is now in the catalog`, actor: request.admin.email })
    .catch((error) => console.error(`Could not create product notification: ${error.message}`));
  emitStorefrontEvent("catalog:updated", { action: "created", product: serialized });
  response.status(201).json({ data: serialized });
}

export async function updateProduct(request, response) {
  const current = await Product.findOne({ id: request.validated.params.id, deletedAt: null }).lean();
  if (!current) return response.status(404).json({ error: { message: "Product not found" } });
  const payload = normalizeProductPayload({ ...request.validated.body }, current);
  if (payload.sku) payload.sku = payload.sku.toUpperCase();
  if (payload.gallery) {
    payload.gallery = [...new Set(payload.gallery)];
    payload.image = payload.gallery[0] || payload.image;
  }
  if (payload.sizes) payload.sizes = [...new Set(payload.sizes)];
  const product = await Product.findOneAndUpdate({ id: request.validated.params.id, deletedAt: null }, payload, { new: true, runValidators: true }).lean();
  const serialized = cleanProduct(product);
  emitStorefrontEvent("catalog:updated", { action: "updated", product: serialized });
  response.json({ data: serialized });
}

export async function deleteProduct(request, response) {
  const product = await Product.findOneAndUpdate({ id: request.validated.params.id, deletedAt: null }, { active: false, deletedAt: new Date() }, { new: true }).lean();
  if (!product) return response.status(404).json({ error: { message: "Product not found" } });
  emitStorefrontEvent("catalog:updated", { action: "deleted", productId: product.id });
  response.status(204).end();
}
