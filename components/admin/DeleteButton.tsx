"use client";

import { useTransition } from "react";
import { deleteImageAction } from "@/actions/delete";
import { confirmDelete, showSuccess, showError } from "@/lib/swal";

export default function DeleteButton({ imageId }: { imageId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const ok = await confirmDelete("This image will be permanently deleted.");
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteImageAction(imageId);

      if (result.success) {
        await showSuccess("Deleted!", result.message);
      } else {
        await showError("Error", result.message);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className='text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50'
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
