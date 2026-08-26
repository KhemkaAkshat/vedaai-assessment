import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function extractQuestions(file) {
  // Convert Next.js File -> Blob
  const arrayBuffer = await file.arrayBuffer();

  const pdfBlob = new Blob([arrayBuffer], {
    type: "application/pdf",
  });

  console.log("Uploading PDF to Gemini...");

  // Upload using Gemini Files API
  const uploadedFile = await ai.files.upload({
    file: pdfBlob,
    config: {
      mimeType: "application/pdf",
      displayName: file.name,
    },
  });

  console.log("Gemini file uploaded:", {
    name: uploadedFile.name,
    uri: uploadedFile.uri,
    mimeType: uploadedFile.mimeType,
    state: uploadedFile.state,
  });

  // Wait until Gemini finishes processing the file
  let processedFile = uploadedFile;

  while (
    processedFile.state &&
    processedFile.state.toString().includes("PROCESSING")
  ) {
    console.log("Gemini is processing the PDF...");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    processedFile = await ai.files.get({
      name: uploadedFile.name,
    });
  }

  console.log("Gemini file state:", processedFile.state);

  if (
    processedFile.state &&
    processedFile.state.toString().includes("FAILED")
  ) {
    throw new Error("Gemini failed to process the PDF.");
  }

  const prompt = `
You are analyzing a school examination question paper.

IMPORTANT:
You MUST extract questions ONLY from the uploaded PDF.
Do not use outside knowledge.
Do not invent questions.
Do not replace the document with another similar question paper.

First inspect the entire PDF.

Extract EVERY actual question from the document.

Rules:

1. Preserve the exact printed question number.
2. Preserve the original printed order.
3. Treat labelled sub-parts as separate questions.
4. Include the complete question text.
5. Preserve mathematical expressions as accurately as possible.
6. Extract marks when they are explicitly visible.
7. Detect whether the question contains or refers to a diagram/figure.
8. Do not treat headings, instructions, page numbers or general information as questions.
9. Do not invent missing questions.
10. The answer must be based ONLY on this PDF.

Before producing the final JSON, internally verify that:
- the first question matches the first question in the PDF
- the last question matches the last question in the PDF
- the question numbers are in the same order as the PDF.

Return the extracted questions.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: [
      {
        fileData: {
          fileUri: processedFile.uri,
          mimeType: processedFile.mimeType,
        },
      },
      {
        text: prompt,
      },
    ],

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",

        properties: {
          questions: {
            type: "array",

            items: {
              type: "object",

              properties: {
                number: {
                  type: "string",
                },

                text: {
                  type: "string",
                },

                marks: {
                  type: "number",
                  nullable: true,
                },

                order: {
                  type: "number",
                },

                hasDiagram: {
                  type: "boolean",
                },
              },

              required: [
                "number",
                "text",
                "order",
                "hasDiagram",
              ],
            },
          },
        },

        required: ["questions"],
      },
    },
  });

  return JSON.parse(response.text);
}