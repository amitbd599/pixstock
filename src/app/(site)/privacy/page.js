import LegalPage from "@/components/LegalPage";
export const metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };
export default function Page() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Last updated: {new Date().getFullYear()}. This policy explains how PixStock handles information when you visit our website.</p>
      <h2>Information we collect</h2>
      <p>You do not need an account to browse or download images. We may collect non-personal data such as browser type, pages visited, and approximate location through standard server logs and analytics.</p>
      <h2>Cookies and advertising</h2>
      <p>We use Google AdSense to display ads. Google and its partners use cookies (including the DoubleClick cookie) to serve ads based on your visits to this and other websites. You can opt out of personalized advertising at <a className="text-brand underline" href="https://www.google.com/settings/ads" rel="noopener noreferrer">Google Ads Settings</a> or <a className="text-brand underline" href="https://www.aboutads.info" rel="noopener noreferrer">aboutads.info</a>.</p>
      <h2>Third parties</h2>
      <p>Images are delivered through Cloudflare. Third-party vendors, including Google, may collect data under their own privacy policies.</p>
      <h2>Children</h2>
      <p>PixStock is not directed to children under 13 and we do not knowingly collect their personal information.</p>
      <h2>Contact</h2>
      <p>Questions? Visit our <a className="text-brand underline" href="/contact">contact page</a>.</p>
    </LegalPage>
  );
}
