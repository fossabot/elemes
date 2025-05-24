import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import {
  dbCreateNewQuestionByExamId,
  dbDeleteQuestionById,
  dbGetExamQuestions,
  dbGetExamQuestionsIsCorrectFalse,
  dbUpdateQuestionTextById,
} from "~/db/service/examQuestion";
import {
  serverMiddlewareIsAuthorExam,
  serverMiddlewareIsAuthorExamData,
  serverMiddlewareIsExamPublic,
  serverMiddlewareIsExamPublicData,
} from "./middleware";

interface serverGetExamQuestionByExamId
  extends serverMiddlewareIsExamPublicData {}
export const serverGetExamQuestionByExamId = createServerFn({ method: "GET" })
  .middleware([serverMiddlewareIsExamPublic])
  .validator((data: serverGetExamQuestionByExamId) => data)
  .handler(async ({ data }) => {
    const { examId } = data;
    const result = await dbGetExamQuestions(examId);

    if (result.length === 0) {
      return null;
    }

    return result;
  });

export const queryGetExamQuestionByExamId = (examId: number) =>
  queryOptions({
    queryKey: ["exam-questions", examId],
    queryFn: () => serverGetExamQuestionByExamId({ data: { examId } }),
  });

interface serverCreateNewQuestion extends serverMiddlewareIsAuthorExamData {
  questionText: string;
}
export const serverCreateNewQuestion = createServerFn({
  method: "POST",
})
  .middleware([serverMiddlewareIsAuthorExam])
  .validator((data: serverCreateNewQuestion) => data)
  .handler(async ({ data }) => {
    const { examId, questionText } = data;
    const result = await dbCreateNewQuestionByExamId(examId, questionText);

    if (!result) {
      return null;
    }

    return result;
  });

interface serverDeleteQuestionByIdData
  extends serverMiddlewareIsAuthorExamData {
  questionId: number;
}
export const serverDeleteQuestionById = createServerFn({
  method: "POST",
})
  .middleware([serverMiddlewareIsAuthorExam])
  .validator((data: serverDeleteQuestionByIdData) => data)
  .handler(async ({ data }) => {
    const { examId, questionId } = data;
    const result = await dbDeleteQuestionById(questionId);

    if (!result) {
      return null;
    }

    return result;
  });

interface serverUpdateQuestionByIdData
  extends serverMiddlewareIsAuthorExamData {
  questionId: number;
  questionText: string;
}
export const serverUpdateQuestionTextById = createServerFn({
  method: "POST",
})
  .middleware([serverMiddlewareIsAuthorExam])
  .validator((data: serverUpdateQuestionByIdData) => data)
  .handler(async ({ data }) => {
    const { questionId, questionText } = data;
    const result = await dbUpdateQuestionTextById(questionId, questionText);

    if (!result) {
      return null;
    }

    return result;
  });

interface serverGetExamQuestionByExamIsCorrectFalseId
  extends serverMiddlewareIsExamPublicData {}
const serverGetExamQuestionByExamIsCorrectFalseId = createServerFn({
  method: "GET",
})
  .middleware([serverMiddlewareIsExamPublic])
  .validator((data: serverGetExamQuestionByExamIsCorrectFalseId) => data)
  .handler(async ({ data }) => {
    const { examId } = data;
    const result = await dbGetExamQuestionsIsCorrectFalse(examId);

    if (result.length === 0) {
      return null;
    }

    return result;
  });

export const queryGetExamQuestionByExamIsCorrectFalseId = (examId: number) =>
  queryOptions({
    queryKey: ["exam-questions-false", examId],
    queryFn: () =>
      serverGetExamQuestionByExamIsCorrectFalseId({ data: { examId } }),
  });
