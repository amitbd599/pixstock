import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav email={session.user.email} />
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}
