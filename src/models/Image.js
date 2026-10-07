import mongoose from "mongoose";

const VariantSchema = { original: String, large: String, medium: String, thumbnail: String };

const ImageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    alt: { type: String, default: "" },
    tags: { type: [String], default: [], index: true },
    category: { type: String, default: "general", index: true },
    slug: { type: String, required: true, unique: true },
    urls: VariantSchema,
    keys: VariantSchema, // R2 object keys (ডিলিটের সময় লাগে)
    width: Number,
    height: Number,
    size: Number,
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    status: { type: String, enum: ["published", "draft"], default: "published", index: true },
  },
  { timestamps: true }
);
ImageSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);
