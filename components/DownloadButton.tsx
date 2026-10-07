"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

interface DownloadButtonProps {
  imageId: string;
}

export default function DownloadButton({ imageId }: DownloadButtonProps) {
  const [quality, setQuality] = useState("original");

  // Free Download = Original
  const handleOriginalDownload = () => {
    window.location.href = `/api/download/${imageId}?type=original`;
  };

  // Dropdown select করলেই download
  const handleQualityChange = (value: string) => {
    setQuality(value);

    window.location.href = `/api/download/${imageId}?type=${value}`;
  };

  return (
    <div className='flex items-center gap-1 mt-1'>
      {/* Original Download */}
      <button
        onClick={handleOriginalDownload}
        className='h-[40px] rounded-l-xl bg-emerald-500/90 text-white font-medium px-6  rounded-lg hover:bg-emerald-500/100 ease-in-out duration-300 transition'
      >
        Free Download
      </button>

      {/* Download Options */}
      <div>
        <Select value={quality} onValueChange={handleQualityChange}>
          <SelectTrigger className='h-[40px] w-[40px] rounded-l-none rounded-r-xl outline-none border-none focus:ring-0 focus:ring-transparent bg-emerald-500/90 hover:bg-emerald-500/100 text-white cus-select ease-in-out duration-300 transition'>
            {/* <SelectValue /> */}
          </SelectTrigger>

          <SelectContent position='popper' side='bottom' align='end'>
            <SelectItem value='original'>Original</SelectItem>

            <SelectItem value='large'>Large</SelectItem>

            <SelectItem value='medium'>Medium</SelectItem>

            <SelectItem value='thumbnail'>Thumbnail</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
