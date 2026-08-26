/**
 * Normalize question numbers so that small formatting
 * differences do not prevent matching.
 *
 * Examples:
 * "Q1"     -> "1"
 * "q1"     -> "1"
 * "1"      -> "1"
 * "Q1(a)"  -> "1(a)"
 * "1 (a)"  -> "1(a)"
 */
function normalizeQuestionNumber(value) {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/^q\s*/, "")
    .replace(/\s+/g, "")
    .replace(/^\((.*)\)$/, "$1");
}

/**
 * Map extracted questions to extracted student answers.
 *
 * This function does NOT use AI.
 * It only matches question numbers.
 */
export function mapQuestionsToAnswers(
  questions = [],
  answers = []
) {
  const answerMap = new Map();

  // Build an index of answers by normalized question number
  for (const answer of answers) {
    const normalizedNumber = normalizeQuestionNumber(
      answer.questionNumber
    );

    if (!normalizedNumber) {
      continue;
    }

    // Keep the first answer if duplicate question numbers exist.
    if (!answerMap.has(normalizedNumber)) {
      answerMap.set(normalizedNumber, answer);
    }
  }

  const mappedQuestions = questions.map((question, index) => {
    const normalizedNumber = normalizeQuestionNumber(
      question.number
    );

    const answer = normalizedNumber
      ? answerMap.get(normalizedNumber) || null
      : null;

    return {
      questionNumber: question.number,
      question: question,
      answer: answer,

      status: answer
        ? "answered"
        : "unanswered",

      order: index + 1,
    };
  });

  // Answers that could not be matched to any question.
  const matchedQuestionNumbers = new Set(
    questions
      .map((question) =>
        normalizeQuestionNumber(question.number)
      )
      .filter(Boolean)
  );

  const unmatchedAnswers = answers.filter((answer) => {
    const normalizedNumber = normalizeQuestionNumber(
      answer.questionNumber
    );

    return (
      normalizedNumber &&
      !matchedQuestionNumbers.has(normalizedNumber)
    );
  });

  return {
    mappedQuestions,
    unmatchedAnswers,
  };
}

export { normalizeQuestionNumber };