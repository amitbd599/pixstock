"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Marquee from "react-fast-marquee";

function SearchBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    } else {
      router.push("/");
    }
  };

  const handleSubmitByTag = (data: string) => {
    router.push(`/search?q=${encodeURIComponent(data)}`);
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

  return (
    <div className='px-2'>
      <Link href='/'>
        <h1 className='text-4xl font-bold text-white text-center mb-2'>
          Free Stock Images
        </h1>
      </Link>

      <p className='text-center text-gray-300 mb-6'>
        Beautiful free images for your next project
      </p>

      <form onSubmit={handleSubmit} className='flex gap-2 max-w-xl mx-auto'>
        <input
          type='text'
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder='Search free stock images...'
          className='flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black'
        />

        <button
          type='submit'
          className='bg-emerald-500/90 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-emerald-500 ease-in-out duration-300'
        >
          Search
        </button>
      </form>

      <div className='max-w-5xl mx-auto flex w-full flex-wrap justify-center gap-2 mt-4'>
        <Marquee
          speed={15}
          gradient
          gradientColor='#111827'
          gradientWidth={100}
        >
          {data.map((item, index) => (
            <button
              key={index}
              className='btn-badge'
              onClick={() => handleSubmitByTag(item.text)}
            >
              {item.text}
            </button>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={null}>
      <SearchBarContent />
    </Suspense>
  );
}
