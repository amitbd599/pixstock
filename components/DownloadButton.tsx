"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const LABELS: Record<string, string> = {
  original: "Download Original",
  large: "Download Large",
  medium: "Download Medium",
  thumbnail: "Download Thumbnail",
};

type Captcha = { q: string; exp: number; sig: string };

export default function DownloadButton({ imageId }: { imageId: string }) {
  const [quality, setQuality] = useState("original");
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCaptcha = async () => {
    const res = await fetch("/api/captcha", { cache: "no-store" });
    setCaptcha(await res.json());
    setAnswer("");
  };

  const openCaptcha = async () => {
    setError("");
    try {
      await loadCaptcha();
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
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

      window.location.href = `/api/download/${imageId}?type=${quality}&${qs}`;
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
      <div className='mt-1 flex items-center gap-1'>
        <button
          type='button'
          onClick={openCaptcha}
          className='h-[40px] rounded-l-xl rounded-r-none bg-emerald-500/90 px-6 font-medium text-white transition duration-300 ease-in-out hover:bg-emerald-500'
        >
          {LABELS[quality]}
        </button>

        <Select value={quality} onValueChange={setQuality}>
          <SelectTrigger
            aria-label='Choose download size'
            className='cus-select h-[40px] w-[40px] rounded-l-none rounded-r-xl border-none bg-emerald-500/90 text-white outline-none transition duration-300 ease-in-out hover:bg-emerald-500 focus:ring-0 focus:ring-transparent'
          />
          <SelectContent position='popper' side='bottom' align='end'>
            <SelectItem value='original'>Original</SelectItem>
            <SelectItem value='large'>Large</SelectItem>
            <SelectItem value='medium'>Medium</SelectItem>
            <SelectItem value='thumbnail'>Thumbnail</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {captcha && (
        <div
          className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm'
          onClick={close}
          role='dialog'
          aria-modal='true'
        >
          <form
            onSubmit={confirm}
            onClick={(e) => e.stopPropagation()}
            className='w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900'
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
        </div>
      )}
    </>
  );
}
