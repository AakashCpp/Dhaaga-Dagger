import assert from "node:assert/strict";
import test from "node:test";
import { createOrderSchema, productPayload } from "../src/validation/schemas.js";
import { Product } from "../src/models/Product.js";

test("product input requires managed catalog fields", () => {
  const result = productPayload.safeParse({
    category: "Jeans",
    subtype: "Wide leg",
    name: "Wide Leg 001",
    fit: "Wide leg",
    price: 1499,
    color: "#b7cad8",
    image: "/assets/wide-leg-001-front.png",
    gallery: ["/assets/wide-leg-001-front.png"],
    sizes: ["30", "32"],
    sku: "DD-WL-0001",
    stock: 20,
    active: true,
  });
  assert.equal(result.success, true);
});

test("Henley catalog input accepts its own style and garment sizes", () => {
  const result = productPayload.safeParse({
    category: "Henley",
    subtype: "Classic Slub",
    name: "Ecru Slub Henley",
    fit: "Regular",
    price: 1499,
    color: "#e8dfcf",
    image: "/assets/henley-ecru.webp",
    gallery: ["/assets/henley-ecru.webp"],
    sizes: ["S", "M", "L", "XL"],
    sku: "DK-H-0009",
    stock: 20,
    active: true,
  });
  assert.equal(result.success, true);
});

test("product model rejects a subtype from another category", async () => {
  const product = new Product({
    id: 999,
    category: "Henley",
    subtype: "Wide leg",
    name: "Invalid Henley",
    fit: "Regular",
    price: 1499,
    color: "#e8dfcf",
    image: "/assets/henley.webp",
    gallery: ["/assets/henley.webp"],
    sizes: ["M"],
    sku: "TEST-H-999",
    stock: 1,
  });
  await assert.rejects(product.validate(), /selected product category/);
});

test("order payload rejects client pricing and invalid quantities", () => {
  const result = createOrderSchema.safeParse({
    body: {
      customer: { name: "Test Customer", phone: "9876543210" },
      address: "A valid delivery address",
      city: "Delhi",
      pin: "110001",
      state: "Delhi",
      payment: "COD",
      items: [{ productId: 1, size: "32", quantity: 0, price: 1 }],
    },
    params: {},
    query: {},
  });
  assert.equal(result.success, false);
});
