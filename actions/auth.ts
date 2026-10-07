"use server";

import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";

// ========== প্রথম Admin তৈরি (একবার চালাবে) ==========
export async function seedAdminAction() {
  try {
    await dbConnect();

    const existing = await Admin.findOne({});
    if (existing) {
      return { success: false, message: "Admin already exists" };
    }

    const hashedPassword = await bcrypt.hash("admin123", 12);

    await Admin.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    return {
      success: true,
      message: "Admin created! Email: admin@example.com | Password: admin123",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create admin" };
  }
}

// ========== Password Change ==========
export type ChangePasswordState = {
  success: boolean;
  message: string;
};

export async function changePasswordAction(
  prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session.user?.role !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, message: "All fields are required" };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        message: "New password must be at least 6 characters",
      };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, message: "New passwords do not match" };
    }

    await dbConnect();

    // Email দিয়ে খুঁজছি (id না)
    const admin = await Admin.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!admin) {
      return { success: false, message: "Admin not found" };
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return { success: false, message: "Current password is incorrect" };
    }

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();

    revalidatePath("/admin/settings");

    return { success: true, message: "Password changed successfully!" };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, message: "Something went wrong" };
  }
}
