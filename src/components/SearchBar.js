export default function SearchBar({ defaultValue = "", large = false }) {
  return (
    <form action="/search" method="get" role="search" className="flex w-full">
      <input
        name="q"
        defaultValue={defaultValue}
        placeholder="Search free images…"
        aria-label="Search images"
        className={`min-w-0 flex-1 rounded-l-full border border-gray-300 bg-white px-5 outline-none focus:border-brand ${large ? "py-4 text-lg" : "py-2 text-sm"}`}
      />
      <button className={`rounded-r-full bg-brand px-6 font-semibold text-white hover:bg-brand-dark ${large ? "text-lg" : "text-sm"}`}>Search</button>
    </form>
  );
}
