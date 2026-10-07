"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { deleteFromR2 } from "@/lib/r2";
import Image from "@/models/Image";

const refresh = () => ["/", "/admin", "/admin/images"].forEach((p) => revalidatePath(p));

export async function deleteImages(ids) {
  await requireAdmin();
  await connectDB();
  const docs = await Image.find({ _id: { $in: ids } }).lean();
  await deleteFromR2(docs.flatMap((d) => Object.values(d.keys || {})));
  await Image.deleteMany({ _id: { $in: docs.map((d) => d._id) } });
  refresh();
  return { count: docs.length };
}

export async function setStatus(ids, status) {
  await requireAdmin();
  if (!["published", "draft"].includes(status)) throw new Error("Invalid status");
  await connectDB();
  await Image.updateMany({ _id: { $in: ids } }, { status });
  refresh();
  return { ok: true };
}
