import dbConnect from "@/lib/db";
import Visit from "@/models/Visit";

export const dynamic = "force-dynamic";

export default async function VisitCount() {
  await dbConnect();
  const rows = await Visit.aggregate([
    {
      $group: {
        _id: "$date",
        visitors: { $sum: 1 },
        views: { $sum: "$views" },
      },
    },
    { $sort: { _id: -1 } },
    { $limit: 14 },
  ]);

  return (
    <div className='w-full max-w-3xl overflow-hidden rounded-xl border bg-white shadow-sm'>
      <div className='flex items-center justify-between border-b px-5 py-4'>
        <h2 className='font-semibold text-gray-900'>Daily Traffic</h2>
        <span className='text-xs text-gray-500'>Last {rows.length} days</span>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-left text-sm'>
          <thead className='bg-gray-50 text-xs uppercase tracking-wide text-gray-500'>
            <tr>
              <th className='px-5 py-3 font-medium'>Date</th>
              <th className='px-5 py-3 text-right font-medium'>Visitors</th>
              <th className='px-5 py-3 text-right font-medium'>Page views</th>
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-100'>
            {rows.map((r, i) => (
              <tr key={r._id} className='transition hover:bg-emerald-50/60'>
                <td className='px-5 py-3 font-medium text-gray-800'>
                  {r._id}
                  {i === 0 && (
                    <span className='ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700'>
                      Latest
                    </span>
                  )}
                </td>
                <td className='px-5 py-3 text-right tabular-nums text-gray-700'>
                  {Number(r.visitors).toLocaleString()}
                </td>
                <td className='px-5 py-3 text-right tabular-nums text-gray-700'>
                  {Number(r.views).toLocaleString()}
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className='px-5 py-10 text-center text-gray-400'
                >
                  No traffic data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
