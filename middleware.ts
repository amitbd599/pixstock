import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Login page সবাই দেখতে পারবে
        if (path === "/admin/login") {
          return true;
        }

        // অন্য admin route → শুধু admin
        if (path.startsWith("/admin")) {
          return token?.role === "admin";
        }

        return true;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};