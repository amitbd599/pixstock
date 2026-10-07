import BulkUploadForm from "@/components/admin/BulkUploadform";
import Link from "next/link";

export default function BulkUploadPage() {
  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Bulk Upload</h1>
        <Link
          href='/admin/upload'
          className='text-sm text-blue-600 hover:underline'
        >
          Single upload
        </Link>
      </div>
      <BulkUploadForm />
    </div>
  );
}
