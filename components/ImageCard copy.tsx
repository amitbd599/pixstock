import Image from "next/image";
import Link from "next/link";

interface Props {
  image: {
    _id: string;
    title: string;
    slug: string;
    thumbnailUrl: string;
  };
}

export default function ImageCard({ image }: Props) {
  return (
    <Link
      href={`/image/${image.slug || image._id}`}
      className='group block overflow-hidden rounded-lg'
    >
      <div className='relative aspect-[4/3] bg-gray-100'>
        <Image
          src={image.thumbnailUrl}
          alt={image.title}
          fill
          className='object-cover transition duration-300 group-hover:scale-105'
          sizes='(max-width: 768px) 50vw, 25vw'
        />
      </div>
      <p className='mt-2 text-sm font-medium truncate'>{image.title}</p>
    </Link>
  );
}
