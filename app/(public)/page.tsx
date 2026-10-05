import SearchBar from "@/components/SearchBar";
import ImageGrid from "@/components/ImageGrid";
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";

async function getImages(page: number) {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const limit = 24;

    const res = await fetch(`${base}/api/images?page=${page}&limit=${limit}`, {
      next: { revalidate: 60 },
    });

    const data = await res.json();

    return {
      images: data.success ? data.data : [],
      pagination: data.pagination || null,
    };
  } catch {
    return {
      images: [],
      pagination: null,
    };
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page) || 1);

  const { images, pagination } = await getImages(page);

  return (
    <main>
      <div className='bg-gray-900 py-[20px]'>
        <SearchBar />
      </div>

      <div className='container mx-auto py-[60px]'>
        <div className='mt-12'>
          <ImageGrid images={images} />
        </div>

        {pagination && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
          />
        )}
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
