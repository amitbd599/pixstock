"use client";

import { useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import { uploadImageAction, UploadState } from "@/actions/upload";

type Meta = {
  title: string;
  description: string;
  alt: string;
  tags: string;
  category: string;
  status: string;
};

type Result = { status: "uploading" | "done" | "failed"; message?: string };

const initial: UploadState = { success: false, message: "" };

const keyOf = (name: string) => name.trim().toLowerCase();
const stripExt = (name: string) => name.replace(/\.[^.]+$/, "");

export default function BulkUploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [rows, setRows] = useState<Record<string, Meta>>({});
  const [csvName, setCsvName] = useState("");
  const [csvError, setCsvError] = useState("");
  const [results, setResults] = useState<Record<string, Result>>({});
  const [running, setRunning] = useState(false);
  const stopRef = useRef(false);

  // ---------- CSV ----------
  function handleCsv(file: File | undefined) {
    setCsvError("");
    if (!file) return;
    setCsvName(file.name);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: (res) => {
        const map: Record<string, Meta> = {};
        for (const r of res.data) {
          const fname = r.filename || r.file || r.image || "";
          if (!fname.trim()) continue;
          map[keyOf(fname)] = {
            title: (r.title || "").trim(),
            description: (r.description || "").trim(),
            alt: (r.alt || "").trim(),
            // "nature|forest|green" or "nature, forest" both work
            tags: (r.tags || "").replace(/\|/g, ",").trim(),
            category: (r.category || "").trim() || "uncategorized",
            status: (r.status || "").trim() || "published",
          };
        }
        if (Object.keys(map).length === 0) {
          setCsvError(
            "CSV te kono row paoa jai nai. 'filename' column ache kina dekho.",
          );
        }
        setRows(map);
      },
      error: () => setCsvError("CSV read kora jai nai."),
    });
  }

  // ---------- Images ----------
  function handleImages(list: FileList | null) {
    if (!list) return;
    const seen = new Set<string>();
    const picked: File[] = [];
    for (const f of Array.from(list)) {
      const k = keyOf(f.name);
      if (seen.has(k)) continue;
      seen.add(k);
      picked.push(f);
    }
    setFiles(picked);
    setResults({});
  }

  // ---------- Match images <-> CSV ----------
  const items = useMemo(
    () =>
      files.map((file) => {
        const k = keyOf(file.name);
        // exact filename match, otherwise match without extension
        const meta = rows[k] ?? rows[keyOf(stripExt(file.name))] ?? null;
        return { key: k, file, meta };
      }),
    [files, rows],
  );

  const matched = items.filter((i) => i.meta);
  const unmatched = items.filter((i) => !i.meta);

  const csvOnlyCount = useMemo(() => {
    const fileKeys = new Set(
      files.flatMap((f) => [keyOf(f.name), keyOf(stripExt(f.name))]),
    );
    return Object.keys(rows).filter((k) => !fileKeys.has(k)).length;
  }, [files, rows]);

  const doneCount = matched.filter(
    (i) => results[i.key]?.status === "done",
  ).length;
  const failedCount = matched.filter(
    (i) => results[i.key]?.status === "failed",
  ).length;
  const pendingItems = matched.filter((i) => results[i.key]?.status !== "done");

  // ---------- Final upload ----------
  async function startUpload() {
    stopRef.current = false;
    setRunning(true);

    for (const item of pendingItems) {
      if (stopRef.current) break;

      setResults((r) => ({ ...r, [item.key]: { status: "uploading" } }));

      const fd = new FormData();
      fd.set("title", item.meta!.title);
      fd.set("description", item.meta!.description);
      fd.set("alt", item.meta!.alt);
      fd.set("tags", item.meta!.tags);
      fd.set("category", item.meta!.category);
      fd.set("status", item.meta!.status);
      fd.set("image", item.file);

      try {
        const res = await uploadImageAction(initial, fd);
        const firstError = res.errors
          ? Object.values(res.errors).flat()[0]
          : undefined;
        setResults((r) => ({
          ...r,
          [item.key]: {
            status: res.success ? "done" : "failed",
            message: res.success
              ? undefined
              : firstError
                ? `${res.message}: ${firstError}`
                : res.message,
          },
        }));
      } catch {
        setResults((r) => ({
          ...r,
          [item.key]: { status: "failed", message: "Network/server error" },
        }));
      }
    }

    setRunning(false);
  }

  const progress = matched.length
    ? Math.round((doneCount / matched.length) * 100)
    : 0;

  return (
    <div className='space-y-6'>
      {/* Step 1 + 2 */}
      <div className='grid gap-4 md:grid-cols-2'>
        <div className='bg-white border rounded-xl p-4'>
          <label className='block text-sm font-medium mb-2'>
            1. Select Multiple Images
          </label>
          <input
            type='file'
            accept='image/jpeg,image/png,image/webp'
            multiple
            disabled={running}
            onChange={(e) => handleImages(e.target.files)}
            className='w-full text-sm'
          />
          {files.length > 0 && (
            <p className='text-sm text-gray-600 mt-2'>
              {files.length} ta image selected
            </p>
          )}
        </div>

        <div className='bg-white border rounded-xl p-4'>
          <label className='block text-sm font-medium mb-2'>
            2. Metadata CSV
          </label>
          <input
            type='file'
            accept='.csv,text/csv'
            disabled={running}
            onChange={(e) => handleCsv(e.target.files?.[0])}
            className='w-full text-sm'
          />
          {csvName && !csvError && (
            <p className='text-sm text-gray-600 mt-2'>
              {csvName}: {Object.keys(rows).length} ta row
            </p>
          )}
          {csvError && <p className='text-sm text-red-600 mt-2'>{csvError}</p>}
          <p className='text-xs text-gray-500 mt-2'>
            Columns: filename, title, description, alt, tags, category, status.
            Tags er majhe comma ba | dite paro.
          </p>
        </div>
      </div>

      {/* Summary */}
      {files.length > 0 && Object.keys(rows).length > 0 && (
        <div className='bg-white border rounded-xl p-4 space-y-3'>
          <div className='flex flex-wrap gap-x-6 gap-y-1 text-sm'>
            <span className='text-green-700'>Matched: {matched.length}</span>
            <span
              className={unmatched.length ? "text-red-600" : "text-gray-500"}
            >
              CSV te nai (skip hobe): {unmatched.length}
            </span>
            <span className={csvOnlyCount ? "text-amber-600" : "text-gray-500"}>
              Image nai kintu CSV te ache: {csvOnlyCount}
            </span>
            {(doneCount > 0 || failedCount > 0) && (
              <>
                <span className='text-green-700'>Uploaded: {doneCount}</span>
                <span className='text-red-600'>Failed: {failedCount}</span>
              </>
            )}
          </div>

          {(running || doneCount > 0) && (
            <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
              <div
                className='h-full bg-blue-600 transition-all'
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className='flex gap-3'>
            <button
              type='button'
              onClick={startUpload}
              disabled={running || pendingItems.length === 0}
              className='bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50'
            >
              {running
                ? `Uploading... (${doneCount}/${matched.length})`
                : failedCount > 0
                  ? `Retry / Continue (${pendingItems.length})`
                  : `Final Upload (${pendingItems.length} images)`}
            </button>
            {running && (
              <button
                type='button'
                onClick={() => (stopRef.current = true)}
                className='px-6 py-2.5 rounded-lg border hover:bg-gray-50'
              >
                Stop
              </button>
            )}
          </div>
        </div>
      )}

      {/* Preview */}
      {items.length > 0 && Object.keys(rows).length > 0 && (
        <div className='bg-white border rounded-xl overflow-hidden'>
          <div className='max-h-[32rem] overflow-auto'>
            <table className='w-full text-sm'>
              <thead className='sticky top-0 bg-gray-50'>
                <tr className='border-b text-left'>
                  <th className='py-3 px-4'>Preview</th>
                  <th className='py-3 px-4'>File</th>
                  <th className='py-3 px-4'>Title</th>
                  <th className='py-3 px-4'>Category</th>
                  <th className='py-3 px-4'>Tags</th>
                  <th className='py-3 px-4'>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map(({ key, file, meta }) => {
                  const r = results[key];
                  return (
                    <tr key={key} className='border-b'>
                      <td className='py-2 px-4'>
                        <Thumb file={file} />
                      </td>
                      <td className='py-2 px-4 break-all'>{file.name}</td>
                      <td className='py-2 px-4'>{meta?.title || "-"}</td>
                      <td className='py-2 px-4'>{meta?.category || "-"}</td>
                      <td className='py-2 px-4'>{meta?.tags || "-"}</td>
                      <td className='py-2 px-4'>
                        {!meta ? (
                          <span className='text-red-600'>CSV te nai</span>
                        ) : r?.status === "done" ? (
                          <span className='text-green-700'>Done</span>
                        ) : r?.status === "uploading" ? (
                          <span className='text-blue-600'>Uploading...</span>
                        ) : r?.status === "failed" ? (
                          <span className='text-red-600'>
                            {r.message || "Failed"}
                          </span>
                        ) : (
                          <span className='text-gray-500'>Ready</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Thumb({ file }: { file: File }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  return (
    <img
      src={url}
      alt={file.name}
      className='w-12 h-10 object-cover rounded'
      onLoad={() => URL.revokeObjectURL(url)}
    />
  );
}
