import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ImageGrid from "@/components/ImageGrid";
import AdSlot from "@/components/AdSlot";
import { getImage, getSimilar, APP_URL } from "@/lib/queries";
import { connectDB } from "@/lib/db";
import ImageModel from "@/models/Image";
import { formatBytes } from "@/lib/utils";

export const dynamic = "force-dynamic"; // view count প্রতি ভিজিটে বাড়বে

export async function generateMetadata({ params }) {
  const img = await getImage(params.id);
  if (!img || img.status !== "published") return { title: "Image not found", robots: { index: false } };
  const url = `${APP_URL}/image/${img._id}`;
  const description = img.description || `Download free ${img.title} stock image. Free for personal and commercial use.`;
  return {
    title: img.title,
    description,
    keywords: img.tags,
    alternates: { canonical: url },
    openGraph: { title: img.title, description, url, type: "website", images: [{ url: img.urls.large, width: img.width, height: img.height, alt: img.alt || img.title }] },
    twitter: { card: "summary_large_image", title: img.title, description, images: [img.urls.large] },
  };
}

export default async function ImagePage({ params }) {
  const img = await getImage(params.id);
  if (!img || img.status !== "published") notFound();

  await connectDB();
  await ImageModel.updateOne({ _id: img._id }, { $inc: { views: 1 } });
  const similar = await getSimilar(img);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: img.title,
    description: img.description || img.title,
    contentUrl: img.urls.original,
    thumbnailUrl: img.urls.thumbnail,
    width: img.width,
    height: img.height,
    keywords: img.tags.join(", "),
    uploadDate: img.createdAt,
    license: `${APP_URL}/license`,
    acquireLicensePage: `${APP_URL}/license`,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="overflow-hidden rounded-xl bg-gray-100">
          <Image src={img.urls.large} alt={img.alt || img.title} width={img.width} height={img.height} priority className="mx-auto h-auto max-h-[80vh] w-auto max-w-full object-contain" />
        </div>
        <aside>
          <h1 className="text-2xl font-bold">{img.title}</h1>
          {img.description && <p className="mt-2 text-gray-600">{img.description}</p>}
          <Button href={`/api/download/${img._id}`} className="mt-5 w-full py-3 text-base" prefetch={false}>⬇ Free Download</Button>
          <p className="mt-2 text-center text-xs text-gray-500">Free for personal & commercial use. <Link href="/license" className="underline">License</Link></p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[["Views", img.views + 1], ["Downloads", img.downloads], ["Size", `${img.width}×${img.height}`], ["File", formatBytes(img.size)]].map(([k, v]) => (
              <div key={k} className="rounded-lg border p-3"><dt className="text-gray-500">{k}</dt><dd className="font-semibold">{v}</dd></div>
            ))}
          </dl>
          {img.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {img.tags.map((t) => (
                <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-brand hover:text-white">{t}</Link>
              ))}
            </div>
          )}
          <AdSlot className="mt-6" />
        </aside>
      </div>
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Similar images</h2>
          <ImageGrid items={similar} />
        </section>
      )}
    </div>
  );
}
