import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import {
  dbCreateExamAttempt,
  dbGetExamAttemptById,
} from "~/db/service/examAttempt";
import { dbIsExamOptionCorrect } from "~/db/service/examOption";
import { dbGetQuestionLengthByExamId } from "~/db/service/examQuestion";
import { serverMiddlewareAuth } from "./middleware";

interface serverGetExamAttemptData {
  examId: number;
}
const serverGetExamAttempt = createServerFn({ method: "GET" })
  .middleware([serverMiddlewareAuth])
  .validator((data: serverGetExamAttemptData) => data)
  .handler(async ({ context, data }) => {
    const examResult = await dbGetExamAttemptById(data.examId, context.user.id);

    return examResult;
  });

export const queryGetExamAttemptOptions = (examId: number) =>
  queryOptions({
    queryKey: ["exam-attempt", examId],
    queryFn: () => serverGetExamAttempt({ data: { examId } }),
  });

interface serverGradingExamData {
  examId: number;
  options: {
    questionId: number;
    selectedOptionId: number;
  }[];
}
export const serverGradingExam = createServerFn({ method: "POST" })
  .middleware([serverMiddlewareAuth])
  .validator((data: serverGradingExamData) => data)
  .handler(async ({ context, data }) => {
    const { examId, options } = data;

    const questionLength = await dbGetQuestionLengthByExamId(examId);

    const sortedOptions = [...options].sort(
      (a, b) => a.selectedOptionId - b.selectedOptionId,
    );

    let totalCorrect = 0;
    const checkedQuestions = new Set<number>();

    for (const { questionId, selectedOptionId } of sortedOptions) {
      if (checkedQuestions.has(questionId)) continue;
      checkedQuestions.add(questionId);

      const isCorrect = await dbIsExamOptionCorrect(
        questionId,
        selectedOptionId,
      );
      if (isCorrect) {
        totalCorrect += 1;
      }
    }

    const grade = Math.ceil((totalCorrect / questionLength) * 100);

    const examAttempt = await dbCreateExamAttempt(
      examId,
      context.user.id,
      grade,
    );

    return { examAttempt };
  });
