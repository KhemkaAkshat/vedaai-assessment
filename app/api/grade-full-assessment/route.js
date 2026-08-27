import { NextResponse } from "next/server";

import { gradeFullAssessment } from "@/services/gemini";

export async function POST(request) {
  try {
    const body = await request.json();
    const { questions, answers } = body;

    if (!Array.isArray(questions) || !Array.isArray(answers)) {
      return NextResponse.json(
        {
          success: false,
          error: "Questions and answers must be arrays.",
        },
        { status: 400 },
      );
    }

    const result = await gradeFullAssessment({
      questions,
      answers,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Full assessment grading API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Failed to grade the full assessment.",
      },
      { status: 500 },
    );
  }
}
