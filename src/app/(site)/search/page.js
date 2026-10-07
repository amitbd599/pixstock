import SearchBar from "@/components/SearchBar";
import ImageGrid from "@/components/ImageGrid";
import Pagination from "@/components/Pagination";
import AdSlot from "@/components/AdSlot";
import { listImages } from "@/lib/queries";

export const dynamic = "force-dynamic";

export function generateMetadata({ searchParams }) {
  const q = searchParams?.q || "";
  return {
    title: q ? `Free "${q}" images` : "Search images",
    description: q ? `Download free ${q} stock images for personal and commercial use.` : "Search free stock images.",
    robots: { index: false, follow: true }, // thin search pages index না করাই ভালো
  };
}

export default async function SearchPage({ searchParams }) {
  const q = (searchParams?.q || "").toString();
  const data = await listImages({ q, page: searchParams?.page, limit: 30 });
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mx-auto mb-6 max-w-2xl sm:hidden"><SearchBar defaultValue={q} /></div>
      <h1 className="mb-1 text-2xl font-bold">{q ? <>Results for “{q}”</> : "All images"}</h1>
      <p className="mb-6 text-sm text-gray-500">{data.total} free images</p>
      <AdSlot className="mb-4" />
      <ImageGrid items={data.items} />
      <Pagination page={data.page} pages={data.pages} basePath="/search" params={{ q }} />
    </div>
  );
}
