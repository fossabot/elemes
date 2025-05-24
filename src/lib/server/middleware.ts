import { createMiddleware } from "@tanstack/react-start";
import { dbIsAuthorExam } from "~/db/service/exam";
import { serverGetUser } from "./auth";

export const serverMiddlewareAuth = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const user = await serverGetUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return next({ context: { user } });
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
