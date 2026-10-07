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
    mediumUrl: string;
  };
}

export default function ImageCard({ image }: Props) {
  return (
    <div className='relative'>
      <Link
        href={`/image/${image.slug || image._id}`}
        className='group block overflow-hidden rounded-lg mb-4 break-inside-avoid' // mb-4 এবং break-inside-avoid জরুরি
      >
        <div className='relative w-full overflow-hidden rounded-lg bg-gray-100'>
          {/* এখানে width এবং height আপনার ডেটাবেজ অনুযায়ী দিতে হবে, অথবা intrinsic size দিতে হবে */}
          <Image
            src={image.mediumUrl}
            alt={image.title}
            width={image.width} // ডামি width
            height={image.height} // ডামি height (আসল ছবির অনুপাত বোঝানোর জন্য)
            className='w-full h-auto object-cover transition duration-300 group-hover:scale-105'
            sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
          />
        </div>
        {/* <p className='mt-2 text-sm font-medium truncate px-1'>{image.title}</p> */}
      </Link>
      <DownloadButtonInner imageId={image._id} />
    </div>
  );
}
