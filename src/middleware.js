import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  // proxy-র ডুপ্লিকেট হেডার ("a, a") ঠিক করা
  const h = new Headers(req.headers);
  for (const k of ["x-forwarded-host", "x-forwarded-proto"]) {
    const v = h.get(k);
    if (v && v.includes(",")) h.set(k, v.split(",")[0].trim());
  }

  // /admin/login বাদে সব /admin রুট প্রটেক্টেড
  const p = req.nextUrl.pathname;
  if (p !== "/admin/login") {
    const t = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!t) {
      const u = req.nextUrl.clone();
      u.pathname = "/admin/login";
      u.search = "";
      return NextResponse.redirect(u);
    }
  }
  return NextResponse.next({ request: { headers: h } });
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
