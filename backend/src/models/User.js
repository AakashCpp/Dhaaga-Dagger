import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  displayName: { type: String, trim: true, default: "Dhaaga & Dagger member" },
  photoURL: { type: String, default: "" },
  emailVerified: { type: Boolean, default: false },
  phone: { type: String, trim: true, default: "" },
  wishlistIds: { type: [Number], default: [] },
  cart: {
    type: [{
      productId: { type: Number, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1, max: 10 },
      _id: false,
    }],
    default: [],
  },
  checkoutDraft: {
    phone: { type: String, default: "" },
    fullName: { type: String, default: "" },
    pin: { type: String, default: "" },
    address: { type: String, default: "" },
    landmark: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    payment: { type: String, enum: ["COD", "UPI", "Card"], default: "COD" },
  },
  lastLoginAt: { type: Date, default: Date.now },
}, { timestamps: true, versionKey: false });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
