"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteImages, setStatus } from "@/actions/images";
import { confirmDelete, toast } from "@/lib/swal";
import { Button } from "@/components/ui/button";

export default function ImagesTable({ items, page, pages, total }) {
  const router = useRouter();
  const [sel, setSel] = useState([]);
  const [pending, start] = useTransition();
  const all = items.length > 0 && sel.length === items.length;
  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const del = async (ids) => {
    if (!(await confirmDelete(ids.length))) return;
    start(async () => {
      try { const r = await deleteImages(ids); toast(`${r.count}টি ডিলিট হয়েছে`); }
      catch { toast("Delete failed", "error"); }
      setSel([]); router.refresh();
    });
  };
  const status = (ids, st) =>
    start(async () => {
      try { await setStatus(ids, st); toast("Status updated"); } catch { toast("Failed", "error"); }
      setSel([]); router.refresh();
    });

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <p className="mr-auto text-sm text-gray-500">{total} images {sel.length > 0 && `· ${sel.length} selected`}</p>
        {sel.length > 0 && (
          <>
            <Button variant="outline" disabled={pending} onClick={() => status(sel, "published")}>Publish</Button>
            <Button variant="outline" disabled={pending} onClick={() => status(sel, "draft")}>Draft</Button>
            <Button variant="danger" disabled={pending} onClick={() => del(sel)}>Delete selected</Button>
          </>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3"><input type="checkbox" checked={all} onChange={() => setSel(all ? [] : items.map((i) => i._id))} aria-label="Select all" /></th>
              <th className="p-3">Image</th><th className="p-3">Category</th><th className="p-3">Views</th><th className="p-3">Downloads</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-gray-500">No images.</td></tr>}
            {items.map((i) => (
              <tr key={i._id} className={sel.includes(i._id) ? "bg-green-50" : ""}>
                <td className="p-3"><input type="checkbox" checked={sel.includes(i._id)} onChange={() => toggle(i._id)} /></td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.urls.thumbnail} alt="" loading="lazy" className="h-12 w-12 rounded object-cover" />
                    <Link href={`/image/${i._id}`} target="_blank" className="max-w-[220px] truncate font-medium hover:text-brand">{i.title}</Link>
                  </div>
                </td>
                <td className="p-3 capitalize">{i.category}</td>
                <td className="p-3">{i.views}</td>
                <td className="p-3">{i.downloads}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${i.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{i.status}</span>
                </td>
                <td className="whitespace-nowrap p-3 text-right">
                  <button disabled={pending} onClick={() => status([i._id], i.status === "published" ? "draft" : "published")} className="mr-3 text-gray-600 hover:text-brand">
                    {i.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button disabled={pending} onClick={() => del([i._id])} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          {page > 1 && <Link className="rounded-lg border bg-white px-3 py-1.5" href={`/admin/images?page=${page - 1}`}>← Prev</Link>}
          <span>Page {page} / {pages}</span>
          {page < pages && <Link className="rounded-lg border bg-white px-3 py-1.5" href={`/admin/images?page=${page + 1}`}>Next →</Link>}
        </div>
      )}
    </div>
  );
}
