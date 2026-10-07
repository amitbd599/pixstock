import LegalPage from "@/components/LegalPage";
export const metadata = { title: "About Us", alternates: { canonical: "/about" } };
export default function Page() {
  return (
    <LegalPage title="About PixStock">
      <p>PixStock is a free stock image library. Our goal is simple: make high-quality visuals available to everyone — bloggers, designers, students, and businesses — without sign-ups or paywalls.</p>
      <p>Every image on PixStock is free to download and use for personal and commercial projects. The site is supported by advertising (Google AdSense), which lets us keep the library free.</p>
      <h2>What we offer</h2>
      <ul><li>Fast, searchable image library</li><li>Multiple sizes optimized for the web</li><li>Clear, simple license</li></ul>
    </LegalPage>
  );
}
