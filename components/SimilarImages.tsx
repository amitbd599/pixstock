import ImageModel from "@/models/Image";
import dbConnect from "@/lib/db";

import ImageGridTwo from "./ImageGridTwo";

const LIMIT = 14;

async function getSimilar(id: string) {
  try {
    await dbConnect();

    const currentImage = await ImageModel.findById(id)
      .select("category tags")
      .lean();

    if (!currentImage) {
      return [];
    }

    const filter: any = {
      _id: { $ne: currentImage._id },
      status: "published",
    };

    if (currentImage.tags?.length > 0) {
      filter.$or = [
        {
          category: currentImage.category,
        },
        {
          tags: {
            $in: currentImage.tags,
          },
        },
      ];
    } else if (currentImage.category) {
      filter.category = currentImage.category;
    }

    const similar = await ImageModel.find(filter)
      .sort({
        views: -1,
        createdAt: -1,
      })
      .limit(LIMIT)
      .select(
        "title slug previewUrl thumbnailUrl mediumUrl width height views downloads category tags",
      )
      .lean();

    return similar.map((img: any) => ({
      _id: String(img._id),
      title: img.title,
      slug: img.slug,
      thumbnailUrl: img.thumbnailUrl,
      mediumUrl: img.mediumUrl,
      previewUrl: img.previewUrl,
      width: img.width,
      height: img.height,
      views: img.views,
      downloads: img.downloads,
      category: img.category,
      tags: img.tags,
    }));
  } catch (error) {
    console.error("getSimilar failed:", error);
    return [];
  }
}

export default async function SimilarImages({ id }: { id: string }) {
  const images = await getSimilar(id);

  if (!images.length) {
    return null;
  }

  return (
    <section className='mt-4'>
      <h2 className='mb-6 text-2xl font-semibold'>Similar Images</h2>

      <ImageGridTwo images={images} />
    </section>
  );
}
