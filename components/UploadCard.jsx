"use client";

import { Upload, X } from "lucide-react";

export default function UploadCard({
  title,
  type,
  file,
  onUpload,
  onRemove,
}) {
  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="relative flex min-h-[40%] items-center justify-center rounded-[15px] border border-dashed border-[#d6d6d6] bg-white px-4 py-4">
      {file ? (
        /* ================= FILE SELECTED ================= */
        <div className="flex w-full items-center justify-center">
          <div className="relative flex min-w-0 max-w-[90%] items-center gap-3 rounded-[9px] bg-[#f7f7f7] px-3 py-2.5">
            {/* PDF Icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#ffe7df]">
              <span className="text-[9px] font-bold text-[#ef5938]">
                PDF
              </span>
            </div>

            {/* File info */}
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-[#333]">
                {file.name}
              </p>

              <p className="mt-0.5 text-[9px] text-[#999]">
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
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#f2f2f2]">
            <Upload
              size={16}
              strokeWidth={1.8}
              className="text-[#444]"
            />
          </div>

          <p className="text-[12px] font-medium text-[#333]">
            Upload{" "}
            <span className="text-[#ff6337]">
              {title}
            </span>
          </p>

          <p className="mt-1 text-[9px] text-[#aaa]">
            Max 10MB
          </p>

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