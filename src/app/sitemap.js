import { connectDB } from "@/lib/db";
import Image from "@/models/Image";
import { APP_URL } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const pages = ["", "/about", "/license", "/privacy", "/terms", "/contact"].map((p) => ({ url: `${APP_URL}${p}` }));
  try {
    await connectDB();
    const imgs = await Image.find({ status: "published" }).sort({ createdAt: -1 }).limit(45000)
      .select("urls.large updatedAt").lean();
    return [...pages, ...imgs.map((i) => ({
      url: `${APP_URL}/image/${i._id}`,
      lastModified: i.updatedAt,
      images: [i.urls.large], // image sitemap extension
    }))];
  } catch {
    return pages;
  }
}
