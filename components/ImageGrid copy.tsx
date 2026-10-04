import ImageCard from "./ImageCard";

export default function ImageGrid({ images }: { images: any[] }) {
  if (!images?.length) {
    return <p className='text-center text-gray-500 py-20'>No images found</p>;
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {images.map((img) => (
        <ImageCard key={img._id} image={img} />
      ))}
    </div>
  );
}
