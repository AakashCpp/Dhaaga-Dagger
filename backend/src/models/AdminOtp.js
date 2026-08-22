import mongoose from "mongoose";

const adminOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  usedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });

export const AdminOtp = mongoose.models.AdminOtp || mongoose.model("AdminOtp", adminOtpSchema);

