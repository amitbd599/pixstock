"use client";

import { useTransition } from "react";
import { toggleImageStatusAction } from "@/actions/delete";

export default function StatusToggle({
  imageId,
  status,
}: {
  imageId: string;
  status: "published" | "draft";
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleImageStatusAction(imageId);
      if (!result.success) {
        alert(result.message);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-2.5 py-1 rounded text-xs font-medium transition disabled:opacity-50 ${
        status === "published"
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
      title='Click to toggle status'
    >
      {isPending ? "..." : status}
    </button>
  );
}
