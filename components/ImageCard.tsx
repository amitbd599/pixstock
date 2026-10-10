import Image from "next/image";
import Link from "next/link";
import DownloadButtonInner from "./DownloadButtonInner";

export interface PixstockImage {
  _id: string;
  title: string;
  width: number;
  height: number;
  slug: string;
  previewUrl?: string | null;
  thumbnailUrl?: string | null;
  mediumUrl?: string | null;
  largeUrl?: string | null;
  originalUrl?: string | null;
  alt?: string | null;
}

interface Props {
  image: PixstockImage;
  isPriority?: boolean;
}

const IMAGE_SIZES =
  "(max-width: 767px) calc(50vw - 24px), " +
  "(max-width: 1023px) calc(33.333vw - 24px), " +
  "(max-width: 1279px) calc(25vw - 24px), 300px";

export default function ImageCard({ image, isPriority = false }: Props) {
  const imageUrl = [
    image.previewUrl,
    image.thumbnailUrl,
    image.mediumUrl,
    image.largeUrl,
    image.originalUrl,
  ].find(
    (url): url is string => typeof url === "string" && url.trim().length > 0,
  );

  const width =
    Number.isFinite(image.width) && image.width > 0 ? image.width : 1200;

  const height =
    Number.isFinite(image.height) && image.height > 0 ? image.height : 800;

  const title = image.title?.trim() || "Free stock image";
  const alt = image.alt?.trim() || title;
  const imageHref = `/image/${image.slug || image._id}`;

  return (
    <div className='relative mb-4 break-inside-avoid'>
      <Link
        href={imageHref}
        className='group relative block overflow-hidden rounded-lg bg-gray-100'
        aria-label={`View image: ${title}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            sizes={IMAGE_SIZES}
            loading={isPriority ? "eager" : "lazy"}
            fetchPriority={isPriority ? "high" : "auto"}
            className='block h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none'
          />
        ) : (
          <div
            className='flex aspect-[3/2] w-full items-center justify-center bg-gray-100 text-sm text-gray-500'
            role='img'
            aria-label={alt}
          >
            Image unavailable
          </div>
        )}

        {imageUrl && (
          <>
            <div className='pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100' />

            <p className='pointer-events-none absolute inset-x-0 bottom-0 translate-y-full truncate px-3 pb-3 text-base font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100'>
              {title}
            </p>
          </>
        )}
      </Link>

      <DownloadButtonInner imageId={image._id} />
    </div>
  );
}
