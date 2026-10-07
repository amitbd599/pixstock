import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ImageGrid from "@/components/ImageGrid";
import Pagination from "@/components/Pagination";
import AdSlot from "@/components/AdSlot";
import { listImages, getCategories } from "@/lib/queries";

export const revalidate = 60; // নোট: ?page= (searchParams) ব্যবহারের কারণে পেজটি dynamic রেন্ডার হয়; CDN/LiteSpeed cache চাইলে সেখানে কনফিগ করুন

export const metadata = { alternates: { canonical: "/" } };

export default async function Home({ searchParams }) {
  const page = parseInt(searchParams?.page) || 1;
  let data = { items: [], page: 1, pages: 1 }, cats = [];
  try {
    [data, cats] = await Promise.all([listImages({ page, limit: 30 }), getCategories()]);
  } catch (e) {
    console.error("home query failed", e.message);
  }

  return (
    <>
      <section className="bg-gradient-to-b from-green-50 to-white px-4 py-16 text-center">
        <h1 className="mx-auto max-w-3xl text-3xl font-extrabold sm:text-5xl">Free stock images for everyone</h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">Download high-quality photos for personal and commercial use. No registration needed.</p>
        <div className="mx-auto mt-8 max-w-2xl"><SearchBar large /></div>
        {cats.length > 0 && (
          <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
            {cats.map((c) => (
              <Link key={c} href={`/search?q=${encodeURIComponent(c)}`} className="rounded-full border bg-white px-3 py-1 text-sm capitalize hover:border-brand hover:text-brand">{c}</Link>
            ))}
          </div>
        )}
      </section>
      <section className="mx-auto max-w-7xl px-4">
        <AdSlot className="mb-4" />
        <ImageGrid items={data.items} />
        <Pagination page={data.page} pages={data.pages} basePath="/" />
      </section>
    </>
  );
}
