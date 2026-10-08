import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Visit from "@/models/Visit";

export async function POST(req: NextRequest) {
  try {
    if (
      /bot|crawl|spider|slurp|headless/i.test(
        req.headers.get("user-agent") || "",
      )
    ) {
      return NextResponse.json({ ok: true });
    }
    const { vid } = await req.json();
    if (typeof vid !== "string" || !/^[a-z0-9-]{10,40}$/i.test(vid)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const date = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Dhaka",
    });
    await dbConnect();
    await Visit.updateOne(
      { date, vid },
      { $inc: { views: 1 } },
      { upsert: true },
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
