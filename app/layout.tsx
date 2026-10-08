import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import NextTopLoader from "nextjs-toploader";
import Track from "@/components/Track";
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PixStock - Free Stock Photos",
  description: "Download free high quality stock images",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className='bg-white text-gray-900 antialiased'>
        <Track />
        <NextTopLoader
          color='#34D39C'
          height={2}
          showSpinner={false}
          crawlSpeed={600}
          shadow='0 0 10px #10b981, 0 0 5px #10b981'
        />
        {children}
      </body>
    </html>
  );
}
