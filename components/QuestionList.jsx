"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";

import { normalizeQuestionNumber } from "@/lib/answerMapping";

export default function QuestionList({
  questions = [],
  answers = [],
  selectedQuestion = null,
  onSelect,
  gradingResults = {},
  gradingStatus = {},
  gradingSummary = {},
  fullGradingStatus = "idle",
  onGradeFullAssessment,
}) {
  const [expandedFeedback, setExpandedFeedback] =
    useState({});

  const getAnswer = (questionNumber) => {
    const normalizedQuestion =
      normalizeQuestionNumber(questionNumber);

    return answers.find((answer) => {
      return (
        normalizeQuestionNumber(
          answer.questionNumber
        ) === normalizedQuestion
      );
    });
  };

  const getGradingResult = (questionNumber) => {
    const key =
      normalizeQuestionNumber(questionNumber);

    return gradingResults[key] || null;
  };

  const getGradingStatus = (questionNumber) => {
    const key =
      normalizeQuestionNumber(questionNumber);

    return gradingStatus[key] || null;
  };

  const toggleFeedback = (
    questionNumber,
    event
  ) => {
    // Prevent selecting the question again
    event.stopPropagation();

    const key =
      normalizeQuestionNumber(questionNumber);

    setExpandedFeedback((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const mappedCount = questions.filter(
    (question) =>
      Boolean(getAnswer(question.number))
  ).length;

  const gradedCount = questions.filter(
    (question) =>
      Boolean(
        getGradingResult(question.number)
      )
  ).length;

  return (
    <div className="flex h-full flex-col bg-[#f7f7f7]">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="shrink-0 border-b border-[#eeeeee] bg-[#f7f7f7] px-3 py-2 md:px-5 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-[11px] font-semibold text-[#292929] md:text-[13px]">
              <span className="md:hidden">Extracted Questions</span>
              <span className="hidden md:inline">
                Extracted Questions from question paper
              </span>
            </h2>

            <p className="mt-1 hidden text-[10px] text-[#999] md:block">
              Select a question to review its
              answer
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="rounded-full bg-white px-2 py-1 text-[9px] text-[#777] shadow-sm md:px-3 md:py-1.5 md:text-[10px]">
              {gradingSummary.awardedMarks ?? 0} / {gradingSummary.totalMarks ?? 0}
            </div>

            <button
              type="button"
              onClick={onGradeFullAssessment}
              disabled={
                mappedCount === 0 ||
                fullGradingStatus === "grading" ||
                fullGradingStatus === "complete"
              }
              className="rounded-full bg-[#292929] px-1.5 py-0.5 text-[8px] font-semibold text-white transition hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:bg-[#c5c5c5] md:px-3 md:py-1.5 md:text-[10px]"
            >
              <span className="md:hidden">
                {fullGradingStatus === "grading"
                  ? "Grading..."
                  : fullGradingStatus === "complete"
                    ? "Graded"
                    : fullGradingStatus === "error"
                      ? "Retry"
                      : "Grade Full"}
              </span>
              <span className="hidden md:inline">
                {fullGradingStatus === "grading"
                  ? "Grading..."
                  : fullGradingStatus === "complete"
                    ? "Graded"
                    : fullGradingStatus === "error"
                      ? "Retry Grading"
                      : "Grade Full Assessment"}
              </span>
            </button>
          </div>
        </div>

        {mappedCount > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 md:mt-3 md:gap-2">
            <div className="rounded-full bg-white px-2 py-1 text-[9px] text-[#777] md:px-2.5">
              {questions.length} questions
            </div>
            
            <div className="rounded-full bg-white px-2 py-1 text-[9px] text-[#777] md:px-2.5">
              {mappedCount} answered
            </div>

            <div className="rounded-full bg-white px-2 py-1 text-[9px] text-[#777] md:px-2.5">
              {gradedCount} graded
            </div>

            
          </div>
        )}

      </div>

      {/* ==========================================
          QUESTION LIST
      ========================================== */}

      <div className="question-list-scroll min-h-0 flex-1 overflow-y-auto px-2 py-2 md:px-4 md:py-3">
        <div className="space-y-2 md:space-y-2.5">
          {questions.map((question, index) => {
            const questionNumber =
              question.number;

            const answer =
              getAnswer(questionNumber);

            const gradingResult =
              getGradingResult(
                questionNumber
              );

            const status =
              getGradingStatus(
                questionNumber
              );

            const isSelected =
              selectedQuestion ===
              questionNumber;

            const hasAnswer =
              Boolean(answer);

            const isGraded =
              Boolean(gradingResult);

            const isGrading =
              status === "grading";

            const hasError =
              status === "error";

            const awardedMarks =
              gradingResult?.awardedMarks;

            const maximumMarks =
              gradingResult?.maximumMarks ??
              question.marks;

            const isCorrect =
              isGraded &&
              Number(awardedMarks) ===
                Number(maximumMarks);

            const isPartial =
              isGraded &&
              Number(awardedMarks) > 0 &&
              Number(awardedMarks) <
                Number(maximumMarks);

            const feedbackKey =
              normalizeQuestionNumber(
                questionNumber
              );

            const isFeedbackOpen =
              Boolean(
                expandedFeedback[feedbackKey]
              );

            return (
              <div
                key={`${questionNumber}-${index}`}
                className={`w-full overflow-hidden rounded-[12px] border transition-all ${
                  isSelected
                    ? "border-[#ff6337] bg-[#fff4ef]"
                    : "border-[#eeeeee] bg-white"
                }`}
              >
                {/* ==================================
                    QUESTION BUTTON
                ================================== */}

                <button
                  type="button"
                  onClick={() =>
                    onSelect(questionNumber)
                  }
                  className="w-full p-2.5 text-left transition-all hover:bg-[#fafafa] md:p-3.5"
                >
                  <div className="flex items-start gap-3">
                    {/* NUMBER */}

                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-md font-semibold border-3 border-gray-500 ${
                        isSelected
                          ? "bg-[#ff6337] border-orange-500 text-white"
                          : "bg-[#555] text-white"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* QUESTION */}

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[13px] leading-[1.45] ${
                          isSelected
                            ? "font-medium text-[#292929]"
                            : "text-[#444]"
                        }`}
                      >
                        {question.text}
                      </p>
                    </div>

                    {/* STATUS */}

                    <div className="shrink-0">
                      {!hasAnswer && (
                        <span className="rounded-full bg-[#fff0eb] px-2.5 py-1 text-[10px] font-semibold text-[#ef5938]">
                          Unanswered
                        </span>
                      )}

                      {hasAnswer &&
                        isGrading && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f3f3] px-2.5 py-1 text-[10px] font-semibold text-[#777]">
                            <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-[#cccccc] border-t-[#ff6337]" />
                            Grading...
                          </span>
                        )}

                      {hasAnswer &&
                        !isGraded &&
                        !isGrading &&
                        !hasError && (
                          <span className="rounded-full bg-[#f3f3f3] px-2.5 py-1 text-[10px] font-semibold text-[#777]">
                            Waiting
                          </span>
                        )}

                      {hasError && (
                        <span className="rounded-full bg-[#fff0eb] px-2.5 py-1 text-[10px] font-semibold text-[#ef5938]">
                          Error
                        </span>
                      )}

                      {isCorrect && (
                        <span className="rounded-full bg-[#eaf8e8] px-2.5 py-1 text-[10px] font-semibold text-[#4ca447]">
                          {awardedMarks}/
                          {maximumMarks}
                        </span>
                      )}

                      {isPartial && (
                        <span className="rounded-full bg-[#fff5df] px-2.5 py-1 text-[10px] font-semibold text-[#c47a16]">
                          {awardedMarks}/
                          {maximumMarks}
                        </span>
                      )}

                      {isGraded &&
                        Number(awardedMarks) ===
                          0 && (
                          <span className="rounded-full bg-[#fff0eb] px-2.5 py-1 text-[10px] font-semibold text-[#ef5938]">
                            0/
                            {maximumMarks}
                          </span>
                        )}
                    </div>
                  </div>

                  {/* MARKS */}

                  {question.marks !==
                    null &&
                    question.marks !==
                      undefined && (
                      <div className="ml-10 mt-2 text-[10px] text-[#999]">
                        {question.marks} marks
                      </div>
                    )}
                </button>

                {/* ==================================
                    AI FEEDBACK
                ================================== */}

                {isGraded &&
                  gradingResult?.feedback && (
                    <div className="px-2 pb-2">
                      <div className="overflow-hidden rounded-[10px] bg-[#f7f7f7]">
                        <button
                          type="button"
                          onClick={(event) =>
                            toggleFeedback(
                              questionNumber,
                              event
                            )
                          }
                          className="flex w-full items-center justify-between px-4 py-3 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles
                              size={14}
                              strokeWidth={1.7}
                              className="text-[#ff6337]"
                            />

                            <span className="text-[11px] font-semibold text-[#292929]">
                              AI Feedback
                            </span>
                          </div>

                          {isFeedbackOpen ? (
                            <ChevronUp
                              size={15}
                              className="text-[#777]"
                            />
                          ) : (
                            <ChevronDown
                              size={15}
                              className="text-[#777]"
                            />
                          )}
                        </button>

                        {/* COLLAPSIBLE CONTENT */}

                        <div
                          className={`grid transition-all duration-200 ${
                            isFeedbackOpen
                              ? "grid-rows-[1fr]"
                              : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="min-h-0 overflow-hidden">
                            <div className="px-4 pb-4">
                              <p className="text-[11px] leading-[1.6] text-[#555]">
                                {
                                  gradingResult.feedback
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
