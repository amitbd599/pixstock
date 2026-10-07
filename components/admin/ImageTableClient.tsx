"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  deleteMultipleImagesAction,
  bulkUpdateStatusAction,
} from "@/actions/delete";
import StatusToggle from "./StatusToggle";
import DeleteButton from "./DeleteButton";
import { confirmDelete, showSuccess, showError } from "@/lib/swal";

type ImageItem = {
  _id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  views: number;
  downloads: number;
  status: "published" | "draft";
};

export default function ImageTableClient({ images }: { images: ImageItem[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const allIds = images.map((img) => img._id);
  const allSelected = images.length > 0 && selected.length === images.length;

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelected(allSelected ? [] : allIds);
  };

  const handleBulkDelete = async () => {
    if (!selected.length) return;

    const ok = await confirmDelete(
      `${selected.length} selected image(s) will be permanently deleted.`,
    );
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteMultipleImagesAction(selected);

      if (result.success) {
        setSelected([]);
        await showSuccess("Deleted!", result.message);
      } else {
        await showError("Error", result.message);
      }
    });
  };

  const handleBulkStatus = (status: "published" | "draft") => {
    if (!selected.length) return;

    startTransition(async () => {
      const result = await bulkUpdateStatusAction(selected, status);

      if (result.success) {
        setSelected([]);
        await showSuccess("Updated!", result.message);
      } else {
        await showError("Error", result.message);
      }
    });
  };

  return (
    <div>
      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <div className='flex flex-wrap items-center gap-3 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
          <span className='text-sm font-medium text-blue-800'>
            {selected.length} selected
          </span>

          <button
            onClick={() => handleBulkStatus("published")}
            disabled={isPending}
            className='px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50'
          >
            Publish
          </button>

          <button
            onClick={() => handleBulkStatus("draft")}
            disabled={isPending}
            className='px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50'
          >
            Draft
          </button>

          <button
            onClick={handleBulkDelete}
            disabled={isPending}
            className='px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50'
          >
            {isPending ? "Processing..." : "Delete Selected"}
          </button>

          <button
            onClick={() => setSelected([])}
            className='px-3 py-1.5 text-sm text-gray-600 hover:underline'
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className='overflow-x-auto bg-white rounded-xl border'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b bg-gray-50 text-left'>
              <th className='py-3 px-4 w-10'>
                <input
                  type='checkbox'
                  checked={allSelected}
                  onChange={toggleAll}
                  className='w-4 h-4 rounded cursor-pointer'
                />
              </th>
              <th className='py-3 px-4'>Image</th>
              <th className='py-3 px-4'>Title</th>
              <th className='py-3 px-4'>Views</th>
              <th className='py-3 px-4'>Downloads</th>
              <th className='py-3 px-4'>Status</th>
              <th className='py-3 px-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img) => (
              <tr
                key={img._id}
                className={`border-b hover:bg-gray-50 ${
                  selected.includes(img._id) ? "bg-blue-50" : ""
                }`}
              >
                <td className='py-3 px-4'>
                  <input
                    type='checkbox'
                    checked={selected.includes(img._id)}
                    onChange={() => toggleOne(img._id)}
                    className='w-4 h-4 rounded cursor-pointer'
                  />
                </td>
                <td className='py-3 px-4'>
                  <img
                    src={img.thumbnailUrl}
                    alt={img.title}
                    className='w-16 h-12 object-cover rounded'
                  />
                </td>
                <td className='py-3 px-4'>
                  <Link
                    href={`/image/${img.slug}`}
                    className='hover:underline font round-medium'
                    target='_blank'
                  >
                    {img.title}
                  </Link>
                </td>
                <td className='py-3 px-4'>{img.views}</td>
                <td className='py-3 px-4'>{img.downloads}</td>
                <td className='py-3 px-4'>
                  <StatusToggle imageId={img._id} status={img.status} />
                </td>
                <td className='py-3 px-4'>
                  <DeleteButton imageId={img._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {images.length === 0 && (
          <p className='text-center text-gray-500 py-12'>No images yet</p>
        )}
      </div>
    </div>
  );
}
