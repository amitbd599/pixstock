import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "License - PixStock",
  description:
    "PixStock free image license. Learn how you can use our free stock photos for personal and commercial projects.",
};

export default function LicensePage() {
  return (
    <main>
      <div>
        <SearchBar />
      </div>

      <div className='container mx-auto py-[100px]'>
        <h1 className='text-3xl font-bold mb-2'>Content License</h1>
        <p className='text-sm text-gray-500 mb-8'>
          Last updated: October 5, 2026
        </p>

        <div className='space-y-6 text-gray-700 leading-relaxed'>
          <p>
            All images available on <strong>PixStock</strong> are free to use.
            This page explains what you can and cannot do with our content.
          </p>

          <div className='bg-green-50 border border-green-200 rounded-xl p-5'>
            <p className='font-semibold text-green-800 mb-1'>Simple summary</p>
            <p className='text-green-900'>
              You can download and use PixStock images for free — for personal
              and commercial projects — without asking permission. You do not
              have to give credit (though it is appreciated).
            </p>
          </div>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            What is allowed
          </h2>
          <p>You may:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Use images for personal projects</li>
            <li>
              Use images for commercial projects (websites, apps, ads, products,
              social media, presentations, print, etc.)
            </li>
            <li>Edit, crop, modify, or combine images with other content</li>
            <li>Use images digitally or in print</li>
            <li>Download and use as many images as you need</li>
          </ul>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            What is not allowed
          </h2>
          <p>You may not:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>
              Sell, redistribute, or share the images as standalone files (for
              example, on another stock photo website or as a paid download
              pack)
            </li>
            <li>
              Claim ownership of the original images or invent a different
              license for them
            </li>
            <li>
              Use images in any way that is illegal, defamatory, hateful, or
              promotes violence or discrimination
            </li>
            <li>
              Use images in a trademark, logo, or branding in a way that
              suggests PixStock endorses your product or business (without
              permission)
            </li>
          </ul>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            Attribution
          </h2>
          <p>
            Giving credit is <strong>not required</strong>, but it is always
            appreciated. If you want to credit PixStock, you can use something
            like:
          </p>
          <p className='bg-gray-100 rounded-lg px-4 py-3 font-mono text-sm'>
            Photo from PixStock
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            No warranty
          </h2>
          <p>
            Images are provided “as is”. PixStock does not guarantee that an
            image is free of all third-party rights in every possible use case
            (for example, recognizable people, logos, or private property
            appearing in a photo). You are responsible for how you use the
            images.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            Changes to this license
          </h2>
          <p>
            We may update this license from time to time. The latest version
            will always be published on this page. Continued use of PixStock
            after changes means you accept the updated license.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-2'>
            Questions
          </h2>
          <p>
            If you are unsure whether your intended use is allowed, please{" "}
            <Link href='/contact' className='text-blue-600 hover:underline'>
              contact us
            </Link>{" "}
            before using the image.
          </p>

          <p className='pt-4 text-sm text-gray-500'>
            Related pages:{" "}
            <Link href='/terms' className='text-blue-600 hover:underline'>
              Terms of Service
            </Link>{" "}
            ·{" "}
            <Link href='/privacy' className='text-blue-600 hover:underline'>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
