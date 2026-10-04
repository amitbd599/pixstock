"use client";

import { useTransition } from "react";
import { deleteImageAction } from "@/actions/delete";

export default function DeleteButton({ imageId }: { imageId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    startTransition(async () => {
      const result = await deleteImageAction(imageId);
      if (!result.success) {
        alert(result.message);
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
