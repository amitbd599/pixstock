"use client";

interface DownloadButtonInnerProps {
  imageId: string;
}

export default function DownloadButtonInner({
  imageId,
}: DownloadButtonInnerProps) {
  // Free Download = Original
  const handleOriginalDownload = () => {
    window.location.href = `/api/download/${imageId}?type=medium`;
  };

  return (
    <div className='absolute top-[0px] right-[0px] z-10 p-3 '>
      <button
        onClick={handleOriginalDownload}
        aria-label='Download original image'
        title='Download original'
        className='group/dl relative grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-gray-100 shadow-lg shadow-black/20 backdrop-blur transition duration-300 ease-out hover:-translate-y-0.5 hover:border-emerald-400/60 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:shadow-emerald-500/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/30 active:translate-y-0 active:scale-95'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 576 512'
          className='h-5 w-5 transition-transform duration-300 group-hover/dl:scale-110'
          aria-hidden='true'
        >
          <path
            fill='currentColor'
            d='M144 480c-79.5 0-144-64.5-144-144 0-63.4 41-117.2 97.9-136.5-1.3-7.7-1.9-15.5-1.9-23.5 0-79.5 64.5-144 144-144 55.4 0 103.5 31.3 127.6 77.1 14.2-8.3 30.8-13.1 48.4-13.1 53 0 96 43 96 96 0 15.7-3.8 30.6-10.5 43.7 44 20.3 74.5 64.7 74.5 116.3 0 70.7-57.3 128-128 128l-304 0zM377 313c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-31 31 0-102.1c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 102.1-31-31c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c9.4 9.4 24.6 9.4 33.9 0l72-72z'
          />
        </svg>
      </button>
    </div>
  );
}
