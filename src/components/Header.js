import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="text-xl font-extrabold text-brand">Pix<span className="text-gray-900">Stock</span></Link>
        <div className="mx-auto hidden max-w-xl flex-1 sm:block"><SearchBar /></div>
        <nav className="ml-auto flex gap-4 text-sm font-medium text-gray-600">
          <Link href="/license" className="hover:text-brand">License</Link>
          <Link href="/about" className="hover:text-brand">About</Link>
        </nav>
      </div>
    </header>
  );
}
