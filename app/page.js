"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UploadCard from "@/components/UploadCard";
import ExtractionScreen from "@/components/ExtractionScreen";
import AssessmentWorkspace from "@/components/AssessmentWorkspace";

import { saveFile, getFile, deleteFile } from "@/lib/fileStorage";
import { mapQuestionsToAnswers } from "@/lib/answerMapping";

export default function Home() {
  const [questionPaper, setQuestionPaper] = useState(null);
  const [answerSheet, setAnswerSheet] = useState(null);

  const [processing, setProcessing] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [assessmentStarted, setAssessmentStarted] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  /* ==================================================
     RESTORE FILES FROM INDEXEDDB
  ================================================== */

  useEffect(() => {
    const restoreFiles = async () => {
      try {
        const storedQuestionPaper = await getFile("questionPaper");

        const storedAnswerSheet = await getFile("answerSheet");

        if (storedQuestionPaper) {
          setQuestionPaper(storedQuestionPaper);
        }

        if (storedAnswerSheet) {
          setAnswerSheet(storedAnswerSheet);
        }
      } catch (error) {
        console.error("Failed to restore uploaded files:", error);
      }
    };

    restoreFiles();
  }, []);

  /* ==================================================
     FILE UPLOAD
  ================================================== */

  const handleFileChange = async (event, type) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    /* File type validation */

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, PNG, or JPG file.");
      event.target.value = "";
      return;
    }

    /* 100MB validation */

    if (file.size > 100 * 1024 * 1024) {
      alert("File size must be less than 100MB.");
      event.target.value = "";
      return;
    }

    /* ==================================================
       QUESTION PAPER
    ================================================== */

    if (type === "question") {
      setQuestionPaper(file);

      try {
        await saveFile("questionPaper", file);

        localStorage.setItem(
          "questionPaperMeta",
          JSON.stringify({
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
          }),
        );
      } catch (error) {
        console.error("Failed to save question paper:", error);

        alert("The file was selected but could not be saved locally.");
      }
    } else {

    /* ==================================================
       ANSWER SHEET
    ================================================== */
      setAnswerSheet(file);

      try {
        await saveFile("answerSheet", file);

        localStorage.setItem(
          "answerSheetMeta",
          JSON.stringify({
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
          }),
        );
      } catch (error) {
        console.error("Failed to save answer sheet:", error);

        alert("The file was selected but could not be saved locally.");
      }
    }

    /*
     * Allows selecting the same file again
     */

    event.target.value = "";
  };

  /* ==================================================
     REMOVE FILE
  ================================================== */

  const removeFile = async (type) => {
    try {
      if (type === "question") {
        setQuestionPaper(null);

        await deleteFile("questionPaper");

        localStorage.removeItem("questionPaperMeta");
      } else {
        setAnswerSheet(null);

        await deleteFile("answerSheet");

        localStorage.removeItem("answerSheetMeta");
      }
    } catch (error) {
      console.error("Failed to remove stored file:", error);
    }
  };

  /* ==================================================
     START MAPPING
  ================================================== */

  const handleStartMapping = async () => {
    if (!questionPaper || !answerSheet || processing) {
      return;
    }

    setProcessing(true);
    setSidebarCollapsed(true);

    try {
      /* ==========================================
         CREATE FORM DATA
      ========================================== */

      const questionFormData = new FormData();

      questionFormData.append("file", questionPaper);

      const answerFormData = new FormData();

      answerFormData.append("file", answerSheet);

      /* ==========================================
         EXTRACT QUESTIONS + ANSWERS IN PARALLEL
      ========================================== */

      console.log("Starting question and answer extraction...");

      const [questionResponse, answerResponse] = await Promise.all([
        fetch("/api/test-gemini", {
          method: "POST",
          body: questionFormData,
        }),

        fetch("/api/test-answer", {
          method: "POST",
          body: answerFormData,
        }),
      ]);

      /* ==========================================
         READ BOTH RESPONSES
      ========================================== */

      const [questionData, answerData] = await Promise.all([
        questionResponse.json(),
        answerResponse.json(),
      ]);

      /* ==========================================
         CHECK QUESTION EXTRACTION
      ========================================== */

      if (!questionResponse.ok || !questionData.success) {
        throw new Error(questionData.error || "Failed to extract questions.");
      }

      /* ==========================================
         CHECK ANSWER EXTRACTION
      ========================================== */

      if (!answerResponse.ok || !answerData.success) {
        throw new Error(answerData.error || "Failed to extract answers.");
      }

      /* ==========================================
         LOG RESULTS
      ========================================== */

      console.log("Question extraction:", questionData);

      console.log("Answer extraction:", answerData);

      /* ==========================================
         STORE RESULTS IN REACT STATE
      ========================================== */

      setQuestions(questionData.result?.questions || []);

      setAnswers(answerData.result?.answers || []);
      const mappingResult = mapQuestionsToAnswers(questions, answers);

      console.log("Question-answer mapping:", mappingResult);

      /*
       * Keep the actual File object.
       * PdfViewer can use it directly.
       */

      setAnswerSheet(answerSheet);

      /*
       * No question selected initially.
       */

      setSelectedQuestion(null);

      /* ==========================================
         SHOW ASSESSMENT
      ========================================== */

      setProcessing(false);

      setAssessmentStarted(true);
    } catch (error) {
      console.error("Assessment processing error:", error);

      alert(
        error.message ||
          "Something went wrong while processing the assessment.",
      );

      setProcessing(false);
    }
  };

  /* ==================================================
     START BUTTON STATE
  ================================================== */

  const canStart = questionPaper && answerSheet && !processing;

  /* ==================================================
     MAIN UI
  ================================================== */

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-[#292929]">
      <div className="flex min-h-screen">
        {/* ================= SIDEBAR ================= */}

        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />

        {/* ================= MAIN ================= */}

        <section className="min-w-0 flex-1">
          {/* ================= NAVBAR ================= */}

          <Header />

          {/* ==================================================
              EXTRACTION STATE
          ================================================== */}

          {processing ? (
            <ExtractionScreen />
          ) : assessmentStarted ? (
            /* ==================================================
               ASSESSMENT STATE
            ================================================== */

            <AssessmentWorkspace
              questions={questions}
              answers={answers}
              answerSheet={answerSheet}
              selectedQuestion={selectedQuestion}
              onSelectQuestion={setSelectedQuestion}
            />
          ) : (
            /* ==================================================
               UPLOAD STATE
            ================================================== */

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
                    onClick={handleStartMapping}
                    className={`flex h-[36px] items-center gap-2 rounded-full px-5 text-[12px] font-medium transition ${
                      canStart
                        ? "bg-[#292929] text-white hover:bg-[#1f1f1f]"
                        : "cursor-not-allowed bg-[#bdbdbd] text-[#e9e9e9]"
                    }`}
                  >
                    Start Mapping
                    <ArrowRight size={15} strokeWidth={1.8} />
                  </button>
                </div>

                {/* ================= HELPER TEXT ================= */}

                <p className="mx-auto mt-3 max-w-[420px] text-center text-[10px] leading-4 text-[#999] md:text-[11px]">
                  Once both files are uploaded, you&apos;ll be able to map
                  answers with questions
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
