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

export async function extractAnswers(file) {
  const arrayBuffer = await file.arrayBuffer();

  const pdfBlob = new Blob([arrayBuffer], {
    type: "application/pdf",
  });

  console.log("Uploading answer sheet to Gemini...");

  const uploadedFile = await ai.files.upload({
    file: pdfBlob,

    config: {
      mimeType: "application/pdf",
      displayName: file.name,
    },
  });

  console.log("Answer sheet uploaded:", {
    name: uploadedFile.name,
    uri: uploadedFile.uri,
    mimeType: uploadedFile.mimeType,
    state: uploadedFile.state,
  });

  let processedFile = uploadedFile;

  while (
    processedFile.state &&
    processedFile.state.toString().includes("PROCESSING")
  ) {
    console.log("Gemini is processing answer sheet...");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    processedFile = await ai.files.get({
      name: uploadedFile.name,
    });
  }

  if (
    processedFile.state &&
    processedFile.state.toString().includes("FAILED")
  ) {
    throw new Error("Gemini failed to process the answer sheet.");
  }

  const prompt = `
You are analyzing a student's handwritten examination answer sheet.

Your task is to identify and extract every answer written by the student.

IMPORTANT RULES:

1. Analyze every page of the uploaded answer sheet.

2. Identify the question number associated with each answer.

3. Preserve the question number exactly as written by the student.
   Examples:
   Q1
   1
   T1
   T1(i)
   11(a)

4. Answers may be written OUT OF ORDER.

5. A question may be completely unanswered.
   Do NOT create an answer object for an unanswered question.

6. An answer may continue across multiple pages.
   Combine all parts of the same answer into one answer object.

7. Do NOT invent answers or question numbers.

8. If a question number cannot be confidently identified, use null.

9. Extract handwritten text as accurately as possible.

10. Preserve mathematical calculations, equations and formulas.

11. Identify diagrams drawn by the student separately from handwritten text.

12. If a diagram is present, describe what the student drew.

13. A single answer may contain:
    - handwritten text
    - calculations
    - equations
    - diagrams

14. Do NOT include printed question text as part of the student's answer.

15. Do NOT include page headers, page numbers, names or unrelated marks as answers.

16. For every answer region, provide its page and approximate bounding box.

17. Coordinates must be normalized from 0 to 1000.

18. x and y represent the top-left corner of the region.

19. width and height represent the size of the region.

20. If an answer contains multiple separated regions on the same page,
    return each region separately.

21. If an answer continues onto another page, return regions for both pages.

IMPORTANT:
The regions must correspond to the ACTUAL HANDWRITING/DIAGRAM drawn by the student,
not the printed question.

Return only the structured JSON.
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
          answers: {
            type: "array",

            items: {
              type: "object",

              properties: {
                questionNumber: {
                  type: ["string", "null"],
                },

                answerText: {
                  type: "string",
                },

                pages: {
                  type: "array",

                  items: {
                    type: "number",
                  },
                },

                regions: {
                  type: "array",

                  items: {
                    type: "object",

                    properties: {
                      page: {
                        type: "number",
                      },

                      type: {
                        type: "string",
                      },

                      x: {
                        type: "number",
                      },

                      y: {
                        type: "number",
                      },

                      width: {
                        type: "number",
                      },

                      height: {
                        type: "number",
                      },

                      description: {
                        type: "string",
                      },
                    },

                    required: [
                      "page",
                      "type",
                      "x",
                      "y",
                      "width",
                      "height",
                      "description",
                    ],
                  },
                },

                hasDiagram: {
                  type: "boolean",
                },
              },

              required: [
                "questionNumber",
                "answerText",
                "pages",
                "regions",
                "hasDiagram",
              ],
            },
          },
        },

        required: ["answers"],
      },
    },
  });

  return JSON.parse(response.text);
}