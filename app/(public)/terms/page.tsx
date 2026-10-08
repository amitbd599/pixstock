import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - PixStock",
  description:
    "Terms of Service for PixStock. Rules for using our free stock images and website.",
};

export default function TermsPage() {
  return (
    <main>
      <div>
        <SearchBar />
      </div>
      <div className='container mx-auto  py-[100px]'>
        <h1 className='text-3xl font-bold mb-2'>Terms of Service</h1>
        <p className='text-sm text-gray-500 mb-8'>
          Last updated: October 5, 2026
        </p>

        <div className='space-y-6 text-gray-700 leading-relaxed'>
          <p>
            By accessing or using <strong>PixStock</strong> (the "Website"), you
            agree to these Terms of Service. If you do not agree, please do not
            use the Website.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            1. Use of the Website
          </h2>
          <p>
            You may use PixStock for lawful purposes only. You agree not to:
          </p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Attempt to disrupt or harm the Website or its servers</li>
            <li>
              Scrape or bulk-download content in a way that overloads our
              systems
            </li>
            <li>
              Use automated tools to abuse search, download, or advertising
              systems
            </li>
            <li>
              Misrepresent content or remove required attribution where
              applicable
            </li>
          </ul>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            2. Image License & Usage
          </h2>
          <p>
            Images on PixStock are generally provided free of charge for
            personal and commercial use, subject to the following:
          </p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>
              You may use images in websites, apps, social media, presentations,
              print, and other projects.
            </li>
            <li>
              You may <strong>not</strong> sell, redistribute, or offer the
              images as standalone files (for example, on another stock site or
              as a paid download pack).
            </li>
            <li>
              You may <strong>not</strong> use images in a way that is illegal,
              defamatory, or promotes hate, violence, or discrimination.
            </li>
            <li>
              Always review the specific license notes on an image page if
              provided. When in doubt, contact us.
            </li>
          </ul>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            3. Intellectual Property
          </h2>
          <p>
            The PixStock name, logo, website design, and original content
            (excluding user-contributed or third-party licensed images where
            noted) are owned by us or our licensors. You may not copy or reuse
            our branding without permission.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            4. Disclaimer
          </h2>
          <p>
            The Website and all content are provided "as is" without warranties
            of any kind. We do not guarantee that the site will be
            uninterrupted, error-free, or that images will always meet your
            specific needs.
          </p>
          <p>
            While we aim to provide accurate and useful content, you are
            responsible for how you use downloaded images, including compliance
            with local laws and any applicable third-party rights.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            5. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, PixStock and its operators
            shall not be liable for any indirect, incidental, special, or
            consequential damages arising from your use of the Website or
            images.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            6. Advertising
          </h2>
          <p>
            The Website may display advertisements, including through Google
            AdSense. We are not responsible for the content of third-party ads
            or the practices of advertisers.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            7. Changes to the Terms
          </h2>
          <p>
            We may update these Terms from time to time. Continued use of the
            Website after changes means you accept the updated Terms.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            8. Contact
          </h2>
          <p>
            For questions about these Terms, please visit our{" "}
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
