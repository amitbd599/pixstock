import Link from "next/link";

export default function Pagination({ page, pages, basePath, params = {} }) {
  if (pages <= 1) return null;
  const href = (p) => {
    const sp = new URLSearchParams({ ...params, page: String(p) });
    return `${basePath}?${sp}`;
  };
  const cls = "rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50";
  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
      {page > 1 && <Link href={href(page - 1)} rel="prev" className={cls}>← Prev</Link>}
      <span className="text-sm text-gray-600">Page {page} / {pages}</span>
      {page < pages && <Link href={href(page + 1)} rel="next" className={cls}>Next →</Link>}
    </nav>
  );
}
