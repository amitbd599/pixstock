"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const items = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/upload", label: "Single Upload", icon: "⬆️" },
  { href: "/admin/bulk-upload", label: "Bulk Upload", icon: "📦" },
  { href: "/admin/images", label: "All Images", icon: "🖼️" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminSidebar({ email }: { email?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // পেজ বদলালে মোবাইল মেনু বন্ধ হবে
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const nav = (
    <div className='flex h-full flex-col'>
      <div className='px-5 py-5 text-xl font-extrabold text-emerald-600'>
        PixStock{" "}
        <span className='text-xs font-medium text-gray-400'>Admin</span>
      </div>

      <nav className='flex-1 space-y-1 px-3'>
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive(it.href)
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className='text-base'>{it.icon}</span>
            {it.label}
          </Link>
        ))}

        <div className='my-3 border-t' />

        <Link
          href='/'
          target='_blank'
          className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100'
        >
          <span className='text-base'>🌐</span>
          View Site
        </Link>
      </nav>

      <div className='border-t p-4'>
        {email && (
          <p className='mb-2 truncate text-xs text-gray-500'>{email}</p>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className='w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50'
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* মোবাইল টপ বার */}
      <div className='sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 md:hidden'>
        <span className='font-extrabold text-emerald-600'>PixStock Admin</span>
        <button
          onClick={() => setOpen(true)}
          aria-label='Open menu'
          className='rounded-lg border px-3 py-1.5 text-sm'
        >
          ☰ Menu
        </button>
      </div>

      {/* মোবাইল ড্রয়ার */}
      {open && (
        <div className='fixed inset-0 z-40 md:hidden'>
          <div
            className='absolute inset-0 bg-black/50'
            onClick={() => setOpen(false)}
          />
          <aside className='absolute left-0 top-0 h-full w-64 bg-white shadow-xl'>
            {nav}
          </aside>
        </div>
      )}

      {/* ডেস্কটপ সাইডবার */}
      <aside className='sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-white md:block'>
        {nav}
      </aside>
    </>
  );
}
