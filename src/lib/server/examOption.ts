import { createServerFn } from "@tanstack/react-start";
import {
  dbCreateExamOption,
  dbDeleteExamOption,
  dbUpdateExamOption,
} from "~/db/service/examOption";
import {
  serverMiddlewareIsAuthorExam,
  serverMiddlewareIsAuthorExamData,
} from "./middleware";

interface serverDeleteExamOptionData extends serverMiddlewareIsAuthorExamData {
  optionId: number[];
}
export const serverDeleteExamOption = createServerFn({ method: "POST" })
  .middleware([serverMiddlewareIsAuthorExam])
  .validator((data: serverDeleteExamOptionData) => data)
  .handler(async ({ data }) => {
    const { optionId } = data;

    const results = [];
    for (const id of optionId) {
      const result = await dbDeleteExamOption(id);
      if (result) {
        results.push(result);
      }
    }

    if (results.length === 0) {
    }
    return results;
  });

interface serverUpdateExamOptionData extends serverMiddlewareIsAuthorExamData {
  update: {
    questionId: number;
    optionId: number;
    optionText: string;
    isCorrect: boolean;
  }[];
}
export const serverUpdateExamOptionText = createServerFn({
  method: "POST",
})
  .middleware([serverMiddlewareIsAuthorExam])
  .validator((data: serverUpdateExamOptionData) => data)
  .handler(async ({ data }) => {
    const { update } = data;

    const results = [];
    for (const { questionId, optionId, optionText, isCorrect } of update) {
      const result = await dbUpdateExamOption(
        questionId,
        optionId,
        optionText,
        isCorrect,
      );
      if (result) {
        results.push(result);
      }
    }
    if (results.length === 0) {
    }
    return results;
  });

interface serverCreateExamOptionData extends serverMiddlewareIsAuthorExamData {
  create: { questionId: number; optionText: string; isCorrect: boolean }[];
}
export const serverCreateExamOption = createServerFn({
  method: "POST",
})
  .middleware([serverMiddlewareIsAuthorExam])
  .validator((data: serverCreateExamOptionData) => data)
  .handler(async ({ data }) => {
    const { create } = data;

    const results = [];
    for (const { questionId, optionText, isCorrect } of create) {
      const result = await dbCreateExamOption(
        questionId,
        optionText,
        isCorrect,
      );
      if (result) {
        results.push(result);
      }
    }
    if (results.length === 0) {
    }
    return results;
  });

