import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Image from "@/models/Image";

export const dynamic = "force-dynamic";

// download count বাড়িয়ে original URL-এ redirect
export async function GET(_req, { params }) {
  if (!mongoose.isValidObjectId(params.id))
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  await connectDB();
  const img = await Image.findOneAndUpdate(
    { _id: params.id, status: "published" },
    { $inc: { downloads: 1 } },
    { new: true },
  ).lean();
  if (!img) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.redirect(img.urls.original);
}
