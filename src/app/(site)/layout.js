import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }) {
  const ads = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <>
      {ads && (
        <Script async strategy="afterInteractive" crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads}`} />
      )}
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
