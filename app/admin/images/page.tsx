import dbConnect from "@/lib/db";
import Image from "@/models/Image";
import Link from "next/link";
import ImageTableClient from "@/components/admin/ImageTableClient";

const PAGE_SIZE = 50;

async function getImages(page: number) {
  await dbConnect();

  const [images, total] = await Promise.all([
    Image.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Image.countDocuments(),
  ]);

  return { images, total };
}

function getPageNumbers(current: number, totalPages: number) {
  const pages: (number | "...")[] = [];
  const delta = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= current - delta && i <= current + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return pages;
}

export default async function AdminImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;

  const requestedPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const { images, total } = await getImages(requestedPage);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const pageHref = (p: number) => `/admin/images?page=${p}`;

  // Client component-এর জন্য data clean করা
  const clientImages = images.map((img: any) => ({
    _id: String(img._id),
    title: img.title,
    slug: img.slug,
    thumbnailUrl: img.thumbnailUrl,
    views: img.views,
    downloads: img.downloads,
    status: img.status,
  }));

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>All Images ({total})</h1>
        <Link
          href='/admin/upload'
          className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700'
        >
          + Upload New
        </Link>
      </div>

      {/* Table + Bulk Actions */}
      <ImageTableClient images={clientImages} />

      {/* Pagination */}
      {total > 0 && (
        <div className='flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 mt-4 border rounded-xl bg-gray-50'>
          <p className='text-sm text-gray-600'>
            Showing {from}-{to} of {total}
          </p>

          {totalPages > 1 && (
            <nav className='flex items-center gap-1'>
              {page > 1 ? (
                <Link
                  href={pageHref(page - 1)}
                  className='px-3 py-1.5 rounded-lg border bg-white text-sm hover:bg-gray-100'
                >
                  Previous
                </Link>
              ) : (
                <span className='px-3 py-1.5 rounded-lg border bg-gray-100 text-sm text-gray-400 cursor-not-allowed'>
                  Previous
                </span>
              )}

              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className='px-2 text-gray-400'>
                    ...
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={pageHref(p)}
                    className={`px-3 py-1.5 rounded-lg border text-sm ${
                      p === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </Link>
                ),
              )}

              {page < totalPages ? (
                <Link
                  href={pageHref(page + 1)}
                  className='px-3 py-1.5 rounded-lg border bg-white text-sm hover:bg-gray-100'
                >
                  Next
                </Link>
              ) : (
                <span className='px-3 py-1.5 rounded-lg border bg-gray-100 text-sm text-gray-400 cursor-not-allowed'>
                  Next
                </span>
              )}
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
