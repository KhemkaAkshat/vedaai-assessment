"use client";

import { Upload, X } from "lucide-react";
import Image from "next/image";

export default function UploadCard({ title, type, file, onUpload, onRemove }) {
  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="relative flex min-h-32 items-center justify-center rounded-[15px] border-2 border-dashed border-[#c2c2c2] bg-white px-12 py-12 md:min-h-[20vh]">
      {file ? (
        /* ================= FILE SELECTED ================= */
        <div className="flex w-full items-center justify-center">
          <div className="relative flex min-w-[90%] px-2 items-center gap-1 rounded-xl bg-[#f7f7f7] ">
            {/* PDF Icon */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl">
              <Image
                src="/images/pdf1.png"
                alt="AI Teacher"
                width={100}
                height = {100}
                className="object-contain"
                priority
              />
            </div>

            {/* File info */}
            <div className="min-w-0 text-center">
              <p className="truncate text-md font-bold text-[#333]">
                {file.name}
              </p>

              <p className="mt-0.5 text-sm text-[#999]">
                {formatFileSize(file.size)}
              </p>
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => onRemove(type)}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#5c5c5c] text-white shadow-sm hover:bg-[#333]"
              aria-label={`Remove ${title}`}
            >
              <X size={11} />
            </button>
          </div>
        </div>
      ) : (
        /* ================= EMPTY STATE ================= */
        <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
          {/* Upload icon */}
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-[#f2f2f2]">
            <Upload size={22} strokeWidth={2.4} className="text-[#444]" />
          </div>

          <p className="text-xl font-semibold text-[#333]">
            Upload <span className="text-[#ff6337]">{title}</span>
          </p>

          <p className="mt-1 text-sm text-[#aaa]">Max 10MB</p>

          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(event) => onUpload(event, type)}
          />
        </label>
      )}
    </div>
  );
}
