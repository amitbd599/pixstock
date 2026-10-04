import { NextResponse } from "next/server";
import { seedAdminAction } from "@/actions/auth";

export async function GET() {
  const result = await seedAdminAction();
  return NextResponse.json(result);
}

// http://localhost:3000/api/seed-admin
