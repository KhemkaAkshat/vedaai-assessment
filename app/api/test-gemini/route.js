import { NextResponse } from "next/server";
import { extractQuestions } from "@/services/gemini";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file provided",
        },
        {
          status: 400,
        }
      );
    }

    console.log("Received file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const result = await extractQuestions(file);

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
    console.error("Gemini error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}