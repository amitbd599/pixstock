"use client";

import Link from "next/link";
import { Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Marquee from "react-fast-marquee";
import nProgress from "nprogress";

function SearchBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    } else {
      nProgress.start();
      router.push("/");
    }
  };

  const data = [
    { text: "nature" },
    { text: "animals" },
    { text: "wildlife" },
    { text: "people" },
    { text: "men" },
    { text: "women" },
    { text: "children" },
    { text: "family" },
    { text: "portrait" },
    { text: "travel" },
    { text: "landscape" },
    { text: "mountains" },
    { text: "beach" },
    { text: "ocean" },
    { text: "sunset" },
    { text: "sunrise" },
    { text: "sky" },
    { text: "clouds" },
    { text: "forest" },
    { text: "flowers" },
    { text: "plants" },
    { text: "food" },
    { text: "coffee" },
    { text: "technology" },
    { text: "computer" },
    { text: "mobile" },
    { text: "business" },
    { text: "office" },
    { text: "work" },
    { text: "education" },
    { text: "architecture" },
    { text: "buildings" },
    { text: "city" },
    { text: "cars" },
    { text: "motorcycles" },
    { text: "sports" },
    { text: "fitness" },
    { text: "health" },
    { text: "fashion" },
    { text: "beauty" },
    { text: "lifestyle" },
    { text: "home" },
    { text: "interior" },
    { text: "art" },
    { text: "music" },
    { text: "abstract" },
    { text: "background" },
    { text: "space" },
    { text: "holidays" },
    { text: "religion" },
  ];

  const inputRef = useRef<HTMLInputElement>(null);

  const handleTagClick = (text: string) => {
    setQ(text); // সার্চ বক্সে লেখা বসবে
    nProgress.start();
    router.push(`/search?q=${encodeURIComponent(text)}`); // ডাটা লোড হবে
  };

  return (
    // <div className='px-2'>
    //   <Link href='/'>
    //     <h1 className='text-4xl font-bold text-white text-center mb-2'>
    //       Free Stock Images
    //     </h1>
    //   </Link>

    //   <p className='text-center text-gray-300 mb-6'>
    //     Beautiful free images for your next project
    //   </p>

    //   <form onSubmit={handleSubmit} className='flex gap-2 max-w-xl mx-auto'>
    //     <input
    //       type='text'
    //       value={q}
    //       onChange={(e) => setQ(e.target.value)}
    //       placeholder='Search free stock images...'
    //       className='flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black'
    //     />

    //     <button
    //       type='submit'
    //       className='bg-emerald-500/90 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-emerald-500 ease-in-out duration-300'
    //     >
    //       Search
    //     </button>
    //   </form>

    //   <div className='max-w-6xl mx-auto flex w-full flex-wrap justify-center gap-2 mt-4'>
    //     <Marquee
    //       speed={15}
    //       gradient
    //       gradientColor='#111827'
    //       gradientWidth={100}
    //       pauseOnClick
    //       pauseOnHover
    //     >
    //       {data.map((item, index) => (
    //         <button
    //           key={index}
    //           className='btn-badge'
    //           onClick={() => handleSubmitByTag(item.text)}
    //         >
    //           {item.text}
    //         </button>
    //       ))}
    //     </Marquee>
    //   </div>
    // </div>
    <section className='relative isolate overflow-hidden bg-gray-900 px-4 py-14 md:py-16'>
      {/* ব্যাকগ্রাউন্ড গ্লো */}
      <div className='pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-24 right-0 -z-10 h-64 w-96 rounded-full bg-sky-500/10 blur-3xl' />
      <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]' />

      <div className='mx-auto max-w-3xl text-center'>
        <span className='mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-emerald-300 backdrop-blur'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-400' />
          100% free · No sign-up needed
        </span>

        <Link href='/'>
          <h1 className='text-4xl font-extrabold tracking-tight text-white md:text-6xl'>
            Free Stock Images for{" "}
            <span className='bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-400 bg-clip-text text-transparent'>
              Everyone
            </span>
          </h1>
        </Link>

        <p className='mx-auto mt-4 max-w-xl text-base text-gray-400 md:text-lg'>
          Beautiful, high-quality photos for your next project. Personal and
          commercial use.
        </p>

        {/* সার্চ বার */}
        <form
          onSubmit={handleSubmit}
          className='mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border border-white/10 bg-white/10 p-1.5 shadow-2xl shadow-black/30 backdrop-blur transition focus-within:border-emerald-400/60 focus-within:ring-4 focus-within:ring-emerald-400/10'
        >
          <svg
            className='ml-3 h-5 w-5 shrink-0 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <circle cx='11' cy='11' r='7' />
            <path strokeLinecap='round' d='m20 20-3.5-3.5' />
          </svg>
          <input
            ref={inputRef}
            type='text'
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Search free stock images...'
            aria-label='Search images'
            className='min-w-0 flex-1 bg-transparent px-2 py-3 text-white placeholder:text-gray-500 focus:outline-none'
          />
          <button
            type='submit'
            className='rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition duration-300 hover:from-emerald-400 hover:to-teal-400 active:scale-95'
          >
            Search
          </button>
        </form>

        {/* ট্যাগ */}
        <p className='mt-8 mb-3 text-xs font-medium uppercase tracking-widest text-gray-500'>
          Trending searches
        </p>
      </div>

      <div className='mx-auto max-w-6xl'>
        <Marquee
          speed={25}
          gradient
          gradientColor='#111827'
          gradientWidth={100}
          pauseOnHover
          pauseOnClick
        >
          {data.map((item, index) => (
            <button
              key={index}
              type='button'
              onClick={() => handleTagClick(item.text)}
              className='mx-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 backdrop-blur transition duration-200 hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-300'
            >
              {item.text}
            </button>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={null}>
      <SearchBarContent />
    </Suspense>
  );
}
