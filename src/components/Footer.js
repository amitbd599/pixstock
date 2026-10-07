import Link from "next/link";

const links = [["About", "/about"], ["License", "/license"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Contact", "/contact"]];

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-gray-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 text-sm text-gray-600">
        <nav className="flex flex-wrap justify-center gap-5">
          {links.map(([n, h]) => <Link key={h} href={h} className="hover:text-brand">{n}</Link>)}
        </nav>
        <p>Free high-quality stock images for everyone.</p>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} PixStock</p>
      </div>
    </footer>
  );
}
