"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const items = [["Dashboard", "/admin"], ["Upload", "/admin/upload"], ["Images", "/admin/images"], ["Settings", "/admin/settings"]];

export default function AdminNav({ email }) {
  const path = usePathname();
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 p-4">
        <span className="font-extrabold text-brand">PixStock Admin</span>
        <nav className="flex gap-1">
          {items.map(([n, h]) => (
            <Link key={h} href={h} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${path === h ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-100"}`}>{n}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <Link href="/" target="_blank" className="text-gray-500 hover:text-brand">View site ↗</Link>
          <span className="hidden text-gray-400 sm:inline">{email}</span>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">Logout</button>
        </div>
      </div>
    </header>
  );
}
