import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - PixStock",
  description:
    "Privacy Policy for PixStock. Learn how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <main>
      <div>
        <SearchBar />
      </div>

      <div className='container mx-auto  py-[100px]'>
        <h1 className='text-3xl font-bold mb-2'>Privacy Policy</h1>
        <p className='text-sm text-gray-500 mb-8'>
          Last updated: October 5, 2026
        </p>

        <div className='space-y-6 text-gray-700 leading-relaxed'>
          <p>
            This Privacy Policy explains how <strong>PixStock</strong> ("we",
            "us", or "our") collects, uses, and protects information when you
            visit or use our website.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            1. Information We Collect
          </h2>
          <p>We may collect the following types of information:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>
              <strong>Usage data:</strong> pages visited, images viewed or
              downloaded, browser type, device information, and approximate
              location derived from IP address.
            </li>
            <li>
              <strong>Cookies and similar technologies:</strong> used for
              analytics, advertising, and improving site performance.
            </li>
            <li>
              <strong>Contact information:</strong> if you message us through
              the contact form (such as name and email address).
            </li>
            <li>
              <strong>Admin account data:</strong> only for authorized
              administrators who manage the platform.
            </li>
          </ul>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            2. How We Use Information
          </h2>
          <ul className='list-disc pl-6 space-y-2'>
            <li>To operate and improve the website</li>
            <li>To understand how visitors use our content</li>
            <li>
              To display relevant advertisements (including Google AdSense)
            </li>
            <li>To respond to inquiries and provide support</li>
            <li>To maintain security and prevent abuse</li>
          </ul>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            3. Google AdSense & Advertising
          </h2>
          <p>
            We use Google AdSense to show ads on our website. Google and its
            partners may use cookies or similar technologies to serve ads based
            on your visits to this site and other sites on the internet.
          </p>
          <p>
            You can learn more about how Google uses data here:{" "}
            <a
              href='https://policies.google.com/technologies/partner-sites'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              How Google uses information from sites that use our services
            </a>
            .
          </p>
          <p>
            You may opt out of personalized advertising by visiting{" "}
            <a
              href='https://www.google.com/settings/ads'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              Google Ads Settings
            </a>
            .
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            4. Cookies
          </h2>
          <p>
            Cookies are small files stored on your device. We use cookies for
            essential site functions, analytics, and advertising. You can
            control cookies through your browser settings. Disabling cookies may
            affect some features of the site.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            5. Third-Party Services
          </h2>
          <p>
            We may use third-party services such as Google Analytics, Google
            AdSense, and cloud storage providers. These services have their own
            privacy policies governing the use of your information.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            6. Data Retention
          </h2>
          <p>
            We retain information only as long as necessary for the purposes
            described in this policy, unless a longer retention period is
            required by law.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            7. Children's Privacy
          </h2>
          <p>
            Our website is not directed to children under 13. We do not
            knowingly collect personal information from children under 13. If
            you believe a child has provided us with personal information,
            please contact us so we can delete it.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            8. Your Rights
          </h2>
          <p>
            Depending on your location, you may have rights to access, correct,
            or delete certain personal information. To make a request, please
            contact us using the details on our{" "}
            <Link href='/contact' className='text-blue-600 hover:underline'>
              Contact page
            </Link>
            .
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            9. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. The updated
            version will be posted on this page with a revised "Last updated"
            date.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            10. Contact
          </h2>
          <p>
            If you have questions about this Privacy Policy, please visit our{" "}
            <Link href='/contact' className='text-blue-600 hover:underline'>
              Contact page
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
