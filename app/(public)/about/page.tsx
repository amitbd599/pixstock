import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us - PixStock",
  description:
    "Learn about PixStock — our mission to provide free high-quality stock images for everyone.",
};

export default function AboutPage() {
  return (
    <main>
      <div>
        <SearchBar />
      </div>

      <div className='container mx-auto  py-[100px]'>
        <h1 className='text-3xl font-bold mb-6'>About PixStock</h1>

        <div className='space-y-6 text-gray-700 leading-relaxed'>
          <p>
            Welcome to <strong>PixStock</strong> — a free stock image platform
            built for creators, designers, developers, bloggers, and businesses
            who need high-quality visuals without complicated licensing.
          </p>

          <p>
            Our goal is simple: make beautiful, usable images available to
            everyone at no cost. Whether you are building a website, designing a
            presentation, creating social media content, or working on a
            personal project, PixStock gives you access to free images you can
            download and use with confidence.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-4'>
            What We Offer
          </h2>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Free high-quality stock photos</li>
            <li>Easy search and discovery</li>
            <li>Fast downloads with no signup required for basic use</li>
            <li>
              Images suitable for personal and commercial projects (as per our
              license terms)
            </li>
          </ul>

          <h2 className='text-xl font-semibold text-gray-900 pt-4'>
            Our Mission
          </h2>
          <p>
            We believe great design should not be limited by budget. PixStock
            exists to remove barriers between creative ideas and the visual
            assets needed to bring them to life.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-4'>
            Who Is Behind PixStock
          </h2>
          <p>
            PixStock is independently operated. We carefully curate and publish
            images, maintain the platform, and continuously improve search,
            performance, and user experience.
          </p>

          <h2 className='text-xl font-semibold text-gray-900 pt-4'>
            Contact Us
          </h2>
          <p>
            Have questions, feedback, or partnership ideas? Visit our{" "}
            <Link href='/contact' className='text-blue-600 hover:underline'>
              Contact page
            </Link>{" "}
            — we would love to hear from you.
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
