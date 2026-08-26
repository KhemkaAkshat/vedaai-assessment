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
    <div className="flex h-[calc(100vh-72px)] min-h-0 flex-col bg-[#eeeeec] mt-4">

      <div className="grid min-h-0 flex-1 grid-cols-[500px_minmax(0,1fr)]">

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