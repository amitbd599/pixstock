import { cache } from "react";
import mongoose from "mongoose";
import { connectDB } from "./db";
import Image from "@/models/Image";

export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
const plain = (d) => (d ? JSON.parse(JSON.stringify(d)) : d);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Server Component থেকে সরাসরি DB query (নিজের public URL fetch করা হয় না)
export async function listImages({ q = "", category = "", page = 1, limit = 24, status = "published" } = {}) {
  await connectDB();
  const f = {};
  if (status) f.status = status;
  if (category) f.category = category;
  if (q.trim()) {
    const r = new RegExp(esc(q.trim()), "i");
    f.$or = [{ title: r }, { tags: r }, { category: r }, { description: r }];
  }
  page = Math.max(1, parseInt(page) || 1);
  const [items, total] = await Promise.all([
    Image.find(f).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Image.countDocuments(f),
  ]);
  return { items: plain(items), total, page, pages: Math.max(1, Math.ceil(total / limit)) };
}

export const getImage = cache(async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  await connectDB();
  return plain(await Image.findById(id).lean());
});

export async function getSimilar(img, limit = 12) {
  await connectDB();
  const items = await Image.find({
    _id: { $ne: img._id },
    status: "published",
    $or: [{ tags: { $in: img.tags || [] } }, { category: img.category }],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return plain(items);
}

export async function getCategories() {
  await connectDB();
  return (await Image.distinct("category", { status: "published" })).filter(Boolean).slice(0, 12);
}

export async function getStats() {
  await connectDB();
  const [total, published, agg, latest] = await Promise.all([
    Image.countDocuments(),
    Image.countDocuments({ status: "published" }),
    Image.aggregate([{ $group: { _id: null, views: { $sum: "$views" }, downloads: { $sum: "$downloads" } } }]),
    Image.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  return {
    total, published, drafts: total - published,
    views: agg[0]?.views || 0, downloads: agg[0]?.downloads || 0,
    latest: plain(latest),
  };
}
