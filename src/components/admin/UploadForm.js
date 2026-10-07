"use client";
import { useState, useRef, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { uploadImage } from "@/actions/upload";
import { toast } from "@/lib/swal";
import { Button } from "@/components/ui/button";

function Submit() {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>{pending ? "Processing & uploading…" : "Upload"}</Button>;
}

export default function UploadForm() {
  const [state, action] = useFormState(uploadImage, null);
  const [preview, setPreview] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (state?.success) { toast(state.success); ref.current?.reset(); setPreview(null); }
    if (state?.error) toast(state.error, "error");
  }, [state]);

  return (
    <form ref={ref} action={action} className="grid gap-6 rounded-xl border bg-white p-5 md:grid-cols-2">
      <div>
        <label className="label">Image (JPG / PNG / WebP) *</label>
        <input name="file" type="file" accept="image/jpeg,image/png,image/webp" required className="input"
          onChange={(e) => setPreview(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null)} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview && <img src={preview} alt="preview" className="mt-3 max-h-72 rounded-lg" />}
      </div>
      <div className="space-y-4">
        <div><label className="label">Title *</label><input name="title" required className="input" /></div>
        <div><label className="label">Description</label><textarea name="description" rows={3} className="input" /></div>
        <div><label className="label">Alt text</label><input name="alt" className="input" placeholder="খালি রাখলে title ব্যবহার হবে" /></div>
        <div><label className="label">Tags (comma separated)</label><input name="tags" className="input" placeholder="nature, mountain, sky" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Category</label><input name="category" defaultValue="general" className="input" /></div>
          <div><label className="label">Status</label>
            <select name="status" className="input"><option value="published">Published</option><option value="draft">Draft</option></select></div>
        </div>
        <div className="flex items-center gap-3">
          <Submit />
          {state?.id && <Link className="text-sm text-brand underline" href={`/image/${state.id}`} target="_blank">View image ↗</Link>}
        </div>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      </div>
    </form>
  );
}
