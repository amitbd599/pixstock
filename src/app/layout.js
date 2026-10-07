import "./globals.css";
import { APP_URL } from "@/lib/queries";

export const metadata = {
  metadataBase: new URL(APP_URL),
  title: { default: "PixStock – Free High-Quality Stock Images", template: "%s | PixStock" },
  description: "Free high-quality stock images for everyone. Download for personal and commercial use, no registration required.",
  openGraph: { siteName: "PixStock", type: "website" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
