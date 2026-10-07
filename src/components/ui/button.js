import Link from "next/link";

const base = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50";
const variants = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  outline: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

// shadcn/ui-স্টাইল Button (href দিলে Link হয়)
export function Button({ variant = "primary", href, className = "", ...props }) {
  const cls = `${base} ${variants[variant]} ${className}`;
  return href ? <Link href={href} className={cls} {...props} /> : <button className={cls} {...props} />;
}
