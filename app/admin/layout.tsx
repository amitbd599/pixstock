import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // session না থাকলে (লগইন পেজ) শুধু children দেখাবে
  if (!session) return <>{children}</>;

  return (
    <div className='min-h-screen bg-gray-50 md:flex'>
      <AdminSidebar email={session.user?.email} />
      <main className=' py-4'>
        <div className='container mx-auto py-4'>{children}</div>
      </main>
    </div>
  );
}
