import SearchBar from "@/components/SearchBar";
import ImageGrid from "@/components/ImageGrid";

async function getImages() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/images?limit=24`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const images = await getImages();

  return (
    <main className='container mx-auto px-4 py-10'>
      <h1 className='text-4xl font-bold text-center mb-2'>Free Stock Images</h1>
      <p className='text-center text-gray-500 mb-8'>
        Beautiful free images for your next project
      </p>
      <SearchBar />
      <div className='mt-12'>
        <ImageGrid images={images} />
      </div>
    </main>
  );
}
