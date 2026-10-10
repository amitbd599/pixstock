import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import dbConnect from "@/lib/db";
import ImageModel from "@/models/Image";

import SimilarImages from "@/components/SimilarImages";
import SearchBar from "@/components/SearchBar";
import DownloadButton from "@/components/DownloadButton";
import Footer from "@/components/Footer";

async function getImage(id: string) {
  try {
    await dbConnect();

    const image = await ImageModel.findOne({
      slug: id,
      status: "published",
    }).lean();

    if (!image) return null;

    return {
      ...image,
      _id: String(image._id),
    };
  } catch (error) {
    console.error("getImage failed:", error);
    return null;
  }
}

// Dynamic SEO Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const image = await getImage(id);

  if (!image) {
    return {
      title: "Image Not Found | Pixstock",
      description: "The requested image could not be found on Pixstock.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${image.title} - Free Stock Photo | Pixstock`;

  const description =
    image.description?.slice(0, 160) ||
    `Download ${image.title} for free. High-quality stock photo from Pixstock.`;

  const imageUrl =
    image.previewUrl ||
    image.largeUrl ||
    image.mediumUrl ||
    image.originalUrl ||
    image.thumbnailUrl;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pixstock.com";

  const pageUrl = `${baseUrl}/image/${image.slug || image._id}`;

  return {
    title,
    description,

    keywords: [
      ...(image.tags || []),
      "free stock photo",
      "free image",
      "free stock image",
      "Pixstock",
    ],

    alternates: {
      canonical: pageUrl,
    },

    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      siteName: "Pixstock",

      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: image.width || 1200,
              height: image.height || 630,
              alt: image.alt || image.title,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SingleImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const image = await getImage(id);

  if (!image) {
    notFound();
  }

  return (
    <main>
      <div>
        <SearchBar />
      </div>

      <div className='container mx-auto mt-5 py-[30px]  md:py-[80px]'>
        <div className='md:grid grid-cols-12 gap-10'>
          {/* Image */}
          <div className='col-span-12 lg:col-span-6 xl:col-span-8'>
            <div className='relative aspect-[3/2] overflow-hidden bg-gray-100'>
              <Image
                src={image.previewUrl}
                alt={image.alt || image.title}
                fill
                className='object-contain object-top'
                priority
                sizes='(max-width: 1024px) 100vw, 66vw'
              />
            </div>

            <div className='hidden lg:block'>
              <SimilarImages id={String(image._id)} />
            </div>
          </div>

          {/* Information */}
          <div className='col-span-12 md:ml-[20px] lg:col-span-6 xl:col-span-4'>
            <div className='relative rounded-lg border p-5 lg:sticky top-[20px]'>
              <h1 className='mb-3 text-[20px] font-bold'>{image.title}</h1>

              {image.description && (
                <p className='mb-5 text-gray-600'>{image.description}</p>
              )}

              {/* Tags */}
              <div className='mb-6 flex flex-wrap gap-2'>
                {image.tags?.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className='rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200'
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Download */}
              <div>
                <DownloadButton imageId={String(image._id)} />

                <br />

                <hr />

                <div className='mt-3 grid gap-3'>
                  <p className='flex justify-between text-sm text-gray-500'>
                    <span>Category:</span>
                    <span className='font-medium text-gray-600'>
                      {image.category}
                    </span>
                  </p>

                  <p className='flex justify-between text-sm text-gray-500'>
                    <span>Views:</span>
                    <span className='font-medium text-gray-600'>
                      {image.views}
                    </span>
                  </p>

                  <p className='flex justify-between text-sm text-gray-500'>
                    <span>Downloads:</span>
                    <span className='font-medium text-gray-600'>
                      {image.downloads}
                    </span>
                  </p>

                  <p className='flex justify-between text-sm text-gray-500'>
                    <span>Media type:</span>
                    <span className='font-medium uppercase text-gray-600'>
                      {image.format}
                    </span>
                  </p>

                  <p className='flex justify-between text-sm text-gray-500'>
                    <span>Resolution:</span>
                    <span className='font-medium text-gray-600'>
                      {image.width} × {image.height}
                    </span>
                  </p>

                  <p className='flex justify-between text-sm text-gray-500'>
                    <span>Size:</span>
                    <span className='font-medium text-gray-600'>
                      {image.size < 1024 * 1024
                        ? `${(image.size / 1024).toFixed(2)} KB`
                        : `${(image.size / (1024 * 1024)).toFixed(2)} MB`}
                    </span>
                  </p>

                  <p className='flex justify-between text-sm text-gray-500'>
                    <span>Published date:</span>

                    <span className='font-medium text-gray-600'>
                      {new Date(image.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Similar Images - Mobile */}
            <div className='mt-[60px] block lg:hidden'>
              <SimilarImages id={String(image._id)} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
