"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const DOWNLOAD_TYPE = "large"; // original | large | medium | thumbnail

type Captcha = { q: string; exp: number; sig: string };

export default function DownloadButtonInner({ imageId }: { imageId: string }) {
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Esc চাপলে popup বন্ধ
  useEffect(() => {
    if (!captcha) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [captcha]);

  const loadCaptcha = async () => {
    const res = await fetch("/api/captcha", { cache: "no-store" });
    setCaptcha(await res.json());
    setAnswer("");
  };

  const openCaptcha = async (e: React.MouseEvent) => {
    // কার্ডের Link-এ ক্লিক যাতে পেজ না খুলে ফেলে
    e.preventDefault();
    e.stopPropagation();
    setError("");
    try {
      await loadCaptcha();
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!captcha || loading) return;

    const ans = answer.trim();
    if (!/^\d+$/.test(ans)) return setError("Please enter a number");

    setLoading(true);
    try {
      const qs = `ans=${ans}&exp=${captcha.exp}&sig=${captcha.sig}`;
      const res = await fetch(`/api/captcha/verify?${qs}`, {
        cache: "no-store",
      });
      const { ok } = await res.json();

      if (!ok) {
        setError("Wrong answer, try this new one");
        await loadCaptcha();
        return;
      }

      window.location.href = `/api/download/${imageId}?type=${DOWNLOAD_TYPE}&${qs}`;
      setCaptcha(null);
      setError("");
    } catch (err) {
      console.error("Download verify failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setCaptcha(null);
    setError("");
  };

  return (
    <>
      <div className='absolute right-0 top-0 z-0 p-3'>
        <button
          type='button'
          onClick={openCaptcha}
          aria-label='Download image'
          title='Download'
          className='group/dl relative grid h-11 w-11 place-items-center rounded-full border-2 border-white/20 bg-white/10 text-gray-800 shadow-lg shadow-black/20 backdrop-blur transition duration-300 ease-out hover:-translate-y-0.5   hover:to-teal-500 hover:text-gray-900  focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/30 active:translate-y-0 active:scale-95'
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

      {mounted &&
        captcha &&
        createPortal(
          <div
            className='fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              close();
            }}
            role='dialog'
            aria-modal='true'
          >
            <form
              onSubmit={confirm}
              onClick={(e) => e.stopPropagation()}
              className='w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 text-gray-900 shadow-2xl dark:bg-zinc-900 dark:text-gray-100'
            >
              <div>
                <h3 className='text-lg font-semibold'>
                  Verify you&apos;re human
                </h3>
                <p className='text-sm text-gray-500'>
                  Solve this to start your download.
                </p>
              </div>

              <p className='rounded-xl bg-gray-100 py-3 text-center text-3xl font-bold tracking-wider dark:bg-zinc-800'>
                {captcha.q}
              </p>

              <input
                autoFocus
                inputMode='numeric'
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder='Your answer'
                aria-label='Captcha answer'
                className='w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700'
              />

              {error && (
                <p className='text-sm text-red-500' role='alert'>
                  {error}
                </p>
              )}

              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={close}
                  className='flex-1 rounded-lg border px-4 py-2.5 dark:border-zinc-700'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-white hover:bg-emerald-600 disabled:opacity-60'
                >
                  {loading ? "Checking..." : "Download"}
                </button>
              </div>
            </form>
          </div>,
          document.body,
        )}
    </>
  );
}
