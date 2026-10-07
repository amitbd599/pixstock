import { NextResponse } from "next/server";
import { getImage, getSimilar } from "@/lib/queries";

export async function GET(_req, { params }) {
  const img = await getImage(params.id);
  if (!img) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ items: await getSimilar(img) });
}
