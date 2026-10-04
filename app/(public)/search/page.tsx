import SearchBar from "@/components/SearchBar";
import ImageGrid from "@/components/ImageGrid";

async function searchImages(q: string) {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(
      `${base}/api/images?q=${encodeURIComponent(q)}&limit=30`,
      {
        next: { revalidate: 60 },
      },
    );
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const images = q ? await searchImages(q) : [];

  return (
    <main>
      <div className='bg-gray-900 py-[20px]'>
        <SearchBar />
      </div>
      <div className='container mx-auto'>
        <h1 className='text-2xl font-semibold mt-10 mb-6'>
          {q ? `Results for "${q}"` : "Search images"}
        </h1>
        <ImageGrid images={images} />
      </div>
    </main>
  );
}
