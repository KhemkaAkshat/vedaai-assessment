import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function extractQuestions(file) {
  // ==========================================
  // 1. CONVERT NEXT.JS FILE -> BLOB
  // ==========================================

  const arrayBuffer = await file.arrayBuffer();

  const pdfBlob = new Blob([arrayBuffer], {
    type: "application/pdf",
  });

  console.log("Uploading question paper to Gemini...");

  // ==========================================
  // 2. UPLOAD PDF TO GEMINI
  // ==========================================

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

  // ==========================================
  // 3. WAIT FOR PROCESSING
  // ==========================================

  let processedFile = uploadedFile;

  while (
    processedFile.state &&
    processedFile.state.toString().includes("PROCESSING")
  ) {
    console.log("Gemini is processing the question paper...");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    processedFile = await ai.files.get({
      name: uploadedFile.name,
    });
  }

  console.log("Gemini question paper state:", processedFile.state);

  if (
    processedFile.state &&
    processedFile.state.toString().includes("FAILED")
  ) {
    throw new Error("Gemini failed to process the question paper.");
  }

  // ==========================================
  // 4. EXTRACTION PROMPT
  // ==========================================

  const prompt = `
You are extracting questions from a school examination question paper.

This is a DOCUMENT EXTRACTION task.

Use ONLY the uploaded PDF.

Do NOT use outside knowledge.

Do NOT invent questions.

Do NOT replace this paper with another similar paper.

Read and inspect the ENTIRE PDF before producing the result.

==================================================
LANGUAGE — VERY IMPORTANT
==================================================

The PDF may contain both English and Hindi versions.

EXTRACT ONLY THE ENGLISH VERSION.

Completely IGNORE Hindi.

Do NOT:

- extract Hindi questions
- translate Hindi into English
- combine Hindi and English
- duplicate questions because both languages exist
- use Hindi text to reconstruct missing English text

Every extracted question must come from the English portion.

==================================================
TOP-LEVEL QUESTION COUNT
==================================================

This examination paper contains EXACTLY 33 top-level questions.

The top-level questions are:

1
2
3
4
...
33

Your output MUST contain exactly 33 question objects.

ONLY a new printed top-level number such as:

1.
2.
3.
...
33.

can create a new object in the questions array.

==================================================
SUBPARTS
==================================================

The following are NOT new top-level questions:

(a)
(b)
(c)
(i)
(ii)
(iii)
(iv)

They are subparts of the current question.

For example:

17. (a) Calculate ...
    OR
    (b) Calculate ...

This is ONE question:

number = "17"

NOT:

17
18

Similarly:

22. (a)
      (i) ...
      (ii) ...
      (iii) ...

    OR

    (b)
      (i) ...
      (ii) ...
      (iii) ...

This is STILL ONE question:

number = "22"

==================================================
OR / अथवा
==================================================

"OR" and "अथवा" indicate an alternative.

They NEVER create a new top-level question.

Keep both alternatives inside the text of the SAME question.

For example:

Question 17:

(a) English alternative A

OR

(b) English alternative B

should become:

{
  "number": "17",
  "text": "(a) English alternative A\\nOR\\n(b) English alternative B"
}

Do NOT create another question object.

==================================================
QUESTION NUMBER
==================================================

Preserve the printed top-level question number.

The output should contain:

1, 2, 3, ... 33

Do not use:

1(a)
1(b)
22(i)
22(ii)

as top-level question numbers.

The question number field represents ONLY the top-level question.

==================================================
QUESTION TEXT
==================================================

Include the COMPLETE English question.

Preserve:

- mathematical expressions
- equations
- symbols
- fractions
- powers
- roots
- units
- diagrams references
- tables
- graphs
- subparts
- alternatives
- OR statements

Do NOT summarize.

Do NOT shorten.

Do NOT rewrite the question.

Preserve the original wording as closely as possible.

==================================================
DIAGRAMS
==================================================

Set:

hasDiagram = true

if the question contains or refers to:

- geometry diagrams
- graphs
- charts
- tables
- figures
- maps
- circuits
- images
- visual data

Otherwise:

hasDiagram = false.

Do not invent diagrams.

==================================================
MARKS
==================================================

Extract marks only when explicitly visible.

If marks cannot be confidently identified:

marks = null

Never guess marks.

==================================================
HEADINGS / INSTRUCTIONS
==================================================

Do NOT treat the following as questions:

- section headings
- general instructions
- page numbers
- school name
- examination name
- time/duration
- maximum marks
- Hindi translations
- OR / अथवा
- subpart labels

==================================================
FINAL VALIDATION
==================================================

Before returning the final JSON, internally verify:

1. Only English was extracted.

2. Hindi was ignored.

3. There are exactly 33 top-level questions.

4. The first object corresponds to printed question 1.

5. The last object corresponds to printed question 33.

6. Question numbers are in printed order.

7. No subpart became a separate question.

8. No OR became a separate question.

9. No अथवा became a separate question.

10. The Hindi version did not create duplicate questions.

11. No question was invented.

12. No question was omitted.

If you cannot confidently identify a question, do not invent it.

Return ONLY the JSON.
`;

  // ==========================================
  // 5. GEMINI REQUEST
  // ==========================================

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

              required: ["number", "text", "order", "hasDiagram"],
            },
          },
        },

        required: ["questions"],
      },
    },
  });

  // ==========================================
  // 6. PARSE RESPONSE
  // ==========================================

  const result = JSON.parse(response.text);

  const questions = result.questions || [];

  // ==========================================
  // 7. VALIDATE COUNT
  // ==========================================

  const expectedQuestionCount = 33;

  const questionCountValid = questions.length === expectedQuestionCount;

  if (questionCountValid) {
    console.log(
      `✅ Extracted exactly ${questions.length} top-level questions.`,
    );
  } else {
    console.warn(
      `⚠️ Question count mismatch. Expected ${expectedQuestionCount}, got ${questions.length}.`,
    );
  }

  // ==========================================
  // 8. VALIDATE NUMBERING
  // ==========================================

  const extractedNumbers = questions.map((question) =>
    String(question.number).trim(),
  );

  const expectedNumbers = Array.from(
    { length: expectedQuestionCount },
    (_, index) => String(index + 1),
  );

  const numberingValid =
    JSON.stringify(extractedNumbers) === JSON.stringify(expectedNumbers);

  if (numberingValid) {
    console.log("✅ Question numbering is correct: 1-33");
  } else {
    console.warn("⚠️ Question numbering mismatch.", {
      expected: expectedNumbers,
      received: extractedNumbers,
    });
  }

  // ==========================================
  // 9. DEBUG OUTPUT
  // ==========================================

  console.log("Extracted top-level question numbers:", extractedNumbers);

  // ==========================================
  // 10. RETURN
  // ==========================================

  return {
    questions,
    questionCount: questions.length,
    expectedQuestionCount,
    questionCountValid,
    numberingValid,

    warning:
      !questionCountValid || !numberingValid
        ? "Question extraction requires review."
        : null,
  };
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
export async function gradeAnswer({
  question,
  answer,
}) {
  if (!question) {
    throw new Error("Question is required.");
  }

  if (!answer) {
    throw new Error("Answer is required.");
  }

  const prompt = `
You are grading a student's answer to an examination question.

Your task is to evaluate ONLY the student's answer against the provided question.

Do not invent information.

Do not assume work that the student has not shown.

Give partial marks when the student demonstrates partial understanding.

========================================
QUESTION
========================================

Question number:
${question.number}

Question:
${question.text}

Maximum marks:
${question.marks ?? "Not specified"}

========================================
STUDENT ANSWER
========================================

${answer.answerText || "[No answer text extracted]"}

========================================
GRADING RULES
========================================

1. Evaluate the student's actual answer.

2. Compare the answer with what the question asks.

3. Award marks based on the quality and correctness of the student's work.

4. Give partial marks when appropriate.

5. Do not award marks for an answer that is merely plausible if the required reasoning is missing.

6. For mathematics:
   - Check the method.
   - Check calculations.
   - Check the final answer.
   - Give partial credit for correct intermediate work.

7. For science:
   - Check concepts.
   - Check equations/formulas.
   - Check calculations.
   - Check units where applicable.

8. If the question contains OR alternatives, grade only the alternative answered by the student.

9. Do not penalize handwriting extraction issues unless the answer itself is genuinely impossible to understand.

10. Do not invent missing steps.

11. If the answer is blank or clearly unanswered:
    awardedMarks = 0.

12. awardedMarks MUST NOT exceed maximumMarks.

13. Return concise feedback explaining why the marks were awarded.

14. Return a confidence score between 0 and 1.

========================================
OUTPUT
========================================

Return ONLY valid JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: [
      {
        text: prompt,
      },
    ],

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",

        properties: {
          questionNumber: {
            type: "string",
          },

          maximumMarks: {
            type: "number",
          },

          awardedMarks: {
            type: "number",
          },

          isCorrect: {
            type: "boolean",
          },

          feedback: {
            type: "string",
          },

          confidence: {
            type: "number",
          },
        },

        required: [
          "questionNumber",
          "maximumMarks",
          "awardedMarks",
          "isCorrect",
          "feedback",
          "confidence",
        ],
      },
    },
  });

  const result = JSON.parse(response.text);

  // Safety validation
  const maximumMarks =
    Number(question.marks) || 0;

  let awardedMarks =
    Number(result.awardedMarks) || 0;

  // Never allow negative marks
  awardedMarks = Math.max(0, awardedMarks);

  // Never allow more than maximum marks
  if (maximumMarks > 0) {
    awardedMarks = Math.min(
      awardedMarks,
      maximumMarks
    );
  }

  return {
    questionNumber: question.number,

    maximumMarks,

    awardedMarks,

    isCorrect:
      maximumMarks > 0
        ? awardedMarks === maximumMarks
        : Boolean(result.isCorrect),

    feedback:
      result.feedback || "No feedback provided.",

    confidence: Math.min(
      1,
      Math.max(
        0,
        Number(result.confidence) || 0
      )
    ),
  };
}

export async function gradeFullAssessment({
  questions = [],
  answers = [],
}) {
  const normalize = (value) =>
    value === null || value === undefined
      ? null
      : String(value)
          .trim()
          .toLowerCase()
          .replace(/^q/, "")
          .replace(/\s+/g, "");

  const answerByQuestion = new Map(
    answers.map((answer) => [
      normalize(answer.questionNumber),
      answer,
    ]),
  );

  const gradeable = questions
    .map((question) => ({
      question,
      answer: answerByQuestion.get(
        normalize(question.number),
      ),
    }))
    .filter(
      ({ answer }) =>
        answer?.answerText && answer.answerText.trim(),
    );

  if (!gradeable.length) {
    return { results: [] };
  }

  const prompt = `
You are grading a complete school examination assessment.

Grade each provided student answer against its matching question.
Use only the provided question and answer data.

Rules:
- Award partial marks when the work shows partial understanding.
- Do not invent missing work or information.
- For mathematics, check method, calculations, final answer, and units.
- If an answer is blank, award zero.
- If a question contains OR or अथवा alternatives, grade only the alternative
  attempted by the student and ignore the unattempted alternative.
- Treat all OR alternatives as one question and award its marks only once.
- awardedMarks must not exceed maximumMarks.
- Return one result for every provided question-answer pair.
- Keep question numbers exactly as provided.
- Feedback must be concise.
- confidence must be between 0 and 1.

ASSESSMENT DATA:
${JSON.stringify(
  gradeable.map(({ question, answer }) => ({
    questionNumber: question.number,
    question: question.text,
    maximumMarks: question.marks ?? null,
    studentAnswer: answer.answerText,
  })),
  null,
  2,
)}

Return only valid JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [{ text: prompt }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                questionNumber: {
                  type: "string",
                },
                maximumMarks: {
                  type: "number",
                },
                awardedMarks: {
                  type: "number",
                },
                isCorrect: {
                  type: "boolean",
                },
                feedback: {
                  type: "string",
                },
                confidence: {
                  type: "number",
                },
              },
              required: [
                "questionNumber",
                "maximumMarks",
                "awardedMarks",
                "isCorrect",
                "feedback",
                "confidence",
              ],
            },
          },
        },
        required: ["results"],
      },
    },
  });

  const parsed = JSON.parse(response.text);
  const questionsByNumber = new Map(
    gradeable.map(({ question }) => [
      normalize(question.number),
      question,
    ]),
  );

  const results = (parsed.results || [])
    .map((result) => {
      const question = questionsByNumber.get(
        normalize(result.questionNumber),
      );

      if (!question) return null;

      const maximumMarks = Number(question.marks) || 0;
      let awardedMarks = Math.max(
        0,
        Number(result.awardedMarks) || 0,
      );

      if (maximumMarks > 0) {
        awardedMarks = Math.min(
          awardedMarks,
          maximumMarks,
        );
      }

      return {
        questionNumber: question.number,
        maximumMarks,
        awardedMarks,
        isCorrect:
          maximumMarks > 0
            ? awardedMarks === maximumMarks
            : Boolean(result.isCorrect),
        feedback:
          result.feedback || "No feedback provided.",
        confidence: Math.min(
          1,
          Math.max(0, Number(result.confidence) || 0),
        ),
      };
    })
    .filter(Boolean);

  return { results };
}
