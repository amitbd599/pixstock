"use client";

import { useActionState } from "react";
import { uploadImageAction, UploadState } from "@/actions/upload";

const initial: UploadState = { success: false, message: "" };

export default function UploadForm() {
  const [state, action, pending] = useActionState(uploadImageAction, initial);

  return (
    <form action={action} className='space-y-5 max-w-xl'>
      <div>
        <label className='block text-sm font-medium mb-1'>Title *</label>
        <input
          name='title'
          required
          className='w-full border rounded-lg px-3 py-2'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>Description</label>
        <textarea
          name='description'
          rows={3}
          className='w-full border rounded-lg px-3 py-2'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>
          Tags (comma separated)
        </label>
        <input
          name='tags'
          placeholder='nature, forest, green'
          className='w-full border rounded-lg px-3 py-2'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>Category</label>
        <input
          name='category'
          defaultValue='uncategorized'
          className='w-full border rounded-lg px-3 py-2'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>Image *</label>
        <input
          type='file'
          name='image'
          accept='image/*'
          required
          className='w-full'
        />
      </div>

      <button
        type='submit'
        disabled={pending}
        className='bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50'
      >
        {pending ? "Uploading..." : "Upload Image"}
      </button>

      {state.message && (
        <p
          className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
