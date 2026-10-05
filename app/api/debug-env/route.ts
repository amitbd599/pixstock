import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
  });
}
