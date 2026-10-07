"use client";
import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { changePassword } from "@/actions/auth";
import { toast } from "@/lib/swal";
import { Button } from "@/components/ui/button";

function Submit() {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>{pending ? "Saving…" : "Change password"}</Button>;
}

export default function PasswordForm() {
  const [state, action] = useFormState(changePassword, null);
  const ref = useRef(null);
  useEffect(() => {
    if (state?.success) { toast(state.success); ref.current?.reset(); }
    if (state?.error) toast(state.error, "error");
  }, [state]);

  return (
    <form ref={ref} action={action} className="max-w-md space-y-4 rounded-xl border bg-white p-5">
      <div><label className="label">Current password</label><input name="current" type="password" required className="input" /></div>
      <div><label className="label">New password (min 8)</label><input name="next" type="password" required minLength={8} className="input" /></div>
      <div><label className="label">Confirm new password</label><input name="confirm" type="password" required className="input" /></div>
      <Submit />
    </form>
  );
}
