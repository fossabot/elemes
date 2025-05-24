import { createServerFn } from "@tanstack/react-start";
import {
  dbCreateExamOption,
  dbDeleteExamOption,
  dbSetExamOptionCorrect,
  dbUpdateExamOptionText,
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
  update: { questionId: number; optionText: string }[];
}
export const serverUpdateExamOptionText = createServerFn({
  method: "POST",
})
  .middleware([serverMiddlewareIsAuthorExam])
  .validator((data: serverUpdateExamOptionData) => data)
  .handler(async ({ data }) => {
    const { update } = data;

    const results = [];
    for (const { questionId, optionText } of update) {
      const result = await dbUpdateExamOptionText(questionId, optionText);
      if (result) {
        results.push(result);
      }
    }
    if (results.length === 0) {
    }
    return results;
  });

interface serverCreateExamOptionData extends serverMiddlewareIsAuthorExamData {
  create: { questionId: number; optionText: string }[];
}
export const serverCreateExamOption = createServerFn({
  method: "POST",
})
  .middleware([serverMiddlewareIsAuthorExam])
  .validator((data: serverCreateExamOptionData) => data)
  .handler(async ({ data }) => {
    const { create } = data;

    const results = [];
    for (const { questionId, optionText } of create) {
      const result = await dbCreateExamOption(questionId, optionText);
      if (result) {
        results.push(result);
      }
    }
    if (results.length === 0) {
    }
    return results;
  });

interface serverSetExamOptionCorrectData
  extends serverMiddlewareIsAuthorExamData {
  optionId: number;
  questionId: number;
}
export const serverSetExamOptionCorrect = createServerFn({
  method: "POST",
})
  .middleware([serverMiddlewareIsAuthorExam])
  .validator((data: serverSetExamOptionCorrectData) => data)
  .handler(async ({ data }) => {
    const { optionId, questionId } = data;

    const correctOption = dbSetExamOptionCorrect(questionId, optionId);

    if (!correctOption) {
    }
    return correctOption;
  });
