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
        { success: false, message: "Not found" },
        { status: 404 },
      );
    }

    await Image.findByIdAndUpdate(image._id, { $inc: { downloads: 1 } });

    return NextResponse.redirect(image.originalUrl);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error" },
      { status: 500 },
    );
  }
}
