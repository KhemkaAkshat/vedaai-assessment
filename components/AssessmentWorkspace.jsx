"use client";

import { useMemo, useState } from "react";

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
  /*
   * ==========================================
   * GRADING STATE
   * ==========================================
   */

  const [gradingResults, setGradingResults] = useState({});

  const [gradingStatus, setGradingStatus] = useState({});

  /*
   * Grading is OFF initially.
   *
   * Once the user clicks "Grade Assessment",
   * clicking a question will grade only that
   * particular question.
   */
  const [gradingEnabled, setGradingEnabled] =
    useState(false);

  /*
   * ==========================================
   * NORMALIZE QUESTION NUMBERS
   * ==========================================
   */

  const normalizeQuestionNumber = (value) => {
    if (value === null || value === undefined) {
      return null;
    }

    return String(value)
      .trim()
      .toLowerCase()
      .replace(/^q/, "")
      .replace(/\s+/g, "");
  };

  /*
   * ==========================================
   * FIND ANSWER FOR QUESTION
   * ==========================================
   */

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

  /*
   * ==========================================
   * QUESTIONS THAT CAN BE GRADED
   * ==========================================
   */

  const gradeableQuestions = useMemo(() => {
    return questions.filter((question) => {
      const answer = getAnswer(question.number);

      return (
        answer &&
        answer.answerText &&
        answer.answerText.trim().length > 0
      );
    });
  }, [questions, answers]);

  /*
   * ==========================================
   * GRADE ONE QUESTION
   * ==========================================
   */

  const gradeQuestion = async (question) => {
    const questionNumber = question.number;

    const key =
      normalizeQuestionNumber(questionNumber);

    const answer = getAnswer(questionNumber);

    /*
     * No answer → nothing to grade
     */
    if (
      !answer ||
      !answer.answerText ||
      !answer.answerText.trim()
    ) {
      return;
    }

    /*
     * Already graded → don't call Gemini again
     */
    if (gradingResults[key]) {
      return;
    }

    /*
     * Already being graded → don't create
     * another request
     */
    if (gradingStatus[key] === "grading") {
      return;
    }

    /*
     * Mark question as currently grading
     */
    setGradingStatus((previous) => ({
      ...previous,
      [key]: "grading",
    }));

    try {
      const response = await fetch(
        "/api/grade-assessment",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question,
            answer,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            `Failed to grade question ${questionNumber}`
        );
      }

      /*
       * Store grading result
       */
      setGradingResults((previous) => ({
        ...previous,
        [key]: data.result,
      }));

      /*
       * Mark as graded
       */
      setGradingStatus((previous) => ({
        ...previous,
        [key]: "graded",
      }));
    } catch (error) {
      console.error(
        `Failed to grade question ${questionNumber}:`,
        error
      );

      setGradingStatus((previous) => ({
        ...previous,
        [key]: "error",
      }));
    }
  };

  /*
   * ==========================================
   * HANDLE QUESTION SELECTION
   * ==========================================
   *
   * Every question is always selectable.
   *
   * If grading is disabled:
   *     → Only select the question
   *
   * If grading is enabled:
   *     → Select the question
   *     → Grade ONLY that question
   */

  const handleSelectQuestion = async (
    questionNumber
  ) => {
    /*
     * Always update selected question first
     */
    onSelectQuestion(questionNumber);

    /*
     * Don't grade anything until the user
     * explicitly enables grading.
     */
    if (!gradingEnabled) {
      return;
    }

    /*
     * Find the actual question object
     */
    const question = questions.find(
      (item) =>
        normalizeQuestionNumber(item.number) ===
        normalizeQuestionNumber(questionNumber)
    );

    if (!question) {
      return;
    }

    /*
     * Find student's answer
     */
    const answer = getAnswer(questionNumber);

    /*
     * Unanswered question → don't call Gemini
     */
    if (
      !answer ||
      !answer.answerText ||
      !answer.answerText.trim()
    ) {
      return;
    }

    /*
     * Grade only this question
     */
    await gradeQuestion(question);
  };

  /*
   * ==========================================
   * GRADING SUMMARY
   * ==========================================
   */

  const gradingSummary = useMemo(() => {
    const results =
      Object.values(gradingResults);

    /*
     * Total possible marks from question paper
     */
    const totalMarks = questions.reduce(
      (total, question) => {
        return (
          total +
          (Number(question.marks) || 0)
        );
      },
      0
    );

    /*
     * Marks awarded for questions that
     * have actually been graded
     */
    const awardedMarks = results.reduce(
      (total, result) => {
        return (
          total +
          (Number(result.awardedMarks) || 0)
        );
      },
      0
    );

    /*
     * Number of questions already graded
     */
    const gradedCount = results.length;

    /*
     * Number of questions that have
     * student answers and can be graded
     */
    const gradingCount =
      gradeableQuestions.length;

    /*
     * Overall percentage
     *
     * This is based on the marks graded so far
     * against the total marks of the assessment.
     */
    const percentage =
      totalMarks > 0
        ? (awardedMarks / totalMarks) * 100
        : 0;

    return {
      totalMarks,
      awardedMarks,
      gradedCount,
      gradingCount,
      percentage,
    };
  }, [
    gradingResults,
    questions,
    gradeableQuestions,
  ]);

  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (
    <div className="mt-4 flex h-[calc(100vh-72px)] min-h-0 flex-col bg-[#eeeeec]">

      {/* ==========================================
          GRADING SUMMARY
          ========================================== */}

      <div className="flex h-[54px] shrink-0 items-center justify-between border-b border-[#e5e5e5] bg-white px-5">

        {/* LEFT SIDE */}

        <div>
          <p className="text-[11px] font-semibold text-[#292929]">
            Assessment
          </p>

          <p className="mt-0.5 text-[9px] text-[#999]">
            {gradingSummary.gradedCount} of{" "}
            {gradingSummary.gradingCount} answered
            questions graded
          </p>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center gap-2">

          {/* MARKS */}

          <div className="rounded-full bg-[#f5f5f5] px-3 py-1.5 text-[10px] text-[#666]">
            {gradingSummary.awardedMarks} /{" "}
            {gradingSummary.totalMarks}
          </div>

          {/* PERCENTAGE */}

          <div className="rounded-full bg-[#fff0eb] px-3 py-1.5 text-[10px] font-semibold text-[#ff6337]">
            {gradingSummary.percentage.toFixed(0)}%
          </div>

          {/* GRADE ASSESSMENT BUTTON */}

          <button
            type="button"
            onClick={() =>
              setGradingEnabled(
                (previous) => !previous
              )
            }
            className={`rounded-full px-4 py-2 text-[10px] font-semibold transition-all ${
              gradingEnabled
                ? "bg-[#ff6337] text-white hover:bg-[#e9572f]"
                : "bg-[#292929] text-white hover:bg-[#1f1f1f]"
            }`}
          >
            {gradingEnabled
              ? "Grading Enabled"
              : "Grade Assessment"}
          </button>
        </div>
      </div>

      {/* ==========================================
          MAIN WORKSPACE
          ========================================== */}

      <div className="grid min-h-0 flex-1 grid-cols-[500px_minmax(0,1fr)]">

        {/* ========================================
            QUESTION LIST
            ======================================== */}

        <div className="min-h-0 overflow-hidden border-r border-[#e8e8e8] bg-white">

          <QuestionList
            questions={questions}
            answers={answers}
            selectedQuestion={selectedQuestion}
            onSelect={handleSelectQuestion}
            gradingResults={gradingResults}
            gradingStatus={gradingStatus}
          />

        </div>

        {/* ========================================
            ANSWER SHEET
            ======================================== */}

        <div className="min-h-0 overflow-hidden bg-[#eeeeec]">

          <PdfViewer
            file={answerSheet}
            answers={answers}
            selectedQuestion={selectedQuestion}
            gradingResults={gradingResults}
          />

        </div>
      </div>
    </div>
  );
}