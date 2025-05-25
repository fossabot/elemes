import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { dbIsAuthorExam, dbIsExamPrivate } from "~/db/service/exam";
import { auth } from "../auth";

export const serverMiddlewareAuth = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const { headers } = getWebRequest();
  const session = await auth.api.getSession({
    headers,
    query: { disableCookieCache: true },
  });

  if (!session) {
    throw new Error("Unauthorized");
  }
  return next({ context: { user: session.user } });
});

export interface serverMiddlewareIsAuthorExamData {
  examId: number;
}
export const serverMiddlewareIsAuthorExam = createMiddleware({
  type: "function",
})
  .middleware([serverMiddlewareAuth])
  .validator((data: serverMiddlewareIsAuthorExamData) => data)
  .server(async ({ next, context, data }) => {
    const { user } = context;
    const isAuthor = await dbIsAuthorExam({
      examId: data.examId,
      userId: user.id,
    });
    if (!isAuthor) {
      throw new Error("Unauthorized");
    }
    return next();
  });

export interface serverMiddlewareIsExamPublicData {
  examId: number;
}
export const serverMiddlewareIsExamPublic = createMiddleware({
  type: "function",
})
  .middleware([serverMiddlewareAuth])
  .validator((data: serverMiddlewareIsExamPublicData) => data)
  .server(async ({ next, context, data }) => {
    const { user } = context;
    const isPrivate = await dbIsExamPrivate(data.examId);
    if (isPrivate) {
      const isAuthor = await dbIsAuthorExam({
        examId: data.examId,
        userId: user.id,
      });
      if (!isAuthor) {
        throw new Error("Unauthorized");
      }
    }
    return next();
  });
