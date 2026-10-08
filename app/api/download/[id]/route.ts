import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Image from "@/models/Image";
import { verifyCaptcha } from "@/lib/captcha";

export const dynamic = "force-dynamic";

type Size = "original" | "large" | "medium" | "thumbnail";

const URL_FIELD: Record<
  Size,
  "originalUrl" | "largeUrl" | "mediumUrl" | "thumbnailUrl"
> = {
  original: "originalUrl",
  large: "largeUrl",
  medium: "mediumUrl",
  thumbnail: "thumbnailUrl",
};

const json = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sp = request.nextUrl.searchParams;

    // ১. আগে ক্যাপচা যাচাই (ডাটাবেসে যাওয়ার আগেই বট আটকানো)
    if (!verifyCaptcha(sp.get("ans"), sp.get("exp"), sp.get("sig"))) {
      return json("Captcha required", 403);
    }

    // ২. ডাউনলোডের সাইজ বাছাই (অজানা মান হলে original)
    const requested = sp.get("type") as Size | null;
    const type: Size =
      requested && requested in URL_FIELD ? requested : "original";

    // ৩. ছবি খোঁজা (id বা slug), শুধু published
    await dbConnect();
    const { id } = await params;
    const image = await Image.findOne(
      mongoose.Types.ObjectId.isValid(id)
        ? { _id: id, status: "published" }
        : { slug: id, status: "published" },
    );
    if (!image) return json("Image not found", 404);

    // ৪. URL নির্ধারণ (কোনো সাইজ না থাকলে original-এ ফিরে যাবে)
    const downloadUrl: string = image[URL_FIELD[type]] || image.originalUrl;

    // ৫. R2 থেকে ছবি আনা
    const upstream = await fetch(downloadUrl, { cache: "no-store" });
    if (!upstream.ok || !upstream.body)
      return json("Failed to fetch image", 502);

    // ৬. সফল হলে তবেই কাউন্ট বাড়ানো
    await Image.updateOne({ _id: image._id }, { $inc: { downloads: 1 } });

    // ৭. ফাইলের নাম: এক্সটেনশন আসল ফাইলের URL থেকে (medium/thumbnail এখন WebP হয়)
    const ext = new URL(downloadUrl).pathname.split(".").pop() || "jpg";
    const safeSlug = String(image.slug).replace(/[^a-z0-9-]/gi, "");
    const filename = `${safeSlug}-${type}.${ext}`;

    const headers: Record<string, string> = {
      "Content-Type":
        upstream.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    };
    const length = upstream.headers.get("content-length");
    if (length) headers["Content-Length"] = length;

    // ৮. স্ট্রিম করে পাঠানো (বড় ছবি মেমরিতে জমা হয় না)
    return new NextResponse(upstream.body, { headers });
  } catch (error) {
    console.error("Download error:", error);
    return json("Download failed", 500);
  }
}
