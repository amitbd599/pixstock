import ImageGridTwo from "./ImageGridTwo";

async function getSimilar(id: string) {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/images/similar/${id}?limit=14`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export default async function SimilarImages({ id }: { id: string }) {
  const images = await getSimilar(id);
  if (!images.length) return null;

  return (
    <section className='mt-4'>
      <h2 className='text-2xl font-semibold mb-6'>Similar Images</h2>
      <ImageGridTwo images={images} />
    </section>
  );
}
