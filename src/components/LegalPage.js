export default function LegalPage({ title, children }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-3 [&_p]:leading-7 [&_p]:text-gray-700">
      <h1 className="mb-6 text-3xl font-extrabold">{title}</h1>
      {children}
    </article>
  );
}
