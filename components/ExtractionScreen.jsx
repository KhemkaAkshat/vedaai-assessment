"use client";

import Image from "next/image";

export default function ExtractionScreen() {
  return (
    <div className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-white mt-2 rounded-xl">
      <div className="flex flex-col items-center justify-center">
        {/* ================= EXTRACTION IMAGE ================= */}
        <div className="relative mb-6 h-30 w-30">
          <Image
            src="/images/Extraction.png"
            alt="Extracting"
            priority
            width={100}
            height={100}
            className="object-contain animate-pulse"
          />
        </div>

        {/* ================= TEXT ================= */}
        <h2 className="bg-gradient-to-r from-black via-[#7c7b7b] to-black bg-clip-text text-[18px] font-semibold tracking-[-0.3px] text-transparent md:text-[20px]">
          Extracting...
        </h2>

        <p className="mt-1.5 text-[11px] text-[#999] md:text-[12px]">
          This may take a while
        </p>
      </div>
    </div>
  );
}
