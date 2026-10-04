import dbConnect from "@/lib/db";
import Image from "@/models/Image";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

async function getAllImages() {
  await dbConnect();
  return Image.find().sort({ createdAt: -1 }).limit(100).lean();
}

export default async function AdminImagesPage() {
  const images = await getAllImages();

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>All Images ({images.length})</h1>
        <Link
          href='/admin/upload'
          className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700'
        >
          + Upload New
        </Link>
      </div>

      <div className='overflow-x-auto bg-white rounded-xl border'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b bg-gray-50 text-left'>
              <th className='py-3 px-4'>Image</th>
              <th className='py-3 px-4'>Title</th>
              <th className='py-3 px-4'>Views</th>
              <th className='py-3 px-4'>Downloads</th>
              <th className='py-3 px-4'>Status</th>
              <th className='py-3 px-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img: any) => (
              <tr key={img._id} className='border-b hover:bg-gray-50'>
                <td className='py-3 px-4'>
                  <img
                    src={img.thumbnailUrl}
                    alt={img.title}
                    className='w-16 h-12 object-cover rounded'
                  />
                </td>
                <td className='py-3 px-4'>
                  <Link
                    href={`/image/${img.slug}`}
                    className='hover:underline font-medium'
                    target='_blank'
                  >
                    {img.title}
                  </Link>
                </td>
                <td className='py-3 px-4'>{img.views}</td>
                <td className='py-3 px-4'>{img.downloads}</td>
                <td className='py-3 px-4'>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      img.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {img.status}
                  </span>
                </td>
                <td className='py-3 px-4'>
                  <DeleteButton imageId={String(img._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {images.length === 0 && (
          <p className='text-center text-gray-500 py-12'>No images yet</p>
        )}
      </div>
    </div>
  );
}
