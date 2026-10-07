import UploadForm from "@/components/admin/UploadForm";
export const metadata = { title: "Upload" };
export default function UploadPage() {
  return (<><h1 className="mb-4 text-2xl font-bold">Upload image</h1><UploadForm /></>);
}
