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
    "Download free high-quality stock images for personal and commercial use. Explore free nature, people, lifestyle and more on Pixstock.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free Stock Images | Pixstock",
    description:
      "Discover and download free high-quality stock images on Pixstock.",
    url: "/",
    siteName: "Pixstock",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Stock Images | Pixstock",
    description: "Discover free high-quality stock images on Pixstock.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function getImages(requestedPage: number) {
  await dbConnect();

  const filter = { status: "published" };

  const fetchPage = (page: number) =>
    Image.find(filter)
      .select(
        "_id title description alt tags category slug previewUrl thumbnailUrl mediumUrl largeUrl originalUrl width height views downloads",
      )
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean();

  const [initialImages, total] = await Promise.all([
    fetchPage(requestedPage),
    Image.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const images = page === requestedPage ? initialImages : await fetchPage(page);

  const clientImages = images.map((img: any) => ({
    _id: String(img._id),
    title: img.title,
    description: img.description,
    alt: img.alt,
    tags: img.tags,
    category: img.category,
    slug: img.slug,

    // Do not pass an empty preview URL.
    previewUrl:
      img.previewUrl ||
      img.thumbnailUrl ||
      img.mediumUrl ||
      img.largeUrl ||
      img.originalUrl ||
      null,

    thumbnailUrl: img.thumbnailUrl || null,
    mediumUrl: img.mediumUrl || null,
    largeUrl: img.largeUrl || null,
    originalUrl: img.originalUrl || null,

    width: img.width,
    height: img.height,
    views: img.views,
    downloads: img.downloads,
  }));

  return { clientImages, total, totalPages, page };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;

  const requestedPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const { clientImages, total, totalPages, page } =
    await getImages(requestedPage);

  return (
    <main>
      <SearchBar />

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
