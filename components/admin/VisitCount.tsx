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
    <table className='w-full max-w-md text-left'>
      <thead>
        <tr>
          <th>Date</th>
          <th>Visitors</th>
          <th>Page views</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r._id}>
            <td>{r._id}</td>
            <td>{r.visitors}</td>
            <td>{r.views}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
