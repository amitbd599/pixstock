import { NextResponse } from "next/server";
import { listImages } from "@/lib/queries";

export async function GET(req) {
  const p = new URL(req.url).searchParams;
  const limit = Math.min(60, Math.max(1, parseInt(p.get("limit")) || 24));
  try {
    const data = await listImages({ q: p.get("q") || "", category: p.get("category") || "", page: p.get("page") || 1, limit });
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
