import VisitCount from "@/components/admin/VisitCount";
import connectDB from "@/lib/db"; // আপনার নামে মিলিয়ে নিন
import Image from "@/models/Image";

async function getStats() {
  await connectDB();

  const [totals] = await Image.aggregate([
    {
      $group: {
        _id: null,
        images: { $sum: 1 },
        views: { $sum: "$views" },
        downloads: { $sum: "$downloads" },
      },
    },
  ]);

  const published = await Image.countDocuments({ status: "published" });

  const topDownloaded = await Image.find()
    .sort({ downloads: -1 })
    .limit(10)
    .select("title thumbnailUrl downloads views")
    .lean();

  return {
    images: totals?.images ?? 0,
    published,
    views: totals?.views ?? 0,
    downloads: totals?.downloads ?? 0,
    topDownloaded: JSON.parse(JSON.stringify(topDownloaded)),
  };
}

export const dynamic = "force-dynamic";
export default async function AdminDashboard() {
  const s = await getStats();

  const cards = [
    ["Total Images", s.images],
    ["Published", s.published],
    ["Total Views", s.views],
    ["Total Downloads", s.downloads],
  ];
  return (
    <div>
      <div className='grid grid-cols-12 gap-[30px]'>
        <div className='col-span-12 md:col-span-6'>
          <div>
            <h1 className='text-2xl font-bold mb-2'>Admin Dashboard</h1>
            <hr />
            <br />
            <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
              {cards.map(([label, value]) => (
                <div
                  key={label as string}
                  className='rounded-xl border bg-white p-5'
                >
                  <p className='text-sm text-gray-500'>{label}</p>
                  <p className='text-3xl font-bold'>
                    {(value as number).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <br />
            {/* VisitCount */}
            <VisitCount />
          </div>
        </div>
        <div className='col-span-12 md:col-span-6'>
          <div>
            <h2 className='mb-3  text-lg font-semibold'>Top downloaded</h2>
            <hr />
            <br />
            <div className='divide-y rounded-xl border bg-white'>
              {s.topDownloaded.map((i: any) => (
                <div key={i._id} className='flex items-center gap-3 p-3'>
                  <img
                    src={i.thumbnailUrl}
                    alt={i.alt}
                    className='h-12 w-16 rounded object-cover'
                  />
                  <span className='flex-1 truncate'>{i.title}</span>
                  <span className='text-sm text-gray-500'>
                    ⬇ {i.downloads} · 👁 {i.views}
                  </span>
                </div>
              ))}
              {!s.topDownloaded.length && (
                <p className='p-4 text-gray-500'>No data yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
