"use client";

import dynamic from "next/dynamic";

import QuestionList from "@/components/QuestionList";

const PdfViewer = dynamic(
  () => import("@/components/PdfViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-[#777]">
        Loading answer sheet...
      </div>
    ),
  }
);

export default function AssessmentWorkspace({
  questions = [],
  answers = [],
  answerSheet = null,
  selectedQuestion = null,
  onSelectQuestion,
}) {
  return (
    <div className="flex h-[calc(100vh-72px)] min-h-0 flex-col bg-[#eeeeec]">

      {/* ================= ASSESSMENT HEADER ================= */}

      <div className="flex h-[54px] shrink-0 items-center justify-between border-b border-[#e8e8e8] bg-white px-5">

        <div>
          <p className="text-[9px] text-[#999]">
            Question - Answer mapping
          </p>

          <h1 className="text-[12px] font-semibold text-[#292929]">
            Extracted Questions from question paper
          </h1>
        </div>

        <div className="rounded-full bg-[#f3f3f3] px-3 py-1.5 text-[9px] text-[#666]">
          {questions.length} Questions
        </div>
      </div>

      {/* ================= WORKSPACE ================= */}

      <div className="grid min-h-0 flex-1 grid-cols-[280px_minmax(0,1fr)]">

        {/* ================= QUESTION LIST ================= */}

        <div className="min-h-0 overflow-hidden border-r border-[#e8e8e8] bg-white">

          <QuestionList
            questions={questions}
            answers={answers}
            selectedQuestion={selectedQuestion}
            onSelect={onSelectQuestion}
          />

        </div>

        {/* ================= ANSWER SHEET ================= */}

        <div className="min-h-0 overflow-hidden bg-[#eeeeec]">

          <PdfViewer
            file={answerSheet}
            answers={answers}
            selectedQuestion={selectedQuestion}
          />

        </div>

      </div>
    </div>
  );
}