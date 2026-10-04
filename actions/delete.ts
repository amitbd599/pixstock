"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Image from "@/models/Image";
import { deleteImageVersions } from "@/lib/image-process";

export async function deleteImageAction(imageId: string) {
  try {
    // Admin চেক
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const image = await Image.findById(imageId);
    if (!image) {
      return { success: false, message: "Image not found" };
    }

    // R2 থেকে ৪টা version delete
    await deleteImageVersions({
      originalUrl: image.originalUrl,
      largeUrl: image.largeUrl,
      mediumUrl: image.mediumUrl,
      thumbnailUrl: image.thumbnailUrl,
    });

    // Database থেকে delete
    await Image.findByIdAndDelete(imageId);

    revalidatePath("/");
    revalidatePath("/admin/images");

    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, message: "Failed to delete image" };
  }
}
