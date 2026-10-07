import ImagesTable from "@/components/admin/ImagesTable";
import { listImages } from "@/lib/queries";

export const metadata = { title: "Images" };

export default async function AdminImages({ searchParams }) {
  const data = await listImages({ status: "", page: searchParams?.page, limit: 20 });
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">All images</h1>
      <ImagesTable items={data.items} page={data.page} pages={data.pages} total={data.total} />
    </>
  );
}
