import mongoose from "mongoose";

const customerOtpSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, index: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  usedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });

customerOtpSchema.index({ firebaseUid: 1, email: 1 });

export const CustomerOtp = mongoose.models.CustomerOtp || mongoose.model("CustomerOtp", customerOtpSchema);
