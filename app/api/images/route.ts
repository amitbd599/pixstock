import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Image from "@/models/Image";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const search = searchParams.get("q") || searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest";
    const skip = (page - 1) * limit;

    const filter: any = { status: "published" };

    if (category && category !== "all") {
      filter.category = category.toLowerCase();
    }

    if (search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === "popular") sortOption = { views: -1 };
    if (sort === "downloads") sortOption = { downloads: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const [images, total] = await Promise.all([
      Image.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .select(
          "title slug originalUrl largeUrl thumbnailUrl mediumUrl width height views downloads category tags createdAt",
        )
        .lean(),
      Image.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: images,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch images" },
      { status: 500 },
    );
  }
}
