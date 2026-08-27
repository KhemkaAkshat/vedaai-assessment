"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  CircleAlert,
  Sparkles,
} from "lucide-react";

export default function AnswerFeedback({
  question = null,
  answer = null,
  gradingResult = null,
  gradingStatus = null,
}) {
  const [isOpen, setIsOpen] = useState(false);

  /*
   * ==========================================
   * NO QUESTION SELECTED
   * ==========================================
   */

  if (!question) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-[13px] font-medium text-[#555]">
            Select a question
          </p>

          <p className="mt-1 text-[10px] text-[#999]">
            Select a question from the left to
            review the answer.
          </p>
        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * QUESTION HAS NO ANSWER
   * ==========================================
   */

  if (!answer) {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="border-b border-[#eeeeee] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[#999]">
                Question
              </p>

              <h2 className="mt-1 text-[17px] font-semibold text-[#292929]">
                Q{question.number}
              </h2>
            </div>

            <span className="rounded-full bg-[#fff0eb] px-3 py-1.5 text-[10px] font-semibold text-[#ef5938]">
              Unanswered
            </span>
          </div>

          <p className="mt-4 text-[13px] leading-5 text-[#444]">
            {question.text}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center px-6">
          <div className="max-w-[360px] text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5]">
              <CircleAlert
                size={18}
                strokeWidth={1.5}
                className="text-[#999]"
              />
            </div>

            <p className="mt-3 text-[12px] font-medium text-[#555]">
              No answer found
            </p>

            <p className="mt-1 text-[10px] leading-4 text-[#999]">
              No student answer was detected for
              this question, so no marks were
              awarded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * GRADING STATE
   * ==========================================
   */

  const isGrading =
    gradingStatus === "grading";

  const hasError =
    gradingStatus === "error";

  /*
   * ==========================================
   * MARKS
   * ==========================================
   */

  const maximumMarks =
    gradingResult?.maximumMarks ??
    question.marks ??
    0;

  const awardedMarks =
    gradingResult?.awardedMarks ?? null;

  const isGraded =
    gradingResult !== null;

  const isCorrect =
    isGraded &&
    Number(awardedMarks) ===
      Number(maximumMarks);

  const isPartial =
    isGraded &&
    Number(awardedMarks) > 0 &&
    Number(awardedMarks) <
      Number(maximumMarks);

  /*
   * ==========================================
   * STATUS
   * ==========================================
   */

  let statusText = "Not graded";
  let statusClass =
    "bg-[#f3f3f3] text-[#777]";

  if (isGrading) {
    statusText = "Grading...";
    statusClass =
      "bg-[#f3f3f3] text-[#777]";
  }

  if (hasError) {
    statusText = "Grading failed";
    statusClass =
      "bg-[#fff0eb] text-[#ef5938]";
  }

  if (isCorrect) {
    statusText = "Correct";
    statusClass =
      "bg-[#eaf8e8] text-[#4ca447]";
  }

  if (isPartial) {
    statusText = "Partial credit";
    statusClass =
      "bg-[#fff5df] text-[#c47a16]";
  }

  if (
    isGraded &&
    Number(awardedMarks) === 0
  ) {
    statusText = "Incorrect";
    statusClass =
      "bg-[#fff0eb] text-[#ef5938]";
  }

  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (
    <div className="flex h-full flex-col bg-white">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="shrink-0 border-b border-[#eeeeee] px-6 py-5">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="text-[10px] text-[#999]">
              Question
            </p>

            <h2 className="mt-1 text-[17px] font-semibold text-[#292929]">
              Q{question.number}
            </h2>
          </div>

          {/* MARKS */}

          <div className="flex shrink-0 items-center gap-2">
            <div className="rounded-lg bg-[#f5f5f5] px-3 py-2 text-center">
              <p className="text-[9px] text-[#999]">
                Marks
              </p>

              <p className="mt-0.5 text-[15px] font-semibold text-[#292929]">
                {awardedMarks !== null
                  ? awardedMarks
                  : "—"}
                <span className="mx-0.5 text-[#aaa]">
                  /
                </span>
                {maximumMarks}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${statusClass}`}
            >
              {statusText}
            </span>
          </div>
        </div>

        {/* QUESTION TEXT */}

        <div className="mt-4 rounded-[10px] bg-[#f7f7f7] px-4 py-3">
          <p className="text-[12px] leading-[1.6] text-[#444]">
            {question.text}
          </p>
        </div>
      </div>

      {/* ========================================
          ANSWER CONTENT
      ======================================== */}

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {/* STUDENT ANSWER */}

        <div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#ff6337]" />

            <h3 className="text-[11px] font-semibold text-[#292929]">
              Student Answer
            </h3>
          </div>

          <div className="mt-3 rounded-[11px] border border-[#eeeeee] bg-white p-4">
            <p className="whitespace-pre-wrap text-[12px] leading-[1.7] text-[#444]">
              {answer.answerText ||
                "No answer text extracted."}
            </p>
          </div>
        </div>

        {/* ======================================
            GRADING
        ====================================== */}

        {isGrading && (
          <div className="mt-5 rounded-[11px] border border-[#eeeeee] bg-[#fafafa] p-4">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#dddddd] border-t-[#ff6337]" />

              <p className="text-[11px] font-medium text-[#666]">
                AI is evaluating this answer...
              </p>
            </div>
          </div>
        )}

        {/* ======================================
            GRADING ERROR
        ====================================== */}

        {hasError && (
          <div className="mt-5 rounded-[11px] border border-[#ffe1d8] bg-[#fff8f5] p-4">
            <div className="flex items-start gap-2">
              <CircleAlert
                size={15}
                className="mt-0.5 shrink-0 text-[#ef5938]"
              />

              <div>
                <p className="text-[11px] font-medium text-[#ef5938]">
                  Unable to grade this answer
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#999]">
                  You can retry the grading later.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================
            AI FEEDBACK
        ====================================== */}

        {isGraded && !hasError && (
          <div className="mt-5 overflow-hidden rounded-[11px] border border-[#eeeeee]">
            <button
              type="button"
              onClick={() =>
                setIsOpen((previous) => !previous)
              }
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[#fafafa]"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fff0eb]">
                  <Sparkles
                    size={13}
                    strokeWidth={1.6}
                    className="text-[#ff6337]"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-[#292929]">
                    AI Feedback
                  </p>

                  <p className="mt-0.5 text-[9px] text-[#999]">
                    View grading explanation
                  </p>
                </div>
              </div>

              <ChevronDown
                size={15}
                strokeWidth={1.7}
                className={`shrink-0 text-[#888] transition-transform duration-200 ${
                  isOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* ==================================
                COLLAPSIBLE CONTENT
            ================================== */}

            <div
              className={`grid transition-all duration-200 ${
                isOpen
                  ? "grid-rows-[1fr]"
                  : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="border-t border-[#eeeeee] px-4 py-4">
                  <div className="rounded-[9px] bg-[#f8f8f8] px-4 py-3">
                    <p className="text-[11px] leading-[1.7] text-[#555]">
                      {gradingResult.feedback ||
                        "No feedback provided."}
                    </p>
                  </div>

                  {/* CONFIDENCE */}

                  {gradingResult.confidence !==
                    undefined && (
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[9px] text-[#999]">
                        AI confidence
                      </span>

                      <span className="text-[9px] font-medium text-[#777]">
                        {Math.round(
                          Number(
                            gradingResult.confidence
                          ) * 100
                        )}
                        %
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}