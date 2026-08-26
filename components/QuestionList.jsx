"use client";

export default function QuestionList({
  questions = [],
  answers = [],
  selectedQuestion = null,
  onSelect,
}) {
  const getAnswer = (questionNumber) => {
    return answers.find(
      (answer) =>
        answer.questionNumber === questionNumber
    );
  };

  return (
    <div className="flex h-full flex-col">

      {/* ================= HEADER ================= */}

      <div className="shrink-0 border-b border-[#eeeeee] px-4 py-3">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-[11px] font-semibold text-[#292929]">
              Extracted Questions from question paper
            </h2>

            <p className="mt-0.5 text-[9px] text-[#999]">
              Select a question to review its answer
            </p>
          </div>

          <div className="rounded-md bg-[#f3f3f3] px-2 py-1 text-[8px] text-[#777]">
            {questions.length}
          </div>

        </div>
      </div>

      {/* ================= QUESTION LIST ================= */}

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">

        <div className="space-y-2">

          {questions.map((question, index) => {
            const questionNumber = question.number;

            const answer = getAnswer(questionNumber);

            const isSelected =
              selectedQuestion === questionNumber;

            const hasAnswer = Boolean(answer);

            return (
              <button
                key={`${questionNumber}-${index}`}
                type="button"
                onClick={() => onSelect(questionNumber)}
                className={`w-full rounded-[9px] border p-3 text-left transition-all ${
                  isSelected
                    ? "border-[#ff6337] bg-[#fff4ef]"
                    : "border-[#eeeeee] bg-white hover:border-[#dddddd] hover:bg-[#fafafa]"
                }`}
              >

                {/* ================= TOP ROW ================= */}

                <div className="flex items-center justify-between gap-2">

                  <div className="flex min-w-0 items-center gap-2">

                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold ${
                        isSelected
                          ? "bg-[#ff6337] text-white"
                          : "bg-[#eeeeee] text-[#555]"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <span
                      className={`text-[10px] font-semibold ${
                        isSelected
                          ? "text-[#ff6337]"
                          : "text-[#333]"
                      }`}
                    >
                      Q{questionNumber}
                    </span>

                  </div>

                  {/* ================= ANSWER STATUS ================= */}

                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[7px] font-medium ${
                      hasAnswer
                        ? "bg-[#edf8ee] text-[#4c9955]"
                        : "bg-[#f3f3f3] text-[#999]"
                    }`}
                  >
                    {hasAnswer
                      ? "Answered"
                      : "Unanswered"}
                  </span>

                </div>

                {/* ================= QUESTION TEXT ================= */}

                <p className="mt-2 line-clamp-2 text-[9px] leading-4 text-[#777]">
                  {question.text}
                </p>

                {/* ================= MARKS ================= */}

                {question.marks !== null &&
                  question.marks !== undefined && (
                    <p className="mt-1.5 text-[8px] text-[#aaa]">
                      {question.marks} marks
                    </p>
                  )}

              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
}