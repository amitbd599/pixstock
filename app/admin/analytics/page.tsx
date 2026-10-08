import Link from "next/link";
import { getAnalytics, getSearch } from "@/lib/google";

export const dynamic = "force-dynamic";

const fmt = (n: number) => Math.round(n).toLocaleString();
const dur = (s: number) => `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
const day = (d: string) => `${d.slice(6, 8)}/${d.slice(4, 6)}`;

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-xl border bg-white p-5'>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='text-2xl font-bold'>{value}</p>
    </div>
  );
}

function Table({
  title,
  head,
  rows,
}: {
  title: string;
  head: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className='overflow-hidden rounded-xl border bg-white'>
      <h3 className='border-b px-4 py-3 font-semibold'>{title}</h3>
      <table className='w-full text-sm'>
        <thead className='bg-gray-50 text-xs uppercase text-gray-500'>
          <tr>
            {head.map((h, i) => (
              <th
                key={h}
                className={`px-4 py-2 ${i ? "text-right" : "text-left"}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y'>
          {rows.map((r, i) => (
            <tr key={i} className='hover:bg-emerald-50/60'>
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`px-4 py-2 ${j ? "text-right tabular-nums" : "max-w-[260px] truncate"}`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td
                colSpan={head.length}
                className='p-6 text-center text-gray-400'
              >
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const days = [7, 28, 90].includes(Number((await searchParams).days))
    ? Number((await searchParams).days)
    : 28;

  let ga: Awaited<ReturnType<typeof getAnalytics>> | null = null;
  let gsc: Awaited<ReturnType<typeof getSearch>> | null = null;
  const errors: string[] = [];
  await Promise.all([
    getAnalytics(days)
      .then((r) => (ga = r))
      .catch((e) => errors.push("Analytics: " + e.message)),
    getSearch(days)
      .then((r) => (gsc = r))
      .catch((e) => errors.push("Search Console: " + e.message)),
  ]);

  const max = ga ? Math.max(1, ...ga.daily.map((d) => d.values[1])) : 1;

  return (
    <div className='space-y-8'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h1 className='text-2xl font-bold'>Analytics</h1>
        <div className='flex gap-2'>
          {[7, 28, 90].map((d) => (
            <Link
              key={d}
              href={`/admin/analytics?days=${d}`}
              className={`rounded-lg border px-3 py-1.5 text-sm ${d === days ? "bg-emerald-600 text-white" : "bg-white"}`}
            >
              {d} days
            </Link>
          ))}
        </div>
      </div>

      {errors.map((e) => (
        <p key={e} className='rounded-lg bg-red-50 p-3 text-sm text-red-700'>
          {e}
        </p>
      ))}

      {ga && (
        <section className='space-y-4'>
          <h2 className='text-lg font-semibold'>Google Analytics</h2>
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            <Card label='Users' value={fmt(ga.totals[0])} />
            <Card label='Sessions' value={fmt(ga.totals[1])} />
            <Card label='Page views' value={fmt(ga.totals[2])} />
            <Card label='Avg. session' value={dur(ga.totals[3])} />
          </div>

          <div className='rounded-xl border bg-white p-5'>
            <p className='mb-3 text-sm font-medium text-gray-600'>
              Page views per day
            </p>
            <div className='flex h-40 items-end gap-1'>
              {ga.daily.map((d) => (
                <div key={d.key} className='group relative flex-1'>
                  <div
                    className='rounded-t bg-emerald-500 transition group-hover:bg-emerald-700'
                    style={{
                      height: `${(d.values[1] / max) * 100}%`,
                      minHeight: 2,
                    }}
                  />
                  <span className='pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block'>
                    {day(d.key)}: {d.values[1]} views, {d.values[0]} users
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='grid gap-4 lg:grid-cols-3'>
            <Table
              title='Top pages'
              head={["Page", "Views", "Users"]}
              rows={ga.pages.map((p) => [
                p.key,
                fmt(p.values[0]),
                fmt(p.values[1]),
              ])}
            />
            <Table
              title='Countries'
              head={["Country", "Users"]}
              rows={ga.countries.map((p) => [p.key, fmt(p.values[0])])}
            />
            <Table
              title='Traffic sources'
              head={["Channel", "Sessions"]}
              rows={ga.channels.map((p) => [p.key, fmt(p.values[0])])}
            />
          </div>
        </section>
      )}

      {gsc && (
        <section className='space-y-4'>
          <h2 className='text-lg font-semibold'>Search Console</h2>
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            <Card label='Clicks' value={fmt(gsc.clicks)} />
            <Card label='Impressions' value={fmt(gsc.impressions)} />
            <Card label='CTR' value={(gsc.ctr * 100).toFixed(2) + "%"} />
            <Card label='Avg. position' value={gsc.position.toFixed(1)} />
          </div>
          <div className='grid gap-4 lg:grid-cols-2'>
            <Table
              title='Top queries'
              head={["Query", "Clicks", "Impr."]}
              rows={gsc.queries.map((r) => [
                r.keys?.[0] ?? "",
                fmt(r.clicks || 0),
                fmt(r.impressions || 0),
              ])}
            />
            <Table
              title='Top pages'
              head={["Page", "Clicks", "Impr."]}
              rows={gsc.pages.map((r) => [
                (r.keys?.[0] ?? "").replace(/^https?:\/\/[^/]+/, "") || "/",
                fmt(r.clicks || 0),
                fmt(r.impressions || 0),
              ])}
            />
          </div>
        </section>
      )}
    </div>
  );
}
