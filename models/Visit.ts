import mongoose, { Schema, models } from "mongoose";

const VisitSchema = new Schema(
  {
    date: { type: String, required: true }, // 2026-10-08
    vid: { type: String, required: true },
    views: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 }, // ৯০ দিন পর নিজে মুছে যাবে
  },
  { versionKey: false },
);
VisitSchema.index({ date: 1, vid: 1 }, { unique: true });

export default models.Visit || mongoose.model("Visit", VisitSchema);
