import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Login page-এ redirect করবে না
  const headersList = await headers();
  const pathname =
    headersList.get("x-pathname") || headersList.get("x-url") || "";

  // সহজ উপায়: session না থাকলে শুধু login ছাড়া অন্য admin page-এ redirect করো
  // কিন্তু layout login page-এও apply হয়, তাই নিচের মতো করো:

  if (!session) {
    // login page নিজেই দেখাবে, অন্য কিছুতে redirect করো না এখান থেকে
    // শুধু children render করো (login page-এর জন্য)
    return <>{children}</>;
  }

  // Logged in হলে normal admin layout দেখাও
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white border-b px-6 py-4 flex items-center justify-between'>
        <nav className='flex gap-6 text-sm font-medium'>
          <Link href='/admin' className='hover:text-blue-600'>
            Dashboard
          </Link>
          <Link href='/admin/upload' className='hover:text-blue-600'>
            Single Upload
          </Link>
          <Link href='/admin/bulk-upload' className='hover:text-blue-600'>
            Bulk Upload
          </Link>
          <Link href='/admin/images' className='hover:text-blue-600'>
            All Images
          </Link>
          <Link href='/' className='hover:text-blue-600'>
            View Site
          </Link>
          <Link href='/admin/settings' className='hover:text-blue-600'>
            Settings
          </Link>
        </nav>
        <form action='/api/auth/signout' method='POST'>
          <button
            type='submit'
            className='text-red-600 text-sm hover:underline'
          >
            Logout
          </button>
        </form>
      </header>
      <main className='p-6 max-w-6xl mx-auto'>{children}</main>
    </div>
  );
}
