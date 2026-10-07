"use server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { processImage } from "@/lib/image-process";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";
import { slugify, parseTags } from "@/lib/utils";
import Image from "@/models/Image";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export async function uploadImage(_prev, fd) {
  if (!(await getAdminSession())) return { error: "Unauthorized" };

  const file = fd.get("file");
  const title = String(fd.get("title") || "").trim();
  if (!file || !file.size) return { error: "একটি ইমেজ সিলেক্ট করুন" };
  if (!ALLOWED.includes(file.type)) return { error: "শুধু JPG, PNG বা WebP চলবে" };
  if (!title) return { error: "Title দিন" };

  const keys = {};
  try {
    const p = await processImage(Buffer.from(await file.arrayBuffer()), file.type);
    const slug = `${slugify(title)}-${crypto.randomBytes(3).toString("hex")}`;
    const urls = {};
    await Promise.all(
      p.variants.map(async (v) => {
        keys[v.name] = `images/${slug}/${v.name}.${v.ext}`;
        urls[v.name] = await uploadToR2(keys[v.name], v.buffer, v.type);
      })
    );

    await connectDB();
    const doc = await Image.create({
      title,
      slug,
      description: String(fd.get("description") || "").trim(),
      alt: String(fd.get("alt") || "").trim() || title,
      tags: parseTags(fd.get("tags")),
      category: String(fd.get("category") || "general").trim().toLowerCase() || "general",
      urls, keys,
      width: p.width, height: p.height, size: p.size,
      status: fd.get("status") === "draft" ? "draft" : "published",
    });

    revalidatePath("/"); revalidatePath("/admin"); revalidatePath("/admin/images");
    return { success: `আপলোড সম্পন্ন: ${doc.title}`, id: doc._id.toString() };
  } catch (e) {
    console.error("upload failed", e);
    await deleteFromR2(Object.values(keys)).catch(() => {});
    return { error: "আপলোড ব্যর্থ: " + (e.message || "unknown error") };
  }
}
