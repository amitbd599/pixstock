"use client";

import { useActionState } from "react";
import { changePasswordAction, ChangePasswordState } from "@/actions/auth";

const initial: ChangePasswordState = { success: false, message: "" };

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState(
    changePasswordAction,
    initial,
  );

  return (
    <form action={action} className='space-y-4 max-w-md'>
      <div>
        <label className='block text-sm font-medium mb-1'>
          Current Password
        </label>
        <input
          type='password'
          name='currentPassword'
          required
          className='w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>New Password</label>
        <input
          type='password'
          name='newPassword'
          required
          minLength={6}
          className='w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>
          Confirm New Password
        </label>
        <input
          type='password'
          name='confirmPassword'
          required
          minLength={6}
          className='w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <button
        type='submit'
        disabled={pending}
        className='bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50'
      >
        {pending ? "Changing..." : "Change Password"}
      </button>

      {state.message && (
        <p
          className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
