import { NextResponse } from "next/server";

import { gradeAnswer } from "@/services/gemini";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      question,
      answer,
    } = body;

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: "Question is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!answer) {
      return NextResponse.json(
        {
          success: false,
          error: "Answer is required.",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "Grading question:",
      question.number
    );

    const result = await gradeAnswer({
      question,
      answer,
    });

    return NextResponse.json({
      success: true,

      result,
    });
  } catch (error) {
    console.error(
      "Grading API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Failed to grade answer.",
      },
      {
        status: 500,
      }
    );
  }
}