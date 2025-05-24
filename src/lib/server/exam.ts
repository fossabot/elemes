import { queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  dbCreateNewExam,
  dbDeleteExamById,
  dbGetAllExams,
  dbGetAllUserExams,
  dbGetExamById,
  dbUpdateExamTitle,
} from "~/db/service/exam";
import { serverMiddlewareAuth, serverMiddlewareIsAuthorExam } from "./middleware";

const serverGetAllExams = createServerFn({ method: "GET" })
  .middleware([serverMiddlewareAuth])
  .handler(async () => {
    const exams = await dbGetAllExams();

    if (exams.length === 0) {
      throw notFound();
    }

    return exams;
  });

export const queryGetExamsOptions = () =>
  queryOptions({
    queryKey: ["exams"],
    queryFn: () => serverGetAllExams(),
  });

const serverGetAllUserExams = createServerFn({ method: "GET" })
  .middleware([serverMiddlewareAuth])
  .handler(async ({ context }) => {
    const { user } = context;
    const data = await dbGetAllUserExams(user.id);
    if (data.length === 0) {
      throw notFound();
    }
    return data;
  });

export const queryGetUserExamsOptions = () =>
  queryOptions({
    queryKey: ["user-exams"],
    queryFn: () => serverGetAllUserExams(),
  });

interface serverCreateNewExamData {
  name: string;
}
export const serverCreateNewExam = createServerFn({ method: "POST" })
  .middleware([serverMiddlewareAuth])
  .validator((data: serverCreateNewExamData) => data)
  .handler(async ({ context, data }) => {
    const { user } = context;
    const { name } = data;
    const result = await dbCreateNewExam(name, user.id);

    return result;
  });

interface serverGetExamByIdData {
  examId: number;
}
const serverGetExamById = createServerFn({ method: "GET" })
  .middleware([serverMiddlewareAuth])
  .validator((data: serverGetExamByIdData) => data)
  .handler(async ({ data }) => {
    const { examId } = data;
    const result = await dbGetExamById(examId);

    if (!result) {
      throw notFound();
    }

    return result;
  });

export const queryGetExamByIdOptions = (examId: number) =>
  queryOptions({
    queryKey: ["exam", examId],
    queryFn: () => serverGetExamById({ data: { examId } }),
  });

interface serverUpdateExamTitleByIdData {
  examId: number;
  title: string;
}
export const serverUpdateExamTitleById = createServerFn({ method: "POST" })
  .middleware([serverMiddlewareIsAuthorExam])
  .validator((data: serverUpdateExamTitleByIdData) => data)
  .handler(async ({ data }) => {
    const { examId, title } = data;
    const result = await dbUpdateExamTitle(examId, title);

    if (!result) {
      throw notFound();
    }

    return result;
  });

interface serverDeleteExamByIdData {
  examId: number;
}
export const serverDeleteExamById = createServerFn({ method: "POST" })
  .middleware([serverMiddlewareIsAuthorExam])
  .validator((data: serverDeleteExamByIdData) => data)
  .handler(async ({ data }) => {
    const { examId } = data;
    const result = await dbDeleteExamById(examId);

    if (!result) {
      throw notFound();
    }

    return result;
  });
