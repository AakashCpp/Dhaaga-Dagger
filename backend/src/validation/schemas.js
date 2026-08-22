import { z } from "zod";

const idParam = z.object({ id: z.coerce.number().int().positive() });
const orderIdParam = z.object({ id: z.string().trim().min(4).max(40) });

export const productPayload = z.object({
  category: z.enum(["Jeans", "Henley"]).default("Jeans"),
  subtype: z.enum(["Slim", "Regular", "Skinny", "Relaxed", "Classic Slub", "Waffle Knit", "Heavyweight Rib", "Short Sleeve"]).default("Regular"),
  name: z.string().trim().min(2).max(120),
  fit: z.enum(["Slim", "Regular", "Skinny", "Relaxed"]).optional(),
  price: z.coerce.number().nonnegative().max(1_000_000),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
  image: z.string().min(1).max(2_000_000),
  gallery: z.array(z.string().min(1).max(2_000_000)).min(1).max(6),
  sizes: z.array(z.string().trim().min(1).max(12)).min(1).max(20),
  sku: z.string().trim().min(2).max(40),
  stock: z.coerce.number().int().nonnegative().max(1_000_000),
  description: z.string().trim().max(1200).default(""),
  active: z.boolean().default(true),
});

export const createProductSchema = z.object({ body: productPayload, params: z.object({}), query: z.object({}) });
export const updateProductSchema = z.object({ body: productPayload.partial().refine((value) => Object.keys(value).length > 0), params: idParam, query: z.object({}) });
export const productIdSchema = z.object({ body: z.unknown().optional(), params: idParam, query: z.unknown().optional() });

const cartItem = z.object({ productId: z.coerce.number().int().positive(), size: z.string().trim().min(1).max(12), quantity: z.coerce.number().int().min(1).max(10) });
export const cartSchema = z.object({ body: z.object({ items: z.array(cartItem).max(50) }), params: z.object({}), query: z.object({}) });
export const wishlistSchema = z.object({ body: z.object({ productId: z.coerce.number().int().positive(), liked: z.boolean() }), params: z.object({}), query: z.object({}) });
export const profileSchema = z.object({ body: z.object({ displayName: z.string().trim().min(2).max(100).optional(), phone: z.string().trim().max(30).optional() }).refine((value) => Object.keys(value).length > 0), params: z.object({}), query: z.object({}) });
export const checkoutSchema = z.object({ body: z.object({
  phone: z.string().trim().min(6).max(30), fullName: z.string().trim().min(2).max(100), pin: z.string().trim().min(4).max(12),
  address: z.string().trim().min(5).max(300), landmark: z.string().trim().max(160).default(""), city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100), payment: z.enum(["COD", "UPI", "Card"]),
}), params: z.object({}), query: z.object({}) });

export const createOrderSchema = z.object({ body: z.object({
  id: z.string().trim().min(4).max(40).optional(),
  customer: z.object({ name: z.string().trim().min(2).max(100), phone: z.string().trim().min(6).max(30), email: z.string().email().optional() }),
  address: z.string().trim().min(5).max(300), city: z.string().trim().min(2).max(100), pin: z.string().trim().min(4).max(12),
  state: z.string().trim().min(2).max(100).default("Not provided"), landmark: z.string().trim().max(160).default(""),
  payment: z.enum(["COD", "UPI", "Card"]),
  items: z.array(cartItem).min(1).max(50),
}), params: z.object({}), query: z.object({}) });
export const orderIdSchema = z.object({ body: z.unknown().optional(), params: orderIdParam, query: z.unknown().optional() });
export const orderStatusSchema = z.object({ body: z.object({ status: z.enum(["Placed", "Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"]) }), params: orderIdParam, query: z.object({}) });
