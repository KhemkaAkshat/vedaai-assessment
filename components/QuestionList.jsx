"use client";

import { normalizeQuestionNumber } from "@/lib/answerMapping";

export default function QuestionList({
  questions = [],
  answers = [],
  selectedQuestion = null,
  onSelect,
}) {
  const getAnswer = (questionNumber) => {
    const normalizedQuestion = normalizeQuestionNumber(questionNumber);

    return answers.find((answer) => {
      const normalizedAnswer = normalizeQuestionNumber(answer.questionNumber);

      return normalizedAnswer === normalizedQuestion;
    });
  };
  const mappedCount = questions.filter((question) =>
    answers.some(
      (answer) =>
        normalizeQuestionNumber(answer.questionNumber) ===
        normalizeQuestionNumber(question.number),
    ),
  ).length;

  const unansweredCount = questions.length - mappedCount;

  return (
    <div className="flex h-full flex-col bg-[#f7f7f7]">
      {/* ================= HEADER ================= */}

      <div className="shrink-0 border-b border-[#eeeeee] bg-[#f7f7f7] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[13px] font-semibold text-[#292929]">
              Extracted Questions from question paper
            </h2>

            <p className="mt-1 text-[10px] text-[#999]">
              Select a question to review its answer
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <div className="rounded-full bg-[#eaf8e8] px-2.5 py-1.5 text-[10px] font-semibold text-[#4ca447]">
              {mappedCount} Answered
            </div>

            <div className="rounded-full bg-[#fff0eb] px-2.5 py-1.5 text-[10px] font-semibold text-[#ef5938]">
              {unansweredCount} Unanswered
            </div>
          </div>
        </div>
      </div>

      {/* ================= QUESTION LIST ================= */}

      <div className="question-list-scroll min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-2.5">
          {questions.map((question, index) => {
            const questionNumber = question.number;

            const answer = getAnswer(questionNumber);

            const isSelected = selectedQuestion === questionNumber;

            const hasAnswer = Boolean(answer);

            return (
              <button
                key={`${questionNumber}-${index}`}
                type="button"
                onClick={() => onSelect(questionNumber)}
                className={`w-full rounded-[12px] border p-3.5 text-left transition-all ${
                  isSelected
                    ? "border-[#ff6337] bg-[#fff4ef]"
                    : "border-[#eeeeee] bg-white hover:border-[#dddddd] hover:bg-[#fafafa]"
                }`}
              >
                {/* ================= TOP ROW ================= */}

                <div className="flex items-start gap-3">
                  {/* Question Number */}

                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                      isSelected
                        ? "bg-[#ff6337] text-white"
                        : "bg-[#555] text-white"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Question Text */}

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[13px] leading-[1.45] ${
                        isSelected
                          ? "font-medium text-[#292929]"
                          : "text-[#444] "
                      }`}
                    >
                      {question.text}
                    </p>
                  </div>

                  {/* ================= ANSWER STATUS ================= */}

                  <div
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      hasAnswer
                        ? "bg-[#eaf8e8] text-[#4ca447]"
                        : "bg-[#fff0eb] text-[#ef5938]"
                    }`}
                  >
                    {hasAnswer ? "Answered" : "Unanswered"}
                  </div>
                </div>

                {/* ================= MARKS ================= */}

                {question.marks !== null && question.marks !== undefined && (
                  <div className="ml-10 mt-2 text-[10px] text-[#999]">
                    {question.marks} marks
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
