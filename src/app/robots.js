import { APP_URL } from "@/lib/queries";
export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/search"] }], sitemap: `${APP_URL}/sitemap.xml` };
}
