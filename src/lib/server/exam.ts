import { queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  dbChangeExamVisibility,
  dbCreateNewExam,
  dbDeleteExamById,
  dbGetAllExams,
  dbGetAllUserExams,
  dbGetExamById,
  dbUpdateExamTitle,
} from "~/db/service/exam";
import {
  serverMiddlewareAuth,
  serverMiddlewareIsAuthorExam,
  serverMiddlewareIsAuthorExamData,
  serverMiddlewareIsExamPublicData,
} from "./middleware";

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

    return dbCreateNewExam(name, user.id);
  });

interface serverGetExamByIdData extends serverMiddlewareIsExamPublicData {}

const serverGetExamById = createServerFn({ method: "GET" })
  .middleware([serverMiddlewareAuth])
  .validator((data: serverGetExamByIdData) => data)
  .handler(async ({ context, data }) => {
    const { examId } = data;
    const result = await dbGetExamById(examId);

    if (!result) {
      throw notFound();
    }

    if (result.private) {
      if (result.author !== context.user.id) {
        throw notFound();
      }
    }

    return result;
  });

export const queryGetExamByIdOptions = (examId: number) =>
  queryOptions({
    queryKey: ["exam", examId],
    queryFn: () => serverGetExamById({ data: { examId } }),
  });

interface serverUpdateExamTitleByIdData
  extends serverMiddlewareIsAuthorExamData {
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

interface serverDeleteExamByIdData extends serverMiddlewareIsAuthorExamData {}

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

interface serverChangeExamVisibilityData
  extends serverMiddlewareIsAuthorExamData {
  isPrivate: boolean;
}

export const serverChangeExamVisibility = createServerFn({ method: "POST" })
  .middleware([serverMiddlewareIsAuthorExam])
  .validator((data: serverChangeExamVisibilityData) => data)
  .handler(async ({ data }) => {
    const { examId, isPrivate } = data;
    const result = await dbChangeExamVisibility(examId, isPrivate);

    if (!result) {
      throw notFound();
    }

    return result;
  });
