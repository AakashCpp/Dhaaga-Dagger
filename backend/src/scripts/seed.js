import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { seedProducts } from "../data/products.seed.js";
import { Counter } from "../models/Counter.js";
import { Product } from "../models/Product.js";

try {
  await connectDatabase();
  await Promise.all(seedProducts.map(({ id, ...product }) => Product.updateOne({ id }, { $setOnInsert: { id, ...product } }, { upsert: true })));
  await Product.updateMany(
    { category: { $exists: false } },
    [{ $set: { category: "Jeans", subtype: "$fit" } }],
    { updatePipeline: true },
  );
  await Counter.updateOne({ _id: "product" }, { $max: { value: Math.max(...seedProducts.map((product) => product.id)) } }, { upsert: true });
  console.log(`Catalog seed complete (${seedProducts.length} defaults checked)`);
} finally {
  await mongoose.disconnect();
}
