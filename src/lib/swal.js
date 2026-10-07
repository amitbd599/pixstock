import Swal from "sweetalert2";

export async function confirmDelete(count = 1) {
  const r = await Swal.fire({
    title: "Are you sure?",
    text: `${count}টি ইমেজ স্থায়ীভাবে ডিলিট হবে (R2 ফাইলসহ)। এটা undo করা যাবে না।`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    confirmButtonText: "Yes, delete",
  });
  return r.isConfirmed;
}

export const toast = (title, icon = "success") =>
  Swal.fire({ toast: true, position: "top-end", timer: 2200, showConfirmButton: false, icon, title });
