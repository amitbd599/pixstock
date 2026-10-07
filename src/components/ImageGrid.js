import Link from "next/link";
import Image from "next/image";

export default function ImageGrid({ items }) {
  if (!items?.length) return <p className="py-20 text-center text-gray-500">No images found.</p>;
  return (
    <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5">
      {items.map((img, i) => (
        <Link key={img._id} href={`/image/${img._id}`} className="group relative mb-3 block overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={img.urls.thumbnail}
            alt={img.alt || img.title}
            width={img.width}
            height={img.height}
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
            priority={i < 4}
            className="h-auto w-full transition group-hover:scale-105"
          />
          <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent p-2 text-xs text-white opacity-0 transition group-hover:opacity-100">
            {img.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
