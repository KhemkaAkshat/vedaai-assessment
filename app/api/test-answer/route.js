import { NextResponse } from "next/server";
import { extractAnswers } from "@/services/gemini";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No answer sheet provided",
        },
        { status: 400 }
      );
    }

    console.log("Received answer sheet:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const result = await extractAnswers(file);

    return NextResponse.json({
      success: true,

      file: {
        name: file.name,
        type: file.type,
        size: file.size,
      },

      result,
    });
  } catch (error) {
    console.error("Answer extraction error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}