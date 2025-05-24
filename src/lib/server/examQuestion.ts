import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { dbGetExamQuestions } from "~/db/service/examQuestion";
import {
  serverMiddlewareAuth,
  serverMiddlewareIsAuthorExamData,
} from "./middleware";

interface serverGetExamQuestionByExamId
  extends serverMiddlewareIsAuthorExamData {}
const serverGetExamById = createServerFn({ method: "GET" })
  .middleware([serverMiddlewareAuth])
  .validator((data: serverGetExamQuestionByExamId) => data)
  .handler(async ({ data }) => {
    const { examId } = data;
    const result = await dbGetExamQuestions(examId);

    if (result.length === 0) {
      return null;
    }

    return result;
  });

export const queryGetExamQuestionByExamIdOptions = (examId: number) =>
  queryOptions({
    queryKey: ["exam-questions", examId],
    queryFn: () => serverGetExamById({ data: { examId } }),
  });
