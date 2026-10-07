import Link from "next/link";
import { getStats } from "@/lib/queries";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const s = await getStats();
  const cards = [["Total images", s.total], ["Published", s.published], ["Drafts", s.drafts], ["Views", s.views], ["Downloads", s.downloads]];
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {cards.map(([k, v]) => (
          <div key={k} className="rounded-xl border bg-white p-4"><p className="text-sm text-gray-500">{k}</p><p className="text-2xl font-bold">{v.toLocaleString()}</p></div>
        ))}
      </div>
      <h2 className="mb-3 mt-8 text-lg font-bold">Latest uploads</h2>
      <div className="divide-y rounded-xl border bg-white">
        {s.latest.length === 0 && <p className="p-4 text-gray-500">No images yet. <Link className="text-brand underline" href="/admin/upload">Upload one</Link></p>}
        {s.latest.map((i) => (
          <div key={i._id} className="flex items-center gap-3 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.urls.thumbnail} alt="" className="h-12 w-12 rounded object-cover" />
            <div className="min-w-0 flex-1"><p className="truncate font-medium">{i.title}</p><p className="text-xs text-gray-500">{i.status}</p></div>
          </div>
        ))}
      </div>
    </>
  );
}
