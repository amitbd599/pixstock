"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";
import dbConnect from "@/lib/db";
import Image from "@/models/Image";
import { processAndUploadImage } from "@/lib/image-process";

const uploadSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  alt: z.string().max(300).optional(),
  tags: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["draft", "published"]).default("published"),
});

export type UploadState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  imageId?: string;
};

export async function uploadImageAction(
  prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || "",
      alt: (formData.get("alt") as string) || "",
      tags: (formData.get("tags") as string) || "",
      category: (formData.get("category") as string) || "uncategorized",
      status: (formData.get("status") as "draft" | "published") || "published",
    };

    const validated = uploadSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const file = formData.get("image") as File | null;
    if (!file || file.size === 0) {
      return { success: false, message: "Please select an image" };
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      return { success: false, message: "Only JPG, PNG, WebP allowed" };
    }

    if (file.size > 15 * 1024 * 1024) {
      return { success: false, message: "Max 15MB allowed" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const processed = await processAndUploadImage(buffer);

    await dbConnect();

    let baseSlug = slugify(validated.data.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await Image.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const tagsArray = validated.data.tags
      ? validated.data.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];

    const newImage = await Image.create({
      title: validated.data.title,
      description: validated.data.description,
      alt: validated.data.alt || validated.data.title,
      tags: tagsArray,
      category: validated.data.category,
      status: validated.data.status,
      slug,
      ...processed,
    });

    revalidatePath("/");
    revalidatePath("/admin/images");

    return {
      success: true,
      message: "Image uploaded successfully!",
      imageId: newImage._id.toString(),
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: "Upload failed. Try again." };
  }
}