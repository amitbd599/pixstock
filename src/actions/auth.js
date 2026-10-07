"use server";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function changePassword(_prev, fd) {
  const s = await getAdminSession();
  if (!s) return { error: "Unauthorized" };
  const current = String(fd.get("current") || "");
  const next = String(fd.get("next") || "");
  if (next.length < 8) return { error: "নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে" };
  if (next !== fd.get("confirm")) return { error: "পাসওয়ার্ড মিলছে না" };

  await connectDB();
  const admin = await Admin.findById(s.user.id);
  if (!admin || !(await bcrypt.compare(current, admin.password))) return { error: "বর্তমান পাসওয়ার্ড ভুল" };
  admin.password = await bcrypt.hash(next, 12);
  await admin.save();
  return { success: "পাসওয়ার্ড পরিবর্তন হয়েছে" };
}
