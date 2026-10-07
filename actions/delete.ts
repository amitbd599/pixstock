"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Image from "@/models/Image";
import { deleteImageVersions } from "@/lib/image-process";

// ----- Single Delete (আগের মতো) -----
export async function deleteImageAction(imageId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();
    const image = await Image.findById(imageId);
    if (!image) {
      return { success: false, message: "Image not found" };
    }

    await deleteImageVersions({
      originalUrl: image.originalUrl,
      largeUrl: image.largeUrl,
      mediumUrl: image.mediumUrl,
      thumbnailUrl: image.thumbnailUrl,
    });

    await Image.findByIdAndDelete(imageId);

    revalidatePath("/");
    revalidatePath("/admin/images");

    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, message: "Failed to delete image" };
  }
}

// ----- Multiple Delete -----
export async function deleteMultipleImagesAction(imageIds: string[]) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    if (!imageIds?.length) {
      return { success: false, message: "No images selected" };
    }

    await dbConnect();

    const images = await Image.find({ _id: { $in: imageIds } });

    // R2 থেকে সব version delete
    await Promise.all(
      images.map((img) =>
        deleteImageVersions({
          originalUrl: img.originalUrl,
          largeUrl: img.largeUrl,
          mediumUrl: img.mediumUrl,
          thumbnailUrl: img.thumbnailUrl,
        }),
      ),
    );

    // Database থেকে delete
    await Image.deleteMany({ _id: { $in: imageIds } });

    revalidatePath("/");
    revalidatePath("/admin/images");

    return {
      success: true,
      message: `${images.length} image(s) deleted successfully`,
    };
  } catch (error) {
    console.error("Bulk delete error:", error);
    return { success: false, message: "Failed to delete images" };
  }
}

// ----- Status Toggle (single) -----
export async function toggleImageStatusAction(imageId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();
    const image = await Image.findById(imageId);
    if (!image) {
      return { success: false, message: "Image not found" };
    }

    image.status = image.status === "published" ? "draft" : "published";
    await image.save();

    revalidatePath("/");
    revalidatePath("/admin/images");

    return {
      success: true,
      message: `Status changed to ${image.status}`,
      status: image.status,
    };
  } catch (error) {
    console.error("Status toggle error:", error);
    return { success: false, message: "Failed to update status" };
  }
}

// ----- Bulk Status Change -----
export async function bulkUpdateStatusAction(
  imageIds: string[],
  status: "published" | "draft",
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    if (!imageIds?.length) {
      return { success: false, message: "No images selected" };
    }

    await dbConnect();
    await Image.updateMany({ _id: { $in: imageIds } }, { $set: { status } });

    revalidatePath("/");
    revalidatePath("/admin/images");

    return {
      success: true,
      message: `${imageIds.length} image(s) marked as ${status}`,
    };
  } catch (error) {
    console.error("Bulk status error:", error);
    return { success: false, message: "Failed to update status" };
  }
}
