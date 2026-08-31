import mongoose from "mongoose";

const subtypesByCategory = {
  Jeans: ["Straight fit", "Wide leg", "Bootcut", "Baggy fit"],
  Henley: ["Classic Slub", "Waffle Knit", "Heavyweight Rib", "Short Sleeve"],
};

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  category: { type: String, enum: ["Jeans", "Henley"], required: true, default: "Jeans", index: true },
  subtype: {
    type: String,
    enum: ["Straight fit", "Wide leg", "Bootcut", "Baggy fit", "Classic Slub", "Waffle Knit", "Heavyweight Rib", "Short Sleeve"],
    required: true,
    default: "Straight fit",
    index: true,
    validate: {
      validator(value) { return subtypesByCategory[this.category]?.includes(value) ?? false; },
      message: "Subtype must belong to the selected product category",
    },
  },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  fit: { type: String, enum: ["Straight fit", "Wide leg", "Bootcut", "Baggy fit", "Regular"], required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  color: { type: String, required: true, match: /^#[0-9a-f]{6}$/i },
  image: { type: String, required: true },
  gallery: { type: [String], validate: (images) => images.length >= 1 && images.length <= 6 },
  sizes: { type: [String], validate: (sizes) => sizes.length > 0 },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  description: { type: String, trim: true, maxlength: 1200, default: "" },
  active: { type: Boolean, default: true, index: true },
  deletedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });

productSchema.index({ name: "text", sku: "text", category: "text", subtype: "text", description: "text" });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
