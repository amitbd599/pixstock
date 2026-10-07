import { NextResponse } from "next/server";
import { getImage } from "@/lib/queries";

export async function GET(_req, { params }) {
  const img = await getImage(params.id);
  if (!img || img.status !== "published") return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(img);
}
