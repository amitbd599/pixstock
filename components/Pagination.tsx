import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className='flex justify-center items-center gap-2 mt-12'>
      {currentPage > 1 && (
        <Link
          href={`/?page=${currentPage - 1}`}
          className='px-4 py-2 border rounded-lg hover:bg-gray-100'
        >
          Previous
        </Link>
      )}

      <span className='px-4 py-2'>
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          href={`/?page=${currentPage + 1}`}
          className='px-4 py-2 border rounded-lg hover:bg-gray-100'
        >
          Next
        </Link>
      )}
    </div>
  );
}
