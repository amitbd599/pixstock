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
    const limit = Math.min(
      20,
      parseInt(new URL(request.url).searchParams.get("limit") || "12"),
    );

    let currentImage;
    if (mongoose.Types.ObjectId.isValid(id)) {
      currentImage = await Image.findById(id).lean();
    } else {
      currentImage = await Image.findOne({ slug: id }).lean();
    }

    if (!currentImage) {
      return NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 },
      );
    }

    const filter: any = {
      _id: { $ne: currentImage._id },
      status: "published",
    };

    if (currentImage.tags?.length > 0) {
      filter.$or = [
        { category: currentImage.category },
        { tags: { $in: currentImage.tags } },
      ];
    } else if (currentImage.category) {
      filter.category = currentImage.category;
    }

    const similar = await Image.find(filter)
      .sort({ views: -1, createdAt: -1 })
      .limit(limit)
      .select(
        "title slug thumbnailUrl mediumUrl width height views downloads category tags",
      )
      .lean();

    return NextResponse.json({ success: true, data: similar });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch similar images" },
      { status: 500 },
    );
  }
}
