import ImageCard from "./ImageCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ImageGridTwo({ images }: { images: any[] }) {
  if (!images?.length) {
    return <p className='text-center text-gray-500 py-20'>No images found</p>;
  }

  return (
    // CSS Columns ব্যবহার করে Masonry লেআউট
    <div className='columns-2 md:columns-3 lg:columns-3 gap-4 space-y-4'>
      {images.map((img) => (
        <ImageCard key={img._id} image={img} />
      ))}
    </div>
  );
}
