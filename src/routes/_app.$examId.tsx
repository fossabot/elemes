import { Center, Container } from "@mantine/core";
import { redirect } from "@tanstack/react-router";
import { z } from "zod";
import { Exam } from "~/components/Exam/Exam";
import { queryGetExamByIdOptions } from "~/lib/server/exam";
import { queryGetExamAttemptOptions } from "~/lib/server/examAttempt";
import { queryGetExamQuestionByExamIsCorrectFalseId } from "~/lib/server/examQuestion";

const searchParams = z.object({
  reset: z.boolean().optional(),
});
export const Route = createFileRoute({
  validateSearch: (search) => searchParams.parse(search),
  beforeLoad: async ({ context, params: { examId }, search }) => {
    const examIdNum = Number(examId);
    if (isNaN(examIdNum)) {
      throw redirect({ to: "/" });
    }
    const examResult = await context.queryClient.ensureQueryData(
      queryGetExamAttemptOptions(examIdNum),
    );
    console.log(search);
    if (examResult && search.reset !== true) {
      throw redirect({ to: "/$examId/result", params: { examId } });
    }
  },
  loader: async ({ context, params: { examId } }) => {
    const examIdNum = Number(examId);
    const examData = await context.queryClient.ensureQueryData(
      queryGetExamByIdOptions(examIdNum),
    );
    const examQuestionData = await context.queryClient.ensureQueryData(
      queryGetExamQuestionByExamIsCorrectFalseId(examIdNum),
    );
    return { examData, examQuestionData };
  },
  component: RouteComponent,
  notFoundComponent: () => NotFound(),
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

function NotFound() {
  return (
    <Container py="xl">
      <Center>not found</Center>
    </Container>
  );
}
