"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PdfViewer({
  file,
  answers = [],
  selectedQuestion = null,
}) {
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(650);
  const [zoom, setZoom] = useState(1);

  const viewerRef = useRef(null);

  const pageRefs = useRef({});

  /* ================= RESPONSIVE WIDTH ================= */

  useEffect(() => {
    const updateWidth = () => {
      const isMobile = window.innerWidth < 768;

      setPageWidth(
        isMobile
          ? Math.max(window.innerWidth - 48, 240)
          : Math.min(window.innerWidth * 0.55, 650),
      );
    };

    updateWidth();

    window.addEventListener(
      "resize",
      updateWidth
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateWidth
      );
    };
  }, []);

  /* ================= GROUP REGIONS BY PAGE ================= */

  const regionsByPage = useMemo(() => {
    const result = {};

    answers.forEach((answer) => {
      if (!answer.regions) return;

      answer.regions.forEach((region) => {
        if (!result[region.page]) {
          result[region.page] = [];
        }

        result[region.page].push({
          ...region,
          questionNumber:
            answer.questionNumber,
        });
      });
    });

    return result;
  }, [answers]);

  /* ================= SELECTED QUESTION ================= */

  useEffect(() => {
    if (!selectedQuestion) return;

    const answer = answers.find(
      (item) =>
        item.questionNumber === selectedQuestion
    );

    if (!answer?.regions?.length) {
      return;
    }

    const firstRegion = answer.regions[0];

    const pageElement =
      pageRefs.current[firstRegion.page];

    const viewerElement = viewerRef.current;

    if (!pageElement || !viewerElement) {
      return;
    }

    /*
     * Keep this here for now.
     * We'll improve the automatic scrolling later.
     */
    const pageTop = pageElement.offsetTop;

    viewerElement.scrollTo({
      top: Math.max(pageTop - 20, 0),
      behavior: "smooth",
    });
  }, [selectedQuestion, answers]);

  /* ================= PDF LOAD ================= */

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[#999]">
        No answer sheet uploaded
      </div>
    );
  }

  return (
    <div
      ref={viewerRef}
      className="h-full overflow-auto bg-[#eeeeec] p-6"
    >
      <div className="sticky top-0 z-10 mx-auto mb-4 flex w-fit items-center gap-1 rounded-full border border-[#e2e2e2] bg-white/95 p-1 shadow-sm backdrop-blur">
        <button
          type="button"
          aria-label="Zoom out"
          disabled={zoom <= 0.75}
          onClick={() => setZoom((value) => Math.max(0.75, value - 0.25))}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#555] transition hover:bg-[#f3f3f3] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ZoomOut size={15} />
        </button>

        <span className="min-w-[42px] text-center text-[10px] font-semibold text-[#666]">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          aria-label="Zoom in"
          disabled={zoom >= 2}
          onClick={() => setZoom((value) => Math.min(2, value + 0.25))}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#555] transition hover:bg-[#f3f3f3] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ZoomIn size={15} />
        </button>

        <div className="mx-1 h-4 w-px bg-[#e5e5e5]" />

        <button
          type="button"
          aria-label="Reset zoom"
          onClick={() => setZoom(1)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#555] transition hover:bg-[#f3f3f3]"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <Document
        file={file}
        onLoadSuccess={handleLoadSuccess}
        loading={
          <div className="flex h-40 items-center justify-center text-sm text-[#777]">
            Loading answer sheet...
          </div>
        }
        error={
          <div className="flex h-40 items-center justify-center text-sm text-red-500">
            Failed to load PDF
          </div>
        }
      >
        <div className="flex flex-col items-center gap-6">

          {Array.from(
            { length: numPages },
            (_, index) => {
              const pageNumber = index + 1;

              const pageRegions =
                regionsByPage[pageNumber] || [];

              return (
                <div
                  key={pageNumber}
                  ref={(element) => {
                    pageRefs.current[
                      pageNumber
                    ] = element;
                  }}
                  className="relative bg-white shadow-md"
                  style={{
                    width: pageWidth * zoom,
                  }}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={pageWidth * zoom}
                    renderTextLayer
                    renderAnnotationLayer
                  />

                  {/* ================= ANSWER REGIONS ================= */}

                  {pageRegions.map(
                    (region, regionIndex) => {
                      const isSelected =
                        selectedQuestion &&
                        region.questionNumber ===
                          selectedQuestion;

                      return (
                        <div
                          key={`${pageNumber}-${regionIndex}`}
                          className={`pointer-events-none absolute rounded-md border-2 transition-all duration-300 ${
                            isSelected
                              ? "border-[#ff6337] bg-[#ff6337]/15"
                              : "border-transparent bg-transparent"
                          }`}
                          style={{
                            left: `${region.x / 10}%`,
                            top: `${region.y / 10}%`,
                            width: `${region.width / 10}%`,
                            height: `${region.height / 10}%`,
                          }}
                        >
                          {isSelected && (
                            <span className="absolute -top-6 left-0 rounded bg-[#ff6337] px-2 py-1 text-[9px] font-medium text-white">
                              Q{region.questionNumber}
                            </span>
                          )}
                        </div>
                      );
                    }
                  )}

                  {/* ================= PAGE NUMBER ================= */}

                  <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-[9px] text-white">
                    Page {pageNumber}
                  </div>
                </div>
              );
            }
          )}

        </div>
      </Document>
    </div>
  );
}
