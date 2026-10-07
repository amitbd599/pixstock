import LegalPage from "@/components/LegalPage";
export const metadata = { title: "Contact", alternates: { canonical: "/contact" } };
export default function Page() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com";
  return (
    <LegalPage title="Contact Us">
      <p>For questions, copyright concerns, or takedown requests, email us at <a className="text-brand underline" href={`mailto:${email}`}>{email}</a>. We usually reply within a few business days.</p>
    </LegalPage>
  );
}
