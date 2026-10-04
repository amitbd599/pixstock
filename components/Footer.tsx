import Link from "next/link";

export default function Footer() {
  return (
    <footer className=' bg-gray-50'>
      <div className='container mx-auto  px-6 py-14 lg:px-8'>
        {/* Top */}
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4'>
          {/* Brand */}
          <div className='lg:col-span-2'>
            <Link
              href='/'
              className='text-2xl font-bold tracking-tight text-gray-900'
            >
              Pixstock
            </Link>

            <p className='mt-4 max-w-md text-sm leading-6 text-gray-500'>
              Discover and download beautiful high-quality images for free. Find
              the perfect image for your next project.
            </p>

            {/* Social */}
          </div>

          {/* Explore */}
          <div>
            <h3 className='text-sm font-semibold text-gray-900'>Explore</h3>

            <ul className='mt-4 space-y-3 text-sm'>
              <li>
                <Link
                  href='/'
                  className='text-gray-500 transition hover:text-gray-900'
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href='/images'
                  className='text-gray-500 transition hover:text-gray-900'
                >
                  All Images
                </Link>
              </li>

              <li>
                <Link
                  href='/categories'
                  className='text-gray-500 transition hover:text-gray-900'
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  href='/popular'
                  className='text-gray-500 transition hover:text-gray-900'
                >
                  Popular
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className='text-sm font-semibold text-gray-900'>Company</h3>

            <ul className='mt-4 space-y-3 text-sm'>
              <li>
                <Link
                  href='/about'
                  className='text-gray-500 transition hover:text-gray-900'
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href='/contact'
                  className='text-gray-500 transition hover:text-gray-900'
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href='/license'
                  className='text-gray-500 transition hover:text-gray-900'
                >
                  License
                </Link>
              </li>

              <li>
                <Link
                  href='/privacy'
                  className='text-gray-500 transition hover:text-gray-900'
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className='mt-12 flex flex-col gap-4 border-t pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between'>
          <p>© {new Date().getFullYear()} Pixstock. All rights reserved.</p>

          <div className='flex gap-5'>
            <Link href='/terms' className='transition hover:text-gray-900'>
              Terms
            </Link>

            <Link href='/privacy' className='transition hover:text-gray-900'>
              Privacy
            </Link>

            <Link href='/contact' className='transition hover:text-gray-900'>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
