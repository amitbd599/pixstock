import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Image from "@/models/Image";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;

    const image = mongoose.Types.ObjectId.isValid(id)
      ? await Image.findById(id)
      : await Image.findOne({ slug: id });

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 },
      );
    }

    // Download type
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "original";

    let downloadUrl = image.originalUrl;

    if (type === "large") {
      downloadUrl = image.largeUrl;
    }

    if (type === "medium") {
      downloadUrl = image.mediumUrl;
    }

    if (type === "thumbnail") {
      downloadUrl = image.thumbnailUrl;
    }

    // Fetch image from R2
    const response = await fetch(downloadUrl);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch image" },
        { status: 500 },
      );
    }

    const buffer = await response.arrayBuffer();

    // Download count
    await Image.findByIdAndUpdate(image._id, {
      $inc: { downloads: 1 },
    });

    const filename = `${image.slug}-${type}.${image.format || "webp"}`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/webp",

        "Content-Disposition": `attachment; filename="${filename}"`,

        "Content-Length": buffer.byteLength.toString(),

        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Download error:", error);

    return NextResponse.json(
      { success: false, message: "Download failed" },
      { status: 500 },
    );
  }
}
