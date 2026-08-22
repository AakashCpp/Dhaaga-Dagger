import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  value: { type: Number, default: 0 },
}, { versionKey: false });

export const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

export async function nextSequence(name) {
  const counter = await Counter.findByIdAndUpdate(name, { $inc: { value: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
  return counter.value;
}

