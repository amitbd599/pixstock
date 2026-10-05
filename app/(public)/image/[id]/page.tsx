import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SimilarImages from "@/components/SimilarImages";
import SearchBar from "@/components/SearchBar";
import DownloadButton from "@/components/DownloadButton";
import Footer from "@/components/Footer";

async function getImage(id: string) {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/images/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

// ✅ Dynamic Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const image = await getImage(id);

  if (!image) {
    return {
      title: "Image not found - PixStock",
    };
  }

  const title = `${image.title} - Free Stock Photo | PixStock`;
  const description =
    image.description?.slice(0, 160) ||
    `Download ${image.title} for free. High quality stock photo from PixStock.`;

  const imageUrl = image.largeUrl || image.mediumUrl || image.thumbnailUrl;
  const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/image/${image.slug || image._id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          width: image.width || 1200,
          height: image.height || 630,
          alt: image.alt || image.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
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
  if (!image) notFound();

  return (
    <main>
      <div className='bg-gray-900 py-[20px]'>
        <SearchBar />
      </div>
      <div className='container mx-auto  mt-5 py-[80px]'>
        <div className='grid grid-cols-12 gap-10'>
          <div className='col-span-12 lg:col-span-6 xl:col-span-8'>
            <div className='relative aspect-[3/2] bg-transparent   overflow-hidden'>
              <Image
                // src={image.largeUrl || image.mediumUrl}
                src={image.largeUrl}
                alt={image.alt || image.title}
                fill
                className='object-contain object-top'
                priority
                sizes='(max-width: 1024px) 100vw, 50vw'
              />
            </div>

            <div className='hidden lg:block '>
              <SimilarImages id={String(image._id)} />
            </div>
          </div>

          <div className='col-span-12 lg:col-span-6 xl:col-span-4 ml-[20px] '>
            <div className='border p-5 rounded-lg relative lg:sticky  top-[20px]'>
              <h1 className='text-[20px] font-bold mb-3'>{image.title}</h1>
              {image.description && (
                <p className='text-gray-600 mb-5'>{image.description}</p>
              )}

              <div className='flex flex-wrap gap-2 mb-6'>
                {image.tags?.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/search?q=${tag}`}
                    className='bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm'
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              <div>
                <DownloadButton imageId={image._id.toString()} />
                <br />

                <hr />

                <div className=' grid gap-3 mt-3'>
                  <p className='text-sm text-gray-500  flex justify-between'>
                    <span>Category:</span>
                    <span className='text-gray-600 font-medium'>
                      {image.category}
                    </span>
                  </p>
                  <p className='text-sm text-gray-500  flex justify-between'>
                    <span>Views:</span>
                    <span className='text-gray-600 font-medium'>
                      {image.views}
                    </span>
                  </p>
                  <p className='text-sm text-gray-500  flex justify-between'>
                    <span>Downloads:</span>
                    <span className='text-gray-600 font-medium'>
                      {image.downloads}
                    </span>
                  </p>
                  <p className='text-sm text-gray-500  flex justify-between'>
                    <span>Media type:</span>
                    <span className='text-gray-600 font-medium'>
                      {image.format}
                    </span>
                  </p>
                  <p className='text-sm text-gray-500  flex justify-between'>
                    <span>Resolution:</span>
                    <span className='text-gray-600 font-medium'>
                      {image.width} × {image.height}
                    </span>
                  </p>
                  <p className='text-sm text-gray-500  flex justify-between'>
                    <span>Size:</span>
                    <span className='text-gray-600 font-medium'>
                      {image.size < 1024 * 1024
                        ? `${(image.size / 1024).toFixed(2)} KB`
                        : `${(image.size / (1024 * 1024)).toFixed(2)} MB`}
                    </span>
                  </p>
                  <p className='text-sm text-gray-500  flex justify-between'>
                    <span>Published date:</span>
                    <span className='text-gray-600 font-medium'>
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

            <div className='block lg:hidden mt-[60px]'>
              <SimilarImages id={String(image._id)} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
