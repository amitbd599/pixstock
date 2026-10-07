import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default function SettingsPage() {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-2'>Settings</h1>
      <p className='text-gray-600 mb-8'>Change your admin password</p>
      <ChangePasswordForm />
    </div>
  );
}
