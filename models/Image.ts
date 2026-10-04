import mongoose, { Schema, models, Document } from "mongoose";

export interface IImage extends Document {
  title: string;
  description?: string;
  alt?: string;
  tags: string[];
  category?: string;
  slug: string;
  originalUrl: string;
  largeUrl: string;
  mediumUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  format: string;
  views: number;
  downloads: number;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "", maxlength: 2000 },
    alt: { type: String, default: "" },
    tags: { type: [String], default: [], index: true },
    category: { type: String, default: "uncategorized", index: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    originalUrl: { type: String, required: true },
    largeUrl: { type: String, required: true },
    mediumUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    size: { type: Number, required: true },
    format: { type: String, default: "webp" },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

ImageSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  alt: "text",
});
ImageSchema.index({ status: 1, createdAt: -1 });
ImageSchema.index({ category: 1, status: 1, createdAt: -1 });

const Image = models.Image || mongoose.model<IImage>("Image", ImageSchema);
export default Image;
