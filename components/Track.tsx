"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Track() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    try {
      let vid = localStorage.getItem("vid");
      if (!vid) {
        vid = crypto.randomUUID();
        localStorage.setItem("vid", vid);
      }
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vid }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }, [pathname]);

  return null;
}
