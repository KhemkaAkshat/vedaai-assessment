"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UploadCard from "@/components/UploadCard";

export default function Home() {
  const [questionPaper, setQuestionPaper] = useState(null);
  const [answerSheet, setAnswerSheet] = useState(null);

  const handleFileChange = (event, type) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    // File type validation
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, PNG, or JPG file.");
      event.target.value = "";
      return;
    }

    // 10MB validation
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      event.target.value = "";
      return;
    }

    if (type === "question") {
      setQuestionPaper(file);
    } else {
      setAnswerSheet(file);
    }

    // Allows selecting the same file again
    event.target.value = "";
  };

  const removeFile = (type) => {
    if (type === "question") {
      setQuestionPaper(null);
    } else {
      setAnswerSheet(null);
    }
  };

  const canStart = questionPaper && answerSheet;

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-[#292929]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <section className="min-w-0 flex-1">
          {/* Navbar */}
          <Header />

          {/* Main upload area */}
          <div className="flex min-h-[100vh] items-start justify-center px-4 pb-10 pt-10 md:px-8 md:pt-[44px]">
            <div className="w-full max-w-[1100px]">
              {/* ================= HEADING ================= */}
              <div className="text-center">
                <h1 className="text-[27px] font-semibold tracking-[-1.2px] text-[#292929] md:text-[46px]">
                  Upload{" "}
                  <span className="rounded-[7px] bg-[#fff0e8] px-1.5 text-[#ff6337]">
                    Question Paper &amp; Answer Sheets
                  </span>
                </h1>

                <p className="mt-2 text-[13px] text-[#555] md:text-[14px]">
                  Upload both files to get started
                </p>
              </div>

              {/* ================= TEACHER IMAGE ================= */}
              <div className="mt-5 flex justify-center md:mt-4">
                <div className="relative h-25 w-25">
                  <Image
                    src="/images/teacher.png"
                    alt="AI Teacher"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* ================= UPLOAD CARDS ================= */}
              <div className="mx-auto mt-3 grid max-w-[80%] gap-3 rounded-[20px] bg-white p-[9px] md:grid-cols-2 md:gap-[10px]">
                <UploadCard
                  title="Question Paper"
                  type="question"
                  file={questionPaper}
                  onUpload={handleFileChange}
                  onRemove={removeFile}
                />

                <UploadCard
                  title="Answer Sheet"
                  type="answer"
                  file={answerSheet}
                  onUpload={handleFileChange}
                  onRemove={removeFile}
                />
              </div>

              {/* ================= START MAPPING ================= */}
              <div className="mt-7 flex justify-center">
                <button
                  type="button"
                  disabled={!canStart}
                  className={`flex h-[36px] items-center gap-2 rounded-full px-5 text-[12px] font-medium transition ${
                    canStart
                      ? "bg-[#292929] text-white hover:bg-[#1f1f1f]"
                      : "cursor-not-allowed bg-[#bdbdbd] text-[#e9e9e9]"
                  }`}
                >
                  Start Mapping

                  <ArrowRight
                    size={15}
                    strokeWidth={1.8}
                  />
                </button>
              </div>

              {/* Helper text */}
              <p className="mx-auto mt-3 max-w-[420px] text-center text-[10px] leading-4 text-[#999] md:text-[11px]">
                Once both files are uploaded, you&apos;ll be
                able to map answers with questions
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}