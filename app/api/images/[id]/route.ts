import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Image from "@/models/Image";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    let image;
    if (mongoose.Types.ObjectId.isValid(id)) {
      image = await Image.findById(id).lean();
    } else {
      image = await Image.findOne({ slug: id, status: "published" }).lean();
    }

    if (!image) {
      return NextResponse.json({ success: false, message: "Image not found" }, { status: 404 });
    }

    Image.findByIdAndUpdate(image._id, { $inc: { views: 1 } }).exec();

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch image" }, { status: 500 });
  }
}