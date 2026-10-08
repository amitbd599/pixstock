import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - PixStock",
  description:
    "Get in touch with the PixStock team for support, feedback, or inquiries.",
};

export default function ContactPage() {
  return (
    <main>
      <div>
        <SearchBar />
      </div>
      <div className='container mx-auto py-[100px]'>
        <h1 className='text-3xl font-bold mb-6'>Contact Us</h1>

        <div className='space-y-6 text-gray-700 leading-relaxed'>
          <p>
            We would love to hear from you. Whether you have a question about
            image licensing, found an issue on the site, or want to share
            feedback — feel free to reach out.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>Email</h2>
          <p>
            Send us a message at:{" "}
            <a
              href='mailto:support@yourdomain.com'
              className='text-blue-600 hover:underline font-medium'
            >
              support@yourdomain.com
            </a>
          </p>
          <p className='text-sm text-gray-500'>
            Replace <code>support@yourdomain.com</code> with your real email
            address before going live.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            What to Include
          </h2>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Your name</li>
            <li>
              A clear subject (e.g. licensing question, bug report, feedback)
            </li>
            <li>Relevant details or screenshots if reporting a problem</li>
          </ul>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            Response Time
          </h2>
          <p>
            We typically respond within 1–3 business days. During busy periods
            it may take a little longer.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            Other Pages
          </h2>
          <p>
            You may also find answers in our{" "}
            <a href='/privacy' className='text-blue-600 hover:underline'>
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href='/terms' className='text-blue-600 hover:underline'>
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
