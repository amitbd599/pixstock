import { google } from "googleapis";
import { unstable_cache } from "next/cache";

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  scopes: [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/webmasters.readonly",
  ],
});
const ga = google.analyticsdata({ version: "v1beta", auth });
const sc = google.searchconsole({ version: "v1", auth });
const iso = (d: Date) => d.toISOString().slice(0, 10);

async function _analytics(days: number) {
  const property = `properties/${process.env.GA4_PROPERTY_ID}`;
  const run = async (dim: string | null, metrics: string[], limit = 10) => {
    const r = await ga.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
        metrics: metrics.map((name) => ({ name })),
        ...(dim
          ? {
              dimensions: [{ name: dim }],
              limit: String(limit),
              orderBys:
                dim === "date"
                  ? [{ dimension: { dimensionName: "date" } }]
                  : [{ metric: { metricName: metrics[0] }, desc: true }],
            }
          : {}),
      },
    });
    return (r.data.rows || []).map((row) => ({
      key: row.dimensionValues?.[0]?.value ?? "total",
      values: (row.metricValues || []).map((m) => Number(m.value)),
    }));
  };
  const [totals, daily, pages, countries, channels] = await Promise.all([
    run(null, [
      "activeUsers",
      "sessions",
      "screenPageViews",
      "averageSessionDuration",
    ]),
    run("date", ["activeUsers", "screenPageViews"], days + 1),
    run("pagePath", ["screenPageViews", "activeUsers"]),
    run("country", ["activeUsers"]),
    run("sessionDefaultChannelGroup", ["sessions"]),
  ]);
  return {
    totals: totals[0]?.values ?? [0, 0, 0, 0],
    daily,
    pages,
    countries,
    channels,
  };
}

async function _search(days: number) {
  const siteUrl = process.env.GSC_SITE_URL!;
  const end = new Date(Date.now() - 2 * 864e5); // Search Console ডাটা ~২ দিন দেরিতে আসে
  const start = new Date(end.getTime() - days * 864e5);
  const q = async (dimensions: string[], rowLimit: number) =>
    (
      await sc.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: iso(start),
          endDate: iso(end),
          dimensions,
          rowLimit,
        },
      })
    ).data.rows || [];
  const [byDate, queries, pages] = await Promise.all([
    q(["date"], days + 5),
    q(["query"], 10),
    q(["page"], 10),
  ]);
  const clicks = byDate.reduce((a, r) => a + (r.clicks || 0), 0);
  const impressions = byDate.reduce((a, r) => a + (r.impressions || 0), 0);
  const position = byDate.length
    ? byDate.reduce((a, r) => a + (r.position || 0), 0) / byDate.length
    : 0;
  return {
    clicks,
    impressions,
    ctr: impressions ? clicks / impressions : 0,
    position,
    queries,
    pages,
  };
}

// ১০ মিনিট ক্যাশ, যাতে Google API-র কোটা শেষ না হয়
export const getAnalytics = unstable_cache(_analytics, ["ga4"], {
  revalidate: 600,
});
export const getSearch = unstable_cache(_search, ["gsc"], { revalidate: 600 });
