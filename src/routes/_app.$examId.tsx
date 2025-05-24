import { redirect } from "@tanstack/react-router";
import { Exam } from "~/components/Exam/Exam";
import { queryGetExamByIdOptions } from "~/lib/server/exam";
import { queryGetExamQuestionByExamId } from "~/lib/server/examQuestion";

export const Route = createFileRoute({
  loader: async ({ context, params: { examId } }) => {
    const examIdNum = Number(examId);
    if (isNaN(examIdNum)) {
      throw redirect({ to: "/" });
    }
    const examData = await context.queryClient.ensureQueryData(
      queryGetExamByIdOptions(examIdNum),
    );
    const examQuestionData = await context.queryClient.ensureQueryData(
      queryGetExamQuestionByExamId(examIdNum),
    );
    return { examData, examQuestionData };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { examData, examQuestionData } = Route.useLoaderData();
  const { queryClient } = Route.useRouteContext();

  return (
    <Exam
      examData={examData}
      queryclient={queryClient}
      examQuestionData={examQuestionData}
    />
  );
}
