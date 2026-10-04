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
      {/* Original Download */}
      <button onClick={handleOriginalDownload}>
        <span className='block'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 576 512'
            className='w-[40px] h-[40px] text-white hover:text-emerald-500 border rounded-full p-2 duration-150 ease-linear'
          >
            <path
              fill='currentColor'
              d='M144 480c-79.5 0-144-64.5-144-144 0-63.4 41-117.2 97.9-136.5-1.3-7.7-1.9-15.5-1.9-23.5 0-79.5 64.5-144 144-144 55.4 0 103.5 31.3 127.6 77.1 14.2-8.3 30.8-13.1 48.4-13.1 53 0 96 43 96 96 0 15.7-3.8 30.6-10.5 43.7 44 20.3 74.5 64.7 74.5 116.3 0 70.7-57.3 128-128 128l-304 0zM377 313c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-31 31 0-102.1c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 102.1-31-31c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c9.4 9.4 24.6 9.4 33.9 0l72-72z'
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
