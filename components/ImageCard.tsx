import Image from "next/image";
import Link from "next/link";
import DownloadButtonInner from "./DownloadButtonInner";

interface Props {
  image: {
    _id: string;
    title: string;
    width: number;
    height: number;
    slug: string;
    previewUrl: string;
  };
}

export default function ImageCard({ image }: Props) {
  return (
    <div className='relative'>
      <Link
        href={`/image/${image.slug || image._id}`}
        className='group relative block mb-4 break-inside-avoid overflow-hidden rounded-lg bg-gray-100'
      >
        <Image
          src={image.previewUrl}
          alt={image.title}
          width={image.width}
          height={image.height}
          className='w-full h-auto object-cover transition duration-500 group-hover:scale-105'
          sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
        />

        {/* নিচের গ্রেডিয়েন্ট: ওপরে স্বচ্ছ, নিচে গাঢ় কালো */}
        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100' />

        {/* টাইটেল: হোভারে নিচ থেকে ওপরে উঠে আসবে */}
        <p className='pointer-events-none absolute inset-x-0 bottom-0 translate-y-full truncate px-3 pb-3 text-[16px] font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100'>
          {image.title}
        </p>
      </Link>
      <DownloadButtonInner imageId={image._id} />
    </div>
  );
}
