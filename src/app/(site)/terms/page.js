import LegalPage from "@/components/LegalPage";
export const metadata = { title: "Terms of Service", alternates: { canonical: "/terms" } };
export default function Page() {
  return (
    <LegalPage title="Terms of Service">
      <p>By using PixStock you agree to these terms.</p>
      <h2>Use of the site</h2>
      <p>You may browse and download images under the terms of our <a className="text-brand underline" href="/license">License</a>. You agree not to scrape the site at a rate that harms its performance or to attempt unauthorized access to admin areas.</p>
      <h2>No warranty</h2>
      <p>The site and images are provided “as is”. We make no guarantee of availability, accuracy, or fitness for a particular purpose.</p>
      <h2>Content removal</h2>
      <p>If you believe an image infringes your rights, contact us and we will review and remove it promptly where appropriate.</p>
      <h2>Changes</h2>
      <p>We may update these terms at any time. Continued use means you accept the updated terms.</p>
    </LegalPage>
  );
}
