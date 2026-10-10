import ImageCard, { type PixstockImage } from "./ImageCard";

interface ImageGridProps {
  images: PixstockImage[];
}

export default function ImageGrid({ images }: ImageGridProps) {
  if (!images?.length) {
    return <p className='py-20 text-center text-gray-500'>No images found</p>;
  }

  return (
    <div className='columns-2 gap-4 md:columns-3 lg:columns-4'>
      {images.map((image, index) => (
        <ImageCard key={image._id} image={image} isPriority={index < 2} />
      ))}
    </div>
  );
}
