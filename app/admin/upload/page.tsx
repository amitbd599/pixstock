import UploadForm from "@/components/admin/UploadForm";

export default function UploadPage() {
  return (
    <div className='grid grid-cols-12 gap-[30px]'>
      <div className='col-span-12'>
        <h1 className='text-2xl font-bold mb-6'>Upload New Image</h1>
        <UploadForm />
      </div>
    </div>
  );
}
