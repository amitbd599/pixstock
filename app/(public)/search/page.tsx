import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import ImageModel from "@/models/Image";

import SearchBar from "@/components/SearchBar";
import ImageGrid from "@/components/ImageGrid";
import Footer from "@/components/Footer";

const PAGE_SIZE = 30;

async function searchImages(q: string) {
  await dbConnect();

  const search = q.trim();

  if (!search) {
    return [];
  }

  const images = await ImageModel.find({
    status: "published",
    $or: [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(PAGE_SIZE)
    .lean();

  return images.map((img: any) => ({
    _id: String(img._id),

    title: img.title,
    description: img.description,
    alt: img.alt,
    tags: img.tags,
    category: img.category,
    slug: img.slug,

    originalUrl: img.originalUrl,
    largeUrl: img.largeUrl,
    mediumUrl: img.mediumUrl,
    thumbnailUrl: img.thumbnailUrl,
    previewUrl: img.previewUrl,

    width: img.width,
    height: img.height,
    size: img.size,
    format: img.format,

    views: img.views,
    downloads: img.downloads,

    createdAt: img.createdAt,
  }));
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;

  const query = q?.trim();

  if (!query) {
    return {
      title: "Search Free Stock Images | Pixstock",
      description:
        "Search and download free high-quality stock images, photos and illustrations on Pixstock.",
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  const title = `Free ${query} Images - Stock Photos | Pixstock`;

  const description = `Find and download free ${query} images and stock photos on Pixstock. High-quality images available for personal and commercial use.`;

  return {
    title,
    description,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: `/search?q=${encodeURIComponent(query)}`,
    },

    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Pixstock",
      url: `/search?q=${encodeURIComponent(query)}`,
    },

    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const query = q?.trim() || "";

  const images = query ? await searchImages(query) : [];

  return (
    <main>
      <div>
        <SearchBar />
      </div>

      <div className='container mx-auto py-[60px]'>
        <h1 className='mt-10 mb-6 text-2xl font-semibold'>
          {query ? `Results for "${query}"` : "Search free stock images"}
        </h1>

        {query && images.length === 0 ? (
          <div className='py-20 text-center'>
            <h2 className='text-xl font-semibold'>No images found</h2>

            <p className='mt-2 text-gray-500'>
              Try searching with a different keyword.
            </p>
          </div>
        ) : (
          <ImageGrid images={images} />
        )}
      </div>

      <Footer />
    </main>
  );
}
