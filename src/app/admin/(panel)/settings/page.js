import PasswordForm from "@/components/admin/PasswordForm";
export const metadata = { title: "Settings" };
export default function Settings() {
  return (<><h1 className="mb-4 text-2xl font-bold">Settings</h1><PasswordForm /></>);
}
