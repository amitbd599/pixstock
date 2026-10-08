import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import Image from "@/models/Image";
import SearchBar from "@/components/SearchBar";
import ImageGrid from "@/components/ImageGrid";
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";

const PAGE_SIZE = 30;

export const metadata: Metadata = {
  title: "Free Stock Images - High Quality Photos | Pixstock",
  description:
    "Download free high-quality stock images for personal and commercial use. Explore thousands of free photos, nature images, people, lifestyle photos and more on Pixstock.",
  keywords: [
    "free stock images",
    "free stock photos",
    "free images",
    "free photos",
    "royalty free images",
    "free image download",
    "high quality images",
    "Pixstock",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free Stock Images - High Quality Photos | Pixstock",
    description:
      "Download free high-quality stock images for personal and commercial use on Pixstock.",
    url: "/",
    siteName: "Pixstock",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Stock Images - High Quality Photos | Pixstock",
    description:
      "Download free high-quality stock images for personal and commercial use on Pixstock.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function getImages(page: number) {
  await dbConnect();

  const [images, total] = await Promise.all([
    Image.find({ status: "published" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),

    Image.countDocuments({ status: "published" }),
  ]);

  return { images, total };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;

  const requestedPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const { images, total } = await getImages(requestedPage);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const page = Math.min(requestedPage, totalPages);

  const clientImages = images.map((img: any) => ({
    _id: String(img._id),
    title: img.title,
    description: img.description,
    alt: img.alt,
    tags: img.tags,
    category: img.category,
    slug: img.slug,

    previewUrl: img.previewUrl,
    originalUrl: img.originalUrl,
    largeUrl: img.largeUrl,
    mediumUrl: img.mediumUrl,
    thumbnailUrl: img.thumbnailUrl,

    width: img.width,
    height: img.height,
    views: img.views,
    downloads: img.downloads,
  }));

  return (
    <main>
      <div>
        <SearchBar />
      </div>

      <div className='container mx-auto py-[60px]'>
        <div className='mt-12'>
          <ImageGrid images={clientImages} />
        </div>

        {total > 0 && <Pagination currentPage={page} totalPages={totalPages} />}
      </div>

      <Footer />
    </main>
  );
}
